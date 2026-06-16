// Supabase integration placeholder.
//
// When ready to move beyond mock data, replace this file with:
//
//   import { createClient } from "@supabase/supabase-js";
//
//   const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
//
//   export const supabase = createClient(supabaseUrl, supabaseKey);
//
// Then update src/core/data/index.ts so each getter queries Supabase instead
// of returning the local mock arrays.
//
// Future tables (map 1-to-1 with mock data shapes):
//   languages          → Language[]
//   users              → (auth-managed)
//   child_profiles     → ChildProfile[]
//   parent_child_links → { parentId, childId }[]
//   lessons            → Lesson[]
//   words              → Word[]
//   sentence_frames    → SentenceFrame[]
//   patterns           → Pattern[]
//   exercises          → Exercise[]  (embedded in lessons, extracted for reuse)
//   scenarios          → Scenario[]
//   stories            → Story[]
//   texting_lessons    → TextingLesson[]
//   proverbs           → Proverb[]
//   user_progress      → { userId, completedLessonIds, completedScenarioIds, ... }
//   user_word_inventory→ { userId, wordId, collectedAt }[]
//   user_pattern_bank  → { userId, patternId, unlockedAt }[]
//   weak_words         → { userId, wordId }[]
//   waitlist           → WaitlistEntry[]
//   audio_assets       → AudioMeta[] (linked to word/dialogue by foreignKey)
//
// Do NOT install @supabase/supabase-js until this integration is ready.

export {};
