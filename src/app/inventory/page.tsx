import Screen from "@/components/ui/Screen";
import { Package, FlaskConical } from "lucide-react";

export default function InventoryPage() {
  return (
    <Screen>
      <div className="mb-7 pt-2">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          Roots Bank
        </h1>
        <p className="text-text-secondary mt-2 text-sm">
          Your collected words and patterns live here.
        </p>
      </div>

      {/* Stat cards — embossed */}
      <div className="flex gap-3 mb-7">
        {[
          { icon: <Package size={22} strokeWidth={1.8} />,      value: "0", label: "Words"    },
          { icon: <FlaskConical size={22} strokeWidth={1.8} />, value: "0", label: "Patterns" },
        ].map(({ icon, value, label }) => (
          <div key={label} className="emboss flex-1 rounded-3xl p-5 text-center">
            <div className="flex justify-center mb-3 text-accent">{icon}</div>
            <div className="font-bold text-text-primary text-2xl leading-none">{value}</div>
            <div className="text-text-secondary text-xs mt-2">{label}</div>
          </div>
        ))}
      </div>

      {/* Empty state — inset */}
      <div className="deboss rounded-3xl p-6">
        <p className="text-text-secondary text-sm text-center">
          Complete lessons to unlock words and patterns.
        </p>
      </div>
    </Screen>
  );
}
