import type { TextingLesson } from "../../types";

export const kinyarwandaTextingLessons: TextingLesson[] = [
  {
    id: "texting-cousin-talk",
    languageId: "kinyarwanda",
    title: "Elder-Safe vs Cousin Talk",
    ageMode: "teen_adult",
    context: "family_group_chat",
    incomingMessages: [
      "Muraho! Amakuru? Wowe?",
      "Uzaza ryari? Twakwitezeye!",
      "Murakoze cyane. Baje bose.",
      "Murabeho! Uje vuba.",
    ],
    exercises: [
      {
        id: "ex-tx-1",
        type: "formal_vs_casual",
        prompt: "Your cousin texts: 'Amakuru bro?' — What is the best reply to send back in the family group chat (elders are watching)?",
        options: [
          "Ni meza, murakoze. Nawe?",
          "All good, what's good?",
          "bro I'm good lol",
        ],
        correctAnswer: "Ni meza, murakoze. Nawe?",
        explanation:
          "In a family group chat with elders present, the respectful form keeps everyone comfortable. That one works with cousins, but not elders.",
        relatedWordIds: ["kin-ni-meza", "kin-murakoze"],
      },
      {
        id: "ex-tx-2",
        type: "natural_texting",
        prompt: "Your cousin texts you privately: 'Amakuru coz??' — What is the most natural reply just between you two?",
        options: [
          "Ni meza cyane! Nawe?",
          "Amakuru yawe, nyogokuru.",
          "Mwaramutse, cousin.",
        ],
        correctAnswer: "Ni meza cyane! Nawe?",
        explanation:
          "Between cousins, more casual energy is fine. 'Cyane' adds emphasis — very well! That one works with cousins, but not elders.",
        relatedWordIds: ["kin-ni-meza"],
      },
      {
        id: "ex-tx-3",
        type: "formal_vs_casual",
        prompt: "Someone from grandma's generation texts the group: 'Murabeho bonye.' What does this moment call for?",
        options: [
          "Reply with 'Murabeho!' respectfully",
          "Just react with a heart emoji",
          "Reply in English",
        ],
        correctAnswer: "Reply with 'Murabeho!' respectfully",
        explanation:
          "Murabeho — a respectful goodbye. Matching the register shows care. Even a short reply in Kinyarwanda means a lot.",
        relatedWordIds: ["kin-murabeho"],
      },
      {
        id: "ex-tx-4",
        type: "where_would_you_hear_this",
        prompt: "Which phrase would you use with an elder, not a cousin?",
        options: [
          "Mwaramutse (good morning — respectful form)",
          "amakuru coz",
          "all good, hbu",
          "lol muraho",
        ],
        correctAnswer: "Mwaramutse (good morning — respectful form)",
        explanation:
          "The formal greeting shows respect for the elder's relationship. Casual slang belongs in private cousin chats.",
        relatedWordIds: ["kin-mwaramutse"],
      },
    ],
    verificationStatus: "demo_needs_review",
  },
];
