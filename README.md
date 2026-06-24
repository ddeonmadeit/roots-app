# Roots — Kinyarwanda-First Heritage Language App

A web app for diaspora families reconnecting with their heritage language. The MVP is Kinyarwanda-first, with six more languages on the roadmap.

> **Your grandma is calling. You understand a little, but you freeze. Roots helps you answer.**

---

## Tech stack

- **Next.js 16** (App Router, TypeScript, `src/` dir)
- **React 19**, **Tailwind CSS v4** (`@theme inline` — no config file)
- **Zustand v5** with `persist` middleware (localStorage key: `roots-demo-v1`)
- **lucide-react** for icons
- **BraunLinear** — local font, all weights, used for both display and body

---

## Install & run

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build + type check
npm run lint      # ESLint
```

Best experienced at phone width (360–430px) or on an actual phone via your local network IP.

---

## Project structure

```
src/
  app/            – Next.js routes (page.tsx per route)
  components/
    ui/           – AppButton, Screen, BottomNav, ProgressBar, Modal, ...
    cards/        – WordCard, PatternCard, WordDetailModal
    exercises/    – ExercisePlayer + MultipleChoice, FillBlank, SentenceBuilder,
                    FlashCard, MatchPairs
    lesson/       – LessonPlayer, CompletionScreen
    call/         – IncomingCall, CallDialogue, CallComplete
    story/        – StoryPanelView, WordPopover, StoryComplete
  core/           – PLATFORM-AGNOSTIC (zero React/Next/DOM imports)
    types.ts      – canonical TypeScript contracts
    data/
      index.ts    – single data-access boundary (getLessons, getWords, ...)
      kinyarwanda/ – words, lessons, patterns, scenarios, stories, texting
      demoUsers.ts – Daniel + Amara demo profiles
    engine/
      lessonEngine.ts   – buildLessonSteps()
      answerCheck.ts    – checkAnswer()
      patternEngine.ts  – renderBreakdown(), parseHighlightMarks()
      reviewEngine.ts   – buildReviewSession()
    copy.ts       – UI copy, feedback lines, passive-speaker reflections
  store/
    useRootsStore.ts    – Zustand store (persisted)
    useHasHydrated.ts   – SSR hydration guard
```

---

## Demo mode

The app has no accounts or backend. Three entry paths let you explore everything without setup:

| Button | What it does |
|---|---|
| Start as Learner | Full onboarding then language select |
| Skip to App Demo | Pre-seeds a believable mid-progress learner state |
| Start Parent Demo | Seeds Daniel + Amara demo data, enables parent mode |

Reset Demo Progress in `/profile` wipes all state and returns to the entry screen.

---

## Content

All Kinyarwanda content is `demo_needs_review` — pending verification by native speakers. Content is labeled clearly throughout the app. See `CONTENT_GUIDE.md` for the contribution workflow.

---

## Deploy to Vercel

Push to `main` — Vercel auto-deploys. No environment variables needed for the demo build. Set `NEXT_PUBLIC_APP_ENV=production` if you want to distinguish environments in future.

---

## Demo limitations

- No real accounts, no backend, no database — localStorage only
- All Kinyarwanda content is unverified demo content
- Audio buttons show "Audio coming soon" — no recordings yet
- Parent/child link is simulated with mock data
- Waitlist submissions are local-state only

See `NEXT_STEPS.md` for the full roadmap.
