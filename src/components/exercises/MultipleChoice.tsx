"use client";

import type { Exercise } from "@/core/types";
import type { ExerciseStatus } from "./ExercisePlayer";

interface MultipleChoiceProps {
  exercise: Exercise;
  value: string | null;
  onChange: (value: string) => void;
  status: ExerciseStatus;
  disabled: boolean;
}

export default function MultipleChoice({
  exercise,
  value,
  onChange,
  status,
  disabled,
}: MultipleChoiceProps) {
  const correct = typeof exercise.correctAnswer === "string" ? exercise.correctAnswer : "";

  return (
    <div className="space-y-2.5">
      {(exercise.options ?? []).map((option) => {
        const isSelected = value === option;
        const showCorrect = status === "correct" && isSelected;
        const showWrong = status === "wrong" && isSelected;

        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option)}
            aria-pressed={isSelected}
            className={`w-full text-left rounded-[1.45rem] p-4 transition-all duration-150 ${
              isSelected ? "emboss" : "deboss"
            } ${disabled && !isSelected ? "opacity-50" : ""}`}
            style={
              showCorrect
                ? { boxShadow: "inset 4px 4px 10px var(--shadow-dark), inset -4px -4px 10px var(--shadow-light)", outline: "1.5px solid var(--green)" }
                : showWrong
                ? { outline: "1.5px solid var(--red)" }
                : isSelected
                ? { boxShadow: "4px 4px 10px var(--shadow-dark), -4px -4px 10px var(--shadow-light), inset 0 0 8px 1px rgba(232,146,76,0.22)" }
                : undefined
            }
          >
            <span
              className={`text-sm font-medium ${
                showCorrect
                  ? "text-green"
                  : showWrong
                  ? "text-red"
                  : isSelected
                  ? "text-accent-dark"
                  : "text-text-primary"
              }`}
            >
              {option}
            </span>
          </button>
        );
      })}

      {/* Reveal the correct answer gently once the learner has it right */}
      {status === "correct" && value !== correct && correct && (
        <p className="text-xs text-green text-center pt-1">Answer: {correct}</p>
      )}
    </div>
  );
}
