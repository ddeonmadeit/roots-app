"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles } from "lucide-react";
import type { Exercise } from "@/core/types";
import { buildReviewSession } from "@/core/engine/reviewEngine";
import { getWordsByIds } from "@/core/data/index";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import ProgressBar from "@/components/ui/ProgressBar";
import ExercisePlayer from "@/components/exercises/ExercisePlayer";
import AppButton from "@/components/ui/AppButton";

export default function ReviewPage() {
  const router = useRouter();
  const hydrated = useHasHydrated();

  const weakWordIds = useRootsStore((s) => s.weakWordIds);
  const collectedWordIds = useRootsStore((s) => s.collectedWordIds);
  const clearWeakWord = useRootsStore((s) => s.clearWeakWord);

  // Build the session once, after hydration (engine uses Math.random / Date.now,
  // so it must not run during SSR — we render a skeleton until hydrated).
  const session = useMemo<Exercise[]>(() => {
    if (!hydrated) return [];
    const poolIds = Array.from(new Set([...collectedWordIds, ...weakWordIds]));
    return buildReviewSession(weakWordIds, getWordsByIds(poolIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const [index, setIndex] = useState(0);

  if (!hydrated) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6">
        <div className="deboss w-24 h-3 rounded-full opacity-50" />
      </div>
    );
  }

  // Nothing to review
  if (session.length === 0) {
    return (
      <EmptyOrDone
        title="No weak words right now"
        body="When you miss an answer in a lesson, the word lands here so you can practise it. Nothing to review yet — nicely done."
        onBack={() => router.push("/home")}
      />
    );
  }

  // Finished the session
  if (index >= session.length) {
    return (
      <EmptyOrDone
        title="Weak words, cleared."
        body="You worked through every word that needed another look. They've been refreshed in your Roots Bank."
        onBack={() => router.push("/home")}
      />
    );
  }

  const exercise = session[index];
  const progress = (index / session.length) * 100;

  function handleContinue() {
    // Correct answer reached — clear the weak word(s) tied to this exercise.
    for (const wid of exercise.relatedWordIds ?? []) {
      clearWeakWord(wid);
    }
    setIndex((i) => i + 1);
  }

  return (
    <div className="flex flex-col min-h-dvh px-5 pb-10">
      <div className="flex items-center gap-3 pt-2 pb-5">
        <button
          onClick={() => router.push("/home")}
          aria-label="Close review"
          className="emboss-sm w-9 h-9 rounded-full flex items-center justify-center text-text-secondary shrink-0 active:scale-95 transition-transform"
        >
          <X size={18} strokeWidth={2} />
        </button>
        <div className="flex-1">
          <ProgressBar value={progress} />
        </div>
        <span className="text-xs text-text-secondary shrink-0 tabular-nums">
          {index + 1}/{session.length}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-accent">
        <Sparkles size={15} strokeWidth={1.8} />
        <span className="text-[11px] font-semibold uppercase tracking-widest">Review</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <ExercisePlayer
          key={exercise.id}
          exercise={exercise}
          onContinue={handleContinue}
          continueLabel={index + 1 < session.length ? "Next word" : "Finish review"}
        />
      </div>
    </div>
  );
}

function EmptyOrDone({
  title,
  body,
  onBack,
}: {
  title: string;
  body: string;
  onBack: () => void;
}) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center gap-5">
      <div className="emboss w-16 h-16 rounded-full flex items-center justify-center">
        <Sparkles size={26} strokeWidth={1.8} className="text-accent" />
      </div>
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary mb-2">{title}</h1>
        <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
      </div>
      <AppButton onClick={onBack}>Back to home</AppButton>
    </div>
  );
}
