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
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Archive,
  Star,
  Phone,
  BookOpen,
  Layers,
  MessageSquare,
  Users,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import { getLessons } from "@/core/data/index";
import { passiveSpeakerReflections } from "@/core/copy";
import Screen from "@/components/ui/Screen";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "Tonight";
}

const allLessons = getLessons();

export default function HomePage() {
  const router = useRouter();
  const hydrated = useHasHydrated();

  const streakDays = useRootsStore((s) => s.streakDays);
  const xp = useRootsStore((s) => s.xp);
  const collectedWordIds = useRootsStore((s) => s.collectedWordIds);
  const weakWordIds = useRootsStore((s) => s.weakWordIds);
  const completedLessonIds = useRootsStore((s) => s.completedLessonIds);
  const passiveSpeakerLevel = useRootsStore((s) => s.passiveSpeakerLevel);
  const parentMode = useRootsStore((s) => s.parentMode);
  const childProfile = useRootsStore((s) => s.childProfile);

  const nextLesson = useMemo(
    () => allLessons.find((l) => !completedLessonIds.includes(l.id)),
    [completedLessonIds],
  );

  const reflection = passiveSpeakerLevel
    ? passiveSpeakerReflections[passiveSpeakerLevel]
    : null;

  const greeting = getGreeting();
  const wordCount = collectedWordIds.length;
  const weakCount = weakWordIds.length;

  const stats = [
    { icon: <Flame size={17} strokeWidth={1.8} />, value: String(streakDays), label: "Streak" },
    { icon: <Archive size={17} strokeWidth={1.8} />, value: String(wordCount), label: "Words" },
    { icon: <Star size={17} strokeWidth={1.8} />, value: String(xp), label: "XP" },
  ];

  if (!hydrated) {
    return (
      <Screen>
        <div className="h-[60vh] flex items-center justify-center">
          <div className="deboss w-20 h-3 rounded-full opacity-50" />
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Greeting + reflection */}
      <div className="mb-6 pt-2">
        <h1 className="font-display text-2xl font-bold text-text-primary leading-tight">
          {greeting}
          {childProfile ? `, ${childProfile.name}` : ""}
        </h1>
        {reflection && (
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">{reflection}</p>
        )}
      </div>

      {/* Stat pills */}
      <div className="flex gap-3 mb-7">
        {stats.map(({ icon, value, label }) => (
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
      {/* Today's Moment hero */}
      <div
        className="emboss relative mb-5 rounded-[1.75rem] overflow-hidden p-6"
        style={{
          boxShadow:
            "6px 6px 14px var(--shadow-dark), -6px -6px 14px var(--shadow-light)," +
            "inset 0 0 16px 0 rgba(235,150,80,0.50)," +
            "inset 0 0 40px 8px rgba(180,72,20,0.28)",
        }}
      >
        {/* Animated highlight that follows the ring around the edge */}
        <div className="moment-ring" aria-hidden="true" />

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
            onClick={() => router.push("/call/grandma-call")}
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
            <span className="relative" style={{ zIndex: 1 }}>Answer the call</span>
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
      {/* 7 action cards */}
      <div className="space-y-2.5">

        {/* 1. Continue lesson */}
        {nextLesson ? (
          <ActionRow
            label="Continue"
            title={nextLesson.title}
            onClick={() => router.push(`/lesson/${nextLesson.id}`)}
          />
        ) : (
          <ActionRow
            label="All lessons done"
            title="Start from the beginning"
            onClick={() => router.push(`/lesson/${allLessons[0]?.id ?? ""}`)}
          />
        )}

        {/* 2. Grandma is Calling */}
        <ActionRow
          icon={<Phone size={17} strokeWidth={1.8} className="text-accent" />}
          label="Phone call"
          title="Grandma is Calling"
          onClick={() => router.push("/call/grandma-call")}
        />

        {/* 3. Story Time */}
        <ActionRow
          icon={<BookOpen size={17} strokeWidth={1.8} className="text-accent" />}
          label="Story"
          title="Story Time"
          onClick={() => router.push("/story/story-grandma-word")}
        />

        {/* 4. Roots Bank */}
        <ActionRow
          icon={<Archive size={17} strokeWidth={1.8} className="text-accent" />}
          label="Roots Bank"
          title={`${wordCount} word${wordCount !== 1 ? "s" : ""} collected`}
          onClick={() => router.push("/inventory")}
        />

        {/* 5. Review Weak Words */}
        {weakCount > 0 && (
          <ActionRow
            icon={<AlertCircle size={17} strokeWidth={1.8} className="text-accent" />}
            label="Review"
            title={`${weakCount} weak word${weakCount !== 1 ? "s" : ""} to practise`}
            onClick={() => router.push("/review")}
          />
        )}

        {/* 6. Save Me Phrases */}
        <ActionRow
          icon={<MessageSquare size={17} strokeWidth={1.8} className="text-accent" />}
          label="Save me phrases"
          title="Texting practice"
          onClick={() => router.push("/texting/texting-cousin-talk")}
        />

        {/* 7. Pattern Lab */}
        <ActionRow
          icon={<Layers size={17} strokeWidth={1.8} className="text-accent" />}
          label="Pattern Lab"
          title="See how the language works"
          onClick={() => router.push("/pattern-lab")}
        />

        {/* Conditional: Parent Dashboard */}
        {parentMode && (
          <ActionRow
            icon={<Users size={17} strokeWidth={1.8} className="text-accent" />}
            label="Parent"
            title="Parent Dashboard"
            onClick={() => router.push("/parent")}
          />
        )}
      </div>
    </Screen>
  );
}

function ActionRow({
  icon,
  label,
  title,
  onClick,
}: {
  icon?: React.ReactNode;
  label: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="deboss w-full rounded-3xl p-5 text-left flex items-center justify-between gap-3 active:opacity-80 transition-opacity"
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-0.5">
            {label}
          </p>
          <p className="font-semibold text-text-primary text-sm truncate">{title}</p>
        </div>
      </div>
      <ChevronRight size={18} strokeWidth={1.8} className="text-text-secondary shrink-0" />
    </button>
  );
}
