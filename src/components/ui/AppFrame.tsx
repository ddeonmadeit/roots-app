import BottomNav from "./BottomNav";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: "var(--desktop-backdrop)" }}>
      <div
        className="mx-auto w-full max-w-[430px] h-dvh flex flex-col relative"
        style={{
          backgroundColor: "var(--background)",
          // Respect notch insets on the sides (landscape / curved displays)
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {/* Scrollable content — vertical breathing room on top of the
            notch / home-bar safe-area insets */}
        <div
          className="flex-1 overflow-y-auto pb-32"
          style={{
            paddingTop: "calc(env(safe-area-inset-top) + 1.5rem)",
          }}
        >
          {children}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
