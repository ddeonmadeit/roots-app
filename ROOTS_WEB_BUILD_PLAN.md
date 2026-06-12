# ROOTS_WEB_BUILD_PLAN.md

# Roots — Kinyarwanda-First Web MVP — Claude Code Build Specification

---

## 0. Instructions to Claude Code (read this first)

You are building a **real, working, clickable web app**, not giving advice or producing a plan.

This document **adapts and supersedes the platform/stack sections** of the original `ROOTS_SPEC_KINYARWANDA_FIRST.md`. The product vision, features, content, tone, and behavior of the original spec all still apply — but the platform is now **web-first**:

- Where the original spec says **Expo / React Native / Expo Go / Expo Router** → build the **Next.js web equivalent** described in this document.
- Where the original spec says **AsyncStorage** → use **localStorage via Zustand persist**.
- Where the original spec says **haptic feedback** → use **subtle micro-animations / visual feedback** instead.
- The original spec's instruction "Do not build a plain HTML/CSS/JS app" meant "do not build a static page instead of the mobile app." For this web build, the correct interpretation is: **do not build a static brochure site — build a fully interactive React application** with the structure below.

The final result must be a runnable Next.js app that starts with:

```bash
npm install
npm run dev
```

and works at `http://localhost:3000`, fully clickable end-to-end on both desktop and a phone browser.

Hard rules:

- Do **not** stop at wireframes.
- Do **not** only describe architecture.
- Do **not** scaffold empty pages and call it done.
- Actually create every route, component, engine, mock data file, and interactive flow described below.
- Work **phase by phase** (Section 16). At the end of every phase the app must compile, run, and be clickable.
- If something in this document conflicts with the original spec, **this document wins**.

The MVP should be polished enough to deploy to Vercel and send to friends/family for feedback on their phones.

---

## 1. Product Summary

**Roots** is a heritage-language learning app for diaspora families and people reconnecting with their cultural roots. The MVP is **Kinyarwanda-first**, with six more languages shown as a "coming soon" roadmap.

It is **not** a generic Duolingo clone. It teaches:

- **Frequency-first learning** — the highest-use words in real family conversation come first
- **Practical sentence frames** built from those words ("I want ___", "I am at ___", "I am coming ___")
- **Pattern noticing** — prefixes, suffixes, stems, speaker/listener markers, singular/plural patterns (critical for Bantu languages like Kinyarwanda)
- **Real family moments** — lessons are "Moments," not "Unit 1: Greetings"
- **Phone-call practice** — a fake incoming call from Grandma/Auntie that the user must survive
- **Interactive stories and proverbs**
- **Natural speech / texting / slang** vs. elder-safe speech
- **Roots Bank** — a collectible inventory of words AND patterns
- **Parent mode** — parents monitor and encourage a child's learning

The emotional promise:

> Your grandma is calling. You understand a little, but you freeze. Roots helps you answer.

Every piece of content must pass the test: *"When would the user actually use this in real life?"* No "the duck eats rice."

---

## 2. Platform Decision — Why Web First (and how we keep mobile open)

The team is building the **web app first** to iterate fast, share a URL for feedback, and avoid app-store friction. A native Expo app is planned later.

To keep that path open, the codebase must follow one strict architectural rule:

> **`src/core/` is platform-agnostic.** Everything inside `src/core/` (types, mock data, engines, pure helpers) must be plain TypeScript with **zero imports from React, Next.js, the DOM, or browser APIs.** A future Expo app should be able to copy `src/core/` unchanged and import the same types, data, and lesson logic.

UI, routing, and storage live outside `src/core/` and are the only parts that get rewritten for mobile later.

The UI itself is **mobile-first**: the app renders inside a centered, phone-width column (the "app frame") so it looks and demos like the future mobile app, and looks intentional on desktop.

---

## 3. Tech Stack

Build with:

