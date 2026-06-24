# Roots — Architecture Guide

---

## The `core/` isolation rule

`src/core/` is platform-agnostic. Every file inside it must be pure TypeScript with **zero imports from React, Next.js, the DOM, or browser APIs.** This means a future Expo React Native app can copy `src/core/` unchanged and get the same types, data, engines, and lesson logic.

What lives in `core/`:
- `types.ts` — canonical TypeScript contracts (the single source of truth)
- `data/` — mock data and the data-access boundary
- `engine/` — lesson sequencing, answer checking, pattern rendering, review generation
- `copy.ts` — reusable UI strings (feedback lines, passive-speaker reflections, frequency copy)

What lives outside `core/` and gets rewritten per platform:
- UI components (`src/components/`)
- Routes (`src/app/`)
- State (`src/store/` — Zustand for web; MMKV/AsyncStorage for native later)

---

## Data-access boundary

All reads go through `src/core/data/index.ts`:

```ts
getLanguages()
getLanguage(id)
getLessons(languageId?)
getLesson(id)
getWords(languageId)
getWordsByIds(ids)
getPatterns(languageId)
getScenario(id)
getStory(id)
getTextingLesson(id)
getProverb(id)
```

**Screens never import from individual mock files.** Swapping to Supabase later = reimplementing only this one module.

---

## Lesson engine

`buildLessonSteps(lesson)` converts a `Lesson` into an ordered `LessonStep[]`:

```
intro_panel (×N if any) → word_card (batched) → sentence_frame → exercise (×N) → completion
```

The player renders one step at a time. `LessonPlayer` handles advancing, exit confirmation, completion commit, and weak-word marking.

### Exercise types

| Type | Component | Description |
|---|---|---|
| `multiple_choice` | MultipleChoice | Tappable option cards |
| `fill_blank` | FillBlank | Gapped sentence + option chips |
| `sentence_builder` | SentenceBuilder | Tap-tile word ordering |
| `flashcard` | FlashCard | Flip card — self-reported Got it / Practice more |
| `match_pairs` | MatchPairs | Two-column tap-to-match |
| `call_response` | MultipleChoice | Same UI, call context |
| `story_question` | MultipleChoice | Same UI, story context |
| `pattern_noticing` | MultipleChoice | Pattern recognition prompt |
| `prefix_swap` | MultipleChoice | Change prefix, same stem |
| `formal_vs_casual` | MultipleChoice | Register-choice |
| `natural_texting` | MultipleChoice | Texting register |
| `where_would_you_hear_this` | MultipleChoice | Context/register recognition |

`checkAnswer` handles all types — including element-wise comparison for `match_pairs`.

---

## Pattern Labs

`patternEngine.ts` provides:
- `renderBreakdown(parts)` — wraps prefix/suffix in `**...**` for highlight markers
- `parseHighlightMarks(str)` — splits into `{ text, highlighted }` segments for accent-colored rendering

Pattern data lives in `core/data/kinyarwanda/patterns.ts`. All patterns use hedged wording ("often signals…", never "always") and carry a `demo_needs_review` status.

Current patterns:
- `kin-pattern-nd` — Nd… prefix (I / me / speaker)
- `kin-pattern-u` — U… prefix (you / listener)
- `kin-pattern-a` — A… prefix (he / she / them)
- `kin-pattern-umu` — Umu… prefix (singular person)
- `kin-pattern-aba` — Aba… prefix (plural/group of people)
- `kin-pattern-ye` — …ye/-ze suffix (completed action / past)

---

## Frequency-first content model

Words carry `frequencyRank` and `frequencyBand` (`top_25 | top_50 | top_100 | top_250 | common | specialized`). This data is surfaced as friendly copy via `getFrequencyLine(band, sentenceFrameIds)` in `core/copy.ts` — never shown as raw numbers or rankings.

The teaching order: high-frequency words in real family conversation → practical sentence frames built from those words → the patterns underneath (prefixes, suffixes) → Roots Bank collection.

---

## Audio architecture

Every word and dialogue line supports `AudioMeta` (`audioUrl`, `speakerName`, `dialectOrRegion`, `recordingType`). The shared `AudioButton` component shows a speaker icon — on tap, if there is no `audioUrl`, it shows an "Audio coming soon" tooltip. The metadata shape is already in place for native-speaker recordings to drop in later without schema changes.

---

## State (Zustand store)

`src/store/useRootsStore.ts` — persisted to localStorage under key `roots-demo-v1`.

Key behaviors:
- `completeLesson` is idempotent — safe to call twice
- Streak increments at most once per calendar day (`lastStreakDate` check)
- `markWeakWord` / `clearWeakWord` drive the `/review` flow
- `startLearnerDemo()` pre-seeds a believable mid-progress state
- `startParentDemo()` loads Daniel + Amara data
- `resetDemo()` wipes everything and returns to entry

SSR safety: `useHasHydrated` (based on `useSyncExternalStore`) prevents hydration mismatch between server and client renders.

---

## Future Supabase swap

The data-access boundary (`core/data/index.ts`) is the only thing that changes when moving to Supabase. Future tables map 1:1 to current mock data shapes:

`languages` · `lessons` · `words` · `exercises` · `patterns` · `scenarios` · `stories` · `texting_lessons` · `proverbs` · `users` · `child_profiles` · `parent_child_links` · `user_progress` · `user_word_inventory` · `user_pattern_bank` · `weak_words` · `waitlist` · `audio_assets`

`src/lib/supabasePlaceholder.ts` shows exactly where the Supabase client, env vars, and query functions go.

---

## How to add a new language

1. Create `src/core/data/{languageId}/` with `words.ts`, `lessons.ts`, `patterns.ts`, `scenarios.ts`, `stories.ts`, `texting.ts`, `proverbs.ts`
2. Add the language entry to `src/core/data/languages.ts` with `status: "coming_soon"` first, then `"active"` once content is ready
3. Register the new data files in `src/core/data/index.ts` — the rest of the app picks it up automatically via the data-access boundary

---

## How to add a new exercise type

1. Add the type string to `ExerciseType` in `core/types.ts`
2. Create the component in `src/components/exercises/`
3. Wire it in `ExercisePlayer.tsx` — detect the type, render the component
4. Handle the answer format in `core/engine/answerCheck.ts` if needed
