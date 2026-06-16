"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  LearnerType,
  LearningReason,
  PassiveSpeakerLevel,
  ChildProfile,
  WaitlistEntry,
  ChallengeType,
} from "@/core/types";
import { getLesson, getDemoChildProfile, getDemoParentName } from "@/core/data/index";

interface RootsStore {
  // ── Onboarding / session ───────────────────────────────────────────────────
  hasOnboarded: boolean;
  learnerType: LearnerType | null;
  learningReason: LearningReason | null;
  passiveSpeakerLevel: PassiveSpeakerLevel | null;
  selectedLanguageId: string;
  parentMode: boolean;
  parentName?: string;
  childProfile?: ChildProfile;

  // ── Progress ───────────────────────────────────────────────────────────────
  streakDays: number;
  xp: number;
  collectedWordIds: string[];
  collectedPatternIds: string[];
  completedLessonIds: string[];
  completedScenarioIds: string[];
  completedStoryIds: string[];
  completedTextingIds: string[];
  unlockedProverbIds: string[];
  weakWordIds: string[];
  lastActivityLabel: string;

  // ── Internal ───────────────────────────────────────────────────────────────
  lastStreakDate: string;

  // ── Mock features ──────────────────────────────────────────────────────────
  waitlist: WaitlistEntry[];
  sentChallenges: { type: ChallengeType; toChildName: string; atLabel: string }[];

  // ── Actions ────────────────────────────────────────────────────────────────
  setOnboardingAnswers(answers: {
    learnerType?: LearnerType;
    learningReason?: LearningReason;
    passiveSpeakerLevel?: PassiveSpeakerLevel;
  }): void;
  completeOnboarding(): void;
  startLearnerDemo(): void;
  startParentDemo(): void;
  completeLesson(lessonId: string, wordIds: string[], patternIds?: string[]): void;
  completeScenario(id: string, reinforcedWordIds: string[]): void;
  completeStory(id: string, wordIds: string[], proverbId?: string): void;
  completeTexting(id: string): void;
  markWeakWord(wordId: string): void;
  clearWeakWord(wordId: string): void;
  joinWaitlist(entry: Omit<WaitlistEntry, "id" | "createdAtLabel">): void;
  sendChallenge(type: ChallengeType): void;
  resetDemo(): void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const union = (existing: string[], incoming: string[]): string[] =>
  Array.from(new Set([...existing, ...incoming]));

const initialState = {
  hasOnboarded: false,
  learnerType: null as LearnerType | null,
  learningReason: null as LearningReason | null,
  passiveSpeakerLevel: null as PassiveSpeakerLevel | null,
  selectedLanguageId: "kinyarwanda",
  parentMode: false,
  parentName: undefined as string | undefined,
  childProfile: undefined as ChildProfile | undefined,
  streakDays: 0,
  xp: 0,
  collectedWordIds: [] as string[],
  collectedPatternIds: [] as string[],
  completedLessonIds: [] as string[],
  completedScenarioIds: [] as string[],
  completedStoryIds: [] as string[],
  completedTextingIds: [] as string[],
  unlockedProverbIds: [] as string[],
  weakWordIds: [] as string[],
  lastActivityLabel: "",
  lastStreakDate: "",
  waitlist: [] as WaitlistEntry[],
  sentChallenges: [] as { type: ChallengeType; toChildName: string; atLabel: string }[],
};

export const useRootsStore = create<RootsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setOnboardingAnswers(answers) {
        set((s) => ({ ...s, ...answers }));
      },

      completeOnboarding() {
        set({ hasOnboarded: true });
      },

