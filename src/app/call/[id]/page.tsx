"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { getScenario, getWordsByIds, getCharacter } from "@/core/data/index";
import { useRootsStore } from "@/store/useRootsStore";
import IncomingCall from "@/components/call/IncomingCall";
import CallDialogue from "@/components/call/CallDialogue";
import CallComplete from "@/components/call/CallComplete";
import AppButton from "@/components/ui/AppButton";

type CallState = "ringing" | "in_call" | "complete";

export default function CallRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const scenario = getScenario(id);
  const character = scenario?.characterId ? getCharacter(scenario.characterId) : undefined;
  const completeScenario = useRootsStore((s) => s.completeScenario);

  const [state, setState] = useState<CallState>("ringing");
  const [declined, setDeclined] = useState(false);

  if (!scenario) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-4">
        <p className="text-text-secondary text-sm">We couldn&apos;t find that call.</p>
        <AppButton onClick={() => router.push("/home")}>Back to home</AppButton>
      </div>
    );
  }

  function handleDecline() {
    setDeclined(true);
    setTimeout(() => router.push("/home"), 1600);
  }

  function handleCallComplete() {
    completeScenario(scenario!.id, scenario!.reinforcedWordIds);
    setState("complete");
  }

  if (declined) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-10 text-center">
        <p className="font-display text-lg text-text-primary leading-relaxed">
          She&apos;ll call back.<br />
          <span className="text-text-secondary text-sm">They always do.</span>
        </p>
      </div>
    );
  }

  if (state === "ringing") {
    return (
      <IncomingCall
        scenario={scenario}
        character={character}
        onAnswer={() => setState("in_call")}
        onDecline={handleDecline}
      />
    );
  }

  if (state === "in_call") {
    return <CallDialogue scenario={scenario} character={character} onComplete={handleCallComplete} />;
  }

  return (
    <CallComplete
      scenario={scenario}
      reinforcedWords={getWordsByIds(scenario.reinforcedWordIds)}
      durationLabel="2:14"
      onDone={() => router.push("/home")}
    />
  );
}
