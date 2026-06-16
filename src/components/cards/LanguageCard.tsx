"use client";

import { Users } from "lucide-react";
import type { Language } from "@/core/types";
import AppButton from "@/components/ui/AppButton";

interface LanguageCardProps {
  language: Language;
  onSelect: () => void;
  onWaitlist: () => void;
}

export default function LanguageCard({ language, onSelect, onWaitlist }: LanguageCardProps) {
  const isActive = language.status === "active";

  return (
    <div className={`emboss rounded-[1.75rem] p-5 ${isActive ? "" : "opacity-95"}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-display text-xl font-bold text-text-primary leading-tight">
            {language.name}
          </h3>
          <span className="text-[11px] text-text-secondary mt-0.5 block">
            {language.regionLabel}
          </span>
        </div>

        {/* Status badge */}
        <span
          className={`shrink-0 mt-0.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
            isActive
              ? "border-accent text-accent"
              : "border-border text-text-secondary"
          }`}
        >
          {isActive ? "Active demo" : "Coming soon"}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        {language.description}
      </p>

      {/* Coming-soon meta */}
      {!isActive && (language.teaser || language.learnerCount) && (
        <div className="deboss rounded-2xl px-4 py-3 mb-4 flex items-center gap-2">
          {language.learnerCount && (
            <div className="flex items-center gap-1.5 text-text-secondary text-xs">
              <Users size={13} strokeWidth={1.8} />
              <span>{language.learnerCount.toLocaleString()} people waiting</span>
            </div>
          )}
          {language.teaser && language.learnerCount && (
            <span className="text-border">·</span>
          )}
          {language.teaser && (
            <span className="text-xs text-text-secondary">{language.teaser}</span>
          )}
        </div>
      )}

      {/* CTA */}
      {isActive ? (
        <AppButton onClick={onSelect} fullWidth>
          Start learning
        </AppButton>
      ) : (
        <AppButton variant="secondary" onClick={onWaitlist} fullWidth>
          Join the waitlist
        </AppButton>
      )}
    </div>
  );
}
