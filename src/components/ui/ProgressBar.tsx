interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  colorClass?: string;
}

export default function ProgressBar({
  value,
  className = "",
  colorClass = "bg-accent",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`w-full h-1.5 bg-border rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full ${colorClass} rounded-full transition-all duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
