"use client";

import { useRouter } from "next/navigation";
import { useRootsStore } from "@/store/useRootsStore";
import { getLanguages } from "@/core/data/index";
import LanguageCard from "@/components/cards/LanguageCard";
import Screen from "@/components/ui/Screen";

const languages = getLanguages();

export default function LanguagesPage() {
  const router = useRouter();
  const setOnboardingAnswers = useRootsStore((s) => s.setOnboardingAnswers);
  const completeOnboarding = useRootsStore((s) => s.completeOnboarding);
  const hasOnboarded = useRootsStore((s) => s.hasOnboarded);

  function selectKinyarwanda() {
    setOnboardingAnswers({ /* language already defaulted to kinyarwanda in store */ });
    if (!hasOnboarded) completeOnboarding();
    router.push("/home");
  }

  return (
    <Screen>
      <div className="mb-6 pt-2">
        <h1 className="font-display text-3xl font-bold text-text-primary leading-tight">
          Choose your language
        </h1>
        <p className="text-sm text-text-secondary mt-2">
          Kinyarwanda is live. More languages coming soon.
        </p>
      </div>

      <div className="space-y-4">
        {languages.map((lang) => (
          <LanguageCard
            key={lang.id}
            language={lang}
            onSelect={selectKinyarwanda}
            onWaitlist={() => router.push(`/waitlist/${lang.id}`)}
          />
        ))}
      </div>
    </Screen>
  );
}
