"use client";

import Screen from "@/components/ui/Screen";
import { Flame, Package, Star, Phone, ChevronRight } from "lucide-react";
import RootsLogo from "@/components/ui/RootsLogo";

export default function HomePage() {
  return (
    <Screen>
      {/* Brand mark — placeholder Roots logo */}
      <div className="mb-7 pt-2 flex justify-center text-text-primary">
        <RootsLogo size={64} />
      </div>

      {/* Stat pills — embossed */}
      <div className="flex gap-3 mb-7">
        {[
          { icon: <Flame size={17} strokeWidth={1.8} />,   value: "0", label: "Streak" },
          { icon: <Package size={17} strokeWidth={1.8} />, value: "0", label: "Words"  },
          { icon: <Star size={17} strokeWidth={1.8} />,    value: "0", label: "XP"     },
        ].map(({ icon, value, label }) => (
          <div key={label} className="emboss flex-1 rounded-3xl p-4 text-center">
            <div className="flex justify-center mb-2 text-accent">{icon}</div>
            <div className="font-bold text-text-primary text-lg leading-none">{value}</div>
            <div className="text-text-secondary text-[11px] mt-1.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Hero — embossed panel with an inner amber ring + travelling highlight */}
      <div
        className="emboss relative mb-6 rounded-[1.75rem] overflow-hidden p-6"
        style={{
          boxShadow:
            "6px 6px 14px var(--shadow-dark), -6px -6px 14px var(--shadow-light)," +
            "inset 0 0 16px 0 rgba(235,150,80,0.50)," +
            "inset 0 0 40px 8px rgba(180,72,20,0.28)",
        }}
      >
        {/* Animated highlight that follows the ring around the edge */}
        <div className="moment-ring" aria-hidden="true" />

        <div className="relative" style={{ zIndex: 1 }}>
          <div className="flex items-center gap-2 mb-3 text-accent">
            <Phone size={15} strokeWidth={1.8} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">
              Today&apos;s Moment
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-2 leading-tight">
            Grandma is Calling
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary mb-5">
            Greet her respectfully, say where you are, tell her you&apos;re coming soon.
          </p>
          <button
            className="relative overflow-hidden rounded-full px-6 py-3 text-xs font-bold tracking-wide uppercase text-accent-dark transition-transform duration-150 active:scale-[0.97]"
            style={{
              background: "var(--surface)",
              boxShadow:
                "5px 5px 12px var(--shadow-dark), -5px -5px 12px var(--shadow-light)," +
                "inset 0 0 12px 0 rgba(235,150,80,0.50)," +
                "inset 0 0 26px 5px rgba(180,72,20,0.26)",
            }}
          >
            <span className="pulse-ring" aria-hidden="true" />
            <span className="relative" style={{ zIndex: 1 }}>Start lesson</span>
          </button>
        </div>
      </div>

      {/* Continue — inset row */}
      <button className="deboss w-full rounded-3xl p-5 mb-3 text-left flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-1">
            Continue
          </p>
          <p className="font-semibold text-text-primary">Lesson 1 · Grandma is Calling</p>
        </div>
        <ChevronRight size={18} strokeWidth={1.8} className="text-text-secondary shrink-0" />
      </button>

      {/* Roots bank — inset row */}
      <button className="deboss w-full rounded-3xl p-5 text-left flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package size={18} strokeWidth={1.8} className="text-accent" />
          <p className="font-medium text-text-primary text-sm">
            Roots Bank — 0 words collected
          </p>
        </div>
        <ChevronRight size={18} strokeWidth={1.8} className="text-text-secondary shrink-0" />
      </button>
    </Screen>
  );
}
