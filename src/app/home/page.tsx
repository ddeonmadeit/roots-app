"use client";

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
            <span className="relative" style={{ zIndex: 1 }}>Answer the call</span>
          </button>
        </div>
      </div>

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

        {/* 2b. Mama is Calling */}
        <ActionRow
          icon={<Phone size={17} strokeWidth={1.8} className="text-accent" />}
          label="Phone call"
          title="Mama is Calling"
          onClick={() => router.push("/call/mama-call")}
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

        {/* 8. Top Words flashcard drill */}
        <ActionRow
          icon={<Archive size={17} strokeWidth={1.8} className="text-accent" />}
          label="Flash cards"
          title="Top Words — quick drill"
          onClick={() => router.push("/lesson/lesson-4-top-words")}
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
