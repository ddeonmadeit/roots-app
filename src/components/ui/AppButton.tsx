"use client";

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

export default function AppButton({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: AppButtonProps) {
  const base =
    "min-h-[48px] px-7 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40 disabled:cursor-not-allowed";

  const variants: Record<Variant, string> = {
    // Raised bronze pill — embossed, presses in on tap
    primary:
      "emboss-interactive text-accent-dark",

    // Same shape, neutral text
    secondary:
      "emboss-interactive text-text-secondary",

    // Frameless
    ghost:
      "text-text-secondary hover:text-text-primary bg-transparent",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
