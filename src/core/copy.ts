import type { PassiveSpeakerLevel } from "./types";

export const passiveSpeakerReflections: Record<PassiveSpeakerLevel, string> = {
  zero: "Let's start from the very beginning — every word counts.",
  greetings_only: "You know more than you think. Let's build on it.",
  understand_cant_reply: "Today we'll help you answer back, not just understand.",
  speak_a_little: "You've got a foundation. Let's make it stronger.",
  build_confidence: "You already have the words — let's find the confidence.",
};

export const correctFeedback = [
  "Good. That's the elder-safe version.",
  "You're building the reply.",
  "Nice — that's exactly what you'd say.",
  "That's right. Keep going.",
  "Perfect. Grandma would be proud.",
  "You got it.",
  "That's the one.",
];

export const wrongFeedback = [
  "Close — try again.",
  "Almost. Give it another go.",
  "Not quite — try once more.",
  "Take another look.",
];

export const registerFeedback = {
  cousin: "That one works with cousins, but not elders.",
  elder: "Good choice for speaking to an elder.",
  formal: "That's the respectful form — well done.",
};

export const frequencyBandCopy: Record<string, string> = {
  top_25: "You'll hear this constantly in family conversation.",
  top_50: "This comes up all the time in everyday speech.",
  top_100: "A very common word — worth knowing early.",
  top_250: "You'll come across this often.",
  common: "A useful word to have.",
  specialized: "This word unlocks specific conversations.",
};

export function getFrequencyLine(
  band?: string,
  sentenceFrameIds?: string[],
): string | undefined {
  if (!band) return undefined;
  if (sentenceFrameIds && sentenceFrameIds.length > 0 && (band === "top_25" || band === "top_50")) {
    return `This word unlocks ${sentenceFrameIds.length} useful repl${sentenceFrameIds.length === 1 ? "y" : "ies"}.`;
  }
  return frequencyBandCopy[band];
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
