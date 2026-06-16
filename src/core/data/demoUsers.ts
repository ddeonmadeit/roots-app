import type { ChildProfile } from "../types";

export const demoChildProfile: ChildProfile = {
  id: "child-amara",
  parentId: "parent-daniel",
  name: "Amara",
  ageRange: "8-10",
  selectedLanguageId: "kinyarwanda",
  streakDays: 4,
  wordsCollected: 28,
  lessonsCompleted: 5,
  weeklyMinutes: 42,
  weakWordIds: ["kin-buhoro", "kin-ndaza", "kin-murakoze"],
  recentActivity: [
    'Completed "Grandma is Calling"',
    "Practiced 6 Save Me Phrases",
    "Unlocked 3 family words",
  ],
  recommendedNextLessonId: "lesson-2-freeze",
};

export const demoParentName = "Daniel";
