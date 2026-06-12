# TEAM_DELEGATION_PLAN.md

# Roots Web MVP — Two-Developer Parallel Work Plan (Hub Model)

This plan splits the build defined in `ROOTS_WEB_BUILD_PLAN.md` between two developers working **simultaneously**, under your two constraints: **(1) only you push to GitHub**, and **(2) his computer holds the full running project, because yours is low on storage.** Phase numbers refer to that document's Section 16.

---

## 1. TL;DR — Who does what

| | **Dev 1 — You** (this machine) | **Dev 2 — Teammate** (main/demo machine) |
|---|---|---|
| **Track** | **Track A — Learning Experiences** | **Track B — App Shell & Dashboards** |
| **Owns** | Lesson engine, all exercise types, Pattern Labs, Phone Call, Story, Texting, Review, Kinyarwanda content data | Design system, navigation, entry/onboarding, language select, waitlist, home, Roots Bank, parent mode, profile |
| **Build plan phases** | Phases **3 → 4**, then half of 6 | Phases **2 → 5**, then half of 6 |
| **GitHub** | ✅ The only one who pushes; owns the repo; merges everything into `main` | ❌ Never pushes. **Pulls only** (pulling is read-only — it is not pushing). Hands finished work to you as patch files |
| **Runs the app locally** | ❌ No `npm install` on your machine — you view your work through Vercel preview links (§3) | ✅ The only machine that runs `npm run dev`; the always-current demo machine |
| **Final say on…** | Product behavior, lesson content, copy/tone | Visual design system, layout, component API |
| **Docs in Phase 6** | ARCHITECTURE.md, CONTENT_GUIDE.md | README.md, NEXT_STEPS.md |

Phases **0–1 are done together in one kickoff session** (Section 6) on **his** machine. The tracks are roughly equal and swappable; the integrator role (applying his patches, merging, pushing) is not — that's structurally yours, since only you push.

Why this split works: Track A and Track B touch **different route folders, component folders, and data files**. The only shared surfaces are the contracts (`core/types.ts`, the store, design tokens, `ui/` components), frozen at kickoff and changed only by agreement.

---

## 2. How the code flows in your setup

```
 Teammate (laptop B)                              You (laptop A)
 full project, runs npm run dev                   slim clone, a few MB, no node_modules
 ──────────────────────────────                   ─────────────────────────────────────
 edits Track B on a local branch,                 edit Track A with Claude Code,
 COMMITS LOCALLY, click-tests it                  commit on a branch
        │                                                │
        │ exports a patch file                           │ git push  (the only pushes
        ▼                                                ▼           in the project)
 drops it in the shared patches folder ───────►  you apply it, review, push
                                                         │
                                                         ▼
                                                  GitHub repo ───► Vercel auto-builds every
                                                  main = demo      push → live preview URL
                                                         │         (this is how YOU see the
                                                         │          app, and how HE reviews
                                                         ▼          your work)
                                          he runs `git pull` → his local files update
```

So your sentence *"changes pushed to GitHub get pushed to his computer"* becomes precisely: **you push to GitHub; he pulls from GitHub.** His machine stays the home of the main running project; GitHub stays the source of truth and the backup; you are the single gatekeeper.

**One honest warning, then we move on.** Until a patch reaches you and you push it, his work exists in exactly one place: his laptop. If that laptop dies mid-week, the unsent work is gone — and you can't see or build on it in the meantime. Two things follow:

1. The patch workflow below is built to keep that window small: small patches, sent at least daily, plus a backup rule (§4 rule 5).
2. Know that the constraint protecting nothing costs nothing to drop: **pushing does not use storage.** He already stores every file — `git push origin his-branch` only *uploads* them. The storage problem in this team is yours, and §3 solves it regardless of who pushes. If he is ever willing to run that one command — to **his own branches only, never `main`** (enforceable with branch protection) — you remain sole owner of `main`, handoffs become instant, his work gets backed up, and every other line of this plan stays identical. Revisit this after your first fiddly patch conflict.

---

## 3. One-time setup (~30 minutes)

**Repo — you:**
1. Create the private GitHub repo (e.g., `roots-app`) and upload `ROOTS_WEB_BUILD_PLAN.md` + this file through the GitHub web UI (zero local storage used). Add your teammate as a **collaborator** — cloning/pulling a *private* repo requires access even though he'll never push. Optionally branch-protect `main`.

