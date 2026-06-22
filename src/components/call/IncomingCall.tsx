"use client";

import { Phone, PhoneOff } from "lucide-react";
import type { Scenario } from "@/core/types";

interface IncomingCallProps {
  scenario: Scenario;
  onAnswer: () => void;
  onDecline: () => void;
}

export default function IncomingCall({ scenario, onAnswer, onDecline }: IncomingCallProps) {
  const initial = scenario.callerName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center justify-between min-h-dvh px-8 py-16 text-center">
      <style>{`
        @keyframes callRing {
          0%   { transform: scale(1);   opacity: 0.55; }
          70%  { transform: scale(1.6); opacity: 0;    }
          100% { transform: scale(1.6); opacity: 0;    }
        }
        @keyframes callShake {
          0%,100% { transform: rotate(0deg); }
          20% { transform: rotate(-9deg); }
          40% { transform: rotate(9deg); }
          60% { transform: rotate(-6deg); }
          80% { transform: rotate(6deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .call-ring, .call-bell { animation: none !important; }
        }
      `}</style>

      <div className="pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-secondary mb-1">
          Incoming call
        </p>
        <p className="text-xs text-text-secondary">Kinyarwanda · mobile</p>
      </div>

      {/* Pulsing avatar */}
      <div className="flex flex-col items-center gap-7">
        <div className="relative flex items-center justify-center">
          <span
            className="call-ring absolute inline-block w-32 h-32 rounded-full"
            style={{ background: "rgba(148,119,75,0.25)", animation: "callRing 1.8s ease-out infinite" }}
            aria-hidden="true"
          />
          <span
            className="call-ring absolute inline-block w-32 h-32 rounded-full"
            style={{ background: "rgba(148,119,75,0.25)", animation: "callRing 1.8s ease-out infinite 0.9s" }}
            aria-hidden="true"
          />
          <div className="emboss-lg relative w-32 h-32 rounded-full flex items-center justify-center">
            <span className="font-display text-5xl font-bold text-accent">{initial}</span>
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary mb-1.5">
            {scenario.callerName}
          </h1>
          <p className="text-sm text-text-secondary">{scenario.subtitle}</p>
        </div>
      </div>

      {/* Answer / Decline */}
      <div className="flex items-end justify-center gap-16 w-full pb-4">
        <button
          onClick={onDecline}
          aria-label="Decline call"
          className="flex flex-col items-center gap-2.5"
        >
          <span
            className="emboss-interactive w-16 h-16 rounded-full flex items-center justify-center"
            style={{ color: "var(--red)" }}
          >
            <PhoneOff size={26} strokeWidth={2} />
          </span>
          <span className="text-xs text-text-secondary">Decline</span>
        </button>

        <button
          onClick={onAnswer}
          aria-label="Answer call"
          className="flex flex-col items-center gap-2.5"
        >
          <span
            className="emboss-interactive call-bell w-16 h-16 rounded-full flex items-center justify-center"
            style={{ color: "var(--green)", animation: "callShake 1s ease-in-out infinite" }}
          >
            <Phone size={26} strokeWidth={2} />
          </span>
          <span className="text-xs text-text-secondary">Answer</span>
        </button>
      </div>
    </div>
  );
}
