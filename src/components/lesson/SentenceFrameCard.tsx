"use client";

import type { SentenceFrame } from "@/core/types";
import AppButton from "@/components/ui/AppButton";

interface SentenceFrameCardProps {
  frame: SentenceFrame;
  onContinue: () => void;
}

// Render the frame with the blank ("___") visually emphasized.
function renderFrame(frame: string) {
  if (!frame.includes("___")) return <span>{frame}</span>;
  const [before, after] = [frame.slice(0, frame.indexOf("___")), frame.slice(frame.indexOf("___") + 3)];
  return (
    <>
      {before}
      <span className="inline-block min-w-[56px] mx-1 px-3 pb-0.5 border-b-2 border-accent text-accent-soft align-baseline">
        &nbsp;
      </span>
      {after}
    </>
  );
}

export default function SentenceFrameCard({ frame, onContinue }: SentenceFrameCardProps) {
  return (
    <div className="flex flex-col">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-4 text-center">
        Sentence frame
      </p>

      {/* The frame, blank emphasized */}
      <div className="emboss rounded-[1.75rem] p-7 text-center mb-5">
        <p className="font-display text-2xl font-bold text-text-primary leading-snug mb-2">
          {renderFrame(frame.frame)}
        </p>
        <p className="text-sm text-text-secondary">{frame.translationFrame}</p>
      </div>

      {/* Example fills */}
      {frame.examples.length > 0 && (
        <div className="space-y-2 mb-4">
          {frame.examples.slice(0, 3).map((ex) => (
            <div key={ex} className="emboss-sm rounded-2xl px-4 py-3">
              <p className="text-sm font-medium text-text-primary">{ex}</p>
            </div>
          ))}
        </div>
      )}

      {/* Where you'll hear it */}
      {frame.whereYouHearIt.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-2">
            Where you&apos;ll hear it
          </p>
          <div className="flex flex-col gap-2">
            {frame.whereYouHearIt.map((w) => (
              <span
                key={w}
                className="deboss-sm rounded-2xl px-4 py-2.5 text-xs text-text-secondary"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2">
        <AppButton fullWidth onClick={onContinue}>
          Got it →
        </AppButton>
      </div>
    </div>
  );
}
