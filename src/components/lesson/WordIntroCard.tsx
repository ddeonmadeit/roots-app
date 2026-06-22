"use client";

import type { Word, LearnerType } from "@/core/types";
import { getFrequencyLine } from "@/core/copy";
import AudioButton from "@/components/ui/AudioButton";
import AppButton from "@/components/ui/AppButton";
import VerificationTag from "@/components/ui/VerificationTag";

interface WordIntroCardProps {
  word: Word;
  learnerType: LearnerType | null;
  onContinue: () => void;
}

const REGISTER_LABELS: Record<string, string> = {
  casual: "Say this to a cousin",
  respectful: "Respectful",
  elder_safe: "Say this to an elder",
  formal: "Formal",
  slang: "Cousin talk",
};

export default function WordIntroCard({ word, learnerType, onContinue }: WordIntroCardProps) {
  const isKid = learnerType === "child";
  const frequencyLine = getFrequencyLine(word.frequencyBand, word.sentenceFrameIds);

  return (
    <div className="flex flex-col">
      {/* Category + verification */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <span className="emboss-sm rounded-full px-3 py-1 text-[11px] font-semibold text-accent">
          {word.category}
        </span>
        {word.verificationStatus === "demo_needs_review" && <VerificationTag />}
      </div>

      {/* Word — large */}
      <div className="emboss rounded-[1.75rem] p-7 text-center mb-5">
        <h2 className="font-display text-4xl font-bold text-text-primary leading-none mb-3">
          {word.word}
        </h2>
        <p className="text-lg text-text-secondary mb-1">{word.translation}</p>
        {word.pronunciation && (
          <p className="text-sm text-accent-soft italic mb-4">{word.pronunciation}</p>
        )}
        <div className="flex justify-center">
          <AudioButton audioUrl={word.audioUrl} size={18} />
        </div>
      </div>

      {/* Friendly frequency line */}
      {frequencyLine && (
        <div className="deboss rounded-2xl px-4 py-3 mb-3">
          <p className="text-xs text-text-secondary text-center leading-relaxed">{frequencyLine}</p>
        </div>
      )}

      {/* Example sentence */}
      {word.exampleSentence && (
        <div className="emboss-sm rounded-2xl px-4 py-3.5 mb-3">
          <p className="text-sm font-medium text-text-primary">{word.exampleSentence}</p>
          {word.exampleTranslation && (
            <p className="text-xs text-text-secondary mt-0.5">{word.exampleTranslation}</p>
          )}
        </div>
      )}

      {/* When to use this */}
      {word.usageNote && (
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-1">
            When to use this
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">{word.usageNote}</p>
        </div>
      )}

      {/* Respect-level chips */}
      {word.usageContext && word.usageContext.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {word.usageContext.map((ctx) => (
            <span
              key={ctx}
              className="deboss-sm rounded-full px-3 py-1 text-[11px] text-text-secondary"
            >
              {REGISTER_LABELS[ctx] ?? ctx}
            </span>
          ))}
        </div>
      )}

      {/* Culture note — teen/adult only */}
      {!isKid && word.cultureNote && (
        <div className="deboss rounded-2xl px-4 py-3 mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-1">
            Culture note
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">{word.cultureNote}</p>
        </div>
      )}

      <div className="mt-4">
        <AppButton fullWidth onClick={onContinue}>
          Got it →
        </AppButton>
      </div>
    </div>
  );
}
