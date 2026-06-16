import type { Word, Exercise } from "../types";

/**
 * Builds a review session from weak word IDs.
 * Generates a multiple-choice "What does X mean?" exercise per weak word,
 * with 3 distractor translations drawn from other collected words.
 */
export function buildReviewSession(
  weakWordIds: string[],
  allCollectedWords: Word[],
): Exercise[] {
  if (weakWordIds.length === 0) return [];

  const weakWords = weakWordIds
    .map((id) => allCollectedWords.find((w) => w.id === id))
    .filter(Boolean) as Word[];

  const distractorPool = allCollectedWords.filter(
    (w) => !weakWordIds.includes(w.id),
  );

  return weakWords.map((word) => {
    const distractors = pickDistractors(word.translation, distractorPool, 3);
    const options = shuffle([word.translation, ...distractors]);

    return {
      id: `review-${word.id}-${Date.now()}`,
      type: "multiple_choice" as const,
      prompt: `What does "${word.word}" mean?`,
      options,
      correctAnswer: word.translation,
      explanation: `"${word.word}" means "${word.translation}".${word.usageNote ? ` ${word.usageNote}` : ""}`,
      relatedWordIds: [word.id],
    };
  });
}

function pickDistractors(
  exclude: string,
  pool: Word[],
  count: number,
): string[] {
  const candidates = pool
    .map((w) => w.translation)
    .filter((t) => t !== exclude);

  const shuffled = shuffle(candidates);
  return shuffled.slice(0, count);
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
