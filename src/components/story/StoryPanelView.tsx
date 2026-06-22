"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import type { StoryPanel, Word } from "@/core/types";

interface StoryPanelViewProps {
  panel: StoryPanel;
  highlightWords: Word[]; // resolved from panel.highlightedWordIds
  onWordTap: (word: Word) => void;
}

// Strip surrounding punctuation/quotes so "'Muraho!" matches the word "muraho".
const strip = (s: string) => s.toLowerCase().replace(/[^a-zà-ÿ]/gi, "");

export default function StoryPanelView({ panel, highlightWords, onWordTap }: StoryPanelViewProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  // Map stripped word form → Word for inline tappable highlights
  const lookup = new Map<string, Word>();
  for (const w of highlightWords) lookup.set(strip(w.word), w);

  // Tokenize on whitespace, keep separators so punctuation/spacing is preserved
  const tokens = panel.text.split(/(\s+)/);

  return (
    <div className="flex flex-col">
      <div className="emboss rounded-[1.75rem] p-7 mb-5">
        <p className="text-[17px] leading-relaxed text-text-primary">
          {tokens.map((tok, i) => {
            const key = strip(tok);
            const w = key ? lookup.get(key) : undefined;
            if (w) {
              return (
                <button
                  key={i}
                  onClick={() => onWordTap(w)}
                  className="text-accent-dark font-semibold underline decoration-accent/40 underline-offset-2 hover:decoration-accent transition-colors"
                >
                  {tok}
                </button>
              );
            }
            return <span key={i}>{tok}</span>;
          })}
        </p>

        {panel.translation && (
          <div className="mt-4">
            <button
              onClick={() => setShowTranslation((v) => !v)}
              className="inline-flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-accent transition-colors"
            >
              <Languages size={13} strokeWidth={1.8} />
              {showTranslation ? "Hide translation" : "Show translation"}
            </button>
            {showTranslation && (
              <p className="text-sm text-text-secondary italic mt-2">{panel.translation}</p>
            )}
          </div>
        )}
      </div>

      {highlightWords.length > 0 && (
        <p className="text-[11px] text-text-secondary text-center">
          Tap the highlighted words to learn them.
        </p>
      )}
    </div>
  );
}
