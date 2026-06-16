import type { Pattern } from "../../types";

export const kinyarwandaPatterns: Pattern[] = [
  {
    id: "kin-pattern-nd",
    languageId: "kinyarwanda",
    name: "The Nd… Prefix",
    pattern: "Nd… / Ndi… / Nda…",
    plainEnglishMeaning: "often points to I / me / the speaker in beginner phrases",
    explanation:
      "In many common Kinyarwanda words, 'nd' at the start often signals that the person speaking is the subject — the 'I' of the sentence. Examples: ndashaka (I want), ndumva (I hear), ndaza (I am coming), ndi (I am). This is a useful beginner shortcut. Kinyarwanda verb structure is richer than this — native-speaker verification is still needed.",
    examples: [
      {
        word: "ndashaka",
        translation: "I want",
        breakdown: [
          { text: "nda", meaning: "I (action prefix)", type: "prefix" },
          { text: "shaka", meaning: "want / look for", type: "stem" },
        ],
        realLifeContext: "Ndashaka amazi — I want water.",
      },
      {
        word: "ndumva",
        translation: "I hear / I understand",
        breakdown: [
          { text: "nd", meaning: "I / me (speaker)", type: "prefix" },
          { text: "umva", meaning: "hear / understand", type: "stem" },
        ],
        realLifeContext: "Ndumva gato — I understand a little.",
      },
      {
        word: "ndaza",
        translation: "I am coming",
        breakdown: [
          { text: "nda", meaning: "I (action prefix)", type: "prefix" },
          { text: "za", meaning: "come", type: "stem" },
        ],
        realLifeContext: "Ndaza vuba — I am coming soon.",
      },
      {
        word: "ndi",
        translation: "I am",
        breakdown: [
          { text: "nd", meaning: "I / me (speaker)", type: "prefix" },
          { text: "i", meaning: "am / be", type: "stem" },
        ],
        realLifeContext: "Ndi mu rugo — I am at home.",
      },
    ],
    usageNote:
      "Once you notice this pattern, you start reading new words differently — even before you know what they mean.",
    exceptionsNote:
      "This is a useful beginner shortcut, not a complete rule. Kinyarwanda has a rich system of verb prefixes that go beyond 'nd'. Native-speaker verification is still needed before relying on this for full grammar.",
    verificationStatus: "demo_needs_review",
  },
  {
    id: "kin-pattern-u",
    languageId: "kinyarwanda",
    name: "The U… Prefix",
    pattern: "U…",
    plainEnglishMeaning: "often points to you / the listener",
    explanation:
      "In many common Kinyarwanda words, 'u' at the start often shifts the meaning from 'I' to 'you' — from the speaker to the listener. Examples: ushaka (you want), ufite (you have), uri (you are). Compare each with its 'nd' counterpart. This pattern is a useful shortcut, not a complete rule.",
    examples: [
      {
        word: "ushaka",
        translation: "you want",
        breakdown: [
          { text: "u", meaning: "you / the listener", type: "prefix" },
          { text: "shaka", meaning: "want / look for", type: "stem" },
        ],
        realLifeContext: "Compare: ndashaka (I want) → ushaka (you want).",
      },
      {
        word: "ufite",
        translation: "you have",
        breakdown: [
          { text: "u", meaning: "you / the listener", type: "prefix" },
          { text: "fite", meaning: "have", type: "stem" },
        ],
        realLifeContext: "Compare: ndafite (I have) → ufite (you have).",
      },
      {
        word: "uri",
        translation: "you are",
        breakdown: [
          { text: "u", meaning: "you / the listener", type: "prefix" },
          { text: "ri", meaning: "be / are", type: "stem" },
        ],
        realLifeContext: "Compare: ndi (I am) → uri (you are).",
      },
    ],
    exceptionsNote:
      "This pattern often signals 'you' in beginner phrases but is not a complete rule. Kinyarwanda verb prefixes are richer — this is a useful shortcut for getting started. Native-speaker verification is still needed.",
    verificationStatus: "demo_needs_review",
  },
  {
    id: "kin-pattern-umu",
    languageId: "kinyarwanda",
    name: "The Umu… Prefix",
    pattern: "Umu… / Um…",
    plainEnglishMeaning: "often appears in words for one person",
    explanation:
      "The 'umu' prefix (sometimes shortened to 'um') often appears at the start of words for individual people. Examples: umwana (child), umugabo (man), umuhungu (boy), umukobwa (girl). This is one of Kinyarwanda's noun class prefixes — a system that groups words and changes based on number and type. This panel is a simplified introduction only.",
    examples: [
      {
        word: "umwana",
        translation: "child",
        breakdown: [
          { text: "um", meaning: "singular person prefix", type: "prefix" },
          { text: "wana", meaning: "young one / child", type: "stem" },
        ],
        realLifeContext: "Umwana → abana (child → children). The prefix changes.",
      },
      {
        word: "umugabo",
        translation: "man",
        breakdown: [
          { text: "umu", meaning: "singular person prefix", type: "prefix" },
          { text: "gabo", meaning: "man / male", type: "stem" },
        ],
        realLifeContext: "Umugabo → abagabo (man → men).",
      },
    ],
    usageNote:
      "Once you notice 'umu' at the start, you can often guess you are talking about one person.",
    exceptionsNote:
      "Kinyarwanda noun classes are much richer than this introduction. The 'umu' prefix is a beginner entry point only. Native-speaker verification is still needed before relying on this for full noun-class understanding.",
    verificationStatus: "demo_needs_review",
  },
  {
    id: "kin-pattern-aba",
    languageId: "kinyarwanda",
    name: "The Aba… Prefix",
    pattern: "Aba…",
    plainEnglishMeaning: "often appears in words for groups of people",
    explanation:
      "The 'aba' prefix often appears at the start of words when talking about groups of people. It is frequently the plural form of words that use 'umu' in the singular. Examples: umwana (child) → abana (children); umugabo (man) → abagabo (men).",
    examples: [
      {
        word: "abana",
        translation: "children",
        breakdown: [
          { text: "aba", meaning: "plural people prefix", type: "prefix" },
          { text: "na", meaning: "young ones / children", type: "stem" },
        ],
        realLifeContext: "Abana bose — all the children.",
      },
      {
        word: "abagabo",
        translation: "men",
        breakdown: [
          { text: "aba", meaning: "plural people prefix", type: "prefix" },
          { text: "gabo", meaning: "man / male", type: "stem" },
        ],
        realLifeContext: "Abagabo bose — all the men.",
      },
    ],
    exceptionsNote:
      "The 'umu → aba' pattern is a useful beginner shortcut but is not a complete rule for all Kinyarwanda noun classes. Native-speaker verification is still needed.",
    verificationStatus: "demo_needs_review",
  },
];
