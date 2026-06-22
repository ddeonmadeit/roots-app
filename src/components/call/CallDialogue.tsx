"use client";

import { useEffect, useRef, useState } from "react";
import { Languages, Check } from "lucide-react";
import type { Scenario, DialogueLine } from "@/core/types";
import { pickRandom, correctFeedback } from "@/core/copy";
import AudioButton from "@/components/ui/AudioButton";

interface CallDialogueProps {
  scenario: Scenario;
  onComplete: () => void;
}

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

export default function CallDialogue({ scenario, onComplete }: CallDialogueProps) {
  const dialogue = scenario.dialogue;
  const totalUserTurns = dialogue.filter((d) => d.speaker === "user").length;

  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [tiles, setTiles] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ kind: "right" | "wrong"; text: string } | null>(null);
  const [shake, setShake] = useState(false);

  const completedRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // `typing` is derived: the conversation is "typing" whenever the cursor sits on a
  // not-yet-shown family/narrator line (during its delay). No setState-in-effect.
  const typing = index < dialogue.length && dialogue[index]?.speaker !== "user";

  // Drive the conversation: family/narrator lines auto-appear after a delay;
  // user lines pause for a response; past the end, finish the call.
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
      const delay = 650 + Math.floor(Math.random() * 300);
      const t = setTimeout(() => {
        setShown((s) => [...s, index]);
        setIndex((i) => i + 1);
      }, delay);
      return () => clearTimeout(t);
    }
    // user line — wait for answer
  }, [index, dialogue, onComplete]);

  // Auto-scroll as content grows
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [shown.length, typing, feedback]);

  const currentLine: DialogueLine | undefined = dialogue[index];
  const awaitingUser = currentLine?.speaker === "user";
  const answeredUserTurns = Object.keys(answers).length;

  function toggleReveal(id: string) {
    setRevealed((r) => {
      const next = new Set(r);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function resolve(line: DialogueLine, chosen: string) {
    const correct = normalize(chosen) === normalize(line.correctResponse ?? "");
    if (correct) {
      setAnswers((a) => ({ ...a, [line.id]: chosen }));
      setShown((s) => [...s, index]);
      setFeedback({ kind: "right", text: line.feedbackRight ?? pickRandom(correctFeedback) });
      setTiles([]);
      setTimeout(() => setFeedback(null), 1100);
      setIndex((i) => i + 1);
    } else {
      setFeedback({ kind: "wrong", text: line.feedbackWrong ?? "Not quite — try again." });
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <style>{`
        @keyframes msgIn { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:none;} }
        @keyframes dotBlink { 0%,80%,100%{opacity:.3} 40%{opacity:1} }
        @keyframes wrongShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @media (prefers-reduced-motion: reduce){ .msg-in,.shake-x,.typing-dot{animation:none!important} }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border/60">
        <div className="emboss-sm w-10 h-10 rounded-full flex items-center justify-center">
          <span className="font-display font-bold text-accent">{scenario.callerName.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary text-sm leading-tight">{scenario.callerName}</p>
          <p className="text-[11px] text-green">● On call</p>
        </div>
        {/* progress dots */}
        <div className="flex gap-1">
          {Array.from({ length: totalUserTurns }).map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${i < answeredUserTurns ? "bg-accent" : "bg-border"}`}
            />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {shown.map((di) => {
          const line = dialogue[di];
          if (line.speaker === "user") {
            return (
              <div key={line.id} className="flex justify-end msg-in" style={{ animation: "msgIn 0.3s ease-out" }}>
                <div className="emboss-sm rounded-3xl rounded-br-lg px-4 py-2.5 max-w-[78%]">
                  <p className="text-sm text-accent-dark font-medium">{answers[line.id]}</p>
                </div>
              </div>
            );
          }
          // family / narrator
          const isRevealed = revealed.has(line.id);
          return (
            <div key={line.id} className="flex justify-start msg-in" style={{ animation: "msgIn 0.3s ease-out" }}>
              <div className="deboss rounded-3xl rounded-bl-lg px-4 py-3 max-w-[82%]">
                <p className="text-sm text-text-primary leading-relaxed">{line.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <AudioButton audioUrl={line.audio?.audioUrl} size={14} />
                  {line.translation && (
                    <button
                      onClick={() => toggleReveal(line.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-text-secondary hover:text-accent transition-colors"
                    >
                      <Languages size={12} strokeWidth={1.8} />
                      {isRevealed ? "Hide" : "Translate"}
                    </button>
                  )}
                </div>
                {line.translation && isRevealed && (
                  <p className="text-xs text-text-secondary mt-1.5 italic">{line.translation}</p>
                )}
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="flex justify-start">
            <div className="deboss rounded-3xl rounded-bl-lg px-4 py-3.5 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="typing-dot w-2 h-2 rounded-full bg-text-secondary"
                  style={{ animation: `dotBlink 1.2s ease-in-out ${i * 0.18}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Response area */}
      {awaitingUser && currentLine && (
        <div
          className={`px-4 pt-3 pb-6 border-t border-border/60 shake-x`}
          style={shake ? { animation: "wrongShake 0.4s ease-in-out" } : undefined}
        >
          {feedback && (
            <p className={`text-xs mb-3 ${feedback.kind === "right" ? "text-green" : "text-red"}`}>
              {feedback.text}
            </p>
          )}

          {/* Option responses */}
          {currentLine.responseOptions && (
            <div className="space-y-2">
              {currentLine.responseOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => resolve(currentLine, opt)}
                  className="emboss-interactive w-full text-left rounded-2xl px-4 py-3 text-sm text-text-primary"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Tile responses */}
          {currentLine.responseTiles && (
            <TileResponder
              tiles={currentLine.responseTiles}
              built={tiles}
              onChange={setTiles}
              onSend={() => resolve(currentLine, tiles.join(" "))}
            />
          )}
        </div>
      )}
    </div>
  );
}

function TileResponder({
  tiles,
  built,
  onChange,
  onSend,
}: {
  tiles: string[];
  built: string[];
  onChange: (v: string[]) => void;
  onSend: () => void;
}) {
  const used = new Set<number>();
  for (const w of built) {
    const i = tiles.findIndex((t, idx) => t === w && !used.has(idx));
    if (i >= 0) used.add(i);
  }
  return (
    <div className="space-y-3">
      <div className="deboss rounded-2xl min-h-[52px] p-2.5 flex flex-wrap gap-2 items-center">
        {built.length === 0 ? (
          <span className="text-xs text-text-secondary/50 px-1">Tap words to build your reply</span>
        ) : (
          built.map((w, i) => (
            <button
              key={`${w}-${i}`}
              onClick={() => onChange(built.filter((_, j) => j !== i))}
              className="emboss-sm rounded-xl px-3 py-1.5 text-sm text-accent-dark font-medium active:scale-95 transition-transform"
            >
              {w}
            </button>
          ))
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tiles.map((w, i) => (
          <button
            key={`${w}-${i}`}
            disabled={used.has(i)}
            onClick={() => onChange([...built, w])}
            className={`deboss rounded-xl px-3.5 py-2 text-sm text-text-primary transition-all ${used.has(i) ? "opacity-30" : "active:scale-95"}`}
          >
            {w}
          </button>
        ))}
      </div>
      <button
        onClick={onSend}
        disabled={built.length === 0}
        className="emboss-interactive w-full rounded-full py-3 text-sm font-semibold text-accent-dark inline-flex items-center justify-center gap-2 disabled:opacity-40"
      >
        <Check size={16} strokeWidth={2} /> Send
      </button>
    </div>
  );
}