- **Next.js (latest, App Router)** with **TypeScript**, created via `npx create-next-app@latest` (TypeScript: yes, ESLint: yes, Tailwind: yes, App Router: yes, `src/` directory: yes, import alias: `@/*`)
- **Tailwind CSS** (whatever version create-next-app scaffolds — define design tokens as CSS variables and reference them from Tailwind so the version doesn't matter)
- **Zustand** with the `persist` middleware (localStorage) for all app state
- **lucide-react** for icons
- **next/font** for fonts (suggested pairing: **Fraunces** for display headings — warm, characterful serif — and **Nunito Sans** or **Inter** for body text)

Rules:

- No backend, no database, no auth in this MVP. Local mock data + localStorage only, but **Supabase-ready** (Section 12).
- Avoid heavy dependencies. No component libraries (no shadcn, no MUI) — build small custom components so the warm, distinctive visual identity comes through. No framer-motion unless a specific interaction genuinely cannot be done with CSS transitions (the incoming-call ring animation is doable with CSS keyframes).
- All interactive screens are **client components** (`"use client"`).
- **Hydration safety:** because Zustand `persist` reads localStorage, guard against SSR/client hydration mismatch. Use a `useHasHydrated` hook (or Zustand's `skipHydration` + manual rehydrate in a top-level client provider) and render a brief skeleton until hydrated. Do not let the app flash incorrect onboarding state.

---

## 4. Project Structure

```txt
roots-web/
  CLAUDE.md                  ← project context for Claude Code (see Phase 0)
  README.md
  ARCHITECTURE.md
  CONTENT_GUIDE.md
  NEXT_STEPS.md
  src/
    app/
      layout.tsx             ← root layout: fonts, theme, AppFrame
      page.tsx               ← entry: demo launcher OR redirect to /home
      globals.css            ← design tokens as CSS variables
      onboarding/page.tsx    ← multi-step onboarding (incl. parent branch)
      languages/page.tsx     ← 7 language cards
      waitlist/[languageId]/page.tsx
      home/page.tsx
      lesson/[id]/page.tsx   ← lesson engine player
      pattern-lab/[id]/page.tsx
      call/[id]/page.tsx     ← phone call practice
      story/[id]/page.tsx
      texting/[id]/page.tsx
      review/page.tsx        ← weak-words review session
      inventory/page.tsx     ← Roots Bank + Pattern Bank
      parent/page.tsx        ← parent dashboard
      parent/setup/page.tsx
      profile/page.tsx
    components/
      ui/                    ← AppButton, AppCard, Screen, ProgressBar,
                               Badge, StatPill, BottomNav, AppFrame,
                               AudioButton, VerificationTag, Modal
      cards/                 ← LanguageCard, WordCard, PatternCard,
                               ScenarioCard, StoryCard, ProverbCard,
                               ParentProgressCard, MomentCard
      exercises/             ← ExercisePlayer + one component per exercise type
      lesson/                ← WordIntroCard, SentenceFrameCard,
                               LessonCompletion, IntroPanelPager
      call/                  ← IncomingCallScreen, CallDialogue, CallComplete
      story/                 ← StoryPanelPager, TappableWord
    core/                    ← ★ PLATFORM-AGNOSTIC. No React/Next/DOM imports.
      types.ts
      data/
        index.ts             ← single data-access boundary (getLessons(), getWords()...)
        languages.ts
        kinyarwanda/
          words.ts
          lessons.ts
          patterns.ts
          scenarios.ts
          stories.ts
          texting.ts
          proverbs.ts
        demoUsers.ts         ← parent/child demo profiles
      engine/
        lessonEngine.ts
        patternEngine.ts
        reviewEngine.ts      ← builds a weak-words quiz
        answerCheck.ts
      copy.ts                ← reusable UI copy strings (feedback lines, etc.)
    store/
      useRootsStore.ts       ← Zustand store (persisted)
      useHasHydrated.ts
    lib/
      supabasePlaceholder.ts
    constants/
      colors.ts
      spacing.ts
```

Adjust slightly for Next.js best practices if needed, but keep the **`core/` isolation rule** and the **single data-access boundary** (`core/data/index.ts`) intact — screens must never deep-import individual mock files, so swapping in Supabase later only touches one module.

---

## 5. Design System

The app should feel: warm, modern, simple, family-centered, premium-but-friendly, playful without being childish, culturally grounded without being stereotypical.

### 5.1 Colors

Define these as CSS variables in `globals.css` and mirror them in `constants/colors.ts`:

```ts
export const colors = {
  background: "#FFF8EF",
  surface: "#FFFFFF",
  textPrimary: "#24160F",
  textSecondary: "#6B5A4D",
  accent: "#D9822B",
  accentDark: "#A65316",
  green: "#4F7A52",
  red: "#B94A3A",
  gold: "#E8B85A",
  border: "#EADCCB",
  locked: "#D8C8B8",
};
```

### 5.2 The App Frame (phone-width layout)

- The whole app renders inside a centered column: `max-width: 430px`, `min-height: 100dvh`, background `--background`, with a subtle border on `md+` screens.
- The page behind the frame (desktop only) gets a very subtle warm treatment (e.g., a slightly darker cream or a faint pattern) so the frame reads as intentional, not unfinished.
- On phone browsers the frame is naturally full-width — this is the primary demo target.
- A **BottomNav** (Home, Roots Bank, Profile — plus Parent when parent mode is on) is sticky inside the frame.
- BottomNav is **hidden on immersive routes**: onboarding, lesson, pattern-lab, call, story, texting, review. Those screens get a top bar with a close/back control and a progress bar instead.

### 5.3 Component look

- Rounded cards (`rounded-2xl`), soft shadows, generous padding, `--border` hairlines.
- Large readable type. Fraunces for headings and emotional copy; sans for UI/body.
- Buttons: solid `--accent` primary with `--accentDark` press state; quiet secondary (surface + border). Obvious hover/active/focus states. Min touch target 44px.
- Gentle transitions everywhere (150–250ms). Respect `prefers-reduced-motion`.
- Friendly icons via lucide-react.

### 5.4 UX rule

**Every screen must feel clickable and alive.** No dead static screens. Every major screen has buttons, progress, cards, or a visible next step. Empty states get warm copy and a CTA, never a blank area.

---
## 6. Data Model — TypeScript Contracts (`src/core/types.ts`)

These are the canonical contracts. They are frozen early so two developers can build against them in parallel — **changing this file requires team agreement** (see TEAM_DELEGATION_PLAN.md).

Note: the original spec defined `Pattern` twice with conflicting shapes. The consolidated version below is canonical. Every entity carries verification metadata so unverified demo language content is always labeled.

```ts
export type LearnerType = "child" | "teen" | "adult" | "parent";

export type LearningReason =
  | "family" | "child" | "culture" | "travel" | "passive_speaker" | "general";

export type PassiveSpeakerLevel =
  | "zero" | "greetings_only" | "understand_cant_reply" | "speak_a_little" | "build_confidence";

export type LanguageStatus = "active" | "coming_soon";

export type ExerciseType =
  | "multiple_choice"
  | "fill_blank"
  | "sentence_builder"
  | "call_response"
  | "story_question"
  | "pattern_noticing"
  | "prefix_swap"
  | "natural_texting"
  | "formal_vs_casual"
  | "where_would_you_hear_this";

export type UsageContext = "casual" | "respectful" | "elder_safe" | "formal" | "slang";

export type VerificationStatus = "verified" | "demo_needs_review";

export interface AudioMeta {
  audioUrl?: string;
  speakerName?: string;
  dialectOrRegion?: string;
  verifiedBy?: string;
  isVerified?: boolean;
  recordingType?: "native_recording" | "ai_generated" | "placeholder";
}

export interface Language {
  id: string;                 // "kinyarwanda", "swahili", ...
  name: string;
  status: LanguageStatus;
  regionLabel: string;        // "Rwanda · East Africa"
  description: string;        // the exact card copy from Section 9.3
  teaser?: string;            // "what you'll learn first" for coming-soon
  learnerCount?: number;      // mock interest count for coming-soon
}

export interface MorphemePart {
  text: string;
  meaning: string;
  type: "prefix" | "stem" | "suffix" | "connector" | "unknown";
}

export interface Word extends AudioMeta {
  id: string;
  languageId: string;
  word: string;
  translation: string;
  pronunciation?: string;
  category: WordCategory;
  frequencyRank?: number;
  frequencyBand?: "top_25" | "top_50" | "top_100" | "top_250" | "common" | "specialized";
  sentenceFrameIds?: string[];
  patternIds?: string[];
  morphemeBreakdown?: MorphemePart[];
  exampleSentence?: string;
  exampleTranslation?: string;
  usageNote?: string;          // "when to use this"
  cultureNote?: string;
  wordStory?: string;          // "Story behind the word" — only if genuinely known
  etymologyNote?: string;      // NEVER invented; omit when unknown
  usageContext?: UsageContext[];
  verificationStatus: VerificationStatus;
}

export type WordCategory =
  | "Family" | "Greetings" | "Respect" | "Food" | "Travel" | "Home"
  | "Feelings" | "Survival Phrases" | "Proverbs" | "Culture"
  | "Faith/Community" | "Slang/Cousin Talk" | "Patterns";

export interface SentenceFrame {
  id: string;
  languageId: string;
  frame: string;               // "Ndashaka ___"
  translationFrame: string;    // "I want ___"
  slots: string[];             // example fillers
  examples: string[];
  whereYouHearIt: string[];    // friendly contexts, not academic data
}

export interface PatternExample {
  word: string;
  translation: string;
  breakdown: MorphemePart[];
  realLifeContext?: string;
}

export interface Pattern {
  id: string;
  languageId: string;
  name: string;                // "Notice the Prefix"
  pattern: string;             // "Nd…"
  plainEnglishMeaning: string; // "often points to I / me / the speaker"
  explanation: string;
  examples: PatternExample[];
  usageNote?: string;
  exceptionsNote?: string;     // required wording style: "often signals…", never "always"
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  options?: string[];
  correctAnswer: string | string[];
  tiles?: string[];            // for sentence_builder
  explanation?: string;        // shown on wrong answers — gentle, never shaming
  relatedWordIds?: string[];   // used for weak-word tracking
}

export type IntroPanel = {
  id: string;
  title: string;
  body: string;
  emoji?: string;
  interaction?: Exercise;      // the "mini interaction" panel
};

export interface Lesson {
  id: string;
  languageId: string;
  title: string;               // "Grandma is Calling"
  subtitle: string;
  momentType: string;          // "family_call", "save_me", "intro", ...
  learningFocus?: "frequency_words" | "sentence_frame" | "pattern_lab"
                | "phone_call" | "story" | "texting" | "history_intro";
  difficulty: "beginner" | "easy" | "medium";
  estimatedMinutes: number;
  introPanels?: IntroPanel[];  // used by Lesson 0
  wordIds: string[];
  patternIds?: string[];
  sentenceFrameIds?: string[];
  exercises: Exercise[];
  completionMessage: string;   // "You survived the call."
}

export interface DialogueLine {
  id: string;
  speaker: "family_member" | "user" | "narrator";
  speakerLabel: string;        // "Nyogokuru (Grandma)"
  text: string;
  translation?: string;
  audio?: AudioMeta;
  responseOptions?: string[];  // when the user must reply
  responseTiles?: string[];    // when the reply is a sentence builder
  correctResponse?: string;
  feedbackRight?: string;
  feedbackWrong?: string;
}

export interface Scenario {
  id: string;
  languageId: string;
  title: string;               // "Grandma is calling…"
  subtitle: string;
  callerName: string;
  scenarioType: "phone_call" | "travel" | "family" | "market" | "community";
  dialogue: DialogueLine[];
  reinforcedWordIds: string[];
  completionMessage: string;   // "You answered without freezing."
}

export interface StoryPanel {
  id: string;
  text: string;
  translation?: string;
  highlightedWordIds?: string[];
  question?: Exercise;
}

export interface Story {
  id: string;
  languageId: string;
  title: string;
  ageMode: "child" | "teen_adult" | "all";
  panels: StoryPanel[];
  cultureNote?: string;
  unlockedWordIds: string[];
  unlockedProverbId?: string;
  verificationStatus: VerificationStatus;
}

export interface Proverb {
  id: string;
  languageId: string;
  proverb: string;
  literalMeaning: string;
  deeperMeaning: string;
  whenYouHearIt: string;
  relatedWordIds: string[];
  cultureNote?: string;
  verificationStatus: VerificationStatus;
}

export interface TextingLesson {
  id: string;
  languageId: string;
  title: string;               // "Text Your Cousin"
  ageMode: "teen_adult" | "all";
  context: "cousin_chat" | "family_group_chat" | "elder_safe_reply";
  incomingMessages: string[];  // rendered as chat bubbles
  exercises: Exercise[];       // mostly formal_vs_casual / natural_texting
  verificationStatus: VerificationStatus;
}

export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  ageRange: "5-7" | "8-10" | "11-12" | "13+";
  selectedLanguageId: string;  // default "kinyarwanda"
  streakDays: number;
  wordsCollected: number;
  lessonsCompleted: number;
  weeklyMinutes: number;
  weakWordIds: string[];
  recentActivity: string[];
  recommendedNextLessonId: string;
}

export interface WaitlistEntry {
  id: string;
  languageId: string;
  name: string;
  email: string;
  reason: LearningReason;
  createdAtLabel: string;
}

export type ChallengeType =
  | "practice_greeting" | "learn_family_words" | "complete_phone_call"
  | "review_weak_words" | "complete_story";
```

---

## 7. App State & Persistence (`src/store/useRootsStore.ts`)

One Zustand store, persisted to localStorage under key `roots-demo-v1`. Shape:

```ts
interface RootsStore {
  // session / onboarding
  hasOnboarded: boolean;
  learnerType: LearnerType | null;
  learningReason: LearningReason | null;
  passiveSpeakerLevel: PassiveSpeakerLevel | null;
  selectedLanguageId: string;          // default "kinyarwanda"
  parentMode: boolean;
  parentName?: string;
  childProfile?: ChildProfile;          // demo child (Amara by default)

  // progress
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

  // mock features
  waitlist: WaitlistEntry[];
  sentChallenges: { type: ChallengeType; toChildName: string; atLabel: string }[];

  // actions
  setOnboardingAnswers(...): void;
  completeOnboarding(): void;
  startLearnerDemo(): void;            // pre-seeds a believable mid-progress learner state
  startParentDemo(): void;             // sets parentMode + Amara demo child
  completeLesson(lessonId: string, wordIds: string[], patternIds?: string[]): void;
  completeScenario(id: string, reinforcedWordIds: string[]): void;
  completeStory(id: string, wordIds: string[], proverbId?: string): void;
  completeTexting(id: string): void;
  markWeakWord(wordId: string): void;  // called when an exercise tied to a word is missed
  clearWeakWord(wordId: string): void; // called when a review answer is correct
  joinWaitlist(entry: Omit<WaitlistEntry, "id" | "createdAtLabel">): void;
  sendChallenge(type: ChallengeType): void;
  resetDemo(): void;                   // wipes persisted state, returns to entry screen
}
```

Behavior rules:

- `completeLesson` must: add the lesson to `completedLessonIds` (idempotent), union the unlocked word/pattern IDs into the collections, bump `xp` (e.g., +10 per exercise), bump `streakDays` by 1 the first completion of a browser day (simple date check is fine), and set `lastActivityLabel` (e.g., `Completed "Grandma is Calling"`).
- Weak-word mechanic: if the user answers an exercise wrong and it has `relatedWordIds`, those words get `markWeakWord`. Correct answers in `/review` call `clearWeakWord`.
- All progress changes must be **visible immediately** somewhere in the UI (home stats, Roots Bank counts, completion screens).

---

## 8. Core Engines (`src/core/engine/`) — pure TypeScript, fully unit-testable

### 8.1 `lessonEngine.ts`

Converts a `Lesson` into an ordered list of steps the player renders one at a time:

```ts
export type LessonStep =
  | { kind: "intro_panel"; panel: IntroPanel }
  | { kind: "word_card"; wordId: string }
  | { kind: "sentence_frame"; frameId: string }
  | { kind: "exercise"; exercise: Exercise }
  | { kind: "completion" };

export function buildLessonSteps(lesson: Lesson): LessonStep[];
```

Default sequencing: intro panels (if any) → word cards → sentence frames → exercises → completion. Interleave at least one pattern-noticing or scenario-flavored exercise between word batches when the lesson provides them, so it never feels like "flashcards then quiz."

### 8.2 `answerCheck.ts`

`checkAnswer(exercise, userAnswer): { correct: boolean; explanation?: string }` — handles string vs string[] answers, trims/normalizes case and whitespace, and joins sentence-builder tiles with single spaces before comparing.

### 8.3 `patternEngine.ts`

Helpers for Pattern Labs: render a `MorphemePart[]` breakdown with the prefix/suffix segment flagged for highlighting (`**umu**-gabo`), and a `swapPrefix(word, fromMorpheme, toMorpheme)` helper used by `prefix_swap` exercises (e.g., `ndafite` → `ufite`).

### 8.4 `reviewEngine.ts`

`buildReviewSession(weakWordIds, allWords): Exercise[]` — generates simple multiple-choice exercises ("What does *buhoro* mean?") with 3 distractor translations pulled from other collected words. Used by `/review`.

### 8.5 Frequency presentation rule

Frequency data exists in the model (`frequencyRank`, `frequencyBand`) but is **never shown as dry data**. Surface it as friendly copy on word cards, e.g. *"You'll hear this constantly in family conversation"* (top_25/top_50) or *"This word unlocks 5 useful replies"* (when it has sentence frames). Put the mapping logic in `core/copy.ts`.

---

## 9. Routes & Screens

| Route | Purpose | Bottom nav? |
|---|---|---|
| `/` | Entry + demo launcher, or redirect to `/home` if onboarded | no |
| `/onboarding` | 4-step onboarding + parent branch | no |
| `/languages` | 7 language cards | yes |
| `/waitlist/[languageId]` | Coming-soon interest form | no |
| `/home` | Daily hub | yes |
| `/lesson/[id]` | Lesson engine player | no (immersive) |
| `/pattern-lab/[id]` | Pattern Lab player | no |
| `/call/[id]` | Phone-call practice | no |
| `/story/[id]` | Story Time | no |
| `/texting/[id]` | Natural texting demo | no |
| `/review` | Weak-words review session | no |
| `/inventory` | Roots Bank + Pattern Bank | yes |
| `/parent/setup` | Parent setup form | no |
| `/parent` | Parent dashboard | yes (when parentMode) |
| `/profile` | Settings / demo controls | yes |

### 9.1 `/` — Entry & Demo Mode

If `hasOnboarded`, redirect to `/home`. Otherwise show the Roots logo/wordmark, one-line promise, and three buttons (spec §38):

- **Start as Learner** → `/onboarding`
- **Start Parent Demo** → seeds parent demo state (Daniel + Amara) → `/parent`
- **Skip to App Demo** → seeds a believable mid-progress learner state → `/home`

This exists so the app can be handed to anyone for feedback with zero setup. No real accounts, ever, in this MVP.

### 9.2 `/onboarding` — four steps, one screen with internal step state

1. **Emotional intro** — animated, line-by-line reveal:
   > Your grandma is calling…
   > She starts speaking in your language.
   > You understand one word.
   > Then you freeze.
   > **Roots helps you answer.**
   Button: **Start reconnecting**.
2. **Why are you learning?** — For my family / For my child / For culture / For travel / I understand but cannot reply / I just want to learn.
3. **Who is learning?** — Child under 13 / Teen 13+ / Adult / **Parent setting up for child** (→ routes to `/parent/setup` after onboarding completes).
4. **Passive speaker check** — "How much do you already understand?" — I am starting from zero / I know greetings only / I understand family talk but cannot reply / I can speak a little / I want to improve confidence.

Each answer is stored in the store and **must change the home screen copy** (Section 9.4). Progress dots across the top; selections are tappable cards with a selected state.

After step 4: non-parents → `/languages`; parents → `/parent/setup` → `/languages`.

### 9.3 `/languages` — Language Selection

Seven `LanguageCard`s. Each shows: name, region tag, status badge (Active demo / Coming soon), short emotional description, and either a primary CTA (Kinyarwanda) or a "Join the waitlist" CTA. Use this exact copy:

- **Kinyarwanda — Active demo:** "Start here. Reconnect with Rwanda through family greetings, high-frequency conversation words, respect phrases, patterns, stories, and everyday speech." → tapping selects it and routes to `/home`.
- **Swahili — Coming soon:** "A major East African language spoken across borders, travel, trade, music, and everyday community life. Join the waitlist for practical family and travel lessons."
- **Yoruba — Coming soon:** "A major West African language with deep cultural, musical, spiritual, and storytelling traditions. Join the waitlist for greetings, family phrases, proverbs, and natural speech."
- **Igbo — Coming soon:** "A major Nigerian language with rich family, proverb, and community traditions. Join the waitlist for practical diaspora lessons and cultural stories."
- **Dinka — Coming soon:** "A major South Sudanese language family with strong community and oral traditions. Join the waitlist to help shape practical lessons for diaspora families."
- **Acholi — Coming soon:** "A Nilotic language connected to northern Uganda and South Sudan, with strong oral storytelling and cultural traditions. Join the waitlist for family-first lessons."
- **Amharic — Coming soon:** "A major Ethiopian language with its own script, history, and deep literary and cultural presence. Join the waitlist for heritage, family, and travel lessons."

Coming-soon cards route to `/waitlist/[languageId]`, show a mock interest count ("2,431 people waiting"), and a one-line "what you'll learn first" teaser. The page should read as a living roadmap, not a graveyard of locked features.

### 9.4 `/home` — the daily hub

Top: warm greeting + selected language chip, stat row (🔥 streak days, 📦 words collected, ✨ xp).

**Passive-speaker reflection** — one line under the greeting driven by the onboarding answer, e.g. for `understand_cant_reply`: *"Today we'll help you answer back, not just understand."* Write a variant for each `PassiveSpeakerLevel` in `core/copy.ts`.

**Today's Moment** hero card:
> **Today's Moment** — Your grandma is calling. Greet her respectfully, say where you are, and tell her you're coming soon. → CTA into the call or Lesson 1.

Then cards (each fully tappable):

1. **Continue Lesson** — next uncompleted lesson, with a small progress bar across all lessons
2. **Grandma is Calling** — phone-call practice (`/call/grandma-call`)
3. **Story Time** — `/story/grandma-word`
4. **Roots Bank** — word + pattern counts
5. **Review Weak Words** — shows a count badge; hidden or shown as a "all clear 🎉" state when there are none → `/review`
6. **Save Me Phrases** — quick access card → `/inventory?category=Survival%20Phrases`
7. **Parent Dashboard** — only when `parentMode`

### 9.5 `/lesson/[id]` — Lesson player

Renders `buildLessonSteps()` one step at a time. Top bar: close (×, confirm-if-mid-lesson), thin progress bar.

- **Word intro cards** show: word (large), translation, pronunciation guide, `AudioButton`, category chip, friendly frequency line (§8.5), example sentence + translation, "When to use this," culture note (teen/adult only), and a `VerificationTag` when `demo_needs_review`. CTA: "Got it →".
- **Sentence frame cards** show the frame with the blank visually emphasized, the translation frame, 2–3 example fills, and "Where you'll hear it" chips.
- **Exercises** render through `ExercisePlayer` (Section 10.1).
- **Completion screen**: confetti-ish gentle animation, completion message (e.g., "You survived the call."), XP earned, words unlocked as small flipping `WordCard`s, "Added to your Roots Bank," streak update, and "next recommended moment" CTA.

### 9.6 `/pattern-lab/[id]` — Pattern Lab player

Sequence: pattern intro (name + plain-English meaning, with the required hedged wording — "often signals…", never "always") → example cards with the morpheme **visually highlighted** in `--accent` (e.g., **umu**gabo / **aba**gabo) and per-part breakdown → exercises (spot-the-pattern, choose-what-the-prefix-means, prefix_swap, build-the-meaning) → exceptions/verification note card → completion that unlocks the pattern into the **Pattern Bank** with a "Patterns I've Noticed +1" moment.

### 9.7 `/call/[id]` — Phone Call Practice (signature feature — make this shine)

Three states:

1. **Incoming call**: full-frame call UI — pulsing avatar (use a warm emoji/initial avatar, no real photos), caller name ("Nyogokuru — Grandma"), "Kinyarwanda · mobile" subtitle, CSS ring animation, green **Answer** / red **Decline**. Decline returns home with the toast: *"She'll call back. They always do."*
2. **In call**: chat-style dialogue. Family lines appear with a typing delay (600–900ms), each with an `AudioButton` and a tap-to-reveal translation. When a `DialogueLine` has `responseOptions` or `responseTiles`, the user must answer to continue. Correct → green tick + `feedbackRight`; wrong → gentle shake + `feedbackWrong` + retry (never blocked, never shamed). A dot indicator shows progress through the call.
3. **Call complete**: "You answered without freezing." + duration mock + reinforced words + a small "confidence +1" meter animation. `completeScenario` fires.

### 9.8 `/story/[id]` — Story Time

Swipeable/paged panels. Highlighted words are tappable → popover with translation, pronunciation, `AudioButton`, and "add to Roots Bank" state. Mid-story: one fill-in-the-blank moment and one comprehension question (via `ExercisePlayer`). End: culture note card → completion that unlocks listed words **and the proverb card** (Section 11.8) with a satisfying reveal.

### 9.9 `/texting/[id]` — Natural speech demo

Phone-chat UI inside the frame (rounded bubbles, cousin/group-chat header). Incoming messages animate in; exercises ask the user to choose between **stiff textbook / natural casual / elder-safe** replies, with feedback explaining the register: *"That one works with cousins, but not elders."* Include a `VerificationTag` banner: slang content needs native-speaker review before production. Teen/adult mode only — child learners see a friendly "this one unlocks at 13+" lock state.

### 9.10 `/review` — Weak words

Builds a session from `reviewEngine`. Empty state: *"No weak words right now. Go collect some new ones."* Correct answers `clearWeakWord` with a visible "mastered" moment.

### 9.11 `/inventory` — Roots Bank

- Header: total words, total patterns, progress by category.
- Tabs: **Words** | **Patterns I've Noticed**.
- Words tab: search input, horizontal category chips (the 13 categories from `WordCategory`, only showing non-empty ones plus locked counts), grid of `WordCard`s — collected words full-color, **locked words** rendered in `--locked` with a lock icon and "Keep learning to unlock."
- Tapping a collected word opens a **detail modal**: word, translation, pronunciation, `AudioButton`, example sentence, "learned in" lesson link, when to use it, usage-context chips (elder-safe / casual / etc.), culture note, **"Story behind the word"** (collapsible; only when `wordStory`/`etymologyNote` exist), region/dialect note, verification tag.
- **Kids mode**: hide etymology/word-story and deep culture notes, simpler wording, bigger cards. **Teen/adult**: show everything.
- Patterns tab: `PatternCard`s with pattern, meaning shortcut, examples, "when it's useful," exceptions note, verification badge.
- **Save Me Phrases** must be findable here as a pinned category.

### 9.12 `/parent/setup` and `/parent`

**Setup form**: parent name, child name, child age range (5–7 / 8–10 / 11–12 / 13+), language, goal (Speak to grandparents / Learn family words / Prepare for visiting home / Build cultural confidence / General learning). Submitting creates the child profile in the store (blank fields fall back to the Daniel/Amara demo data) and enables `parentMode`.

**Dashboard**: child header card (name, language, streak, words, lessons, weekly minutes — Section 11.9 data) plus six cards:

1. Progress overview (simple bars/stats)
2. Words learned (mini word chips)
3. Weak words (chips: buhoro, ndaza, murakoze) with "Help them review"
4. Recent lessons / activity feed
5. Recommended next moment ("I Understand But I Freeze")
6. **Send a challenge** — opens a sheet with five options (Practice greeting grandma / Learn 5 family words / Complete today's phone call / Review weak words / Complete a story) → success state: *"Challenge sent to Amara."* (stored in `sentChallenges`, shown as "sent ✓" history)

**Tone rule (important):** frame everything as encouragement — "Encourage," "Support," "See growth," "Celebrate words learned." Never surveillance language. The parent should feel *"I can actually see whether my child is learning"* — warmly.

### 9.13 `/waitlist/[languageId]`

Header: "{Language} is coming soon. Join the waitlist and tell us what you want to learn first." Fields: name, email, language (pre-selected, switchable), reason (select). Submit → success state: *"You're on the {language} waitlist. We'll let you know when the first family lessons are ready."* + increment the mock interest count. Local state only.

### 9.14 `/profile`

Shows learner type, learning reason, passive-speaker level, selected language (link to `/languages`). Demo controls: **Switch to Parent Demo**, **Switch to Learner Demo**, **Reset Demo Progress** (confirmation dialog → `resetDemo()` → back to `/`). Footer: app version, and a visible content disclaimer: *"Kinyarwanda demo content is being verified with native speakers. Some spellings and phrases may change."*

---
## 10. Cross-Cutting Feature Rules

### 10.1 `ExercisePlayer` (`components/exercises/`)

One dispatcher component that renders the right exercise component by `type`, runs `checkAnswer`, and standardizes feedback. All ten `ExerciseType`s must work:

- **multiple_choice** — tappable option cards
- **fill_blank** — sentence with a visible gap + option chips
- **sentence_builder** — word tiles the user **taps to move** into an answer row (tap again to remove); animate the tile moving; check on "Check" press
- **call_response** — used inside `/call`, same option UI in chat context
- **story_question** — used inside `/story`
- **pattern_noticing** — "Notice the start of the word. Who is speaking?" style
- **prefix_swap** — show `ndafite = I have`, ask for `ufite`, via tiles or options
- **natural_texting** / **formal_vs_casual** — register-choice questions
- **where_would_you_hear_this** — scenario/respect-level questions ("Who would you say this to?")

### 10.2 Feedback states (apply everywhere)

- **Correct:** green success flash, short encouraging copy rotated from `core/copy.ts` — "Good. That's the elder-safe version." / "You're building the reply." / "Nice — that's exactly what you'd say."
- **Wrong:** gentle correction, the exercise's `explanation`, and a retry. Copy like "Close — try again." Never red-X shame, never blocking, never streak punishment.
- Register-specific feedback when relevant: *"That one works with cousins, but not elders."*

### 10.3 Verification & cultural-safety rules (non-negotiable)

- **Every Kinyarwanda string in this plan and in the original spec is `demo_needs_review` unless explicitly marked verified.** Render `VerificationTag` ("demo — needs native review") subtly but honestly wherever such content appears prominently (word detail, pattern labs, texting, story, proverb).
- Pattern explanations must use hedged wording: *"This pattern often signals…"*, *"In many common words…"*, *"This is a useful shortcut, but native-speaker verification is still needed."* Never claim a rule works 100% of the time.
- **Never invent etymology or history.** `wordStory`/`etymologyNote` are omitted unless genuinely known; the Lesson 0 history panels stay simple, emotional, and non-specific, and carry the verification note.
- The spec's generic exercise examples in its §15 ("maji", "Ninataka", "Ninakuja hivi karibuni") are **Swahili** illustrations of exercise mechanics. Do **not** copy them into Kinyarwanda content. All active MVP content is Kinyarwanda.

### 10.4 Audio architecture

No real audio, no ElevenLabs, no speech recognition in this MVP. Every word, dialogue line, and story panel supports `AudioMeta`. The shared `AudioButton`: speaker icon → on tap, if no `audioUrl`, play a 250ms pressed animation + tooltip/toast **"Audio coming soon"**. The metadata fields exist now so native-speaker recordings drop in later without schema changes.

### 10.5 Kids mode vs teen/adult mode

Driven by `learnerType` (or the child profile in parent flows): kids get simpler wording, bigger touch targets, more playful visuals, shorter lesson step counts, no etymology/deep culture notes, no slang/texting (friendly 13+ lock). Teen/adult gets culture notes, word stories, respect-vs-casual registers, and the texting/slang track.

### 10.6 Respect levels

`usageContext` chips appear on word cards and detail views ("Say this to an elder" / "Say this to a cousin"). The data model and UI fully support all five registers even where MVP content only uses two or three.

---

## 11. Required Kinyarwanda MVP Content (`src/core/data/kinyarwanda/`)

Quantity floor: **≥ 20 words/phrases** (including ~5 still-locked words and 3 pre-seeded weak words), **4 lessons** (intro + 3), **2 Pattern Labs**, **1 texting demo**, **1 phone call**, **1 story**, **1 proverb**. All `demo_needs_review`.

### 11.1 Lesson 0 — "Welcome to Kinyarwanda" (`learningFocus: "history_intro"`)

Five swipeable intro panels, then straight into Lesson 1's recommendation:

1. **What is Kinyarwanda?** — the language of Rwanda and a major part of Rwandan identity, family life, stories, proverbs, greetings, and everyday communication. Simple and emotional, not academic.
2. **Where does it come from?** — a Bantu language, connected to a wider family of Bantu languages in the region; related patterns can sometimes be noticed across them — worded carefully, no overclaiming.
3. **Why it feels special** — strong patterns in word beginnings; small changes show who is speaking, who is spoken to, one person vs a group; respect and greetings matter.
4. **How Roots will teach it** — high-frequency words first → family moments → the patterns underneath → your Roots Bank.
5. **Mini interaction** — "What should Roots teach first?" Options: *Words you actually hear* (correct) / *Random animal sentences* / *Only grammar rules*. Wrong answers get a playful nudge.

Panels carry a small "history simplified — being verified" note.

### 11.2 Lesson 1 — "Grandma is Calling"

Subtitle: *Greet her respectfully and answer simple family questions.* Words (all `demo_needs_review`):

| word | translation | notes |
|---|---|---|
| muraho | hello | Greetings, top_25 |
| amakuru | how are you? / news | Greetings, top_25 |
| ni meza | it is good / I am well | Greetings |
| ndumva | I hear / I understand | Survival Phrases; morphemes: **nd** + umva |
| buhoro | slowly | Survival Phrases; pre-seed as weak word |
| murakoze | thank you | Respect; pre-seed as weak word |
| ndi | I am | Survival Phrases; **nd** prefix |
| mu rugo | at home | Home |
| ndaza | I am coming | Family; pre-seed as weak word |
| vuba | soon | Family |
| ndashaka | I want | Survival Phrases; morphemes: **nda** + shaka |
| ndafite / mfite | I have | Survival Phrases; flag: "preferred beginner form needs verification" |

Sentence frames: `Ndi ___` (I am ___), `Ndashaka ___` (I want ___), `Ndaza ___` (I am coming ___). Exercises must include MC, fill-blank, at least one pattern_noticing, and sentence builders for the real replies: **"Ndi mu rugo"** (I am at home), **"Ndaza vuba"** (I am coming soon), plus choices for "Please speak slowly" and "I understand a little." Completion message: **"You survived the call."**

### 11.3 Lesson 2 — "I Understand But I Freeze"

Subtitle: *Learn simple replies when family speaks quickly.* Passive-speaker confidence focus: replying with partial understanding, buying time, short honest answers. Reuse Lesson 1 vocabulary plus 3–5 new words; heavy on sentence builders and call_response exercises.

### 11.4 Lesson 3 — "Save Me Phrases"

Subtitle: *Learn what to say when you understand a little but need help.* The phrase set (give each a best-effort Kinyarwanda rendering labeled `demo_needs_review`; where genuinely unsure, present the English with "Kinyarwanda version pending native review" rather than inventing): Please speak slowly · I understand a little · I am still learning · Can you repeat that? · How do you say this? · Do not laugh at me (keep this one playful and culturally warm) · I am trying · I forgot the word · I can hear you, but I cannot reply well. These all live in the **Survival Phrases** category and power the home-screen Save Me Phrases card.

### 11.5 Pattern Lab 1 — "Notice the Prefix"

Goal: common word beginnings can reveal who is speaking or whether a word means one person or a group. Patterns (all hedged, all `demo_needs_review`):

- **Nd… / Ndi…** → often points to *I / me / the speaker* in beginner phrases (ndashaka, ndafite/mfite, ndumva, ndi)
- **U…** → often points to *you / the listener* (ufite = you have, urabizi = you know, uri = you are)
- **Umu…** → often appears in singular person words (umwana = child, umugabo = man, umuhungu = boy, umukobwa = girl)
- **Aba…** → often appears in plural/group person words (abana, abagabo, abahungu, abakobwa)

Render breakdowns with the prefix highlighted (**umu**-gabo → **aba**-gabo). Exercises: "Notice the start of the word — who is speaking?" (options: I/me · you · a group · a place); "What changed when the word became plural?"; prefix-swap drills. Exceptions card: *"These are useful beginner shortcuts, not full grammar rules. Kinyarwanda noun classes are richer than this — native-speaker verification is still needed."*

### 11.6 Pattern Lab 2 — "From I to You"

Goal: changing the beginning of a word changes who the sentence is about. Core drill: `ndashaka` = I want → `ushaka` = you want → "What changed?" → *The beginning changed from "nda" to "u."* Plus swaps: ndafite → ufite, ndi → uri. Unlocks the speaker/listener pattern pair into the Pattern Bank.

### 11.7 Texting demo — "Elder-Safe vs Cousin Talk" (teen/adult)

Family-group-chat context. 3–4 incoming messages; each user turn offers stiff-textbook vs natural-casual vs elder-safe replies with register feedback. End card: *"Slang and texting shortcuts here are demo content and must be verified by native speakers before launch."*

### 11.8 Phone call — "Grandma is calling…" + Story + Proverb

**Call (`grandma-call`)** — dialogue beats, reusing Lesson 1 words so the user feels words move from lesson card to real family moment: (1) greeting → user picks reply, (2) "amakuru?" → reply, (3) "are you at home?" → sentence-builder *Ndi mu rugo*, (4) "are you coming soon?" → *Ndaza vuba*, (5) user says thank you (murakoze), (6) user admits understanding a little, (7) user asks her to speak slowly (buhoro), (8) respectful goodbye. Completion: **"You answered without freezing."**

**Story (`grandma-word`) — "The Word Grandma Repeated"** — a child keeps hearing the same word from grandma and slowly learns what it means. 5–7 short panels, highlighted tappable high-frequency words, one pattern-noticing moment, one comprehension question, a culture note (language is memory, family, respect, and patterns — not just vocabulary), and a completion that unlocks 2–3 words **plus the proverb card**.

**Proverb** — one demo proverb card: proverb text, literal meaning, deeper meaning, "when someone might say it," related words, culture note — clearly tagged `demo_needs_review`. If no authentic Kinyarwanda proverb can be rendered confidently, use a clearly-labeled placeholder ("Demo proverb — real proverb coming with native review") rather than inventing one and presenting it as real.

### 11.9 Parent demo data (`core/data/demoUsers.ts`)

> Parent: **Daniel** · Child: **Amara** · Age range: 8–10 · Language: Kinyarwanda · Streak: 4 days · Words collected: 28 · Lessons completed: 5 · Weekly practice: 42 minutes · Weak words: buhoro, ndaza, murakoze · Recent activity: Completed "Grandma is Calling"; Practiced 6 Save Me Phrases; Unlocked 3 family words · Recommended next: "I Understand But I Freeze"

### 11.10 Extra word seeds (to clear the 20-word floor; all `demo_needs_review`)

yego (yes) · oya (no) · amazi (water) · umuryango (family) · mwaramutse (good morning) · mwiriwe (good afternoon/evening) · murabeho (goodbye) · nyogokuru (grandmother) · ejo (tomorrow — note: context-dependent, can also mean yesterday; flag for verification). Mark ~5 of the total word set as **locked** so the Roots Bank shows the locked/unlocked mechanic.

---

## 12. Supabase-Ready Architecture (build nothing real yet)

- All reads go through `core/data/index.ts` (e.g., `getLanguages()`, `getLesson(id)`, `getWordsByIds(ids)`...). Screens never import mock files directly. Swapping to Supabase later = reimplementing this one module.
- `src/lib/supabasePlaceholder.ts`: a commented file showing exactly where the Supabase client, env vars, and table queries will go.
- Mock data shapes map 1:1 to future tables: `languages`, `users`, `child_profiles`, `parent_child_links`, `lessons`, `words`, `exercises`, `scenarios`, `stories`, `user_progress`, `user_word_inventory`, `weak_words`, `waitlist`, `audio_assets`, `patterns`, `user_pattern_bank`.
- Do **not** install `@supabase/supabase-js`, do not add env vars, do not build auth.

---

## 13. Documentation Files to Generate

- **README.md** — app overview, tech stack, install/run (`npm install`, `npm run dev`, open `http://localhost:3000`; best viewed at phone width or on a phone via local network IP), project structure, demo limitations (mock data, localStorage-only persistence, unverified language content), one-paragraph Vercel deploy note, next steps pointer.
- **ARCHITECTURE.md** — the `core/` isolation rule and why; data-access boundary; how lessons/exercises/steps are structured; how the frequency-first model, Pattern Labs, texting lessons, Roots Bank, Pattern Bank, and parent dashboard work; audio metadata plan; full future-Supabase table mapping (including `patterns` and `user_pattern_bank`) and how the waitlist later connects; **how to add a new language** (step-by-step: data folder, language entry, flip status) and how to add a history-intro panel.
- **CONTENT_GUIDE.md** — for future language contributors: frequency-first methodology; choosing high-frequency words; writing practical sentence frames; writing "where you would hear this" notes; creating Pattern Labs and documenting prefixes/suffixes/stems safely (hedged wording, exceptions notes); creating natural texting/slang lessons; the verified vs `demo_needs_review` system; **no AI-hallucinated etymology, ever**; the native-speaker review workflow for translations, patterns, and audio. Core principle: contributors should teach **how the language works**, not just translate English words.
- **NEXT_STEPS.md** — 1. Polish UI · 2. Add verified content · 3. Add native speaker audio · 4. Connect Supabase · 5. Real parent/child accounts · 6. Real waitlist · 7. More languages · 8. Expo React Native app reusing `src/core/` · 9. TestFlight / App Store prep — plus a list of tasks that are safe to delegate to cheaper models later (mock-data expansion, copy variants, simple component variants, doc updates).

---

## 14. What NOT to Build

No real payments/subscriptions · no real auth (Apple/Google/Supabase) · no real email sending · no voice recognition or microphone use · no ElevenLabs/AI voice · no live AI tutor · no admin CMS · no App Store/TestFlight setup · no active content for the six coming-soon languages · no complex gamification economy, leaderboards, or social feed · no server, no API routes, no database. Interactive core product experience only.

---

## 15. Acceptance Criteria

The build is successful only if **all** of the following are true:

- `npm install` then `npm run dev` runs clean; `npm run build` and `npm run lint` pass with no errors
- It is a Next.js React application (not a static page), fully usable in a desktop browser and a phone browser
- Entry demo launcher works (Learner / Parent Demo / Skip to App), onboarding works and its answers visibly change home copy
- Language selection works: Kinyarwanda → home; all six coming-soon languages → waitlist; waitlist submit shows success and bumps the mock count
- Lessons are interactive: multiple choice, fill-blank, and tap-tile sentence builder all work with correct/incorrect feedback and retry
- Pattern-noticing exercises work; both Pattern Labs complete and unlock into the Pattern Bank
- The texting/formal-vs-casual demo works (teen/adult), with the 13+ lock for child mode
- Phone-call practice works end-to-end: ring → answer → dialogue with responses → "You answered without freezing."
- Story Time works: panels, tappable highlighted words, question, culture note, word + proverb unlock
- Roots Bank works: categories, search, locked/unlocked words, word detail modal, Pattern Bank tab, Save Me Phrases findable
- Weak-words flow works: missing an exercise flags words; `/review` clears them
- Parent flow works: setup, dashboard with Amara data, send-challenge with success state
- Demo progress changes visually everywhere (stats, streak, counts, completion screens) and **persists across reload**; Reset Demo wipes it
- Audio buttons everywhere show the "Audio coming soon" interaction; unverified content shows verification tags
- README, ARCHITECTURE, CONTENT_GUIDE, and NEXT_STEPS exist with the required content
- The app feels polished enough to deploy and share a link for feedback

---

## 16. Build Phases (work in this exact order)

Each phase ends with: app compiles, runs, lints, and the phase's "done" list is demonstrably clickable. Commit at least once per phase. The two-developer split across these phases is defined in `TEAM_DELEGATION_PLAN.md` — when prompted with a specific phase, **stay inside that phase's file areas**.

### Phase 0 — Scaffold & theme
Create the Next.js app (Section 3 options) in the repo root; install zustand + lucide-react; set up fonts via next/font; define all design tokens in `globals.css` + `constants/`; build `AppFrame`, `Screen`, `AppButton`, `AppCard`, `ProgressBar`, `BottomNav` shells; write `CLAUDE.md` (project summary, commands, conventions, the `core/` isolation rule, the ownership map from the delegation plan).
**Done:** themed empty home renders inside the phone frame with working bottom nav between three placeholder tabs.

### Phase 1 — Contracts (the parallel-work unlock)
`core/types.ts` exactly as Section 6; `core/copy.ts`; full mock data files with **stable IDs** for every entity in Section 11 (content can be first-pass; IDs and shapes are final); `core/data/index.ts` boundary; `core/engine/` all four engines with basic implementations; the Zustand store (Section 7) with hydration guard; `lib/supabasePlaceholder.ts`.
**Done:** `npm run build` type-checks clean; a temporary debug page can list lessons and complete one via store actions.

### Phase 2 — Shell & navigation *(Track B in the delegation plan)*
Entry `/` with demo seeding; full onboarding incl. parent branch; `/languages` with all seven cards and exact copy; `/waitlist/[languageId]`; `/home` with all cards + passive-speaker reflection; `/profile` with demo controls and reset.
**Done:** a new user can click from entry → onboarding → language select → home → every card navigates somewhere (feature routes may be placeholders); reset works.

### Phase 3 — Lesson engine & exercises *(Track A)*
`ExercisePlayer` + all ten exercise components; word intro cards, sentence frame cards; lesson player for `/lesson/[id]`; completion screen wired to `completeLesson`; weak-word marking; `/review`.
**Done:** Lesson 0 and Lesson 1 are playable start-to-finish; completing Lesson 1 visibly updates home stats and Roots Bank counts; missing an answer creates a reviewable weak word.

### Phase 4 — Signature experiences *(Track A)*
`/call/[id]` (ring → dialogue → completion), `/story/[id]` (panels, tappable words, proverb unlock), `/pattern-lab/[id]` (both labs), `/texting/[id]` with age gating.
**Done:** all four flows complete end-to-end and write to the store.

### Phase 5 — Roots Bank & Parent mode *(Track B)*
Full `/inventory` (tabs, categories, search, locked states, detail modal, kids-mode rules, Save Me Phrases); `/parent/setup` + `/parent` dashboard with challenges.
**Done:** words unlocked in Phases 3–4 appear correctly; parent demo is fully clickable.

### Phase 6 — Content fill, polish, docs, deploy-readiness *(both tracks)*
Complete Lessons 2–3 content; second pass on all copy (warm, diaspora-specific — "Your auntie is calling. Don't panic." / "Your mum hands you the phone." / "Grandma asks if you've eaten." — never classroom-generic); micro-animations and transitions; empty/edge states; phone-browser QA at 360–430px; accessibility pass (focus states, button semantics, alt text, reduced motion); generate the four docs (Section 13); verify every acceptance criterion in Section 15.
**Done:** Section 15 checklist passes in full.

---

## 17. Final Instruction

Implement this now, phase by phase. Do not only return a plan. Do not say "here is how you could build it." Create the working files.

Priorities, in order: (1) working app, (2) clean `core/`-isolated architecture, (3) interactive UX, (4) polished demo feel, (5) easy future Supabase + Expo reuse.

After each phase, report: files created/changed, commands to run, dependencies added, assumptions made, known issues.

The goal:

> Anyone on the team can run `npm run dev` (or open the deployed URL on their phone), click through the full Roots demo — onboarding, lessons, the grandma call, a story, the Roots Bank, the parent dashboard — and hand it to a family member for feedback.
