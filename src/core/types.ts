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
  | "where_would_you_hear_this"
  | "flashcard"
  | "match_pairs";

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
  id: string;
  name: string;
  status: LanguageStatus;
  regionLabel: string;
  description: string;
  teaser?: string;
  learnerCount?: number;
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
  usageNote?: string;
  cultureNote?: string;
  wordStory?: string;
  etymologyNote?: string;
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
  frame: string;
  translationFrame: string;
  slots: string[];
  examples: string[];
  whereYouHearIt: string[];
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
  name: string;
  pattern: string;
  plainEnglishMeaning: string;
  explanation: string;
  examples: PatternExample[];
  usageNote?: string;
  exceptionsNote?: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  options?: string[];
  correctAnswer: string | string[];
  tiles?: string[];
  explanation?: string;
  relatedWordIds?: string[];
}

export type IntroPanel = {
  id: string;
  title: string;
  body: string;
  emoji?: string;
  interaction?: Exercise;
};

export interface Lesson {
  id: string;
  languageId: string;
  title: string;
  subtitle: string;
  momentType: string;
  learningFocus?: "frequency_words" | "sentence_frame" | "pattern_lab"
               | "phone_call" | "story" | "texting" | "history_intro"
               | "flashcard_drill" | "interactive_parable";
  difficulty: "beginner" | "easy" | "medium";
  estimatedMinutes: number;
  introPanels?: IntroPanel[];
  wordIds: string[];
  patternIds?: string[];
  sentenceFrameIds?: string[];
  exercises: Exercise[];
  completionMessage: string;
}

export interface DialogueLine {
  id: string;
  speaker: "family_member" | "user" | "narrator";
  speakerLabel: string;
  text: string;
  translation?: string;
  audio?: AudioMeta;
  responseOptions?: string[];
  responseTiles?: string[];
  correctResponse?: string;
  feedbackRight?: string;
  feedbackWrong?: string;
}

export interface Scenario {
  id: string;
  languageId: string;
  title: string;
  subtitle: string;
  callerName: string;
  scenarioType: "phone_call" | "travel" | "family" | "market" | "community";
  dialogue: DialogueLine[];
  reinforcedWordIds: string[];
  completionMessage: string;
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
  title: string;
  ageMode: "teen_adult" | "all";
  context: "cousin_chat" | "family_group_chat" | "elder_safe_reply";
  incomingMessages: string[];
  exercises: Exercise[];
  verificationStatus: VerificationStatus;
}

export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  ageRange: "5-7" | "8-10" | "11-12" | "13+";
  selectedLanguageId: string;
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
