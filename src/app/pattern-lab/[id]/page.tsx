"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Layers, Sparkles } from "lucide-react";
import type { Pattern, Exercise, MorphemePart } from "@/core/types";
import { getLesson, getPattern } from "@/core/data/index";
import { renderBreakdown, parseHighlightMarks } from "@/core/engine/patternEngine";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import ProgressBar from "@/components/ui/ProgressBar";
import AppButton from "@/components/ui/AppButton";
import VerificationTag from "@/components/ui/VerificationTag";
import ExercisePlayer from "@/components/exercises/ExercisePlayer";

type Step =
  | { kind: "pattern"; pattern: Pattern }
  | { kind: "exercise"; exercise: Exercise }
  | { kind: "exceptions"; patterns: Pattern[] }
  | { kind: "completion" };

export default function PatternLabRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const hydrated = useHasHydrated();
  const lesson = getLesson(id);

  const completeLesson = useRootsStore((s) => s.completeLesson);

  const patterns = useMemo<Pattern[]>(
    () => (lesson?.patternIds ?? []).map((pid) => getPattern(pid)).filter(Boolean) as Pattern[],
    [lesson],
  );

  const steps = useMemo<Step[]>(() => {
    if (!lesson) return [];
    const s: Step[] = [];
    for (const p of patterns) s.push({ kind: "pattern", pattern: p });
    for (const ex of lesson.exercises) s.push({ kind: "exercise", exercise: ex });
    s.push({ kind: "exceptions", patterns });
    s.push({ kind: "completion" });
    return s;
  }, [lesson, patterns]);

  const [index, setIndex] = useState(0);
  const [committed, setCommitted] = useState(false);

  if (!lesson) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-4">
        <p className="text-text-secondary text-sm">We couldn&apos;t find that pattern lab.</p>
        <AppButton onClick={() => router.push("/home")}>Back to home</AppButton>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="deboss w-24 h-3 rounded-full opacity-50" />
      </div>
    );
  }

  const step = steps[index];
  const isCompletion = step.kind === "completion";
  const progress = (index / Math.max(1, steps.length - 1)) * 100;

  function advance() {
    setIndex((i) => {
      const next = Math.min(i + 1, steps.length - 1);
      if (steps[next]?.kind === "completion" && !committed) {
        completeLesson(lesson!.id, lesson!.wordIds, lesson!.patternIds ?? []);
        setCommitted(true);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col min-h-dvh px-5 pb-10">
      {!isCompletion && (
        <div className="flex items-center gap-3 pt-2 pb-6">
          <button
            onClick={() => router.push("/home")}
            aria-label="Close pattern lab"
            className="emboss-sm w-9 h-9 rounded-full flex items-center justify-center text-text-secondary shrink-0 active:scale-95 transition-transform"
          >
            <X size={18} strokeWidth={2} />
          </button>
          <div className="flex-1">
            <ProgressBar value={progress} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center">
        {step.kind === "pattern" && <PatternCard pattern={step.pattern} onContinue={advance} />}

        {step.kind === "exercise" && (
          <ExercisePlayer key={step.exercise.id} exercise={step.exercise} onContinue={advance} />
        )}

        {step.kind === "exceptions" && <ExceptionsCard patterns={step.patterns} onContinue={advance} />}

        {step.kind === "completion" && (
          <CompletionCard
            patternNames={patterns.map((p) => p.name)}
            onDone={() => router.push("/home")}
          />
        )}
      </div>
    </div>
  );
}

// ── Morpheme breakdown ───────────────────────────────────────────────────────

function Breakdown({ parts }: { parts: MorphemePart[] }) {
  const segments = parseHighlightMarks(renderBreakdown(parts));
  return (
    <span className="font-display text-xl font-bold">
      {segments.map((seg, i) => (
        <span key={i} className={seg.highlighted ? "text-accent" : "text-text-primary"}>
          {seg.text}
        </span>
      ))}
    </span>
  );
}

// ── Pattern intro + examples ─────────────────────────────────────────────────

function PatternCard({ pattern, onContinue }: { pattern: Pattern; onContinue: () => void }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-3 text-accent">
        <Layers size={15} strokeWidth={1.8} />
        <span className="text-[11px] font-semibold uppercase tracking-widest">Pattern</span>
      </div>

      <div className="emboss rounded-[1.75rem] p-6 mb-5">
        <h2 className="font-display text-2xl font-bold text-text-primary leading-tight mb-1">
          {pattern.name}
        </h2>
        <p className="text-sm text-accent-soft mb-3">{pattern.pattern}</p>
        <p className="text-[15px] text-text-secondary leading-relaxed mb-2">
          This pattern {pattern.plainEnglishMeaning}.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">{pattern.explanation}</p>
        <div className="mt-4">
          <VerificationTag />
        </div>
      </div>

      {/* Example cards */}
      <div className="space-y-3 mb-2">
        {pattern.examples.map((ex) => (
          <div key={ex.word} className="emboss-sm rounded-2xl p-4">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <Breakdown parts={ex.breakdown} />
              <span className="text-sm text-text-secondary shrink-0">{ex.translation}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-1">
              {ex.breakdown.map((p, i) => (
                <span
                  key={i}
                  className={`text-[11px] rounded-full px-2.5 py-0.5 ${
                    p.type === "prefix" || p.type === "suffix"
                      ? "deboss-sm text-accent"
                      : "deboss-sm text-text-secondary"
                  }`}
                >
                  {p.text} · {p.meaning}
                </span>
              ))}
            </div>
            {ex.realLifeContext && (
              <p className="text-xs text-text-secondary mt-2 italic">{ex.realLifeContext}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5">
        <AppButton fullWidth onClick={onContinue}>Got it →</AppButton>
      </div>
    </div>
  );
}

// ── Exceptions / verification note ───────────────────────────────────────────

function ExceptionsCard({ patterns, onContinue }: { patterns: Pattern[]; onContinue: () => void }) {
  const notes = patterns
    .map((p) => p.exceptionsNote)
    .filter((n, i, arr): n is string => !!n && arr.indexOf(n) === i);

  return (
    <div className="flex flex-col">
      <div className="emboss rounded-[1.75rem] p-6 mb-5">
        <h2 className="font-display text-xl font-bold text-text-primary mb-3">
          A quick honesty note
        </h2>
        <div className="space-y-3">
          {notes.map((n, i) => (
            <p key={i} className="text-sm text-text-secondary leading-relaxed">{n}</p>
          ))}
        </div>
        <div className="mt-4">
          <VerificationTag />
        </div>
      </div>
      <AppButton fullWidth onClick={onContinue}>I understand →</AppButton>
    </div>
  );
}

// ── Completion ───────────────────────────────────────────────────────────────

function CompletionCard({ patternNames, onDone }: { patternNames: string[]; onDone: () => void }) {
  return (
    <div className="flex flex-col items-center text-center pt-4">
      <style>{`
        @keyframes popIn { 0%{opacity:0;transform:translateY(8px) scale(.92)} 100%{opacity:1;transform:none} }
        @media (prefers-reduced-motion: reduce){ .pop{animation:none!important} }
      `}</style>

      <div
        className="pop emboss w-20 h-20 rounded-full flex items-center justify-center mb-6 text-accent"
        style={{ animation: "popIn 0.5s ease-out both" }}
      >
        <Sparkles size={30} strokeWidth={1.8} />
      </div>

      <h1 className="font-display text-2xl font-bold text-text-primary mb-2 leading-tight">
        Patterns I&apos;ve Noticed +{patternNames.length}
      </h1>
      <p className="text-sm text-text-secondary mb-6">
        You noticed something real about how Kinyarwanda works.
      </p>

      <div className="w-full space-y-2.5 mb-8">
        {patternNames.map((name, i) => (
          <div
            key={name}
            className="pop deboss rounded-2xl px-4 py-3 text-left"
            style={{ animation: "popIn 0.4s ease-out both", animationDelay: `${i * 70}ms` }}
          >
            <p className="text-sm font-semibold text-text-primary">{name}</p>
            <p className="text-[11px] text-accent">Added to your Pattern Bank</p>
          </div>
        ))}
      </div>

      <div className="w-full">
        <AppButton fullWidth onClick={onDone}>Back to home</AppButton>
      </div>
    </div>
  );
}