**Your slim, low-storage setup — Dev 1:**
2. `git clone <repo-url>`. The *source* of this entire project stays in the single-digit-MB range. The storage monster is `node_modules` (roughly 0.5–1 GB), and you avoid it entirely: **never run `npm install` on your machine.**
3. Because of that, you can't run `npm run dev` locally — so make **Vercel your eyes**: import the GitHub repo into Vercel (free Hobby plan). From then on, every branch you push gets a **live preview URL** and `main` gets the production URL. Your loop: write with Claude Code → push → open the preview link → click-test. He reviews your work from the same link without applying anything.
4. Recommended since you can't build locally: add a GitHub Action running `npm ci && npm run lint && npm run build` on every push (free tier is plenty). Vercel's build already catches compile errors; the Action adds lint and a visible ✅/❌ on each commit.
5. If the slim clone ever feels limiting (or even a few MB is too much), **GitHub Codespaces** gives you a full cloud dev environment — terminal, dev server, and you can install Claude Code inside it — using zero local storage; personal accounts include a free monthly allowance.

**His setup — Dev 2:**
6. Install Node 20+, Git, and Claude Code. `git clone`, `npm install`, `npm run dev` — his machine is the only one running the app locally, which is exactly the "main files live here" role you described.
7. Agree on **one** patch channel: a single shared Drive folder (or one pinned chat) called `patches/`. Patches scattered across three apps is how work gets lost.

**Shared:**
8. GitHub Issues + a simple board (To do / In progress / In review / Done) with labels `track-a` / `track-b`. He can read, comment, and open issues on GitHub freely — only *pushing* is reserved to you.

---

## 4. Workflow rules (the whole agreement)

