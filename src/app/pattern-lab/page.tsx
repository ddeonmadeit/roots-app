"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Layers } from "lucide-react";
import { getLessons } from "@/core/data/index";
import Screen from "@/components/ui/Screen";

const labs = getLessons().filter((l) => l.learningFocus === "pattern_lab");

export default function PatternLabIndex() {
  const router = useRouter();

  return (
    <Screen>
      <div className="mb-6 pt-2">
        <div className="flex items-center gap-2 mb-2 text-accent">
          <Layers size={16} strokeWidth={1.8} />
          <span className="text-[11px] font-semibold uppercase tracking-widest">Pattern Lab</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-text-primary leading-tight">
          See how the language works
        </h1>
        <p className="text-sm text-text-secondary mt-2">
          Small changes at the start of words carry big meaning. Notice the patterns underneath.
        </p>
      </div>

      <div className="space-y-3">
        {labs.map((lab) => (
          <button
            key={lab.id}
            onClick={() => router.push(`/pattern-lab/${lab.id}`)}
            className="emboss-interactive w-full text-left rounded-3xl p-5 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="font-semibold text-text-primary">{lab.title}</p>
              <p className="text-xs text-text-secondary mt-0.5">{lab.subtitle}</p>
            </div>
            <ChevronRight size={18} strokeWidth={1.8} className="text-text-secondary shrink-0" />
          </button>
        ))}
      </div>
    </Screen>
  );
}
