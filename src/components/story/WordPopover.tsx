"use client";

import { Check, Archive } from "lucide-react";
import type { Word } from "@/core/types";
import AudioButton from "@/components/ui/AudioButton";
import VerificationTag from "@/components/ui/VerificationTag";

interface WordPopoverProps {
  word: Word;
  collected: boolean;
  onClose: () => void;
}

export default function WordPopover({ word, collected, onClose }: WordPopoverProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-[430px] mx-auto emboss rounded-t-[2rem] p-6 pb-9">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-text-primary leading-none">{word.word}</h3>
            <p className="text-sm text-text-secondary mt-1.5">{word.translation}</p>
            {word.pronunciation && (
              <p className="text-xs text-accent-soft italic mt-0.5">{word.pronunciation}</p>
            )}
          </div>
          <AudioButton audioUrl={word.audioUrl} size={18} />
        </div>

        {word.verificationStatus === "demo_needs_review" && (
          <div className="mb-4">
            <VerificationTag />
          </div>
        )}

        {/* Roots Bank state */}
        <div className="deboss rounded-2xl px-4 py-3 flex items-center gap-2.5">
          {collected ? (
            <>
              <span className="text-green"><Check size={16} strokeWidth={2.2} /></span>
              <span className="text-sm text-text-primary">In your Roots Bank</span>
            </>
          ) : (
            <>
              <span className="text-accent"><Archive size={16} strokeWidth={1.8} /></span>
              <span className="text-sm text-text-secondary">Added to your Roots Bank when you finish the story</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
