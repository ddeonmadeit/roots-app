interface VerificationTagProps {
  className?: string;
}

export default function VerificationTag({ className = "" }: VerificationTagProps) {
  return (
    <span
      className={`inline-block text-[10px] font-medium text-text-secondary border border-border rounded-full px-2.5 py-0.5 ${className}`}
    >
      demo — needs native review
    </span>
  );
}
