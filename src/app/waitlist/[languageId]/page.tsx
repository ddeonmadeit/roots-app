"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRootsStore } from "@/store/useRootsStore";
import { getLanguage } from "@/core/data/index";
import Screen from "@/components/ui/Screen";
import AppButton from "@/components/ui/AppButton";
import type { LearningReason } from "@/core/types";

const REASONS: { value: LearningReason; label: string }[] = [
  { value: "family",          label: "To speak with family" },
  { value: "child",           label: "For my child" },
  { value: "culture",         label: "Cultural reconnection" },
  { value: "travel",          label: "Travel" },
  { value: "passive_speaker", label: "I understand but can't reply" },
  { value: "general",         label: "General curiosity" },
];

export default function WaitlistPage() {
  const params = useParams();
  const router = useRouter();
  const joinWaitlist = useRootsStore((s) => s.joinWaitlist);

  const languageId = typeof params.languageId === "string" ? params.languageId : "";
  const language = getLanguage(languageId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<LearningReason>("family");
  const [submitted, setSubmitted] = useState(false);

  if (!language) {
    return (
      <Screen>
        <p className="text-text-secondary text-sm">Language not found.</p>
        <AppButton onClick={() => router.push("/languages")} className="mt-4">Back to languages</AppButton>
      </Screen>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    joinWaitlist({ languageId, name: name.trim(), email: email.trim(), reason });
    setSubmitted(true);
  }

  const inputClass =
    "w-full deboss rounded-2xl px-4 py-3.5 text-sm text-text-primary bg-transparent outline-none focus:ring-1 focus:ring-accent placeholder:text-text-secondary/60 transition-all";

  if (submitted) {
    return (
      <Screen>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-5 px-2">
          <div className="emboss w-16 h-16 rounded-full flex items-center justify-center">
            <span className="text-2xl text-accent font-bold">✓</span>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
              You&apos;re on the list.
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              We&apos;ll let you know when the first {language.name} family lessons are ready.
            </p>
            {language.learnerCount && (
              <p className="text-xs text-accent mt-3">
                {(language.learnerCount + 1).toLocaleString()} people waiting with you.
              </p>
            )}
          </div>
          <AppButton onClick={() => router.push("/languages")} variant="secondary">
            Back to languages
          </AppButton>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-text-secondary text-sm mb-6 flex items-center gap-1 hover:text-text-primary transition-colors"
      >
        ← Back
      </button>

      <div className="mb-6">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-accent mb-2 block">
          Coming soon
        </span>
        <h1 className="font-display text-2xl font-bold text-text-primary leading-tight mb-2">
          {language.name} is coming.
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Join the waitlist and tell us what you want to learn first.
          {language.learnerCount && (
            <span className="text-accent font-medium">
              {" "}{language.learnerCount.toLocaleString()} people already waiting.
            </span>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-1.5 block">
            Your name
          </label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-1.5 block">
            Why do you want to learn?
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as LearningReason)}
            className={inputClass}
          >
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2">
          <AppButton type="submit" fullWidth disabled={!name.trim() || !email.trim()}>
            Join the {language.name} waitlist
          </AppButton>
        </div>
      </form>

      {language.teaser && (
        <div className="deboss rounded-2xl p-4 mt-6 text-center">
          <p className="text-xs text-text-secondary">
            <span className="text-accent font-semibold">You&apos;ll learn first: </span>
            {language.teaser}
          </p>
        </div>
      )}
    </Screen>
  );
}
