// Single data-access boundary. Screens must import from here only.
// Swapping to Supabase later = reimplementing this module only.

import type { Language, Word, WordCategory, Lesson, Pattern, SentenceFrame, Scenario, Story, TextingLesson, Proverb, ChildProfile, Character } from "../types";
import { languages } from "./languages";
import { kinyarwandaWords } from "./kinyarwanda/words";
import { kinyarwandaLessons, kinyarwandaSentenceFrames } from "./kinyarwanda/lessons";
import { kinyarwandaPatterns } from "./kinyarwanda/patterns";
import { kinyarwandaScenarios } from "./kinyarwanda/scenarios";
import { kinyarwandaStories } from "./kinyarwanda/stories";
import { kinyarwandaTextingLessons } from "./kinyarwanda/texting";
import { kinyarwandaProverbs } from "./kinyarwanda/proverbs";
import { kinyarwandaCharacters } from "./kinyarwanda/characters";
import { demoChildProfile, demoParentName } from "./demoUsers";

// ── Language ──────────────────────────────────────────────────────────────────

export function getLanguages(): Language[] {
  return languages;
}

export function getLanguage(id: string): Language | undefined {
  return languages.find((l) => l.id === id);
}

// ── Words ─────────────────────────────────────────────────────────────────────

const allWords: Word[] = [...kinyarwandaWords];

export function getWords(languageId?: string): Word[] {
  return languageId ? allWords.filter((w) => w.languageId === languageId) : allWords;
}

export function getWordsByIds(ids: string[]): Word[] {
  return ids.map((id) => allWords.find((w) => w.id === id)).filter(Boolean) as Word[];
}

export function getWord(id: string): Word | undefined {
  return allWords.find((w) => w.id === id);
}

export function getWordsByCategory(category: WordCategory, languageId?: string): Word[] {
  return allWords.filter(
    (w) => w.category === category && (!languageId || w.languageId === languageId),
  );
}

// ── Sentence frames ───────────────────────────────────────────────────────────

const allSentenceFrames: SentenceFrame[] = [...kinyarwandaSentenceFrames];

export function getSentenceFrame(id: string): SentenceFrame | undefined {
  return allSentenceFrames.find((f) => f.id === id);
}

export function getAllSentenceFrames(languageId?: string): SentenceFrame[] {
  return languageId
    ? allSentenceFrames.filter((f) => f.languageId === languageId)
    : allSentenceFrames;
}

// ── Lessons ───────────────────────────────────────────────────────────────────

const allLessons: Lesson[] = [...kinyarwandaLessons];

export function getLessons(languageId?: string): Lesson[] {
  return languageId ? allLessons.filter((l) => l.languageId === languageId) : allLessons;
}

export function getLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

// ── Patterns ──────────────────────────────────────────────────────────────────

const allPatterns: Pattern[] = [...kinyarwandaPatterns];

export function getPatterns(languageId?: string): Pattern[] {
  return languageId ? allPatterns.filter((p) => p.languageId === languageId) : allPatterns;
}

export function getPattern(id: string): Pattern | undefined {
  return allPatterns.find((p) => p.id === id);
}

// ── Scenarios ─────────────────────────────────────────────────────────────────

const allScenarios: Scenario[] = [...kinyarwandaScenarios];

export function getScenario(id: string): Scenario | undefined {
  return allScenarios.find((s) => s.id === id);
}

export function getScenarios(languageId?: string): Scenario[] {
  return languageId ? allScenarios.filter((s) => s.languageId === languageId) : allScenarios;
}

// ── Stories ───────────────────────────────────────────────────────────────────

const allStories: Story[] = [...kinyarwandaStories];

export function getStory(id: string): Story | undefined {
  return allStories.find((s) => s.id === id);
}

export function getStories(languageId?: string): Story[] {
  return languageId ? allStories.filter((s) => s.languageId === languageId) : allStories;
}

// ── Texting lessons ───────────────────────────────────────────────────────────

const allTextingLessons: TextingLesson[] = [...kinyarwandaTextingLessons];

export function getTextingLesson(id: string): TextingLesson | undefined {
  return allTextingLessons.find((t) => t.id === id);
}

export function getTextingLessons(languageId?: string): TextingLesson[] {
  return languageId
    ? allTextingLessons.filter((t) => t.languageId === languageId)
    : allTextingLessons;
}

// ── Proverbs ──────────────────────────────────────────────────────────────────

const allProverbs: Proverb[] = [...kinyarwandaProverbs];

export function getProverb(id: string): Proverb | undefined {
  return allProverbs.find((p) => p.id === id);
}

export function getProverbs(languageId?: string): Proverb[] {
  return languageId ? allProverbs.filter((p) => p.languageId === languageId) : allProverbs;
}

// ── Characters ────────────────────────────────────────────────────────────────

const allCharacters: Character[] = [...kinyarwandaCharacters];

export function getCharacter(id: string): Character | undefined {
  return allCharacters.find((c) => c.id === id);
}

export function getCharacters(mode?: "call" | "parable"): Character[] {
  return mode ? allCharacters.filter((c) => c.mode === mode) : allCharacters;
}

export function getCallCharacters(): Character[] {
  return allCharacters.filter((c) => c.mode === "call").sort((a, b) => a.level - b.level);
}

// ── Demo users ────────────────────────────────────────────────────────────────

export function getDemoChildProfile(): ChildProfile {
  return demoChildProfile;
}

export function getDemoParentName(): string {
  return demoParentName;
}
