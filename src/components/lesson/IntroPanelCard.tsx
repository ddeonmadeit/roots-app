"use client";

import type { IntroPanel } from "@/core/types";
import AppButton from "@/components/ui/AppButton";
import VerificationTag from "@/components/ui/VerificationTag";
import ExercisePlayer from "@/components/exercises/ExercisePlayer";

interface IntroPanelCardProps {
  panel: IntroPanel;
  onContinue: () => void;
}

export default function IntroPanelCard({ panel, onContinue }: IntroPanelCardProps) {
  const hasInteraction = !!panel.interaction;

  return (
    <div className="flex flex-col">
      <div className="emboss rounded-[1.75rem] p-7 mb-5">
        <h2 className="font-display text-2xl font-bold text-text-primary leading-tight mb-4">
          {panel.title}
        </h2>
        <p className="text-[15px] text-text-secondary leading-relaxed">{panel.body}</p>

        {/* History-simplified verification note */}
        <div className="mt-5 flex justify-center">
          <VerificationTag />
        </div>
      </div>

      {hasInteraction ? (
        <div className="emboss-sm rounded-[1.75rem] p-5">
          <ExercisePlayer
            exercise={panel.interaction!}
            onContinue={onContinue}
            continueLabel="Continue →"
          />
        </div>
      ) : (
        <AppButton fullWidth onClick={onContinue}>
          Continue →
        </AppButton>
      )}
    </div>
  );
}
