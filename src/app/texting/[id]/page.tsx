"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Lock, MessageSquare, ShieldAlert, Check } from "lucide-react";
import { getTextingLesson } from "@/core/data/index";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import ProgressBar from "@/components/ui/ProgressBar";
import AppButton from "@/components/ui/AppButton";
import ExercisePlayer from "@/components/exercises/ExercisePlayer";

export default function TextingRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const hydrated = useHasHydrated();
  const lesson = getTextingLesson(id);

  const learnerType = useRootsStore((s) => s.learnerType);
  const parentMode = useRootsStore((s) => s.parentMode);
  const childProfile = useRootsStore((s) => s.childProfile);
  const completeTexting = useRootsStore((s) => s.completeTexting);

  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  if (!lesson) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-4">
        <p className="text-text-secondary text-sm">We couldn&apos;t find that conversation.</p>
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

  // ── Age gate ──────────────────────────────────────────────────────────────
  const isChildLearner =
    learnerType === "child" ||
    (parentMode && !!childProfile && childProfile.ageRange !== "13+");

  if (lesson.ageMode === "teen_adult" && isChildLearner) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-10 text-center gap-5">
        <div className="emboss w-16 h-16 rounded-full flex items-center justify-center text-accent">
          <Lock size={26} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">This one unlocks at 13+</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Casual texting and slang come later. For now, let&apos;s keep building the words and
            family phrases that matter most.
          </p>
        </div>
        <AppButton onClick={() => router.push("/home")}>Back to home</AppButton>
      </div>
    );
  }

  // ── Completion ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center gap-5">
        <div className="emboss w-16 h-16 rounded-full flex items-center justify-center text-green">
          <Check size={28} strokeWidth={2} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">You read the room.</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Knowing when to be casual and when to be elder-safe is half the language.
          </p>
        </div>
        <AppButton onClick={() => router.push("/home")}>Back to home</AppButton>
      </div>
    );
  }

  const exercise = lesson.exercises[index];
  const progress = (index / lesson.exercises.length) * 100;

  function advance() {
    if (index + 1 >= lesson!.exercises.length) {
      completeTexting(lesson!.id);
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <div className="flex flex-col min-h-dvh px-5 pb-10">
      <style>{`
        @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @media (prefers-reduced-motion: reduce){ .msg-in{animation:none!important} }
      `}</style>

      {/* Top bar */}
      <div className="flex items-center gap-3 pt-2 pb-4">
        <button
          onClick={() => router.push("/home")}
          aria-label="Close"
          className="emboss-sm w-9 h-9 rounded-full flex items-center justify-center text-text-secondary shrink-0 active:scale-95 transition-transform"
        >
          <X size={18} strokeWidth={2} />
        </button>
        <div className="flex-1">
          <ProgressBar value={progress} />
        </div>
      </div>

      {/* Chat header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="emboss-sm w-10 h-10 rounded-full flex items-center justify-center text-accent">
          <MessageSquare size={18} strokeWidth={1.8} />
        </div>
        <div>
          <p className="font-semibold text-text-primary text-sm leading-tight">{lesson.title}</p>
          <p className="text-[11px] text-text-secondary">Family group chat</p>
        </div>
      </div>

      {/* Verification banner */}
      <div className="deboss rounded-2xl px-4 py-2.5 mb-4 flex items-center gap-2">
        <ShieldAlert size={14} strokeWidth={1.8} className="text-accent shrink-0" />
        <p className="text-[11px] text-text-secondary leading-snug">
          Slang and casual phrasing need native-speaker review before production.
        </p>
      </div>

      {/* Incoming messages */}
      <div className="space-y-2 mb-5">
        {lesson.incomingMessages.map((msg, i) => (
          <div key={i} className="flex justify-start msg-in" style={{ animation: `msgIn 0.3s ease-out ${i * 0.08}s both` }}>
            <div className="deboss rounded-3xl rounded-bl-lg px-4 py-2.5 max-w-[80%]">
              <p className="text-sm text-text-primary">{msg}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Exercise */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="emboss-sm rounded-[1.75rem] p-5">
          <ExercisePlayer
            key={exercise.id}
            exercise={exercise}
            onContinue={advance}
            continueLabel={index + 1 >= lesson.exercises.length ? "Finish →" : "Next →"}
          />
        </div>
      </div>
    </div>
  );
}
