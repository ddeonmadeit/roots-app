"use client";

import type { Exercise } from "@/core/types";
import type { ExerciseStatus } from "./ExercisePlayer";

interface FillBlankProps {
  exercise: Exercise;
  value: string | null;
  onChange: (value: string) => void;
  status: ExerciseStatus;
  disabled: boolean;
}

export default function FillBlank({
  exercise,
  value,
  onChange,
  status,
  disabled,
}: FillBlankProps) {
  // Split the prompt on the blank marker so we can render the gap inline.
  const [before, after] = exercise.prompt.includes("___")
    ? splitOnce(exercise.prompt, "___")
    : [exercise.prompt, ""];

  const filled = value ?? "";

  return (
    <div className="space-y-5">
      {/* Sentence with the gap */}
      <div className="deboss rounded-2xl px-5 py-5 text-center">
        <p className="text-lg leading-relaxed text-text-primary">
          {before}
          <span
            className={`inline-flex min-w-[64px] justify-center mx-1 px-2 pb-0.5 border-b-2 align-baseline ${
              filled
                ? status === "correct"
                  ? "text-green border-green"
                  : status === "wrong"
                  ? "text-red border-red"
                  : "text-accent-dark border-accent"
                : "text-text-secondary/40 border-text-secondary/40"
            }`}
          >
            {filled || "   "}
          </span>
          {after}
        </p>
      </div>

      {/* Option chips */}
      <div className="flex flex-wrap gap-2.5 justify-center">
        {(exercise.options ?? []).map((option) => {
          const isSelected = value === option;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option)}
              aria-pressed={isSelected}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-150 ${
                isSelected ? "emboss text-accent-dark" : "deboss text-text-primary"
              } ${disabled && !isSelected ? "opacity-50" : ""}`}
              style={
                isSelected
                  ? { boxShadow: "3px 3px 7px var(--shadow-dark), -3px -3px 7px var(--shadow-light), inset 0 0 8px 1px rgba(232,146,76,0.22)" }
                  : undefined
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function splitOnce(s: string, sep: string): [string, string] {
  const i = s.indexOf(sep);
  return [s.slice(0, i), s.slice(i + sep.length)];
}
