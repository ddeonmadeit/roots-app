import type { Exercise } from "../types";

export interface AnswerResult {
  correct: boolean;
  explanation?: string;
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Checks a user answer against the exercise's correctAnswer.
 * - string answers: normalized case/whitespace comparison
 * - string[] answers (sentence_builder): joined with single space, then normalized
 * - tiles already joined before passing in for sentence_builder
 */
export function checkAnswer(
  exercise: Exercise,
  userAnswer: string | string[],
): AnswerResult {
  const { correctAnswer, explanation } = exercise;

  // match_pairs: element-wise comparison (user submits string[] parallel to options)
  if (exercise.type === "match_pairs" && Array.isArray(correctAnswer)) {
    const userArr = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
    const correct =
      userArr.length === correctAnswer.length &&
      userArr.every((u, i) => normalize(u) === normalize(correctAnswer[i]));
    return { correct, explanation: correct ? undefined : explanation };
  }

  // Sentence builder: user submits string[]
  if (Array.isArray(correctAnswer)) {
    const userStr = Array.isArray(userAnswer)
      ? userAnswer.join(" ")
      : (userAnswer as string);
    const correctStr = correctAnswer.join(" ");
    const correct = normalize(userStr) === normalize(correctStr);
    return { correct, explanation: correct ? undefined : explanation };
  }

  // All other types: single string answer
  const userStr = Array.isArray(userAnswer) ? userAnswer.join(" ") : userAnswer;
  const correct = normalize(userStr) === normalize(correctAnswer);
  return { correct, explanation: correct ? undefined : explanation };
}
