import type { Lesson, IntroPanel, Exercise } from "../types";

export type LessonStep =
  | { kind: "intro_panel"; panel: IntroPanel }
  | { kind: "word_card"; wordId: string }
  | { kind: "sentence_frame"; frameId: string }
  | { kind: "exercise"; exercise: Exercise }
  | { kind: "completion" };

/**
 * Converts a Lesson into an ordered list of steps for the player.
 *
 * Sequencing:
 *   intro panels → interleaved [word cards + exercises] → sentence frames → remaining exercises → completion
 *
 * Exercises are interleaved between word batches (every 2–3 words) so the
 * lesson never feels like "flashcards then quiz."
 */
export function buildLessonSteps(lesson: Lesson): LessonStep[] {
  const steps: LessonStep[] = [];

  // 1. Intro panels (lesson 0 history panels, mini interactions embedded)
  for (const panel of lesson.introPanels ?? []) {
    steps.push({ kind: "intro_panel", panel });
  }

  // If this lesson has only intro panels (lesson 0), jump to completion
  if ((lesson.introPanels?.length ?? 0) > 0 && lesson.wordIds.length === 0) {
    steps.push({ kind: "completion" });
    return steps;
  }

  // 2. Partition exercises into those that should be interleaved with words
  //    (pattern_noticing, fill_blank, call_response, multiple_choice early ones)
  //    vs those that follow sentence frames (sentence_builder, prefix_swap, story_question)
  const interleaveTypes = new Set([
    "pattern_noticing",
    "multiple_choice",
    "fill_blank",
    "call_response",
  ]);
  const lateTypes = new Set([
    "sentence_builder",
    "prefix_swap",
    "story_question",
    "natural_texting",
    "formal_vs_casual",
    "where_would_you_hear_this",
  ]);

  const interleaveExercises = lesson.exercises.filter((e) => interleaveTypes.has(e.type));
  const lateExercises = lesson.exercises.filter((e) => lateTypes.has(e.type));

  // 3. Word cards with exercises interleaved every 2–3 words
  const BATCH_SIZE = 2;
  let exIdx = 0;

  for (let i = 0; i < lesson.wordIds.length; i++) {
    steps.push({ kind: "word_card", wordId: lesson.wordIds[i] });

    // Interleave one exercise after each batch
    if ((i + 1) % BATCH_SIZE === 0 && exIdx < interleaveExercises.length) {
      steps.push({ kind: "exercise", exercise: interleaveExercises[exIdx++] });
    }
  }

  // Any remaining interleave exercises
  while (exIdx < interleaveExercises.length) {
    steps.push({ kind: "exercise", exercise: interleaveExercises[exIdx++] });
  }

  // 4. Sentence frames
  for (const frameId of lesson.sentenceFrameIds ?? []) {
    steps.push({ kind: "sentence_frame", frameId });
  }

  // 5. Late exercises (sentence builders, prefix swaps, etc.)
  for (const ex of lateExercises) {
    steps.push({ kind: "exercise", exercise: ex });
  }

  // 6. Completion
  steps.push({ kind: "completion" });

  return steps;
}
