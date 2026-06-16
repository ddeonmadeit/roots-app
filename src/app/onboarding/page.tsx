"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRootsStore } from "@/store/useRootsStore";
import AppButton from "@/components/ui/AppButton";
import type { LearningReason, LearnerType, PassiveSpeakerLevel } from "@/core/types";

// ── Step data ──────────────────────────────────────────────────────────────

const INTRO_LINES = [
  "Your grandma is calling…",
  "She starts speaking in your language.",
  "You understand one word.",
  "Then you freeze.",
  "Roots helps you answer.",
];

const REASONS: { value: LearningReason; label: string; sub: string }[] = [
  { value: "family",          label: "For my family",                  sub: "Talk to grandparents, aunts, uncles" },
  { value: "child",           label: "For my child",                   sub: "Help them connect with their roots" },
  { value: "culture",         label: "For culture",                    sub: "Reconnect with where I come from" },
  { value: "travel",          label: "For travel",                     sub: "Planning a visit or trip abroad" },
  { value: "passive_speaker", label: "I understand but cannot reply",  sub: "I grew up hearing it but can't speak back" },
  { value: "general",         label: "I just want to learn",           sub: "Curiosity and personal growth" },
];

const LEARNER_TYPES: { value: LearnerType; label: string; sub: string }[] = [
  { value: "child",  label: "Child under 13",              sub: "Learning with family support" },
  { value: "teen",   label: "Teen 13+",                    sub: "Independent learner" },
  { value: "adult",  label: "Adult",                       sub: "Reconnecting on your own terms" },
  { value: "parent", label: "Parent setting up for child", sub: "Creating an account for a young learner" },
];

const PASSIVE_LEVELS: { value: PassiveSpeakerLevel; label: string; sub: string }[] = [
  { value: "zero",                 label: "I am starting from zero",             sub: "Never heard it before" },
  { value: "greetings_only",       label: "I know greetings only",               sub: "Muraho and not much more" },
  { value: "understand_cant_reply",label: "I understand but cannot reply",       sub: "The words go in but don't come out" },
  { value: "speak_a_little",       label: "I can speak a little",                sub: "A few phrases, nothing fluent" },
  { value: "build_confidence",     label: "I want to build confidence",          sub: "I have some ability, want more" },
];

// ── Selection card ─────────────────────────────────────────────────────────

