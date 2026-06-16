"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  // SSR default matches the no-flash script's default (light)
  return false;
}

function setDark(next: boolean) {
  document.documentElement.classList.toggle("dark", next);
  try {
    localStorage.setItem("roots-theme", next ? "dark" : "light");
  } catch {}
  listeners.forEach((l) => l());
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <button
      onClick={() => setDark(!isDark)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="emboss-interactive flex items-center justify-between w-full rounded-3xl p-5"
    >
      <span className="flex flex-col items-start">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-1.5">
          Appearance
        </span>
        <span className="font-medium text-text-primary">
          {isDark ? "Dark" : "Light"} mode
        </span>
      </span>
      <span className="emboss-sm flex items-center justify-center w-11 h-11 rounded-full text-accent">
        {isDark ? <Moon size={18} strokeWidth={1.8} /> : <Sun size={18} strokeWidth={1.8} />}
      </span>
    </button>
  );
}
