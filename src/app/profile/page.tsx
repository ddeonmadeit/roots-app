"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import Screen from "@/components/ui/Screen";
import AppButton from "@/components/ui/AppButton";
import Modal from "@/components/ui/Modal";
import ThemeToggle from "@/components/ui/ThemeToggle";

const LEARNER_TYPE_LABELS: Record<string, string> = {
  child: "Child (under 13)",
  teen: "Teen (13+)",
  adult: "Adult",
  parent: "Parent",
};

const REASON_LABELS: Record<string, string> = {
  family: "For family",
  child: "For my child",
  culture: "Cultural reconnection",
  travel: "Travel",
  passive_speaker: "Passive speaker",
  general: "General curiosity",
};

const LEVEL_LABELS: Record<string, string> = {
  zero: "Starting from zero",
  greetings_only: "Greetings only",
  understand_cant_reply: "Understand but can't reply",
  speak_a_little: "Can speak a little",
  build_confidence: "Building confidence",
};

export default function ProfilePage() {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const [resetOpen, setResetOpen] = useState(false);

  const learnerType = useRootsStore((s) => s.learnerType);
  const learningReason = useRootsStore((s) => s.learningReason);
  const passiveSpeakerLevel = useRootsStore((s) => s.passiveSpeakerLevel);
  const selectedLanguageId = useRootsStore((s) => s.selectedLanguageId);
  const parentMode = useRootsStore((s) => s.parentMode);
  const parentName = useRootsStore((s) => s.parentName);
  const childProfile = useRootsStore((s) => s.childProfile);
  const streakDays = useRootsStore((s) => s.streakDays);
  const xp = useRootsStore((s) => s.xp);
  const collectedWordIds = useRootsStore((s) => s.collectedWordIds);

  const startLearnerDemo = useRootsStore((s) => s.startLearnerDemo);
  const startParentDemo = useRootsStore((s) => s.startParentDemo);
  const resetDemo = useRootsStore((s) => s.resetDemo);

  if (!hydrated) {
    return (
      <Screen>
        <div className="h-[60vh] flex items-center justify-center">
          <div className="deboss w-32 h-3 rounded-full opacity-50" />
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="mb-6 pt-2">
        <h1 className="font-display text-3xl font-bold text-text-primary">Profile</h1>
      </div>

      {/* Learner info */}
      <div className="space-y-2.5 mb-6">
        <InfoRow label="Learning" value={selectedLanguageId.charAt(0).toUpperCase() + selectedLanguageId.slice(1)} />

        {parentMode && parentName && (
          <InfoRow label="Parent" value={parentName} />
        )}

        {parentMode && childProfile && (
          <>
            <InfoRow label="Child" value={`${childProfile.name}, ages ${childProfile.ageRange}`} />
            <InfoRow label="Streak" value={`${childProfile.streakDays} days`} />
            <InfoRow label="Words collected" value={String(childProfile.wordsCollected)} />
          </>
        )}

        {!parentMode && (
          <>
            {learnerType && (
              <InfoRow label="Learner type" value={LEARNER_TYPE_LABELS[learnerType] ?? learnerType} />
            )}
            {learningReason && (
              <InfoRow label="Why learning" value={REASON_LABELS[learningReason] ?? learningReason} />
            )}
            {passiveSpeakerLevel && (
              <InfoRow label="Starting level" value={LEVEL_LABELS[passiveSpeakerLevel] ?? passiveSpeakerLevel} />
            )}
            <InfoRow label="Streak" value={`${streakDays} day${streakDays !== 1 ? "s" : ""}`} />
            <InfoRow label="Words collected" value={String(collectedWordIds.length)} />
            <InfoRow label="XP" value={String(xp)} />
          </>
        )}
      </div>

      {/* Theme toggle */}
      <div className="mb-6">
        <ThemeToggle />
      </div>

      {/* Demo controls */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-3">
          Demo controls
        </p>
        <div className="space-y-2.5">
          <AppButton
            fullWidth
            variant="secondary"
            onClick={() => {
              startLearnerDemo();
              router.push("/home");
            }}
          >
            Switch to Learner Demo
          </AppButton>

          <AppButton
            fullWidth
            variant="secondary"
            onClick={() => {
              startParentDemo();
              router.push("/parent");
            }}
          >
            Switch to Parent Demo
          </AppButton>

          <AppButton
            fullWidth
            variant="ghost"
            onClick={() => setResetOpen(true)}
          >
            Reset demo
          </AppButton>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="deboss rounded-3xl p-5">
        <p className="text-xs text-text-secondary leading-relaxed text-center">
          Kinyarwanda demo content is being verified with native speakers.
          Some spellings and phrases may change.
        </p>
      </div>

      {/* Reset confirmation modal */}
      <Modal
        open={resetOpen}
        title="Reset demo?"
        body="This clears all progress — streak, collected words, and completed lessons. The app returns to the entry screen."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={() => {
          resetDemo();
          setResetOpen(false);
          router.replace("/");
        }}
        onCancel={() => setResetOpen(false)}
      />
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="emboss rounded-3xl px-5 py-4 flex items-center justify-between gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-accent shrink-0">
        {label}
      </p>
      <p className="font-medium text-text-primary text-sm text-right">{value}</p>
    </div>
  );
}
