"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronDown, BookOpen } from "lucide-react";
import type { Word, Lesson } from "@/core/types";
import { getFrequencyLine } from "@/core/copy";
import AudioButton from "@/components/ui/AudioButton";
import VerificationTag from "@/components/ui/VerificationTag";

interface WordDetailModalProps {
  word: Word;
  learnedInLesson?: Lesson;
  kidsMode: boolean;
  onClose: () => void;
}

const REGISTER_LABELS: Record<string, string> = {
  casual: "Say this to a cousin",
  respectful: "Respectful",
  elder_safe: "Say this to an elder",
  formal: "Formal",
  slang: "Cousin talk",
};

export default function WordDetailModal({ word, learnedInLesson, kidsMode, onClose }: WordDetailModalProps) {
  const [storyOpen, setStoryOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const frequencyLine = getFrequencyLine(word.frequencyBand, word.sentenceFrameIds);
  const hasStory = !kidsMode && (!!word.wordStory || !!word.etymologyNote);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-[430px] mx-auto emboss rounded-t-[2rem] p-6 pb-10 max-h-[88vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="emboss-sm absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-text-secondary active:scale-95 transition-transform"
        >
          <X size={16} strokeWidth={2} />
        </button>

        {/* Header */}
        <div className="mb-4 pr-10">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-3xl font-bold text-text-primary leading-none">{word.word}</h2>
            <AudioButton audioUrl={word.audioUrl} size={18} />
          </div>
          <p className="text-base text-text-secondary mt-2">{word.translation}</p>
          {word.pronunciation && (
            <p className="text-sm text-accent-soft italic mt-0.5">{word.pronunciation}</p>
          )}
        </div>

        {/* Category + frequency */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="emboss-sm rounded-full px-3 py-1 text-[11px] font-semibold text-accent">
            {word.category}
          </span>
          {word.verificationStatus === "demo_needs_review" && <VerificationTag />}
        </div>

        {frequencyLine && (
          <div className="deboss rounded-2xl px-4 py-3 mb-3">
            <p className="text-xs text-text-secondary text-center leading-relaxed">{frequencyLine}</p>
          </div>
        )}

        {/* Example */}
        {word.exampleSentence && (
          <div className="emboss-sm rounded-2xl px-4 py-3.5 mb-3">
            <p className="text-sm font-medium text-text-primary">{word.exampleSentence}</p>
            {word.exampleTranslation && (
              <p className="text-xs text-text-secondary mt-0.5">{word.exampleTranslation}</p>
            )}
          </div>
        )}

        {/* When to use */}
        {word.usageNote && (
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-1">When to use this</p>
            <p className="text-sm text-text-secondary leading-relaxed">{word.usageNote}</p>
          </div>
        )}

        {/* Register chips */}
        {word.usageContext && word.usageContext.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {word.usageContext.map((ctx) => (
              <span key={ctx} className="deboss-sm rounded-full px-3 py-1 text-[11px] text-text-secondary">
                {REGISTER_LABELS[ctx] ?? ctx}
              </span>
            ))}
          </div>
        )}

        {/* Culture note — teen/adult only */}
        {!kidsMode && word.cultureNote && (
          <div className="deboss rounded-2xl px-4 py-3 mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-1">Culture note</p>
            <p className="text-xs text-text-secondary leading-relaxed">{word.cultureNote}</p>
          </div>
        )}

        {/* Story behind the word — collapsible, teen/adult only */}
        {hasStory && (
          <div className="mb-3">
            <button
              onClick={() => setStoryOpen((v) => !v)}
              className="deboss w-full rounded-2xl px-4 py-3 flex items-center justify-between"
            >
              <span className="text-sm font-semibold text-text-primary">Story behind the word</span>
              <ChevronDown
                size={16}
                strokeWidth={2}
                className={`text-text-secondary transition-transform ${storyOpen ? "rotate-180" : ""}`}
              />
            </button>
            {storyOpen && (
              <div className="px-4 py-3">
                {word.wordStory && <p className="text-sm text-text-secondary leading-relaxed">{word.wordStory}</p>}
                {word.etymologyNote && (
                  <p className="text-xs text-text-secondary leading-relaxed mt-2 italic">{word.etymologyNote}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Region / dialect note */}
        {word.dialectOrRegion && (
          <p className="text-[11px] text-text-secondary mb-3">Region/dialect: {word.dialectOrRegion}</p>
        )}

        {/* Learned in */}
        {learnedInLesson && (
          <Link
            href={`/lesson/${learnedInLesson.id}`}
            className="emboss-interactive rounded-2xl px-4 py-3 flex items-center gap-2.5 mt-1"
          >
            <BookOpen size={15} strokeWidth={1.8} className="text-accent shrink-0" />
            <span className="text-sm text-text-primary">
              Learned in <span className="font-semibold">{learnedInLesson.title}</span>
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
