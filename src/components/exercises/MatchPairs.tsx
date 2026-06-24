"use client";

import { useState } from "react";
import type { Exercise } from "@/core/types";
import type { ExerciseStatus } from "./ExercisePlayer";

interface MatchPairsProps {
  exercise: Exercise;
  onChange: (pairs: string[]) => void;
  status: ExerciseStatus;
  disabled: boolean;
}

export default function MatchPairs({ exercise, onChange, status, disabled }: MatchPairsProps) {
  const leftItems = exercise.options ?? [];

  // Shuffle once on mount via useState initializer (avoids impure function in render)
  const [rightItems] = useState<string[]>(() => {
    const pool = [...(exercise.tiles ?? [])];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
  });

  // pairs[i] = rightItem chosen for leftItems[i], or null
  const [pairs, setPairs] = useState<(string | null)[]>(() => leftItems.map(() => null));
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);

  const correctAnswer = exercise.correctAnswer as string[];

  function selectLeft(i: number) {
    if (disabled) return;
    setSelectedLeft(selectedLeft === i ? null : i);
  }

  function selectRight(val: string) {
    if (disabled || selectedLeft === null) return;

    // If this right item is already used by another left item, swap
    const newPairs = [...pairs];
    const existingLeftIdx = newPairs.findIndex((p) => p === val);
    if (existingLeftIdx !== -1) newPairs[existingLeftIdx] = null;
    newPairs[selectedLeft] = val;

    setPairs(newPairs);
    setSelectedLeft(null);
    onChange(newPairs.map((p) => p ?? ""));
  }

  function clearPair(i: number) {
    if (disabled) return;
    const newPairs = [...pairs];
    newPairs[i] = null;
    setPairs(newPairs);
    setSelectedLeft(i);
    onChange(newPairs.map((p) => p ?? ""));
  }

  const usedRight = new Set(pairs.filter(Boolean) as string[]);

  function pairClass(i: number): string {
    if (status === "correct" && pairs[i] === correctAnswer[i]) return "ring-2 ring-green";
    if (status === "wrong" && pairs[i] !== correctAnswer[i]) return "ring-2 ring-red";
    if (pairs[i]) return "emboss-sm text-text-primary";
    if (selectedLeft === i) return "deboss ring-2 ring-accent text-accent";
    return "deboss text-text-secondary";
  }

  function rightClass(val: string): string {
    const isUsed = usedRight.has(val);
    if (status !== "idle") {
      const leftIdx = pairs.findIndex((p) => p === val);
      if (leftIdx !== -1 && correctAnswer[leftIdx] === val) return "ring-2 ring-green emboss-sm text-text-primary";
      if (leftIdx !== -1) return "ring-2 ring-red deboss text-text-secondary";
    }
    if (isUsed) return "deboss-sm text-text-secondary opacity-50";
    return "emboss-interactive text-text-primary";
  }

  return (
    <div>
      <p className="text-xs text-text-secondary mb-3 leading-relaxed">
        {selectedLeft !== null
          ? `"${leftItems[selectedLeft]}" selected — tap a meaning to match it`
          : "Tap a word, then tap its meaning"}
      </p>

      <div className="grid grid-cols-2 gap-2">
        {/* Left column — Kinyarwanda words */}
        <div className="space-y-2">
          {leftItems.map((item, i) => (
            <button
              key={item}
              onClick={() => pairs[i] ? clearPair(i) : selectLeft(i)}
              disabled={disabled}
              className={`w-full rounded-2xl px-3 py-3 text-sm font-semibold text-center transition-all active:scale-95 ${pairClass(i)}`}
            >
              <span className="font-display font-bold">{item}</span>
              {pairs[i] && (
                <span className="block text-[10px] font-normal text-text-secondary truncate mt-0.5">
                  → {pairs[i]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right column — Translations */}
        <div className="space-y-2">
          {rightItems.map((val) => (
            <button
              key={val}
              onClick={() => selectRight(val)}
              disabled={disabled || usedRight.has(val)}
              className={`w-full rounded-2xl px-3 py-3 text-xs text-center transition-all active:scale-95 ${rightClass(val)}`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
