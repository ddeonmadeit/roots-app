"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, HelpCircle, X, Check } from "lucide-react";
import type { Scenario, DialogueLine } from "@/core/types";
import type { Character } from "@/core/types";
import { pickRandom, correctFeedback } from "@/core/copy";
import CharacterPortrait from "@/components/characters/CharacterPortrait";

interface CallDialogueProps {
  scenario: Scenario;
  character?: Character;
  onComplete: () => void;
}

const normalize = (s: string) =>
  s.trim().toLowerCase().replace(/[!?.,"']/g, "").replace(/\s+/g, " ");

// Word-overlap fuzzy match: returns the best matching option or null
function fuzzyMatch(transcript: string, options: string[]): string | null {
  const tWords = new Set(normalize(transcript).split(" ").filter(Boolean));
  let best: string | null = null;
  let bestScore = 0;
  for (const opt of options) {
    const oWords = normalize(opt).split(" ").filter(Boolean);
    const overlap = oWords.filter((w) => tWords.has(w)).length;
    const score = overlap / Math.max(oWords.length, 1);
    if (score > bestScore && score >= 0.45) {
      bestScore = score;
      best = opt;
    }
  }
  return best;
}

type UserState = "mic" | "listening" | "choosing";

export default function CallDialogue({ scenario, character, onComplete }: CallDialogueProps) {
  const dialogue = scenario.dialogue;
  const totalUserTurns = dialogue.filter((d) => d.speaker === "user").length;

  const themeHex    = character?.themeHex  ?? "#94774B";
  const ringRgba    = character?.ringRgba  ?? "rgba(148,119,75,0.38)";
  const washRgba    = character?.washRgba  ?? "rgba(148,119,75,0.11)";
  const characterId = character?.id ?? "nyogokuru";
  // Grandma → higher pitch; general fallback → neutral
  const synthPitch  = characterId === "nyogokuru" ? 1.25
                    : characterId === "mama"       ? 1.15
                    : 1.0;

  const washLight = washRgba.replace(/[\d.]+\)$/, "0.18)");
  const ringLight = ringRgba.replace(/[\d.]+\)$/, "0.18)");
  const ringPulse = ringRgba.replace(/[\d.]+\)$/, "0.22)");

  const [index, setIndex]         = useState(0);
  const [shown, setShown]         = useState<number[]>([]);
  const [answers, setAnswers]     = useState<Record<string, string>>({});
  const [tiles, setTiles]         = useState<string[]>([]);
  const [feedback, setFeedback]   = useState<{ kind: "right" | "wrong"; text: string } | null>(null);
  const [shake, setShake]         = useState(false);
  const [userState, setUserState] = useState<UserState>("mic");
  const [helpOpen, setHelpOpen]   = useState(false);
  const [elapsed, setElapsed]     = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const completedRef       = useRef(false);
  const audioRef           = useRef<HTMLAudioElement | null>(null);
  const recognitionRef     = useRef<{ stop: () => void; abort: () => void } | null>(null);
  const lastCallerIdRef    = useRef<string | null>(null);
  const playStopTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  // TTS cache: lineId → blob URL (fetched from /api/tts on mount)
  const audioCacheRef      = useRef<Map<string, string>>(new Map());
  const fetchPromisesRef   = useRef<Map<string, Promise<string | null>>>(new Map());

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const seconds = (elapsed % 60).toString().padStart(2, "0");

  // ── Derived state ──────────────────────────────────────────────────────────
  // "typing" = next line is a caller line waiting in its delay before appearing
  const typing = index < dialogue.length && dialogue[index]?.speaker !== "user";
  // Waveform shows while the caller's delay is running OR while audio is playing
  const showWaveform = typing || isPlaying;

  const lastCallerLine = useMemo(() => {
    for (let i = shown.length - 1; i >= 0; i--) {
      const line = dialogue[shown[i]];
      if (line.speaker === "family_member" || line.speaker === "narrator") return line;
    }
    return null;
  }, [shown, dialogue]);

  // ── TTS helpers (defined before effects that use them) ──────────────────────

  // Fetch authentic Kinyarwanda audio from /api/tts, cache as blob URL
  function fetchTTS(lineId: string, text: string): Promise<string | null> {
    const cached = audioCacheRef.current.get(lineId);
    if (cached) return Promise.resolve(cached);
    const inflight = fetchPromisesRef.current.get(lineId);
    if (inflight) return inflight;

    const promise = fetch(`/api/tts?text=${encodeURIComponent(text)}`)
      .then(async (res) => {
        if (!res.ok) return null;
        const url = URL.createObjectURL(await res.blob());
        audioCacheRef.current.set(lineId, url);
        return url;
      })
      .catch(() => null);

    fetchPromisesRef.current.set(lineId, promise);
    return promise;
  }

  // Web Speech fallback: speaks text using the device's built-in TTS
  function tryWebSpeech(text: string, fallbackMs: number, onDone: () => void) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      playStopTimerRef.current = setTimeout(onDone, fallbackMs);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = "rw-RW";
    utterance.rate  = 0.80;
    utterance.pitch = synthPitch;
    utterance.onend   = onDone;
    utterance.onerror = () => { playStopTimerRef.current = setTimeout(onDone, fallbackMs); };
    playStopTimerRef.current = setTimeout(onDone, fallbackMs + 3000); // Safari safety cap
    window.speechSynthesis.speak(utterance);
  }

  // ── Pre-fetch all caller lines the moment the dialogue mounts ─────────────
  useEffect(() => {
    const callerLines = dialogue.filter(
      (l) => l.speaker === "family_member" || l.speaker === "narrator"
    );
    for (const line of callerLines) fetchTTS(line.id, line.text);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Speak caller line when it first appears in `shown` ────────────────────
  useEffect(() => {
    if (!lastCallerLine) return;
    if (lastCallerLine.id === lastCallerIdRef.current) return;
    lastCallerIdRef.current = lastCallerLine.id;

    if (playStopTimerRef.current) clearTimeout(playStopTimerRef.current);
    setIsPlaying(true);

    let cancelled = false;
    let audioStarted = false;

    const text = lastCallerLine.text;
    const lineId = lastCallerLine.id;
    // Estimate duration for fallback timing (60 ms per char, 1.8 s minimum)
    const estimatedMs = Math.max(1800, text.replace(/[^a-zA-Z ]/g, "").length * 60);

    const stopPlaying = () => {
      if (!cancelled) setIsPlaying(false);
      if (playStopTimerRef.current) clearTimeout(playStopTimerRef.current);
    };

    function playUrl(url: string) {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = stopPlaying;
      audio.onerror = () => { if (!cancelled) tryWebSpeech(text, estimatedMs, stopPlaying); };
      playStopTimerRef.current = setTimeout(stopPlaying, estimatedMs + 5000);
      audio.play().catch(() => { if (!cancelled) tryWebSpeech(text, estimatedMs, stopPlaying); });
    }

    // After 4 s, fall back to Web Speech so the call never stalls (e.g. first HF warm-up)
    const fallbackTimer = setTimeout(() => {
      if (cancelled || audioStarted) return;
      audioStarted = true;
      tryWebSpeech(text, estimatedMs, stopPlaying);
    }, 4000);

    fetchTTS(lineId, text).then((url) => {
      clearTimeout(fallbackTimer);
      if (cancelled || audioStarted) return; // Web Speech already started
      audioStarted = true;
      if (url) { playUrl(url); } else { tryWebSpeech(text, estimatedMs, stopPlaying); }
    });

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      audioRef.current?.pause();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
      if (playStopTimerRef.current) clearTimeout(playStopTimerRef.current);
    };
  }, [lastCallerLine?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    const blobCache = audioCacheRef.current;
    return () => {
      audioRef.current?.pause();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
      recognitionRef.current?.abort();
      if (playStopTimerRef.current) clearTimeout(playStopTimerRef.current);
      for (const url of blobCache.values()) URL.revokeObjectURL(url);
    };
  }, []);

  // ── Conversation driver ───────────────────────────────────────────────────
  useEffect(() => {
    if (index >= dialogue.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        const t = setTimeout(onComplete, 700);
        return () => clearTimeout(t);
      }
      return;
    }
    const line = dialogue[index];
    if (line.speaker === "family_member" || line.speaker === "narrator") {
      // Short pre-play pause when audio/synthesis will play; longer for silent text
      const delay = 350;
      const t = setTimeout(() => {
        setShown((s) => [...s, index]);
        setIndex((i) => i + 1);
        setUserState("mic");
      }, delay);
      return () => clearTimeout(t);
    }
    // user line — wait
  }, [index, dialogue, onComplete]);

  const currentLine        = dialogue[index] as DialogueLine | undefined;
  const awaitingUser       = currentLine?.speaker === "user";
  const hasTiles           = Boolean(currentLine?.responseTiles);
  const answeredUserTurns  = Object.keys(answers).length;

  // ── Resolve a user answer ─────────────────────────────────────────────────
  function resolve(line: DialogueLine, chosen: string) {
    const correct = normalize(chosen) === normalize(line.correctResponse ?? "");
    if (correct) {
      recognitionRef.current?.abort();
      setAnswers((a) => ({ ...a, [line.id]: chosen }));
      setShown((s) => [...s, index]);
      setFeedback({ kind: "right", text: line.feedbackRight ?? pickRandom(correctFeedback) });
      setTiles([]);
      setUserState("mic");
      setTimeout(() => setFeedback(null), 1200);
      setIndex((i) => i + 1);
    } else {
      setFeedback({ kind: "wrong", text: line.feedbackWrong ?? "Not quite — try again." });
      setShake(true);
      setTimeout(() => { setShake(false); setFeedback(null); }, 1000);
    }
  }

  // ── Mic tap → start speech recognition ───────────────────────────────────
  function handleMicTap() {
    if (!currentLine) return;
    if (hasTiles) { setUserState("choosing"); return; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type SRConstructor = new () => { lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number; onresult: ((e: any) => void) | null; onspeechend: (() => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void; stop: () => void; abort: () => void; };
    const SR =
      (typeof window !== "undefined" &&
        ((window as unknown as { SpeechRecognition?: SRConstructor }).SpeechRecognition ||
         (window as unknown as { webkitSpeechRecognition?: SRConstructor }).webkitSpeechRecognition)) as SRConstructor | false;

    if (!SR) { setUserState("choosing"); return; }

    let speechDetected = false;
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = "rw-RW";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    recognition.onresult = (event) => {
      speechDetected = true;
      const transcripts: string[] = [];
      for (let i = 0; i < event.results[0].length; i++) {
        transcripts.push(event.results[0][i].transcript);
      }
      const opts = currentLine.responseOptions ?? [];
      for (const t of transcripts) {
        const match = fuzzyMatch(t, opts);
        if (match) { resolve(currentLine, match); return; }
      }
      // No confident match — show text options
      setUserState("choosing");
    };

    recognition.onspeechend = () => recognition.stop();

    recognition.onerror = () => setUserState("choosing");

    recognition.onend = () => {
      if (!speechDetected) setUserState("choosing");
    };

    try {
      recognition.start();
      setUserState("listening");
    } catch {
      setUserState("choosing");
    }
  }

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col min-h-dvh relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <style>{`
        @keyframes waveBar {
          0%   { height: 5px;  opacity: 0.30; }
          100% { height: 32px; opacity: 1;    }
        }
        @keyframes micIdle {
          0%, 100% { box-shadow: 6px 6px 16px var(--shadow-dark), -6px -6px 16px var(--shadow-light); }
          50%       { box-shadow: 6px 6px 16px var(--shadow-dark), -6px -6px 16px var(--shadow-light), 0 0 0 18px ${ringPulse}; }
        }
        @keyframes micActive {
          0%, 100% { box-shadow: 6px 6px 16px var(--shadow-dark), -6px -6px 16px var(--shadow-light), 0 0 0 8px rgba(220,50,50,0.16); }
          50%       { box-shadow: 6px 6px 16px var(--shadow-dark), -6px -6px 16px var(--shadow-light), 0 0 0 22px rgba(220,50,50,0.08); }
        }
        @keyframes wrongShake {
          0%,100% { transform: translateX(0); }
          25%     { transform: translateX(-7px); }
          75%     { transform: translateX(7px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes callBubbleIn {
          from { opacity: 0; transform: scale(0.97) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
      `}</style>

      {/* Colour halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 100% 52% at 50% 0%, ${washLight} 0%, transparent 70%)`, zIndex: 0 }}
        aria-hidden="true"
      />

      {/* ── Header ── */}
      <div className="relative flex items-center px-5 pt-12 pb-3" style={{ zIndex: 1 }}>
        <div className="flex-1 text-center">
          <p className="font-display font-bold text-text-primary text-lg leading-tight">{scenario.callerName}</p>
          <p className="text-xs mt-0.5" style={{ color: "#4CAF50" }}>{minutes}:{seconds}</p>
        </div>
        <div className="absolute right-5 flex gap-1.5">
          {Array.from({ length: totalUserTurns }).map((_, i) => (
            <span key={i} className="w-2 h-2 rounded-full"
              style={{ background: i < answeredUserTurns ? themeHex : "var(--shadow-dark)" }} />
          ))}
        </div>
      </div>

      {/* ── Portrait medallion ── */}
      <div className="relative flex justify-center pt-2 pb-5" style={{ zIndex: 1 }}>
        <div
          className="relative flex items-end justify-center rounded-full overflow-hidden"
          style={{
            width: 130, height: 130,
            background: washLight,
            boxShadow: `5px 5px 14px var(--shadow-dark), -5px -5px 14px var(--shadow-light), inset 0 0 18px 0 ${ringLight}`,
          }}
        >
          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)" }}>
            <CharacterPortrait characterId={characterId} size={122} />
          </div>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="relative flex-1 flex flex-col items-center px-6 gap-5" style={{ zIndex: 1 }}>

        {/* Waveform: caller delay OR audio playing */}
        {showWaveform && (
          <div className="flex flex-col items-center gap-3" style={{ animation: "fadeUp 0.3s ease-out" }}>
            <div className="flex items-center gap-1.5" style={{ height: 42 }}>
              {[0.7, 1.1, 0.5, 1.35, 0.6, 1.0, 0.8].map((mult, i) => (
                <div key={i} style={{
                  width: 5, borderRadius: 3, background: themeHex, height: 5,
                  animation: `waveBar ${0.5 + mult * 0.28}s ease-in-out ${i * 0.115}s infinite alternate`,
                }} />
              ))}
            </div>
            <p className="text-xs text-text-secondary tracking-wide">Speaking…</p>
          </div>
        )}

        {/* Voice bubble — last caller line, shows once audio ends */}
        {!showWaveform && lastCallerLine && !feedback && (
          <div
            className="deboss rounded-[1.5rem] px-5 py-4 w-full max-w-xs text-center"
            style={{ animation: "callBubbleIn 0.35s ease-out" }}
          >
            <p className="text-base text-text-primary leading-relaxed">
              &ldquo;{lastCallerLine.text}&rdquo;
            </p>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <p className="text-sm font-medium text-center px-4" style={{
            color: feedback.kind === "right" ? "#4CAF50" : "var(--red)",
            animation: "fadeUp 0.2s ease-out",
          }}>
            {feedback.text}
          </p>
        )}

        {/* User turn */}
        {awaitingUser && currentLine && !feedback && (
          <div
            className="w-full flex flex-col items-center gap-4"
            style={shake ? { animation: "wrongShake 0.45s ease-in-out" } : undefined}
          >
            {/* Tile responses — show directly, no mic step */}
            {hasTiles && (
              <TileResponder
                tiles={currentLine.responseTiles!}
                built={tiles}
                onChange={setTiles}
                onSend={() => resolve(currentLine, tiles.join(" "))}
                themeHex={themeHex}
              />
            )}

            {/* Option responses: mic → listening → options */}
            {!hasTiles && userState === "mic" && (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">Your turn</p>
                <button
                  onClick={handleMicTap}
                  className="rounded-full flex items-center justify-center active:opacity-70 transition-opacity"
                  style={{ width: 80, height: 80, color: themeHex, background: "var(--surface)", animation: "micIdle 2s ease-in-out infinite" }}
                  aria-label="Tap to speak"
                >
                  <Mic size={32} strokeWidth={1.8} />
                </button>
                <p className="text-xs text-text-secondary">Tap to speak</p>
              </>
            )}

            {!hasTiles && userState === "listening" && (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">Listening…</p>
                <button
                  onClick={() => { recognitionRef.current?.abort(); setUserState("choosing"); }}
                  className="rounded-full flex items-center justify-center"
                  style={{ width: 80, height: 80, color: "#DC3232", background: "var(--surface)", animation: "micActive 1s ease-in-out infinite" }}
                  aria-label="Stop listening"
                >
                  <Mic size={32} strokeWidth={1.8} />
                </button>
                <p className="text-xs" style={{ color: "#DC3232" }}>Speak in Kinyarwanda</p>
              </>
            )}

            {!hasTiles && userState === "choosing" && (
              <div className="w-full space-y-2.5" style={{ animation: "fadeUp 0.25s ease-out" }}>
                {currentLine.responseOptions?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => resolve(currentLine, opt)}
                    className="emboss-interactive w-full text-left rounded-2xl px-4 py-3.5 text-sm text-text-primary"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Help button ── */}
      <div className="relative flex justify-center pb-8 pt-4" style={{ zIndex: 1 }}>
        <button
          onClick={() => setHelpOpen(true)}
          className="deboss-sm rounded-full px-5 py-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-secondary"
        >
          <HelpCircle size={14} strokeWidth={1.8} />
          Help
        </button>
      </div>

      {helpOpen && (
        <HelpSheet
          callerLine={lastCallerLine ?? undefined}
          userLine={awaitingUser ? currentLine : undefined}
          onClose={() => setHelpOpen(false)}
        />
      )}
    </div>
  );
}

// ── Help sheet ─────────────────────────────────────────────────────────────────

function HelpSheet({ callerLine, userLine, onClose }: {
  callerLine?: DialogueLine;
  userLine?: DialogueLine;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 flex flex-col justify-end"
      style={{ zIndex: 50, background: "rgba(0,0,0,0.22)" }}
      onClick={onClose}
    >
      <div
        className="rounded-t-[1.75rem] px-6 pt-5 pb-10 space-y-5"
        style={{ background: "var(--surface)", boxShadow: "0 -6px 28px var(--shadow-dark)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Help</p>
          <button onClick={onClose} className="text-text-secondary" aria-label="Close help"><X size={18} strokeWidth={1.8} /></button>
        </div>

        {callerLine && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">What they said</p>
            <p className="text-base font-medium text-text-primary">&ldquo;{callerLine.text}&rdquo;</p>
            {callerLine.translation && <p className="text-sm text-text-secondary italic">{callerLine.translation}</p>}
          </div>
        )}

        {userLine?.responseOptions && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">You could say</p>
            {userLine.responseOptions.map((opt, i) => (
              <div key={i} className="deboss rounded-xl px-3.5 py-2.5">
                <p className="text-sm text-text-primary">{opt}</p>
              </div>
            ))}
          </div>
        )}

        {userLine?.responseTiles && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">Build your reply</p>
            <div className="flex flex-wrap gap-2">
              {userLine.responseTiles.map((t, i) => (
                <span key={i} className="deboss-sm rounded-lg px-3 py-1.5 text-xs text-text-primary">{t}</span>
              ))}
            </div>
            <p className="text-xs text-text-secondary mt-1">Answer: &ldquo;{userLine.correctResponse}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tile responder ────────────────────────────────────────────────────────────

function TileResponder({ tiles, built, onChange, onSend, themeHex }: {
  tiles: string[];
  built: string[];
  onChange: (v: string[]) => void;
  onSend: () => void;
  themeHex: string;
}) {
  const used = new Set<number>();
  for (const w of built) {
    const i = tiles.findIndex((t, idx) => t === w && !used.has(idx));
    if (i >= 0) used.add(i);
  }

  return (
    <div className="w-full space-y-3">
      <div className="deboss rounded-2xl min-h-[52px] p-2.5 flex flex-wrap gap-2 items-center">
        {built.length === 0
          ? <span className="text-xs text-text-secondary/50 px-1">Tap words to build your reply</span>
          : built.map((w, i) => (
              <button key={`${w}-${i}`} onClick={() => onChange(built.filter((_, j) => j !== i))}
                className="emboss-sm rounded-xl px-3 py-1.5 text-sm font-medium active:scale-95 transition-transform"
                style={{ color: themeHex }}>
                {w}
              </button>
            ))
        }
      </div>
      <div className="flex flex-wrap gap-2">
        {tiles.map((w, i) => (
          <button key={`${w}-${i}`} disabled={used.has(i)} onClick={() => onChange([...built, w])}
            className={`deboss rounded-xl px-3.5 py-2 text-sm text-text-primary transition-all ${used.has(i) ? "opacity-30" : "active:scale-95"}`}>
            {w}
          </button>
        ))}
      </div>
      <button onClick={onSend} disabled={built.length === 0}
        className="emboss-interactive w-full rounded-full py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-40"
        style={{ color: themeHex }}>
        <Check size={16} strokeWidth={2} /> Send
      </button>
    </div>
  );
}
