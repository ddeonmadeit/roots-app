"use client";

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  /** "raised" (default) sits proud of the surface; "inset" is pressed in */
  variant?: "raised" | "inset";
}

export default function AppCard({
  children,
  className = "",
  onClick,
  variant = "raised",
}: AppCardProps) {
  const base = "rounded-[1.75rem] p-5";
  const surface = onClick
    ? "emboss-interactive cursor-pointer"
    : variant === "inset"
      ? "deboss"
      : "emboss";

  return (
    <div
      className={`${base} ${surface} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); }
          : undefined
      }
    >
      {children}
    </div>
  );
}
