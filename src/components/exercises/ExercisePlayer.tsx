"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import type { Exercise } from "@/core/types";
import { checkAnswer } from "@/core/engine/answerCheck";
import { correctFeedback, wrongFeedback, pickRandom } from "@/core/copy";
import AppButton from "@/components/ui/AppButton";
import MultipleChoice from "./MultipleChoice";
import FillBlank from "./FillBlank";
import SentenceBuilder from "./SentenceBuilder";

export type ExerciseStatus = "idle" | "correct" | "wrong";

interface ExercisePlayerProps {
  exercise: Exercise;
  /** Advance the flow. Enabled only once the learner answers correctly. */
  onContinue: () => void;
  /** Fired on each incorrect submission — used to seed weak words. */
  onWrong?: (exercise: Exercise) => void;
  continueLabel?: string;
}

// Tile-based input vs single-option input
const TILE_TYPES = new Set(["sentence_builder"]);
const FILL_TYPES = new Set(["fill_blank"]);

export default function ExercisePlayer({
  exercise,
  onContinue,
  onWrong,
  continueLabel = "Continue",
}: ExercisePlayerProps) {
  const isTile = TILE_TYPES.has(exercise.type);
  const isFill = FILL_TYPES.has(exercise.type);

  const [optionValue, setOptionValue] = useState<string | null>(null);
  const [tileValue, setTileValue] = useState<string[]>([]);
  const [status, setStatus] = useState<ExerciseStatus>("idle");

  // Rotate one piece of feedback copy per submission attempt
  const [feedback, setFeedback] = useState<string>("");

  const hasAnswer = isTile ? tileValue.length > 0 : optionValue !== null;
  const locked = status === "correct";

  const correctText = useMemo(
    () =>
      Array.isArray(exercise.correctAnswer)
        ? exercise.correctAnswer.join(" ")
        : exercise.correctAnswer,
    [exercise.correctAnswer],
  );

  function handleOptionChange(v: string) {
    if (locked) return;
    setOptionValue(v);
    if (status === "wrong") setStatus("idle");
  }

  function handleTileChange(v: string[]) {
    if (locked) return;
    setTileValue(v);
    if (status === "wrong") setStatus("idle");
  }

  function handleCheck() {
    const answer = isTile ? tileValue : (optionValue ?? "");
    const result = checkAnswer(exercise, answer);
    if (result.correct) {
      setStatus("correct");
      setFeedback(pickRandom(correctFeedback));
    } else {
      setStatus("wrong");
      setFeedback(pickRandom(wrongFeedback));
      onWrong?.(exercise);
    }
  }

  return (
    <div className="flex flex-col">
      {/* fill_blank renders the prompt as its own gapped sentence, so skip the heading there */}
      {!isFill && (
        <p className="font-display text-lg font-semibold text-text-primary mb-5 leading-snug">
          {exercise.prompt}
        </p>
      )}

      {/* Input */}
      {isTile ? (
        <SentenceBuilder
          exercise={exercise}
          value={tileValue}
          onChange={handleTileChange}
          status={status}
          disabled={locked}
        />
      ) : isFill ? (
        <FillBlank
          exercise={exercise}
          value={optionValue}
          onChange={handleOptionChange}
          status={status}
          disabled={locked}
        />
      ) : (
        <MultipleChoice
          exercise={exercise}
          value={optionValue}
          onChange={handleOptionChange}
          status={status}
          disabled={locked}
        />
      )}

      {/* Feedback */}
      {status !== "idle" && (
        <div
          className={`deboss rounded-2xl px-4 py-3.5 mt-5 ${
            status === "correct" ? "text-green" : "text-text-primary"
          }`}
        >
          <p className={`text-sm font-semibold ${status === "correct" ? "text-green" : "text-red"}`}>
            {feedback}
          </p>
          {status === "wrong" && exercise.explanation && (
            <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
              {exercise.explanation}
            </p>
          )}
          {status === "correct" && exercise.explanation && (
            <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
              {exercise.explanation}
            </p>
          )}
        </div>
      )}

      {/* Action */}
      <div className="mt-6">
        {status === "correct" ? (
          <AppButton fullWidth onClick={onContinue}>
            {continueLabel}
          </AppButton>
        ) : status === "wrong" ? (
          <AppButton
            fullWidth
            variant="secondary"
            onClick={handleCheck}
            disabled={!hasAnswer}
            className="inline-flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} strokeWidth={2} />
            Try again
          </AppButton>
        ) : (
          <AppButton
            fullWidth
            onClick={handleCheck}
            disabled={!hasAnswer}
            className="inline-flex items-center justify-center gap-2"
          >
            <Check size={16} strokeWidth={2} />
            Check
          </AppButton>
        )}
      </div>

      {/* a11y: keep correct answer text available even when revealed visually */}
      <span className="sr-only" aria-live="polite">
        {status === "correct" ? `Correct. The answer is ${correctText}.` : ""}
      </span>
    </div>
  );
}
