"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";

interface AudioButtonProps {
  audioUrl?: string;
  size?: number;
  className?: string;
}

export default function AudioButton({ audioUrl, size = 16, className = "" }: AudioButtonProps) {
  const [pressed, setPressed] = useState(false);

  function handleTap() {
    if (audioUrl) {
      // Phase 6: play real audio
      return;
    }
    setPressed(true);
    setTimeout(() => setPressed(false), 250);
  }

  return (
    <button
      onClick={handleTap}
      aria-label="Play pronunciation"
      title={audioUrl ? "Play" : "Audio coming soon"}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full deboss text-text-secondary transition-all duration-150 ${pressed ? "scale-90 text-accent" : "hover:text-accent"} ${className}`}
    >
      <Volume2 size={size} strokeWidth={1.8} />
    </button>
  );
}
