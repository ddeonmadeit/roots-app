"use client";

import type { Exercise } from "@/core/types";
import type { ExerciseStatus } from "./ExercisePlayer";

interface SentenceBuilderProps {
  exercise: Exercise;
  value: string[];
  onChange: (value: string[]) => void;
  status: ExerciseStatus;
  disabled: boolean;
}

export default function SentenceBuilder({
  exercise,
  value,
  onChange,
  status,
  disabled,
}: SentenceBuilderProps) {
  const tiles = exercise.tiles ?? [];

  // A tile is consumed once it has been placed into the answer row. We track by
  // index so duplicate words (e.g. "buhoro buhoro") each remain tappable.
  const usedIndices = new Set<number>();
  for (const word of value) {
    const idx = tiles.findIndex((t, i) => t === word && !usedIndices.has(i));
    if (idx >= 0) usedIndices.add(idx);
  }

  function addTile(word: string) {
    if (disabled) return;
    onChange([...value, word]);
  }

  function removeAt(index: number) {
    if (disabled) return;
    onChange(value.filter((_, i) => i !== index));
  }

  const rowBorder =
    status === "correct"
      ? "border-green"
      : status === "wrong"
      ? "border-red"
      : "border-transparent";

  return (
    <div className="space-y-5">
      {/* Answer row */}
      <div
        className={`deboss rounded-2xl min-h-[68px] p-3 flex flex-wrap gap-2 items-center justify-center border ${rowBorder} transition-colors`}
      >
        {value.length === 0 ? (
          <span className="text-sm text-text-secondary/50">Tap words to build your answer</span>
        ) : (
          value.map((word, i) => (
            <button
              key={`${word}-${i}`}
              type="button"
              disabled={disabled}
              onClick={() => removeAt(i)}
              className="emboss-sm rounded-xl px-3.5 py-2 text-sm font-medium text-accent-dark transition-transform duration-150 active:scale-95"
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Tile bank */}
      <div className="flex flex-wrap gap-2.5 justify-center">
        {tiles.map((word, i) => {
          const used = usedIndices.has(i);
          return (
            <button
              key={`${word}-${i}`}
              type="button"
              disabled={disabled || used}
              onClick={() => addTile(word)}
              className={`deboss rounded-xl px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-150 ${
                used ? "opacity-30" : "active:scale-95"
              }`}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
