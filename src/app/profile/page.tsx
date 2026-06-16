import Screen from "@/components/ui/Screen";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function ProfilePage() {
  return (
    <Screen>
      <div className="mb-7 pt-2">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          Profile
        </h1>
      </div>

      <div className="space-y-3">
        {[
          { label: "Learning", value: "Kinyarwanda" },
          { label: "Demo controls", value: "Available in Phase 2" },
        ].map(({ label, value }) => (
          <div key={label} className="emboss rounded-3xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-1.5">
              {label}
            </p>
            <p className="font-medium text-text-primary">{value}</p>
          </div>
        ))}

        <ThemeToggle />
      </div>

      <div className="deboss rounded-3xl p-5 mt-7">
        <p className="text-xs text-text-secondary leading-relaxed text-center">
          Kinyarwanda demo content is being verified with native speakers.
          Some spellings and phrases may change.
        </p>
      </div>
    </Screen>
  );
}
