"use client";

import { useEffect, useState } from "react";
import { BookOpen, Archive, Quote } from "lucide-react";
import type { Story, Word, Proverb } from "@/core/types";
import AppButton from "@/components/ui/AppButton";
import VerificationTag from "@/components/ui/VerificationTag";

interface StoryCompleteProps {
  story: Story;
  unlockedWords: Word[];
  proverb?: Proverb;
  onDone: () => void;
}

export default function StoryComplete({ story, unlockedWords, proverb, onDone }: StoryCompleteProps) {
  const [showProverb, setShowProverb] = useState(false);

  // Reveal the proverb card a beat after the words land
  useEffect(() => {
    if (!proverb) return;
    const t = setTimeout(() => setShowProverb(true), 600);
    return () => clearTimeout(t);
  }, [proverb]);

  return (
    <div className="flex flex-col min-h-dvh px-6 py-12">
      <style>{`
        @keyframes popIn { 0%{opacity:0;transform:translateY(10px) scale(.96)} 100%{opacity:1;transform:none} }
        @media (prefers-reduced-motion: reduce){ .pop{animation:none!important} }
      `}</style>

      <div className="flex-1">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="emboss w-16 h-16 rounded-full flex items-center justify-center mb-4 text-accent">
            <BookOpen size={26} strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">{story.title}</h1>
        </div>

        {/* Culture note */}
        {story.cultureNote && (
          <div className="deboss rounded-2xl p-5 mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-2">Culture note</p>
            <p className="text-sm text-text-secondary leading-relaxed">{story.cultureNote}</p>
          </div>
        )}

        {/* Unlocked words */}
        {unlockedWords.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3 text-accent">
              <Archive size={15} strokeWidth={1.8} />
              <p className="text-[11px] font-semibold uppercase tracking-widest">Added to your Roots Bank</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {unlockedWords.map((w, i) => (
                <div
                  key={w.id}
                  className="pop emboss-sm rounded-2xl px-3 py-3"
                  style={{ animation: "popIn 0.4s ease-out both", animationDelay: `${i * 60}ms` }}
                >
                  <p className="text-sm font-semibold text-text-primary leading-tight">{w.word}</p>
                  <p className="text-[11px] text-text-secondary truncate">{w.translation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Proverb reveal */}
        {proverb && showProverb && (
          <div
            className="pop emboss rounded-[1.75rem] p-6"
            style={{ animation: "popIn 0.5s ease-out both" }}
          >
            <div className="flex items-center gap-2 mb-3 text-accent">
              <Quote size={15} strokeWidth={1.8} />
              <p className="text-[11px] font-semibold uppercase tracking-widest">Proverb unlocked</p>
            </div>
            <p className="font-display text-lg font-bold text-text-primary mb-1">{proverb.proverb}</p>
            <p className="text-sm text-text-secondary italic mb-3">{proverb.literalMeaning}</p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">{proverb.deeperMeaning}</p>
            <VerificationTag />
          </div>
        )}
      </div>

      <div className="pt-6">
        <AppButton fullWidth onClick={onDone}>
          Back to home
        </AppButton>
      </div>
    </div>
  );
}
