interface ScreenProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}

export default function Screen({
  children,
  className = "",
  padded = true,
}: ScreenProps) {
  return (
    <div className={`${padded ? "px-4 py-6" : ""} ${className}`}>
      {children}
    </div>
  );
}