**His loop — Track B, GitHub read-only:**
1. Start every session synced: `git checkout main && git pull`, then a local branch: `git checkout -b feat/b-onboarding`.
2. Build (Claude Code + hands), **commit locally, small and often** — local commits are free safety and never touch GitHub.
3. Before handing off, re-sync so the patch applies cleanly on your side: `git fetch origin && git rebase origin/main`.
4. Export and deliver: `git format-patch origin/main --stdout > b-onboarding.patch` → drop in the patches folder with a one-line note. **Small patches (one feature), sent at least daily.** Week-old mega-patches are where this model breaks.
5. Backup rule: any local work not yet sent as a patch by end of day gets zipped to Drive/USB (exclude `node_modules` and `.git` — it's a few MB). Or push the branch; see §2.

**Your loop — Track A + integrator:**
6. Your own work: branch off fresh `main` → edit with Claude Code → push the branch → check the **Vercel preview** → merge to `main`.
7. His patches: `git checkout -b feat/b-onboarding && git am path/to/b-onboarding.patch` (`git apply` as fallback). Skim the diff, push the branch, send him the preview URL — he confirms it looks right deployed (he already click-tested locally before exporting), then you merge to `main`. **Apply his patches before starting your own work each session** so integration debt never piles up.
8. Never silently edit inside his patch. If it needs changes, tell him and take a v2 — or add your change as a separate, visible commit. If a patch won't apply, don't wrestle it: he pulls `main`, rebases, re-exports (90% of patch pain is a stale base).

**Both:**
9. `main` is always demo-ready. After every merge, **he pulls** so the demo machine is current, and you both glance at the production URL. Contract files (§5) change only via the agreed protocol, each in its own tiny patch/commit, announced before it exists. If `main` breaks, fixing it outranks all other work.

If a conflict does land: the patch's author pulls `main`, rebases his branch, fixes the markers locally where he can *run* the result, re-exports. Ten-minute event, not a crisis — the ownership map below makes it rare.

---

## 5. Ownership map (who may edit what)

| Area | Path(s) | Owner | Others may change it? |
|---|---|---|---|
| Lesson/Review routes | `src/app/lesson/`, `src/app/review/` | **Dev 1** | only with Dev 1's review |
| Pattern Lab / Call / Story / Texting routes | `src/app/pattern-lab/`, `src/app/call/`, `src/app/story/`, `src/app/texting/` | **Dev 1** | with review |
| Exercise + lesson/call/story components | `src/components/exercises/`, `src/components/lesson/`, `src/components/call/`, `src/components/story/` | **Dev 1** | with review |
| Engines | `src/core/engine/` | **Dev 1** | with review |
| Kinyarwanda content data | `src/core/data/kinyarwanda/` | **Dev 1** | with review |
| Entry / onboarding / languages / waitlist / home / inventory / parent / profile routes + root layout | `src/app/page.tsx`, `src/app/onboarding/`, `src/app/languages/`, `src/app/waitlist/`, `src/app/home/`, `src/app/inventory/`, `src/app/parent/`, `src/app/profile/`, `src/app/layout.tsx` | **Dev 2** | with review |
| Design system + card components | `src/components/ui/`, `src/components/cards/`, `src/app/globals.css`, `src/constants/` | **Dev 2** | with review |
| Languages + demo-user data | `src/core/data/languages.ts`, `src/core/data/demoUsers.ts` | **Dev 2** | with review |
| **CONTRACTS — frozen at kickoff** | `src/core/types.ts`, `src/core/data/index.ts`, `src/store/`, `src/core/copy.ts` | **Joint** (Dev 1 tie-breaks on types/store semantics) | only via: propose in chat → owner makes it as its own tiny commit/patch → both confirm → you push → **he pulls immediately** |
| Docs | `ARCHITECTURE.md`, `CONTENT_GUIDE.md` → Dev 1 · `README.md`, `NEXT_STEPS.md`, `CLAUDE.md` → Dev 2 | split | with review |

Two practical notes on the contract files:

- **`core/data/index.ts`** will need a new export occasionally (e.g., Dev 1 adds `getProverb(id)`). Additive changes are a 5-line commit with a heads-up message — the rule prevents silent *reshaping*, not additions.
- **`components/ui/`** belongs to Dev 2, but Dev 1 consumes it constantly. If Dev 1 needs a variant (say, a danger button), request it or contribute it into `ui/` — never fork a local copy. One design system, no drift.

---

## 6. Kickoff session — do Phases 0–1 together (one sitting, ~2–3 hours, on HIS machine)

His machine is the only one that can `npm install` and run the app, so the kickoff happens there — paired, in person or screen-shared. One person drives Claude Code; both review. This session creates everything both tracks depend on; nobody builds solo until it's in GitHub.

1. Repo already exists with the two plan docs (§3 step 1). He clones it.
2. On a local branch `feat/phase-0-scaffold`, prompt Claude Code:
   > Read ROOTS_WEB_BUILD_PLAN.md in full. Execute **Phase 0 only** (Section 16). Stop when the Phase 0 "Done" condition is met and report.
3. Verify `npm install && npm run dev` works; both click around the themed shell.
4. Same for Phase 1 on `feat/phase-1-contracts`:
   > Read ROOTS_WEB_BUILD_PLAN.md. Execute **Phase 1 only**. Types must match Section 6 exactly; mock data needs final stable IDs even if content is first-pass. Stop at the Phase 1 "Done" condition.
5. **Both of you read `core/types.ts` and the store together, line by line.** This is the contract freeze — speak now or patch later.
6. Get the kickoff into GitHub (pick one):
   - **Easiest — one bootstrap exception while you're sitting together:** he runs `git push origin main` this single time. Done in ten seconds.
   - **Strict version (your rule, no exceptions):** he exports `git format-patch --root --stdout > kickoff.patch` (or zips the project **excluding `node_modules` and `.git`** — a few MB), you apply/commit on your slim clone and push.
7. Connect Vercel to the repo (§3 step 3) and confirm the production URL builds and renders. He runs `git pull` to confirm read access. Create the §7 issues on the board.

From this moment you work in parallel and should rarely touch the same file again.

---

## 7. Parallel tracks & integration milestones

Stub strategy that makes parallelism painless: Phase 1 already created all data and the store, so **Track A builds feature screens reachable by direct URL** (`/lesson/lesson-1`) without waiting for Track B's navigation, and **Track B builds navigation pointing at routes that may still be placeholders**. The tracks meet at the store, which is frozen.

### Milestone 1 — "Walkable shell + first playable lesson"

| Dev 1 (Track A) | Dev 2 (Track B) |
|---|---|
| `ExercisePlayer` + multiple_choice, fill_blank, sentence_builder | Entry `/` + demo seeding actions |
| Word intro card + sentence frame card | Onboarding (4 steps + parent branch hand-off) |
| Lesson player loop + progress bar + completion wired to `completeLesson` | `/languages` (7 cards, exact copy) + `/waitlist/[languageId]` |
| Lesson 0 + Lesson 1 playable via direct URL | `/home` v1 (stats + cards linking out) + `/profile` with reset |

**Integration check:** land both tracks in `main`; from a fresh reset on the production URL **and** his local build: entry → onboarding → languages → home → Lesson 1 → complete it → home stats changed. Fix seams together. *(≈ end of build-plan Phases 2 & 3.)*

### Milestone 2 — "Signature features + Roots Bank"

| Dev 1 (Track A) | Dev 2 (Track B) |
|---|---|
| Remaining exercise types (pattern_noticing, prefix_swap, formal_vs_casual, natural_texting, where_would_you_hear_this, call_response, story_question) | `/inventory` Words tab — categories, search, locked/unlocked, detail modal, kids-mode rules |
| `/pattern-lab/[id]` — both labs, Pattern Bank unlocks | `/inventory` Patterns tab + Save Me Phrases pinned category |
| `/call/grandma-call` — ring → dialogue → completion | `/parent/setup` + `/parent` dashboard + send-challenge flow |
| `/review` weak-words session | BottomNav polish incl. conditional Parent tab; immersive-route nav hiding |

**Integration check:** complete a lesson, miss an answer on purpose → weak word appears on home and in `/review`; words unlocked by Track A appear correctly in Track B's Roots Bank; parent demo fully clickable. *(≈ Phases 4 & 5 underway.)*

### Milestone 3 — "Feature complete"

| Dev 1 (Track A) | Dev 2 (Track B) |
|---|---|
| `/story/grandma-word` + proverb unlock | Inventory ↔ story/proverb display (ProverbCard) |
| `/texting/elder-safe` + 13+ age gating | Passive-speaker home copy variants + Today's Moment logic |
| Lessons 2 & 3 full content (`core/data/kinyarwanda/`) | Empty states, toasts, transitions across shell screens |
| Weak-word + verification-tag consistency pass | Audio "coming soon" interaction consistency pass |

**Integration check:** run the entire Section 15 acceptance list from the build plan together — on his local build, the production URL, and at least one phone browser.

### Milestone 4 — Phase 6 split (polish, docs, ship the link)

- **Dev 1:** copy/tone pass on all learning content (warm, diaspora-specific, zero classroom-generic), exercise feel polish, `ARCHITECTURE.md`, `CONTENT_GUIDE.md`.
- **Dev 2:** visual polish + micro-animations, 360–430px phone QA, accessibility pass, `README.md`, `NEXT_STEPS.md`.
- **You:** confirm the Vercel production deploy of `main`, then send the URL out — "pass the phone around for feedback" becomes "text everyone a link."

---

## 8. Working with Claude Code as a two-person team

Both of you run Claude Code locally (his on the full project; yours on the slim clone or in a Codespace). The rules that keep two AI-assisted devs from trampling each other:

1. **Branch first, always.** Claude Code never runs against `main` — true for local branches too.
2. **Scope every prompt to your ownership area** and name the phase/milestone. The repo's `CLAUDE.md` (template below) reinforces this even when you forget.
3. **Contract lockout:** instruct it explicitly — *"If this task requires changing `src/core/types.ts`, `src/store/`, or `src/core/data/index.ts`, do not change them — list the proposed change and stop."* Route proposals through the §5 contracts protocol.
4. **Review every diff** before committing. You are the author; Claude Code is the typist. (Extra true on your machine, where you can't run the result locally — the diff, the CI check, and the Vercel preview are your three safety nets.)
5. Commit in small, working increments — smaller patches, easier reviews, easier rollbacks.
6. After the other dev's work lands in `main`, pull it — and start a **fresh Claude Code session** (or tell it to re-read changed files) so it isn't reasoning from a stale view of the repo.

Sample scoped prompts:

> **Dev 1, M1:** "Read ROOTS_WEB_BUILD_PLAN.md sections 8, 9.5, 10.1, 10.2, 11.1–11.2, and Phase 3 in section 16. Implement the lesson player and the multiple_choice, fill_blank, and sentence_builder exercises so Lesson 0 and Lesson 1 are playable at /lesson/[id]. Work only inside src/app/lesson, src/app/review, src/components/exercises, src/components/lesson, and src/core/engine. If a contract file needs changes, propose and stop."

> **Dev 2, M1:** "Read ROOTS_WEB_BUILD_PLAN.md sections 5, 9.1–9.4, 9.14, and Phase 2 in section 16. Implement the entry screen, onboarding, languages, waitlist, home v1, and profile. Work only inside src/app/(those routes), src/components/ui, src/components/cards, and src/core/data/languages.ts. If a contract file needs changes, propose and stop."

---

## 9. Daily loop & communication

**His session:** pull `main` → local branch → build → run it, click-test his flow **and** the golden path (entry → Lesson 1 → home stats update) → commit → export patch to the folder → move the issue card.

**Your session:** pull `main` → **apply waiting patches first** (review, push, send him preview links, merge) → then your own branch work → push → check the Vercel preview + CI → merge → tell him to pull.

**Async sync note** (one message a day, 60 seconds): *Merged / In progress / Blocked on / Heads-up for you.* A coming contract change goes in **Heads-up** *before* the patch exists, not after. Patch drops also get a one-liner: what it is, what to click.

Disagreements: Dev 1 decides product/content questions, Dev 2 decides visual/system questions (§1 table), and either can call a 10-minute screen-share instead of a 40-message debate.

---

## 10. Definition of done (checklist before anything merges to `main`)

- `npm run build` + `npm run lint` pass — on his machine for his patches; via CI/Vercel build for your branches
- The author clicked through the changed feature **and** the golden path (entry → Lesson 1 → home stats update) — him locally, you on the preview URL
- The *other* dev looked at it: you review his diff after `git am`; he opens your preview link before you merge
- New screens work at 390px width; buttons have hover/focus states
- All user-visible Kinyarwanda content has correct verification tagging
- No edits to contract files (or the §5 protocol was followed)
- No new dependencies without partner agreement (and note: a new dependency means **he** must `npm install` after pulling — say so in the sync note)

---

## 11. Suggested schedule

Time-boxed loosely; "session" ≈ a focused half-day. With two devs + Claude Code this is roughly a two-week part-time project:

| When | What |
|---|---|
| Session 1 (together, his machine) | Setup (§3) + Kickoff Phases 0–1 (§6) + Vercel connected |
| Sessions 2–4 (parallel) | Milestone 1 + integration check |
| Sessions 5–7 (parallel) | Milestone 2 + integration check |
| Sessions 8–9 (parallel) | Milestone 3 + full acceptance run |
| Session 10 | Milestone 4: polish, docs, production deploy, send the link out |

Tag releases when `main` hits a demo-worthy state: `git tag v0.1-demo && git push --tags` — a known-good version to fall back to before any risky merge.

---

## 12. Appendix A — `CLAUDE.md` template (commit at repo root during Phase 0)

```md
# CLAUDE.md — Roots Web MVP

Heritage-language learning web app (Kinyarwanda-first) for diaspora families.
Full build spec: ROOTS_WEB_BUILD_PLAN.md — read the relevant sections before any task.

## Commands
- npm run dev    # localhost:3000 (only on machines with node_modules installed)
- npm run build  # must pass (locally or in CI) before work is handed off
- npm run lint

## Hard rules
1. src/core/ is platform-agnostic: NO imports from React, Next.js, or browser APIs inside it.
2. NEVER modify src/core/types.ts, src/store/, src/core/data/index.ts, or src/core/copy.ts
   unless the prompt explicitly says so. If a task seems to require it, propose the change and stop.
3. Screens read data only through src/core/data/index.ts — never deep-import mock files.
4. No new dependencies without explicit instruction.
5. All Kinyarwanda content defaults to verificationStatus: "demo_needs_review".
   Never invent etymology, history, or proverbs. Hedge all pattern claims ("often signals…").
6. Stay inside the file areas named in the prompt (ownership map in TEAM_DELEGATION_PLAN.md §5).
7. Interactive screens are client components; localStorage access must be hydration-safe.

## Conventions
- TypeScript strict; Tailwind with the design tokens in globals.css / src/constants — no ad-hoc hex colors.
- Components: PascalCase files; small, composed; reuse src/components/ui primitives.
- Warm, diaspora-specific copy (see core/copy.ts). Never shame-based feedback.
- Commits: feat(scope): message · fix(scope): message
```

---

## 13. Appendix B — Teammate's cheat sheet (the only Git he needs)

```bash
# start of every session
git checkout main && git pull

# new piece of work
git checkout -b feat/b-onboarding

# save progress (do this often)
git add -A && git commit -m "feat(onboarding): step 2 reason selection"

# before handing off — sync with the latest main
git fetch origin && git rebase origin/main

# hand off: creates one file containing all your commits
git format-patch origin/main --stdout > b-onboarding.patch
# → drop the .patch file in the shared patches folder, send a one-liner

# after Dev 1 merges anything
git checkout main && git pull
# (if the sync note mentions a new dependency: npm install)
```

Pull, branch, commit, rebase, format-patch. Five commands, zero pushes. And if one day `git push origin feat/b-onboarding` feels easier than exporting files — it is, it's safe, and `main` stays yours alone (§2).
