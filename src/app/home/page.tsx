"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Zap, BookOpen, Phone, ChevronRight, Lock, Star, Archive, Flame } from "lucide-react";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import { getLessons, getCallCharacters, getScenarios } from "@/core/data/index";
import type { Character } from "@/core/types";
import CharacterPortrait from "@/components/characters/CharacterPortrait";
import Screen from "@/components/ui/Screen";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "Tonight";
}

const allLessons = getLessons();
const flashLessons = allLessons.filter((l) => l.learningFocus === "flashcard_drill");
const parableLessons = allLessons.filter((l) => l.learningFocus === "interactive_parable");
const callCharacters = getCallCharacters()
  .filter((c) => c.mode === "call")
  .sort((a, b) => a.level - b.level);
const callScenarios = getScenarios().filter((s) => s.scenarioType === "phone_call" && s.characterId);

export default function HomePage() {
  const router = useRouter();
  const hydrated = useHasHydrated();

  const streakDays        = useRootsStore((s) => s.streakDays);
  const xp                = useRootsStore((s) => s.xp);
  const collectedWordIds  = useRootsStore((s) => s.collectedWordIds);
  const completedLessonIds   = useRootsStore((s) => s.completedLessonIds);
  const completedScenarioIds = useRootsStore((s) => s.completedScenarioIds);
  const childProfile      = useRootsStore((s) => s.childProfile);

  const wordCount = collectedWordIds.length;

  const nextFlash = useMemo(
    () => flashLessons.find((l) => !completedLessonIds.includes(l.id)),
    [completedLessonIds],
  );
  const nextParable = useMemo(
    () => parableLessons.find((l) => !completedLessonIds.includes(l.id)),
    [completedLessonIds],
  );
  const activeCallCharacter = useMemo((): Character | null => {
    for (const char of callCharacters) {
      if (!char.callId) continue;
      const scenario = callScenarios.find((s) => s.id === char.callId);
      if (!scenario) continue;
      if (!completedScenarioIds.includes(scenario.id)) return char;
    }
    return null;
  }, [completedScenarioIds]);

  const nextSession = useMemo(
    () => allLessons.find((l) => !completedLessonIds.includes(l.id)),
    [completedLessonIds],
  );

  const greeting = getGreeting();

  if (!hydrated) {
    return (
      <Screen>
        <div className="h-[60vh] flex items-center justify-center">
          <div className="deboss w-20 h-3 rounded-full opacity-50" />
        </div>
      </Screen>
    );
  }

  function handleContinue() {
    if (nextFlash)                       router.push(`/lesson/${nextFlash.id}`);
    else if (nextParable)                router.push(`/lesson/${nextParable.id}`);
    else if (activeCallCharacter?.callId) router.push(`/call/${activeCallCharacter.callId}`);
    else if (nextSession)                router.push(`/lesson/${nextSession.id}`);
  }

  return (
    <Screen>
      {/* Greeting */}
      <div className="mb-5 pt-2">
        <h1 className="font-display text-2xl font-bold text-text-primary leading-tight">
          {greeting}{childProfile ? `, ${childProfile.name}` : ""}
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">Your words are waiting.</p>
      </div>

      {/* Stats pills */}
      <div className="flex gap-3 mb-6">
        {[
          { icon: <Flame size={16} strokeWidth={1.8} />, value: String(streakDays), label: "Streak" },
          { icon: <Archive size={16} strokeWidth={1.8} />, value: String(wordCount),  label: "Words"  },
          { icon: <Star   size={16} strokeWidth={1.8} />, value: String(xp),          label: "XP"     },
        ].map(({ icon, value, label }) => (
          <div key={label} className="emboss flex-1 rounded-3xl p-3 text-center">
            <div className="flex justify-center mb-1.5 text-accent">{icon}</div>
            <div className="font-bold text-text-primary text-base leading-none">{value}</div>
            <div className="text-text-secondary text-[10px] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* ── TODAY'S QUEST — combined quest, amber glow ── */}
      <TodaysQuest
        nextFlash={nextFlash ?? null}
        nextParable={nextParable ?? null}
        activeCallChar={activeCallCharacter}
        onContinue={handleContinue}
      />

      {/* ── Mode cards ── */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary mb-3">
        Choose your mode
      </p>
      <div className="space-y-3">

        {/* Flash Mode */}
        <ModeCard
          label="Flash Mode"
          icon={<Zap size={14} strokeWidth={2} className="text-accent" />}
          iconBg="rgba(220,170,60,0.18)"
          title={nextFlash?.title ?? "All complete"}
          sub="Quick-fire cards & sentence blocks"
          progressCurrent={completedLessonIds.filter(id => flashLessons.some(l => l.id === id)).length}
          progressTotal={flashLessons.length}
          accentColor="var(--accent)"
          onClick={() => router.push(nextFlash ? `/lesson/${nextFlash.id}` : `/lesson/${flashLessons[0]?.id ?? ""}`)}
        />

        {/* Parable Mode */}
        <ModeCard
          label="Parable Mode"
          icon={<BookOpen size={14} strokeWidth={2} style={{ color: "#7A5C3A" }} />}
          iconBg="rgba(139,108,56,0.20)"
          title={nextParable?.title ?? "All parables heard"}
          sub={`The Elder Speaks · Chapter ${completedLessonIds.filter(id => parableLessons.some(l => l.id === id)).length + 1}`}
          progressCurrent={completedLessonIds.filter(id => parableLessons.some(l => l.id === id)).length}
          progressTotal={parableLessons.length}
          accentColor="#7A5C3A"
          onClick={() => router.push(nextParable ? `/lesson/${nextParable.id}` : `/lesson/${parableLessons[0]?.id ?? ""}`)}
        />

        {/* Phone Call Mode */}
        <CallModeCard
          characters={callCharacters}
          completedScenarioIds={completedScenarioIds}
          activeChar={activeCallCharacter}
          onNavigate={router.push}
        />

      </div>
    </Screen>
  );
}

// ── Today's Quest ─────────────────────────────────────────────────────────────

function TodaysQuest({
  nextFlash, nextParable, activeCallChar, onContinue,
}: {
  nextFlash: ReturnType<typeof getLessons>[number] | null;
  nextParable: ReturnType<typeof getLessons>[number] | null;
  activeCallChar: Character | null;
  onContinue: () => void;
}) {
  const hasAnything = nextFlash || nextParable || activeCallChar;
  if (!hasAnything) return null;

  // Build a dynamic subtitle listing what's queued
  const queued = [
    nextFlash   && "flash cards",
    nextParable && "a parable",
    activeCallChar && `${activeCallChar.name}'s call`,
  ].filter(Boolean) as string[];

  const queuedText = queued.length === 1
    ? queued[0]
    : queued.slice(0, -1).join(", ") + " & " + queued[queued.length - 1];

  return (
    <div
      className="relative rounded-[1.75rem] overflow-hidden p-6 mb-7"
      style={{
        background: "var(--surface)",
        boxShadow:
          "6px 6px 14px var(--shadow-dark), -6px -6px 14px var(--shadow-light)," +
          "inset 0 0 16px 0 rgba(235,150,80,0.50)," +
          "inset 0 0 40px 8px rgba(180,72,20,0.28)",
      }}
    >
      <div className="moment-ring" aria-hidden="true" />
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Label */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
          Today&apos;s Quest
        </p>

        {/* Mode icon row */}
        <div className="flex items-center gap-2 mb-3">
          {nextFlash && (
            <span className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(220,170,60,0.18)" }}>
              <Zap size={13} strokeWidth={2} className="text-accent" />
            </span>
          )}
          {nextParable && (
            <span className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(139,108,56,0.18)" }}>
              <BookOpen size={13} strokeWidth={2} style={{ color: "#7A5C3A" }} />
            </span>
          )}
          {activeCallChar && (
            <span className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: activeCallChar.washRgba.replace(/[\d.]+\)$/, "0.22)") }}>
              <Phone size={13} strokeWidth={2} style={{ color: activeCallChar.themeHex }} />
            </span>
          )}
        </div>

        <h2 className="font-display text-xl font-bold text-text-primary mb-1.5 leading-tight">
          Your daily mix
        </h2>
        <p className="text-sm leading-relaxed text-text-secondary mb-5 capitalize">
          {queuedText} — all in one session.
        </p>

        <button
          onClick={onContinue}
          className="relative overflow-hidden rounded-full px-5 py-2.5 text-xs font-bold tracking-wide uppercase text-accent-dark transition-transform duration-150 active:scale-[0.97]"
          style={{
            background: "var(--surface)",
            boxShadow:
              "4px 4px 10px var(--shadow-dark), -4px -4px 10px var(--shadow-light)," +
              "inset 0 0 10px 0 rgba(235,150,80,0.42)," +
              "inset 0 0 22px 4px rgba(180,72,20,0.22)",
          }}
        >
          <span className="pulse-ring" aria-hidden="true" />
          <span className="relative" style={{ zIndex: 1 }}>Begin</span>
        </button>
      </div>
    </div>
  );
}

// ── Generic mode card (shared style = deboss, same as Flash) ──────────────────

function ModeCard({
  label, icon, iconBg, title, sub, progressCurrent, progressTotal, accentColor, onClick,
}: {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  progressCurrent: number;
  progressTotal: number;
  accentColor: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="deboss w-full rounded-[1.75rem] p-5 text-left active:opacity-80 transition-opacity"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconBg }}>
              {icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
              {label}
            </span>
          </div>
          <p className="font-bold text-text-primary text-sm leading-tight mb-0.5">{title}</p>
          <p className="text-xs text-text-secondary mb-3">{sub}</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--shadow-dark)" }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  background: accentColor,
                  width: `${Math.min(100, (progressCurrent / Math.max(1, progressTotal)) * 100)}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-text-secondary shrink-0">
              {progressCurrent}/{progressTotal}
            </span>
          </div>
        </div>
        <ChevronRight size={18} strokeWidth={1.8} className="text-text-secondary shrink-0 mt-1" />
      </div>
    </button>
  );
}

// ── Phone Call Mode card ──────────────────────────────────────────────────────

function CallModeCard({
  characters, completedScenarioIds, activeChar, onNavigate,
}: {
  characters: Character[];
  completedScenarioIds: string[];
  activeChar: Character | null;
  onNavigate: (path: string) => void;
}) {
  const themeHex  = activeChar?.themeHex  ?? "#94774B";
  const washRgba  = activeChar?.washRgba  ?? "rgba(148,119,75,0.11)";

  return (
    <button
      onClick={() => { if (activeChar?.callId) onNavigate(`/call/${activeChar.callId}`); }}
      className="deboss w-full rounded-[1.75rem] p-5 text-left active:opacity-80 transition-opacity"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: washRgba.replace(/[\d.]+\)$/, "0.22)") }}>
              <Phone size={14} strokeWidth={2} style={{ color: themeHex }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: themeHex }}>
              Phone Call Mode
            </span>
          </div>
          <p className="font-bold text-text-primary text-sm leading-tight mb-0.5">
            {activeChar ? `${activeChar.name} is waiting…` : "All calls answered"}
          </p>
          {activeChar && (
            <p className="text-xs text-text-secondary mb-3">
              {activeChar.level === 0 ? "Intro" : `Level ${activeChar.level}`} · {activeChar.nameLabel}
            </p>
          )}
          {/* Level progression dots */}
          <div className="flex items-center gap-2 mt-2">
            {characters.map((char) => {
              const scenario = callScenarios.find((s) => s.characterId === char.id);
              const done    = scenario ? completedScenarioIds.includes(scenario.id) : false;
              const isActive = char.id === activeChar?.id;
              const locked  = !done && !isActive;
              return (
                <div key={char.id} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      background: done ? char.themeHex : isActive
                        ? char.washRgba.replace(/[\d.]+\)$/, "0.28)")
                        : "var(--shadow-dark)",
                      border: isActive ? `2px solid ${char.themeHex}` : "none",
                      opacity: locked ? 0.40 : 1,
                    }}
                  >
                    {done ? (
                      <span className="text-[10px] font-bold text-white">✓</span>
                    ) : locked ? (
                      <Lock size={10} strokeWidth={2.5} style={{ color: "var(--text-secondary)" }} />
                    ) : (
                      <div style={{ transform: "scale(0.42) translateY(4px)", transformOrigin: "bottom center" }}>
                        <CharacterPortrait characterId={char.id} size={80} />
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] text-text-secondary leading-none">{char.nameLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Active character preview */}
        {activeChar && (
          <div
            className="shrink-0 w-16 h-16 rounded-2xl overflow-hidden flex items-end justify-center"
            style={{
              background: washRgba.replace("0.11","0.22").replace("0.08","0.18"),
              border: `1px solid ${washRgba.replace("0.11","0.32").replace("0.08","0.26")}`,
            }}
          >
            <CharacterPortrait characterId={activeChar.id} size={64} />
          </div>
        )}
      </div>
    </button>
  );
}
