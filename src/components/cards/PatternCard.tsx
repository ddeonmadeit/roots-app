"use client";

import { Lock, Layers } from "lucide-react";
import type { Pattern } from "@/core/types";
import { renderBreakdown, parseHighlightMarks } from "@/core/engine/patternEngine";
import VerificationTag from "@/components/ui/VerificationTag";

interface PatternCardProps {
  pattern: Pattern;
  locked: boolean;
}

function Breakdown({ word }: { word: { breakdown: Pattern["examples"][number]["breakdown"] } }) {
  const segments = parseHighlightMarks(renderBreakdown(word.breakdown));
  return (
    <span className="font-display text-base font-bold">
      {segments.map((seg, i) => (
        <span key={i} className={seg.highlighted ? "text-accent" : "text-text-primary"}>
          {seg.text}
        </span>
      ))}
    </span>
  );
}

export default function PatternCard({ pattern, locked }: PatternCardProps) {
  if (locked) {
    return (
      <div className="rounded-[1.5rem] p-5" style={{ background: "var(--locked)" }} aria-disabled="true">
        <div className="flex items-center justify-between mb-1">
          <span className="font-display text-lg font-bold text-text-secondary/60">{pattern.name}</span>
          <Lock size={15} strokeWidth={1.8} className="text-text-secondary/50 shrink-0" />
        </div>
        <p className="text-xs text-text-secondary/60">Notice this pattern in a Pattern Lab to unlock it.</p>
      </div>
    );
  }

  return (
    <div className="emboss rounded-[1.5rem] p-5">
      <div className="flex items-center gap-2 mb-2 text-accent">
        <Layers size={14} strokeWidth={1.8} />
        <span className="text-[10px] font-semibold uppercase tracking-widest">Pattern</span>
      </div>

      <h3 className="font-display text-lg font-bold text-text-primary leading-tight">{pattern.name}</h3>
      <p className="text-sm text-text-secondary mt-1 leading-relaxed">
        Often {pattern.plainEnglishMeaning}.
      </p>

      {/* Examples */}
      <div className="flex flex-wrap gap-2 mt-3">
        {pattern.examples.slice(0, 3).map((ex) => (
          <span key={ex.word} className="deboss-sm rounded-xl px-3 py-1.5 inline-flex items-baseline gap-1.5">
            <Breakdown word={ex} />
            <span className="text-[11px] text-text-secondary">{ex.translation}</span>
          </span>
        ))}
      </div>

      {/* When it's useful */}
      {pattern.usageNote && (
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-0.5">When it&apos;s useful</p>
          <p className="text-xs text-text-secondary leading-relaxed">{pattern.usageNote}</p>
        </div>
      )}

      {/* Exceptions */}
      {pattern.exceptionsNote && (
        <div className="deboss rounded-xl px-3 py-2.5 mt-3">
          <p className="text-[11px] text-text-secondary leading-relaxed">{pattern.exceptionsNote}</p>
        </div>
      )}

      <div className="mt-3">
        <VerificationTag />
      </div>
    </div>
  );
}
