@AGENTS.md

# Roots — Kinyarwanda-First Web MVP

## Commands
- `npm run dev` — start dev server at http://localhost:3000
- `npm run build` — production build + type check
- `npm run lint` — ESLint

## Stack
- **Next.js 16** (App Router, `src/` dir, `@/*` alias), React 19, TypeScript
- **Tailwind CSS v4** — no tailwind.config file; extend via `@theme inline` in `globals.css`
- **Zustand v5** with `persist` middleware (localStorage key: `roots-demo-v1`)
- **lucide-react** for icons
- **next/font/local**: BraunLinear (`--font-braun`) — used for both `font-display` and `font-sans`. Files in `public/fonts/`. Weights: 100 Thin, 300 Light, 400 Regular, 500 Medium, 700 Bold.

## Architecture Rule — `core/` isolation
`src/core/` must contain **zero** imports from React, Next.js, the DOM, or browser APIs.
Pure TypeScript only: types, mock data, engines, pure helpers.
A future Expo app can copy `src/core/` unchanged.

## Data Access Boundary
All data reads go through `src/core/data/index.ts` (e.g. `getLesson(id)`, `getWordsByIds(ids)`).
Screens must **never** deep-import individual mock files.
Swapping to Supabase later = reimplementing only this one module.

## Design System — Neumorphic cream (soft UI)
Defined as CSS custom properties in `src/app/globals.css`, mirrored in `src/constants/colors.ts`.
- **Base:** warm cream (`--background` and `--surface` are the SAME color `#EBE7DD` — essential for soft UI).
- **Accent:** warm bronze `--accent` `#94774B` (+ `--accent-dark`, `--accent-soft`).
- **Sculpting:** every element is shaped by the shadow pair `--shadow-light` (top-left highlight) + `--shadow-dark` (bottom-right shadow). No flat borders, no glassmorphism, no dark mode, no gradients.
- **Helper classes (use these, don't hand-roll shadows):**
  - `.emboss` / `.emboss-sm` / `.emboss-lg` — raised, sits proud of the surface
  - `.deboss` / `.deboss-sm` — pressed into the surface (selected states, insets, empty states)
  - `.emboss-interactive` — raised, presses in (inset) on `:active` — use for all buttons/tappable cards
- Generous rounding (`rounded-3xl` / `rounded-[1.75rem]` / `rounded-full`).
- Icons: lucide, `strokeWidth` 1.8–2.2. **No emoji, ever.**
Fonts: `font-display` and `font-sans` both = BraunLinear.

## Conventions
- All interactive / state-reading screens: `"use client"` directive
- Hydration guard: render a skeleton until Zustand `persist` has hydrated (`useHasHydrated`)
- Components live in `src/components/` — not inside `src/app/`
- No component libraries (no shadcn, no MUI) — custom components only
- No `framer-motion` unless a specific interaction genuinely needs it
- All Kinyarwanda content is `demo_needs_review` unless explicitly marked verified

## File Ownership (from TEAM_DELEGATION_PLAN.md)
- **Track A**: `src/core/`, lesson/exercise engine, `/lesson`, `/call`, `/story`, `/pattern-lab`, `/texting`, `/review`
- **Track B**: `/`, `/onboarding`, `/languages`, `/waitlist`, `/home`, `/inventory`, `/parent`, `/profile`

## Phase Status
- ✅ Phase 0 — Scaffold & theme (AppFrame, BottomNav, UI shells, design tokens, fonts)
- ⬜ Phase 1 — Contracts (types, mock data, engines, store)
- ⬜ Phase 2 — Shell & navigation
- ⬜ Phase 3 — Lesson engine & exercises
- ⬜ Phase 4 — Signature experiences (call, story, pattern-lab, texting)
- ⬜ Phase 5 — Roots Bank & Parent mode
- ⬜ Phase 6 — Content fill, polish, deploy-readiness

## Verification Rule
Never invent etymology. Never claim a grammar pattern is 100% consistent.
Pattern explanations must use hedged wording: "often signals…", "in many common words…"
Show `VerificationTag` wherever `demo_needs_review` content appears prominently.
