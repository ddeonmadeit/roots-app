"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import RootsLogo from "@/components/ui/RootsLogo";
import AppButton from "@/components/ui/AppButton";

export default function EntryPage() {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const hasOnboarded = useRootsStore((s) => s.hasOnboarded);
  const startLearnerDemo = useRootsStore((s) => s.startLearnerDemo);
  const startParentDemo = useRootsStore((s) => s.startParentDemo);

  useEffect(() => {
    if (hydrated && hasOnboarded) router.replace("/home");
  }, [hydrated, hasOnboarded, router]);

  // Show nothing while checking — avoids flash of entry screen for returning users
  if (!hydrated || hasOnboarded) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-10 h-10 opacity-40">
          <RootsLogo size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between px-6 py-16">
      {/* Logo + wordmark */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <RootsLogo size={80} />

        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-text-primary tracking-tight mb-3">
            Roots
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-[260px]">
            Your grandma is calling.<br />
            Let&apos;s make sure you can answer.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <AppButton
          fullWidth
          onClick={() => router.push("/onboarding")}
        >
          Start as Learner
        </AppButton>

        <AppButton
          variant="secondary"
          fullWidth
          onClick={() => {
            startParentDemo();
            router.push("/parent");
          }}
        >
          Start Parent Demo
        </AppButton>

        <AppButton
          variant="ghost"
          fullWidth
          onClick={() => {
            startLearnerDemo();
            router.push("/home");
          }}
        >
          Skip to App Demo
        </AppButton>
      </div>
    </div>
  );
}
