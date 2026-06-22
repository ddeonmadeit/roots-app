"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Flame, Archive, BookOpen, Clock, Heart, Send, Check,
  ChevronRight, Sparkles, TrendingUp,
} from "lucide-react";
import type { ChallengeType } from "@/core/types";
import { getWordsByIds, getLesson, getLanguage } from "@/core/data/index";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import Screen from "@/components/ui/Screen";
import AppButton from "@/components/ui/AppButton";
import ProgressBar from "@/components/ui/ProgressBar";

const CHALLENGES: { type: ChallengeType; label: string }[] = [
  { type: "practice_greeting", label: "Practice greeting grandma" },
  { type: "learn_family_words", label: "Learn 5 family words" },
  { type: "complete_phone_call", label: "Complete today's phone call" },
  { type: "review_weak_words", label: "Review weak words" },
  { type: "complete_story", label: "Complete a story" },
];

const CHALLENGE_LABEL: Record<ChallengeType, string> = Object.fromEntries(
  CHALLENGES.map((c) => [c.type, c.label]),
) as Record<ChallengeType, string>;

export default function ParentDashboard() {
  const router = useRouter();
  const hydrated = useHasHydrated();

  const childProfile = useRootsStore((s) => s.childProfile);
  const parentName = useRootsStore((s) => s.parentName);
  const sentChallenges = useRootsStore((s) => s.sentChallenges);
  const sendChallenge = useRootsStore((s) => s.sendChallenge);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [justSent, setJustSent] = useState<ChallengeType | null>(null);

  if (!hydrated) {
    return (
      <Screen>
        <div className="h-[60vh] flex items-center justify-center">
          <div className="deboss w-24 h-3 rounded-full opacity-50" />
        </div>
      </Screen>
    );
  }

  if (!childProfile) {
    return (
      <Screen>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-5 px-4">
          <div className="emboss w-16 h-16 rounded-full flex items-center justify-center text-accent">
            <Heart size={26} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary mb-2">Set up parent mode</h1>
            <p className="text-sm text-text-secondary">Create a profile to follow your child&apos;s journey.</p>
          </div>
          <AppButton onClick={() => router.push("/parent/setup")}>Get started</AppButton>
        </div>
      </Screen>
    );
  }

  const child = childProfile;
  const language = getLanguage(child.selectedLanguageId);
  const learnedWords = getWordsByIds(getLesson("lesson-1-grandma")?.wordIds ?? []).slice(0, 8);
  const weakWords = getWordsByIds(child.weakWordIds);
  const nextLesson = getLesson(child.recommendedNextLessonId);

  function send(type: ChallengeType) {
    sendChallenge(type);
    setJustSent(type);
    setSheetOpen(false);
    setTimeout(() => setJustSent(null), 2600);
  }

  return (
    <Screen>
      {/* Greeting */}
      <div className="mb-5 pt-2">
        <div className="flex items-center gap-2 mb-1 text-accent">
          <Heart size={15} strokeWidth={1.8} />
          <span className="text-[11px] font-semibold uppercase tracking-widest">Parent view</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-text-primary leading-tight">
          {parentName ? `Hello, ${parentName}` : "Welcome"}
        </h1>
        <p className="text-sm text-text-secondary mt-1">See how {child.name} is reconnecting.</p>
      </div>

      {/* Child header card */}
      <div className="emboss rounded-[1.75rem] p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="emboss-sm w-12 h-12 rounded-full flex items-center justify-center">
            <span className="font-display text-xl font-bold text-accent">{child.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-text-primary leading-tight">{child.name}</p>
            <p className="text-xs text-text-secondary">
              {language?.name ?? child.selectedLanguageId} · ages {child.ageRange}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Stat icon={<Flame size={15} strokeWidth={1.8} />} value={child.streakDays} label="streak" />
          <Stat icon={<Archive size={15} strokeWidth={1.8} />} value={child.wordsCollected} label="words" />
          <Stat icon={<BookOpen size={15} strokeWidth={1.8} />} value={child.lessonsCompleted} label="lessons" />
          <Stat icon={<Clock size={15} strokeWidth={1.8} />} value={child.weeklyMinutes} label="min/wk" />
        </div>
      </div>

      {/* 1. Progress overview */}
      <Card title="Growth this week" icon={<TrendingUp size={15} strokeWidth={1.8} />}>
        <Bar label="Day streak" value={child.streakDays} max={7} suffix={`${child.streakDays}/7`} />
        <Bar label="Weekly practice" value={child.weeklyMinutes} max={60} suffix={`${child.weeklyMinutes} min`} />
        <Bar label="Lessons completed" value={child.lessonsCompleted} max={6} suffix={`${child.lessonsCompleted}/6`} />
      </Card>

      {/* 2. Words learned */}
      <Card title="Words they've learned" icon={<Archive size={15} strokeWidth={1.8} />}>
        <div className="flex flex-wrap gap-2">
          {learnedWords.map((w) => (
            <span key={w.id} className="deboss-sm rounded-full px-3 py-1.5 text-xs text-text-primary">
              {w.word}
            </span>
          ))}
          <span className="emboss-sm rounded-full px-3 py-1.5 text-xs text-accent font-semibold">
            +{Math.max(0, child.wordsCollected - learnedWords.length)} more
          </span>
        </div>
      </Card>

      {/* 3. Weak words */}
      <Card title="Words to revisit together" icon={<Sparkles size={15} strokeWidth={1.8} />}>
        <div className="flex flex-wrap gap-2 mb-3">
          {weakWords.map((w) => (
            <span key={w.id} className="deboss-sm rounded-full px-3 py-1.5 text-xs text-text-primary">
              {w.word} <span className="text-text-secondary">· {w.translation}</span>
            </span>
          ))}
        </div>
        <AppButton variant="secondary" fullWidth onClick={() => send("review_weak_words")}>
          Encourage them to review
        </AppButton>
      </Card>

      {/* 4. Recent activity */}
      <Card title="Recent activity" icon={<BookOpen size={15} strokeWidth={1.8} />}>
        <div className="space-y-2">
          {child.recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <p className="text-sm text-text-secondary">{a}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Recommended next */}
      {nextLesson && (
        <Card title="Recommended next moment" icon={<Sparkles size={15} strokeWidth={1.8} />}>
          <Link
            href={`/lesson/${nextLesson.id}`}
            className="emboss-interactive rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3"
          >
            <div>
              <p className="font-semibold text-text-primary text-sm">{nextLesson.title}</p>
              <p className="text-xs text-text-secondary mt-0.5">{nextLesson.subtitle}</p>
            </div>
            <ChevronRight size={18} strokeWidth={1.8} className="text-text-secondary shrink-0" />
          </Link>
        </Card>
      )}

      {/* 6. Send a challenge */}
      <Card title="Send an encouragement" icon={<Send size={15} strokeWidth={1.8} />}>
        {justSent && (
          <div className="deboss rounded-2xl px-4 py-3 mb-3 flex items-center gap-2 text-green">
            <Check size={16} strokeWidth={2.2} />
            <span className="text-sm font-medium">Challenge sent to {child.name}.</span>
          </div>
        )}
        <AppButton fullWidth onClick={() => setSheetOpen(true)}>Send a challenge</AppButton>

        {sentChallenges.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary mb-2">Sent history</p>
            <div className="space-y-1.5">
              {sentChallenges.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-text-secondary">{CHALLENGE_LABEL[c.type] ?? c.type}</span>
                  <span className="text-[11px] text-green inline-flex items-center gap-1 shrink-0">
                    <Check size={12} strokeWidth={2.2} /> sent · {c.atLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="h-2" />

      {/* Challenge sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSheetOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-[430px] mx-auto emboss rounded-t-[2rem] p-6 pb-10">
            <h2 className="font-display text-lg font-bold text-text-primary mb-1">Send {child.name} a challenge</h2>
            <p className="text-sm text-text-secondary mb-5">A gentle nudge to keep the streak alive.</p>
            <div className="space-y-2.5">
              {CHALLENGES.map((c) => (
                <button
                  key={c.type}
                  onClick={() => send(c.type)}
                  className="emboss-interactive w-full text-left rounded-2xl px-4 py-3.5 text-sm font-medium text-text-primary flex items-center justify-between"
                >
                  {c.label}
                  <Send size={15} strokeWidth={1.8} className="text-accent shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="deboss-sm rounded-2xl py-2.5 text-center">
      <div className="flex justify-center text-accent mb-1">{icon}</div>
      <div className="font-bold text-text-primary text-base leading-none">{value}</div>
      <div className="text-text-secondary text-[10px] mt-1">{label}</div>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="emboss rounded-[1.5rem] p-5 mb-4">
      <div className="flex items-center gap-2 mb-3 text-accent">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-widest">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Bar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-xs text-text-primary font-medium">{suffix}</span>
      </div>
      <ProgressBar value={(value / max) * 100} />
    </div>
  );
}