function OptionCard({
  label,
  sub,
  selected,
  onClick,
}: {
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-[1.45rem] p-4 transition-all duration-150 ${
        selected ? "emboss" : "deboss"
      }`}
      style={
        selected
          ? {
              boxShadow:
                "4px 4px 10px var(--shadow-dark), -4px -4px 10px var(--shadow-light), inset 0 0 8px 1px rgba(232,146,76,0.22)",
            }
          : undefined
      }
    >
      <p className={`font-semibold text-sm ${selected ? "text-accent-dark" : "text-text-primary"}`}>
        {label}
      </p>
      <p className="text-xs text-text-secondary mt-0.5">{sub}</p>
    </button>
  );
}

// ── Onboarding page ────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const setOnboardingAnswers = useRootsStore((s) => s.setOnboardingAnswers);
  const completeOnboarding = useRootsStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0); // 0 = intro, 1 = reason, 2 = learnerType, 3 = passive
  const [visibleLines, setVisibleLines] = useState(0);
  const [reason, setReason] = useState<LearningReason | null>(null);
  const [learnerType, setLearnerType] = useState<LearnerType | null>(null);
  const [passiveLevel, setPassiveLevel] = useState<PassiveSpeakerLevel | null>(null);

  // Animate intro lines
  useEffect(() => {
    if (step !== 0) return;
    const timers = INTRO_LINES.map((_, i) =>
      setTimeout(() => setVisibleLines((v) => Math.max(v, i + 1)), i * 700 + 300),
    );
    return () => timers.forEach(clearTimeout);
  }, [step]);

  function handleNext() {
    if (step === 0) { setStep(1); return; }
    if (step === 1 && reason) {
      setOnboardingAnswers({ learningReason: reason });
      setStep(2);
      return;
    }
    if (step === 2 && learnerType) {
      setOnboardingAnswers({ learnerType });
      setStep(3);
      return;
    }
    if (step === 3 && passiveLevel) {
      setOnboardingAnswers({ passiveSpeakerLevel: passiveLevel });
      completeOnboarding();
      // Parent branch → /parent/setup (Phase 5). For now route all to /languages.
      router.push("/languages");
    }
  }

  const canAdvance =
    step === 0 ||
    (step === 1 && reason !== null) ||
    (step === 2 && learnerType !== null) ||
    (step === 3 && passiveLevel !== null);

  const currentDot = step;

  return (
    <div className="min-h-dvh flex flex-col px-5 py-6" style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}>
      {/* Progress dots (steps 1–4 only) */}
      {step > 0 && (
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((dot) => (
            <div
              key={dot}
              className={`rounded-full transition-all duration-300 ${
                dot === currentDot
                  ? "w-5 h-2 bg-accent"
                  : dot < currentDot
                  ? "w-2 h-2 bg-accent-soft"
                  : "w-2 h-2 bg-border"
              }`}
            />
          ))}
        </div>
      )}

      {/* ── Step 0: Emotional intro ──────────────────────────────────────── */}
      {step === 0 && (
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-12 space-y-4">
            {INTRO_LINES.map((line, i) => (
              <p
                key={i}
                className={`transition-all duration-500 ${
                  i < visibleLines
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                } ${
                  i === INTRO_LINES.length - 1
                    ? "font-display text-2xl font-bold text-text-primary"
                    : "text-lg text-text-secondary"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
          <AppButton
            fullWidth
            onClick={handleNext}
            className={`transition-all duration-500 ${visibleLines >= INTRO_LINES.length ? "opacity-100" : "opacity-0"}`}
          >
            Start reconnecting
          </AppButton>
        </div>
      )}

      {/* ── Step 1: Why are you learning? ───────────────────────────────── */}
      {step === 1 && (
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
              Why are you learning?
            </h2>
            <p className="text-sm text-text-secondary">
              Your answer shapes what we show you first.
            </p>
          </div>
          <div className="flex-1 space-y-2.5 mb-6">
            {REASONS.map((r) => (
              <OptionCard
                key={r.value}
                label={r.label}
                sub={r.sub}
                selected={reason === r.value}
                onClick={() => setReason(r.value)}
              />
            ))}
          </div>
          <AppButton fullWidth onClick={handleNext} disabled={!canAdvance}>
            Continue
          </AppButton>
        </div>
      )}

      {/* ── Step 2: Who is learning? ─────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
              Who is learning?
            </h2>
            <p className="text-sm text-text-secondary">
              We adjust the content to fit you.
            </p>
          </div>
          <div className="flex-1 space-y-2.5 mb-6">
            {LEARNER_TYPES.map((t) => (
              <OptionCard
                key={t.value}
                label={t.label}
                sub={t.sub}
                selected={learnerType === t.value}
                onClick={() => setLearnerType(t.value)}
              />
            ))}
          </div>
          <AppButton fullWidth onClick={handleNext} disabled={!canAdvance}>
            Continue
          </AppButton>
        </div>
      )}

      {/* ── Step 3: Passive speaker check ───────────────────────────────── */}
      {step === 3 && (
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
              How much do you already understand?
            </h2>
            <p className="text-sm text-text-secondary">
              Be honest — it helps us start in the right place.
            </p>
          </div>
          <div className="flex-1 space-y-2.5 mb-6">
            {PASSIVE_LEVELS.map((l) => (
              <OptionCard
                key={l.value}
                label={l.label}
                sub={l.sub}
                selected={passiveLevel === l.value}
                onClick={() => setPassiveLevel(l.value)}
              />
            ))}
          </div>
          <AppButton fullWidth onClick={handleNext} disabled={!canAdvance}>
            Show me the languages
          </AppButton>
        </div>
      )}
    </div>
  );
}
