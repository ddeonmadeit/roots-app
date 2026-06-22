"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import type { ChildProfile } from "@/core/types";
import { getLanguages } from "@/core/data/index";
import { useRootsStore } from "@/store/useRootsStore";
import Screen from "@/components/ui/Screen";
import AppButton from "@/components/ui/AppButton";

const AGE_RANGES: ChildProfile["ageRange"][] = ["5-7", "8-10", "11-12", "13+"];

const GOALS = [
  "Speak to grandparents",
  "Learn family words",
  "Prepare for visiting home",
  "Build cultural confidence",
  "General learning",
];

const languages = getLanguages();

export default function ParentSetupPage() {
  const router = useRouter();
  const startParentDemo = useRootsStore((s) => s.startParentDemo);

  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [ageRange, setAgeRange] = useState<ChildProfile["ageRange"]>("8-10");
  const [languageId, setLanguageId] = useState("kinyarwanda");
  const [goal, setGoal] = useState(GOALS[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Seeds the Daniel/Amara demo profile so the dashboard has meaningful data.
    startParentDemo();
    router.push("/parent");
  }

  const inputClass =
    "w-full deboss rounded-2xl px-4 py-3.5 text-sm text-text-primary bg-transparent outline-none focus:ring-1 focus:ring-accent placeholder:text-text-secondary/60";

  return (
    <Screen>
      <div className="mb-6 pt-2">
        <div className="flex items-center gap-2 mb-2 text-accent">
          <Heart size={16} strokeWidth={1.8} />
          <span className="text-[11px] font-semibold uppercase tracking-widest">For parents</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-text-primary leading-tight">
          Set up your child&apos;s learning
        </h1>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">
          A warm window into how they&apos;re reconnecting — so you can encourage and celebrate every word.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Your name">
          <input className={inputClass} placeholder="e.g. Daniel" value={parentName}
            onChange={(e) => setParentName(e.target.value)} />
        </Field>

        <Field label="Child's name">
          <input className={inputClass} placeholder="e.g. Amara" value={childName}
            onChange={(e) => setChildName(e.target.value)} />
        </Field>

        <Field label="Child's age">
          <div className="grid grid-cols-4 gap-2">
            {AGE_RANGES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAgeRange(a)}
                className={`rounded-xl py-2.5 text-xs font-semibold transition-all ${
                  ageRange === a ? "emboss-sm text-accent-dark" : "deboss-sm text-text-secondary"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Language">
          <select className={inputClass} value={languageId} onChange={(e) => setLanguageId(e.target.value)}>
            {languages.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Their goal">
          <select className={inputClass} value={goal} onChange={(e) => setGoal(e.target.value)}>
            {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>

        <div className="deboss rounded-2xl px-4 py-3">
          <p className="text-[11px] text-text-secondary leading-relaxed">
            For this demo, we&apos;ll load a sample learner so you can explore the full dashboard.
          </p>
        </div>

        <div className="pt-1">
          <AppButton type="submit" fullWidth>Open the dashboard</AppButton>
        </div>
      </form>
    </Screen>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}
