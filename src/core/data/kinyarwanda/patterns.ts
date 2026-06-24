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
    id: "kin-pattern-a",
    languageId: "kinyarwanda",
    name: "The A… Prefix",
    pattern: "A…",
    plainEnglishMeaning: "often points to he / she / them (someone else, not you)",
    explanation:
      "In many common Kinyarwanda words, 'a' at the start often signals that the subject is a third person — he, she, or someone you are talking about. Examples: ashaka (he/she wants), arakoze (he/she has done). Compare the full speaker pattern: ndashaka (I want) → ushaka (you want) → ashaka (he/she wants). Only the beginning changes. This is a useful beginner shortcut; full verb conjugation is richer.",
    examples: [
      {
        word: "ashaka",
        translation: "he/she wants",
        breakdown: [
          { text: "a", meaning: "he / she (subject marker)", type: "prefix" },
          { text: "shaka", meaning: "want / look for", type: "stem" },
        ],
        realLifeContext: "Ashaka amazi — he/she wants water.",
      },
      {
        word: "arakoze",
        translation: "he/she has done",
        breakdown: [
          { text: "a", meaning: "he / she (subject marker)", type: "prefix" },
          { text: "ra", meaning: "action marker", type: "connector" },
          { text: "kore", meaning: "work / do", type: "stem" },
          { text: "ze", meaning: "completed action", type: "suffix" },
        ],
        realLifeContext: "Arakoze neza — he/she did well.",
      },
    ],
    usageNote:
      "Once you know nd- (I), u- (you), and a- (he/she), you can start reading many Kinyarwanda verbs. Same stem, different beginning.",
    exceptionsNote:
      "This is a beginner shortcut. Kinyarwanda subject agreement is richer than nd-/u-/a- alone — it interacts with noun classes. Native-speaker verification is still needed.",
    verificationStatus: "demo_needs_review",
  },
  {
    id: "kin-pattern-ye",
    languageId: "kinyarwanda",
    name: "The -ye / -ze Ending",
    pattern: "…ye / …ze",
    plainEnglishMeaning: "often appears in words about completed actions or something that was done",
    explanation:
      "In many Kinyarwanda words, a -ye or -ze ending often signals that an action has been completed. You have already been using this without knowing it: murakoze (thank you — literally 'you all have done'), nabyibagiriye (I forgot), ndaryiye (I have eaten), waralyiye (have you eaten?). The ending also sometimes marks respect. This is a simplified introduction; full Kinyarwanda verb morphology is richer.",
    examples: [
      {
        word: "murakoze",
        translation: "thank you (literally: you have done)",
        breakdown: [
          { text: "mura", meaning: "you all (subject marker)", type: "prefix" },
          { text: "kore", meaning: "work / do", type: "stem" },
          { text: "ze", meaning: "completed action / done", type: "suffix" },
        ],
        realLifeContext: "You have been saying this all along. Now you see what is inside it.",
      },
      {
        word: "nabyibagiriye",
        translation: "I forgot",
        breakdown: [
          { text: "na", meaning: "I (past marker)", type: "prefix" },
          { text: "byibagiri", meaning: "forget", type: "stem" },
          { text: "ye", meaning: "completed action", type: "suffix" },
        ],
        realLifeContext: "Nabyibagiriye — I forgot. The -ye at the end marks it as something that happened.",
      },
      {
        word: "ndaryiye",
        translation: "I have eaten",
        breakdown: [
          { text: "nda", meaning: "I (action prefix)", type: "prefix" },
          { text: "lyi", meaning: "eat", type: "stem" },
          { text: "ye", meaning: "completed action", type: "suffix" },
        ],
        realLifeContext: "Yego, ndaryiye — Yes, I have eaten. Grandma will ask.",
      },
    ],
    usageNote:
      "Once you spot the -ye/-ze ending, you start noticing past or completed actions. It unlocks the meaning of words you already know.",
    exceptionsNote:
      "The -ye/-ze ending is a useful beginner entry point, not a complete rule. Kinyarwanda tense and aspect are expressed through a system richer than a single suffix. Native-speaker verification is still needed.",
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