      startLearnerDemo() {
        set({
          ...initialState,
          hasOnboarded: true,
          learnerType: "adult",
          learningReason: "family",
          passiveSpeakerLevel: "understand_cant_reply",
          selectedLanguageId: "kinyarwanda",
          streakDays: 3,
          xp: 50,
          collectedWordIds: [
            "kin-muraho", "kin-amakuru", "kin-ni-meza", "kin-ndumva",
            "kin-murakoze", "kin-ndi", "kin-mu-rugo", "kin-ndaza",
            "kin-vuba", "kin-ndashaka", "kin-yego", "kin-oya",
          ],
          collectedPatternIds: [],
          completedLessonIds: ["lesson-0-welcome", "lesson-1-grandma"],
          weakWordIds: ["kin-buhoro", "kin-ndaza", "kin-murakoze"],
          lastActivityLabel: 'Completed "Grandma is Calling"',
          lastStreakDate: todayISO(),
        });
      },

      startParentDemo() {
        set({
          ...initialState,
          hasOnboarded: true,
          learnerType: "parent",
          selectedLanguageId: "kinyarwanda",
          parentMode: true,
          parentName: getDemoParentName(),
          childProfile: getDemoChildProfile(),
          lastActivityLabel: "Switched to Parent Demo",
        });
      },

      completeLesson(lessonId, wordIds, patternIds = []) {
        const state = get();
        if (state.completedLessonIds.includes(lessonId)) return;

        const lesson = getLesson(lessonId);
        const exerciseCount = lesson?.exercises.length ?? 3;
        const xpGain = exerciseCount * 10;

        const today = todayISO();
        const isNewDay = state.lastStreakDate !== today;

        set({
          completedLessonIds: [...state.completedLessonIds, lessonId],
          collectedWordIds: union(state.collectedWordIds, wordIds),
          collectedPatternIds: union(state.collectedPatternIds, patternIds),
          xp: state.xp + xpGain,
          streakDays: isNewDay ? state.streakDays + 1 : state.streakDays,
          lastStreakDate: today,
          lastActivityLabel: `Completed "${lesson?.title ?? lessonId}"`,
        });
      },

      completeScenario(id, reinforcedWordIds) {
        const state = get();
        if (state.completedScenarioIds.includes(id)) return;
        set({
          completedScenarioIds: [...state.completedScenarioIds, id],
          collectedWordIds: union(state.collectedWordIds, reinforcedWordIds),
          xp: state.xp + 20,
          lastActivityLabel: "Completed phone call practice",
        });
      },

      completeStory(id, wordIds, proverbId) {
        const state = get();
        if (state.completedStoryIds.includes(id)) return;
        set({
          completedStoryIds: [...state.completedStoryIds, id],
          collectedWordIds: union(state.collectedWordIds, wordIds),
          unlockedProverbIds: proverbId
            ? union(state.unlockedProverbIds, [proverbId])
            : state.unlockedProverbIds,
          xp: state.xp + 15,
          lastActivityLabel: "Completed a story",
        });
      },

      completeTexting(id) {
        const state = get();
        if (state.completedTextingIds.includes(id)) return;
        set({
          completedTextingIds: [...state.completedTextingIds, id],
          xp: state.xp + 10,
          lastActivityLabel: "Completed texting lesson",
        });
      },

      markWeakWord(wordId) {
        const state = get();
        if (state.weakWordIds.includes(wordId)) return;
        set({ weakWordIds: [...state.weakWordIds, wordId] });
      },

      clearWeakWord(wordId) {
        set((s) => ({
          weakWordIds: s.weakWordIds.filter((id) => id !== wordId),
          xp: s.xp + 5,
        }));
      },

      joinWaitlist(entry) {
        const state = get();
        const newEntry: WaitlistEntry = {
          ...entry,
          id: `waitlist-${Date.now()}`,
          createdAtLabel: new Date().toLocaleDateString("en-AU", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        };
        set({ waitlist: [...state.waitlist, newEntry] });
      },

      sendChallenge(type) {
        const state = get();
        const childName = state.childProfile?.name ?? "your child";
        const atLabel = new Date().toLocaleDateString("en-AU", {
          month: "short",
          day: "numeric",
        });
        set({
          sentChallenges: [
            ...state.sentChallenges,
            { type, toChildName: childName, atLabel },
          ],
        });
      },

      resetDemo() {
        set({ ...initialState });
      },
    }),
    {
      name: "roots-demo-v1",
    },
  ),
);
