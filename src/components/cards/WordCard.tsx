"use client";

import { Lock } from "lucide-react";
import type { Word } from "@/core/types";

interface WordCardProps {
  word: Word;
  locked: boolean;
  onTap?: (word: Word) => void;
}

export default function WordCard({ word, locked, onTap }: WordCardProps) {
  if (locked) {
    return (
      <div
        className="rounded-2xl p-4 flex flex-col gap-1"
        style={{ background: "var(--locked)" }}
        aria-disabled="true"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-base font-bold text-text-secondary/60">
            {word.word}
          </span>
          <Lock size={14} strokeWidth={1.8} className="text-text-secondary/50 shrink-0" />
        </div>
        <span className="text-[11px] text-text-secondary/60 leading-snug">
          Keep learning to unlock
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => onTap?.(word)}
      className="emboss-interactive rounded-2xl p-4 text-left flex flex-col gap-1"
    >
      <span className="font-display text-base font-bold text-text-primary leading-tight">
        {word.word}
      </span>
      <span className="text-[11px] text-text-secondary leading-snug truncate">
        {word.translation}
      </span>
    </button>
  );
}
