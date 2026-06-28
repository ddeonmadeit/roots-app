"use client";

import { Phone, PhoneOff } from "lucide-react";
import type { Scenario } from "@/core/types";
import type { Character } from "@/core/types";
import CharacterPortrait from "@/components/characters/CharacterPortrait";

interface IncomingCallProps {
  scenario: Scenario;
  character?: Character;
  onAnswer: () => void;
  onDecline: () => void;
}

export default function IncomingCall({ scenario, character, onAnswer, onDecline }: IncomingCallProps) {
  const hex = character?.themeHex ?? "var(--accent)";
  const ringRgba = character?.ringRgba ?? "rgba(148,119,75,0.30)";
  const washRgba = character?.washRgba ?? "rgba(148,119,75,0.08)";
  const characterId = character?.id ?? "nyogokuru";

  return (
    <div
      className="relative flex flex-col items-center justify-between min-h-dvh px-8 py-14 text-center overflow-hidden"
      style={{ background: `var(--background)` }}
    >
      <style>{`
        @keyframes callRing {
          0%   { transform: scale(1);   opacity: 0.60; }
          75%  { transform: scale(1.7); opacity: 0;    }
          100% { transform: scale(1.7); opacity: 0;    }
        }
        @keyframes callShake {
          0%,100% { transform: rotate(0deg); }
          20% { transform: rotate(-9deg); }
          40% { transform: rotate(9deg); }
          60% { transform: rotate(-5deg); }
          80% { transform: rotate(5deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .call-ring, .call-shake { animation: none !important; }
        }
      `}</style>

      {/* Colour wash — fills top ~55% of screen with character's hue */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 90% 58% at 50% 0%, ${washRgba.replace("0.11", "0.22")} 0%, transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* Top label */}
      <div className="relative pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-secondary mb-1">
          Incoming call
        </p>
        <p className="text-xs text-text-secondary">Kinyarwanda · phone call</p>
      </div>

      {/* Character portrait with pulsing rings */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative flex items-end justify-center" style={{ width: 220, height: 220 }}>
          {/* Pulsing rings in character colour */}
          <span
            className="call-ring absolute inset-0 rounded-full"
            style={{
              background: ringRgba,
              animation: "callRing 2s ease-out infinite",
            }}
            aria-hidden="true"
          />
          <span
            className="call-ring absolute inset-0 rounded-full"
            style={{
              background: ringRgba,
              animation: "callRing 2s ease-out infinite 1s",
            }}
            aria-hidden="true"
          />

          {/* Character medallion */}
          <div
            className="relative flex items-end justify-center w-full h-full rounded-full overflow-hidden"
            style={{
              background: washRgba.replace("0.11", "0.18"),
              boxShadow: `6px 6px 18px var(--shadow-dark), -6px -6px 18px var(--shadow-light), inset 0 0 24px 0 ${ringRgba.replace("0.38", "0.22")}`,
            }}
          >
            {/* Portrait floats up from the bottom of the medallion */}
            <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)" }}>
              <CharacterPortrait characterId={characterId} size={195} />
            </div>
          </div>
        </div>

        {/* Name + subtitle */}
        <div>
          <h1
            className="font-display text-3xl font-bold mb-1.5 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {scenario.callerName}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {scenario.subtitle}
          </p>
        </div>
      </div>

      {/* Answer / Decline */}
      <div className="relative flex items-end justify-center gap-20 w-full pb-2">
        <button onClick={onDecline} aria-label="Decline call" className="flex flex-col items-center gap-3">
          <span
            className="emboss-interactive w-16 h-16 rounded-full flex items-center justify-center"
            style={{ color: "var(--red)" }}
          >
            <PhoneOff size={26} strokeWidth={2} />
          </span>
          <span className="text-xs text-text-secondary">Decline</span>
        </button>

        <button onClick={onAnswer} aria-label="Answer call" className="flex flex-col items-center gap-3">
          <span
            className="call-shake emboss-interactive w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              color: hex,
              animation: "callShake 1s ease-in-out infinite",
              boxShadow: `6px 6px 16px var(--shadow-dark), -6px -6px 16px var(--shadow-light), inset 0 0 18px 0 ${ringRgba.replace("0.38", "0.28")}`,
            }}
          >
            <Phone size={30} strokeWidth={2} />
          </span>
          <span className="text-xs font-semibold" style={{ color: hex }}>Answer</span>
        </button>
      </div>
    </div>
  );
}
