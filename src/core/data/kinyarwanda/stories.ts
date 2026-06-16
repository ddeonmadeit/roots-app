import type { Story } from "../../types";

export const kinyarwandaStories: Story[] = [
  {
    id: "story-grandma-word",
    languageId: "kinyarwanda",
    title: "The Word Grandma Repeated",
    ageMode: "all",
    cultureNote:
      "Language is not just vocabulary — it is memory, family, respect, and pattern. In Rwandan tradition, the way you speak to an elder tells them everything about how you were raised.",
    unlockedWordIds: [
      "kin-muraho",
      "kin-amakuru",
      "kin-murakoze",
    ],
    unlockedProverbId: "proverb-demo-1",
    verificationStatus: "demo_needs_review",
    panels: [
      {
        id: "sp-gw-1",
        text: "Every Saturday, the phone would ring at the same time. The child would hear the voice before picking it up — warm, fast, full of words.",
        translation: undefined,
        highlightedWordIds: [],
      },
      {
        id: "sp-gw-2",
        text: "Grandma always started the same way. 'Muraho! Muraho!' She said it like the word itself was a hug.",
        translation: "Hello! Hello!",
        highlightedWordIds: ["kin-muraho"],
      },
      {
        id: "sp-gw-3",
        text: "Then came the question. It came every call, every time. 'Amakuru?' The child heard it so often, they started to feel it — even before they knew what it meant.",
        translation: "How are you? / What's the news?",
        highlightedWordIds: ["kin-amakuru"],
      },
      {
        id: "sp-gw-4",
        text: "One day, the child tried saying it back. 'Amakuru, nyogokuru?' There was a long pause. Then grandma laughed — the kind of laugh that meant: you did something right.",
        translation: "How are you, grandma?",
        highlightedWordIds: ["kin-amakuru", "kin-nyogokuru"],
        question: {
          id: "ex-story-q1",
          type: "story_question",
          prompt: "Why did grandma laugh when the child said 'amakuru, nyogokuru'?",
          options: [
            "Because the child used the word correctly",
            "Because the child made a mistake",
            "Because grandma did not understand",
            "Because the phone had bad signal",
          ],
          correctAnswer: "Because the child used the word correctly",
          explanation:
            "Grandma's laugh was recognition and pride — the child had used a real word in real context. That is how language comes alive.",
        },
      },
      {
        id: "sp-gw-5",
        text: "After the call, the child wrote it down. Muraho. Amakuru. Murakoze. Three words. But they had started something. A list. A Roots Bank of their own.",
        translation: "Hello. How are you. Thank you.",
        highlightedWordIds: ["kin-muraho", "kin-amakuru", "kin-murakoze"],
      },
      {
        id: "sp-gw-6",
        text: "The next Saturday, grandma called again. 'Muraho!' And this time, without thinking — without freezing — the child said it back.",
        highlightedWordIds: ["kin-muraho"],
      },
      {
        id: "sp-gw-7",
        text: "That is how it starts. Not with fluency. Not with grammar rules. With one word, repeated until it belongs to you.",
        highlightedWordIds: [],
      },
    ],
  },
];
