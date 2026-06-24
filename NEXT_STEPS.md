# Roots — Next Steps

In rough priority order.

---

## 1. Native-speaker content verification

Every Kinyarwanda string is currently `demo_needs_review`. Before sharing with real learners:

- Recruit a native Kinyarwanda speaker (ideally diaspora-familiar) to review all word content, pronunciation guides, usage notes, culture notes, and pattern explanations
- Correct any inaccuracies and move verified content to `verificationStatus: "verified"`
- Record native-speaker audio for top-25 words and the phone-call dialogue lines
- Re-check prefix/suffix pattern explanations with a linguist or fluent speaker

---

## 2. Audio

The app is built for audio from the start — every word and dialogue line has `AudioMeta`. What's needed:

- Native-speaker recordings for all 40+ words (priority: top_25 band first)
- Dialogue recordings for the grandma and mama call scenarios
- Drop-in: set `audioUrl` and `recordingType: "native_recording"` on the relevant data objects — the `AudioButton` picks it up automatically

---

## 3. More content

Lessons:
- Lesson 6: "Visiting Home" — travel vocabulary (airport, taxi, family compound)
- Lesson 7: "At the Table" — food words, sharing a meal with elders
- Lesson 8: "The Family Group Chat" — code-switching, helping parents read English messages

Pattern Labs:
- Pattern Lab 4: "Tense and Time" — deeper into how Kinyarwanda marks past/present/future
- Pattern Lab 5: "The Noun Classes" — a proper (but accessible) intro to Kinyarwanda noun class prefixes

Stories:
- Story 2: "The Proverb Grandma Said" — discovering a proverb through context
- Story 3: "When Papa Called" — a more complex family call, multiple speakers

Phone calls:
- Call 3: "Auntie is calling" — faster, more informal, more code-switching
- Call 4: "The family group call" — multiple voices, harder to follow

---

## 4. Supabase backend

Replace the `core/data/index.ts` mock implementations with Supabase queries. The mock shapes map 1:1 to future tables (see `ARCHITECTURE.md`).

Steps:
- Install `@supabase/supabase-js`
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- Reimplement `getLessons()`, `getWords()`, etc. in `core/data/index.ts` using Supabase queries
- No other files change

---

## 5. Real auth (Supabase)

After backend is live:
- Email magic link or Apple/Google sign-in via Supabase Auth
- User progress synced to `user_progress` table instead of localStorage
- Waitlist connected to a real table + email notification

---

## 6. Real parent/child accounts

The parent/child relationship is currently demo data. With real auth:
- Parent creates account, child creates account
- `parent_child_links` table connects them
- Parent dashboard pulls live data from child's progress
- Send challenge fires a real push notification

---

## 7. More languages

Each new language follows the same content structure. Priority order from waitlist interest:
1. Swahili (largest waitlist, widest reach)
2. Yoruba
3. Igbo
4. Amharic
5. Dinka
6. Acholi

Each language needs a native-speaker content contributor before going live. See `CONTENT_GUIDE.md`.

---

## 8. Expo React Native app

`src/core/` is already platform-agnostic — zero React/Next/DOM imports. The Expo migration path:

- Copy `src/core/` unchanged into the Expo project
- Rewrite routes as React Native screens (Expo Router)
- Replace Zustand `persist` (localStorage) with Zustand + MMKV or AsyncStorage
- Replace `next/font` with Expo font loading
- Replace CSS custom properties + Tailwind with React Native StyleSheet
- UI components will need rewriting; core logic does not

---

## 9. TestFlight / App Store prep

After the Expo app is stable:
- Apple Developer account
- Privacy policy (language learning, no sensitive data until auth ships)
- App Store description and screenshots (the web app frames make this easy)
- App Review: content verification status visible in UI is important for approval

---

## Tasks safe to delegate (to a junior dev or a lighter model)

- Expanding mock data: new words, new exercise variants, new dialogue lines
- Copy variants: more feedback lines for `core/copy.ts`
- New language stubs: creating the folder structure and empty data files for coming-soon languages
- Doc updates: keeping this file and `CONTENT_GUIDE.md` current
- Simple component variants: new card layouts, color theme variants
- Pattern Lab content: once the prefix/suffix methodology is understood, new patterns follow the same template
