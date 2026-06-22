"use client";

import { Flame, Star, Archive } from "lucide-react";
import type { Word } from "@/core/types";
import AppButton from "@/components/ui/AppButton";

interface CompletionScreenProps {
  message: string;
  xpEarned: number;
  unlockedWords: Word[];
  streakDays: number;
  nextLabel: string;
  onNext: () => void;
}

export default function CompletionScreen({
  message,
  xpEarned,
  unlockedWords,
  streakDays,
  nextLabel,
  onNext,
}: CompletionScreenProps) {
  return (
    <div className="flex flex-col items-center text-center pt-4">
      {/* gentle pop-in keyframes (scoped, no global CSS change) */}
      <style>{`
        @keyframes rootsPop {
          0%   { opacity: 0; transform: translateY(8px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .roots-pop { animation: none !important; }
        }
      `}</style>

      {/* Badge */}
      <div
        className="roots-pop emboss w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{
          animation: "rootsPop 500ms ease-out both",
          boxShadow:
            "6px 6px 14px var(--shadow-dark), -6px -6px 14px var(--shadow-light)," +
            "inset 0 0 14px 0 rgba(235,150,80,0.45)",
        }}
      >
        <Star size={32} strokeWidth={1.8} className="text-accent" />
      </div>

      <h1 className="font-display text-2xl font-bold text-text-primary mb-2 leading-tight">
        {message}
      </h1>

      {/* Stat row */}
      <div className="flex gap-3 w-full mt-6 mb-6">
        <div className="emboss flex-1 rounded-3xl p-4">
          <Star size={16} strokeWidth={1.8} className="text-accent mx-auto mb-1.5" />
          <div className="font-bold text-text-primary text-lg leading-none">+{xpEarned}</div>
          <div className="text-text-secondary text-[11px] mt-1">XP earned</div>
        </div>
        <div className="emboss flex-1 rounded-3xl p-4">
          <Flame size={16} strokeWidth={1.8} className="text-accent mx-auto mb-1.5" />
          <div className="font-bold text-text-primary text-lg leading-none">{streakDays}</div>
          <div className="text-text-secondary text-[11px] mt-1">Day streak</div>
        </div>
      </div>

      {/* Unlocked words */}
      {unlockedWords.length > 0 && (
        <div className="w-full mb-6">
          <div className="flex items-center justify-center gap-2 mb-3 text-accent">
            <Archive size={15} strokeWidth={1.8} />
            <p className="text-[11px] font-semibold uppercase tracking-widest">
              Added to your Roots Bank
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {unlockedWords.map((word, i) => (
              <div
                key={word.id}
                className="roots-pop emboss-sm rounded-2xl px-3 py-3 text-left"
                style={{
                  animation: "rootsPop 400ms ease-out both",
                  animationDelay: `${120 + i * 55}ms`,
                }}
              >
                <p className="text-sm font-semibold text-text-primary leading-tight">{word.word}</p>
                <p className="text-[11px] text-text-secondary truncate">{word.translation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full mt-2">
        <AppButton fullWidth onClick={onNext}>
          {nextLabel}
        </AppButton>
      </div>
    </div>
  );
}
