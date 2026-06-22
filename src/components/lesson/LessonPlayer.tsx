"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { Lesson, Exercise, LearnerType } from "@/core/types";
import { buildLessonSteps } from "@/core/engine/lessonEngine";
import {
  getWord,
  getWordsByIds,
  getSentenceFrame,
  getLessons,
} from "@/core/data/index";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import ProgressBar from "@/components/ui/ProgressBar";
import Modal from "@/components/ui/Modal";
import ExercisePlayer from "@/components/exercises/ExercisePlayer";
import WordIntroCard from "./WordIntroCard";
import SentenceFrameCard from "./SentenceFrameCard";
import IntroPanelCard from "./IntroPanelCard";
import CompletionScreen from "./CompletionScreen";

interface LessonPlayerProps {
  lesson: Lesson;
}

export default function LessonPlayer({ lesson }: LessonPlayerProps) {
  const router = useRouter();
  const hydrated = useHasHydrated();

  const learnerType = useRootsStore((s) => s.learnerType);
  const streakDays = useRootsStore((s) => s.streakDays);
  const completeLesson = useRootsStore((s) => s.completeLesson);
  const markWeakWord = useRootsStore((s) => s.markWeakWord);

  const steps = useMemo(() => buildLessonSteps(lesson), [lesson]);

  const [stepIndex, setStepIndex] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [committed, setCommitted] = useState(false);

  const step = steps[stepIndex];
  const isCompletion = step?.kind === "completion";
  const progress = (stepIndex / Math.max(1, steps.length - 1)) * 100;

  // XP mirrors the store's completeLesson math (exerciseCount * 10).
  const xpEarned = lesson.exercises.length * 10;

  // Next recommended lesson (first uncompleted after this one in the list)
  const nextLesson = useMemo(() => {
    const all = getLessons(lesson.languageId);
    const idx = all.findIndex((l) => l.id === lesson.id);
    return idx >= 0 ? all[idx + 1] : undefined;
  }, [lesson]);

  function advance() {
    setStepIndex((i) => {
      const next = Math.min(i + 1, steps.length - 1);
      // When we land on the completion step, commit progress to the store once.
      if (steps[next]?.kind === "completion" && !committed) {
        completeLesson(lesson.id, lesson.wordIds, lesson.patternIds ?? []);
        setCommitted(true);
      }
      return next;
    });
  }

  function handleWrong(exercise: Exercise) {
    for (const wid of exercise.relatedWordIds ?? []) {
      markWeakWord(wid);
    }
  }

  function confirmExit() {
    setExitOpen(false);
    router.push("/home");
  }

  function handleClose() {
    if (stepIndex === 0 || isCompletion) router.push("/home");
    else setExitOpen(true);
  }

  function finish() {
    if (nextLesson) router.push(`/lesson/${nextLesson.id}`);
    else router.push("/home");
  }

  if (!hydrated) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6">
        <div className="deboss w-24 h-3 rounded-full opacity-50" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh px-5 pb-10">
      {/* Top bar */}
      {!isCompletion && (
        <div className="flex items-center gap-3 pt-2 pb-5">
          <button
            onClick={handleClose}
            aria-label="Close lesson"
            className="emboss-sm w-9 h-9 rounded-full flex items-center justify-center text-text-secondary shrink-0 active:scale-95 transition-transform"
          >
            <X size={18} strokeWidth={2} />
          </button>
          <div className="flex-1">
            <ProgressBar value={progress} />
          </div>
        </div>
      )}

      {/* Step body */}
      <div className="flex-1 flex flex-col justify-center">
        {step?.kind === "intro_panel" && (
          <IntroPanelCard key={step.panel.id} panel={step.panel} onContinue={advance} />
        )}

        {step?.kind === "word_card" && <WordStep wordId={step.wordId} learnerType={learnerType} onContinue={advance} />}

        {step?.kind === "sentence_frame" && (
          <FrameStep frameId={step.frameId} onContinue={advance} />
        )}

        {step?.kind === "exercise" && (
          <ExercisePlayer
            key={step.exercise.id}
            exercise={step.exercise}
            onContinue={advance}
            onWrong={handleWrong}
          />
        )}

        {isCompletion && (
          <CompletionScreen
            message={lesson.completionMessage}
            xpEarned={xpEarned}
            unlockedWords={getWordsByIds(lesson.wordIds)}
            streakDays={streakDays}
            nextLabel={nextLesson ? `Next: ${nextLesson.title}` : "Back to home"}
            onNext={finish}
          />
        )}
      </div>

      <Modal
        open={exitOpen}
        title="Leave this lesson?"
        body="Your progress in this lesson won't be saved until you finish it."
        confirmLabel="Leave"
        cancelLabel="Keep going"
        onConfirm={confirmExit}
        onCancel={() => setExitOpen(false)}
      />
    </div>
  );
}

// ── Small wrappers that resolve data through the boundary ──────────────────────

function WordStep({
  wordId,
  learnerType,
  onContinue,
}: {
  wordId: string;
  learnerType: LearnerType | null;
  onContinue: () => void;
}) {
  const word = getWord(wordId);
  if (!word) {
    return <SkeletonStep onContinue={onContinue} />;
  }
  return <WordIntroCard word={word} learnerType={learnerType} onContinue={onContinue} />;
}

function FrameStep({ frameId, onContinue }: { frameId: string; onContinue: () => void }) {
  const frame = getSentenceFrame(frameId);
  if (!frame) {
    return <SkeletonStep onContinue={onContinue} />;
  }
  return <SentenceFrameCard frame={frame} onContinue={onContinue} />;
}

function SkeletonStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center">
      <p className="text-sm text-text-secondary mb-4">This step is missing its content.</p>
      <button onClick={onContinue} className="text-accent text-sm underline">
        Skip →
      </button>
    </div>
  );
}
