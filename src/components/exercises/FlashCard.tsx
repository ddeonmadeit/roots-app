"use client";

import { useState } from "react";
import { ThumbsUp, RefreshCw } from "lucide-react";
import type { Exercise } from "@/core/types";

interface FlashCardProps {
  exercise: Exercise;
  onContinue: () => void;
}

export default function FlashCard({ exercise, onContinue }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [choice, setChoice] = useState<"got_it" | "more_practice" | null>(null);

  function handleFlip() {
    if (!flipped) setFlipped(true);
  }

  function handleGotIt() {
    setChoice("got_it");
    setTimeout(onContinue, 400);
  }

  function handleMorePractice() {
    setChoice("more_practice");
    setFlipped(false);
    setTimeout(() => setChoice(null), 300);
  }

  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <button
        onClick={handleFlip}
        aria-label={flipped ? "Card showing translation" : "Tap to reveal translation"}
        className="w-full emboss rounded-[1.75rem] min-h-[200px] flex flex-col items-center justify-center p-8 text-center active:scale-[0.98] transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-accent"
        style={{ cursor: flipped ? "default" : "pointer" }}
      >
        {!flipped ? (
          <>
            <p className="font-display text-4xl font-bold text-text-primary leading-tight mb-3">
              {exercise.prompt}
            </p>
            <p className="text-xs text-text-secondary uppercase tracking-widest">
              Tap to reveal
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-text-secondary uppercase tracking-widest mb-3">
              Translation
            </p>
            <p className="font-display text-3xl font-bold text-accent leading-tight mb-4">
              {Array.isArray(exercise.correctAnswer)
                ? exercise.correctAnswer.join(" ")
                : exercise.correctAnswer}
            </p>
            {exercise.explanation && (
              <p className="text-sm text-text-secondary leading-relaxed max-w-[260px]">
                {exercise.explanation}
              </p>
            )}
          </>
        )}
      </button>

      {/* Actions */}
      {flipped && (
        <div className="flex gap-3 mt-5 w-full">
          <button
            onClick={handleMorePractice}
            className={`flex-1 deboss rounded-2xl py-3.5 flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-95 ${
              choice === "more_practice" ? "text-accent" : "text-text-secondary"
            }`}
            aria-label="Need more practice"
          >
            <RefreshCw size={16} strokeWidth={2} />
            Practice more
          </button>
          <button
            onClick={handleGotIt}
            className={`flex-1 emboss-interactive rounded-2xl py-3.5 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
              choice === "got_it" ? "text-green" : "text-text-primary"
            }`}
            aria-label="Got it"
          >
            <ThumbsUp size={16} strokeWidth={2} />
            Got it
          </button>
        </div>
      )}

      {!flipped && (
        <p className="mt-4 text-xs text-text-secondary">
          Think about the meaning first, then tap.
        </p>
      )}

      <span className="sr-only" aria-live="polite">
        {flipped
          ? `Translation: ${Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer.join(" ") : exercise.correctAnswer}`
          : ""}
      </span>
    </div>
  );
}
