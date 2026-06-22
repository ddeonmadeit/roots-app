"use client";

import { useEffect, useState } from "react";
import { PhoneCall, TrendingUp } from "lucide-react";
import type { Scenario, Word } from "@/core/types";
import AppButton from "@/components/ui/AppButton";

interface CallCompleteProps {
  scenario: Scenario;
  reinforcedWords: Word[];
  durationLabel: string;
  onDone: () => void;
}

export default function CallComplete({
  scenario,
  reinforcedWords,
  durationLabel,
  onDone,
}: CallCompleteProps) {
  const [confidence, setConfidence] = useState(0);

  // Animate the confidence meter from 0 → 100 on mount (state set in timeout, not sync)
  useEffect(() => {
    const t = setTimeout(() => setConfidence(100), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center text-center min-h-dvh px-8 py-14">
      <style>{`
        @keyframes popIn { 0%{opacity:0;transform:translateY(8px) scale(.92)} 100%{opacity:1;transform:none} }
        @media (prefers-reduced-motion: reduce){ .pop{animation:none!important} }
      `}</style>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div
          className="pop emboss w-20 h-20 rounded-full flex items-center justify-center"
          style={{ animation: "popIn 0.5s ease-out both", color: "var(--green)" }}
        >
          <PhoneCall size={30} strokeWidth={1.8} />
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-1.5 leading-tight">
            {scenario.completionMessage}
          </h1>
          <p className="text-sm text-text-secondary">Call duration · {durationLabel}</p>
        </div>

        {/* Confidence meter */}
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
              <TrendingUp size={13} strokeWidth={2} /> Confidence
            </span>
            <span className="text-[11px] text-green font-semibold">+1</span>
          </div>
          <div className="deboss h-3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${confidence}%`, background: "var(--green)" }}
            />
          </div>
        </div>

        {/* Reinforced words */}
        {reinforcedWords.length > 0 && (
          <div className="w-full">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-3">
              Words you used
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {reinforcedWords.map((w, i) => (
                <span
                  key={w.id}
                  className="pop emboss-sm rounded-full px-3.5 py-1.5 text-xs text-text-primary"
                  style={{ animation: "popIn 0.4s ease-out both", animationDelay: `${150 + i * 45}ms` }}
                >
                  {w.word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm">
        <AppButton fullWidth onClick={onDone}>
          Back to home
        </AppButton>
      </div>
    </div>
  );
}
