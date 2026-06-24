# Roots — Content Guide

For language contributors adding or verifying Kinyarwanda content (and future languages).

---

## The golden rule

**Every piece of content must pass this test:** *"When would the user actually use this in real life?"*

No "the duck eats rice." No animal sentences. No classroom vocabulary lists. Every word, phrase, and sentence frame must connect to a moment the diaspora learner will actually experience — a phone call with grandma, a family visit, a group chat, a moment of cultural reconnection.

---

## Verification system

All content has a `verificationStatus` field:

- `"demo_needs_review"` — placeholder or unverified; shown with a VerificationTag in the UI
- `"verified"` — confirmed by a native speaker with the language background

**Every Kinyarwanda string in the current codebase is `demo_needs_review`.** Do not ship content as `"verified"` unless it has been reviewed by someone with fluency in the relevant dialect/region of the language.

---

## Frequency-first methodology

The MVP teaches the most frequently used words in real family conversation first. Not "the apple is red." Not "this is a pen."

When selecting words for a new lesson:
1. Would a diaspora learner hear this in the first 5 minutes of a family call?
2. Can they use this to survive a conversation, buy time, or show they are trying?
3. Does it pair with a sentence frame they can actually say out loud?

Frequency bands in the data model:
- `top_25` — essential survival words; heard constantly
- `top_50` — very common in family and community conversation
- `top_100` — common in daily life
- `top_250` — regular vocabulary
- `common` — useful but not universal
- `specialized` — specific domains (food, market, ceremony, etc.)

Start every new language with `top_25` words. Don't add `specialized` words until the core survival vocabulary is solid.

---

## Writing sentence frames

A sentence frame is a reusable structure with a blank the learner fills in:

```
Ndi ___         (I am ___)
Ndashaka ___    (I want ___)
Ndaza ___       (I am coming ___)
```

Frames must:
- Come from real family conversation
- Have 2–3 concrete example fills (`amazi`, `mu rugo`, `vuba`)
- Include a "where you'd hear this" note that is warm and specific, not academic

Bad: "This is a common sentence pattern used in everyday speech."
Good: "Every grandma call ends here — 'ndaza vuba' is the phrase she is waiting for."

---

## Writing pattern labs (prefixes & suffixes)

Pattern Labs teach the building blocks of the language — how small changes at the start or end of words carry meaning. The Kinyarwanda patterns taught so far:

| Pattern | What it often signals |
|---|---|
| `nd-` / `nda-` | I / me / the speaker |
| `u-` | you / the listener |
| `a-` | he / she / them |
| `umu-` | one person (singular) |
| `aba-` | a group of people (plural) |
| `-ye` / `-ze` | completed action / past context |

Rules for writing pattern content:

1. **Always hedge.** Never say "always" or "every time." Use: "often signals…", "in many common words…", "a useful beginner shortcut", "this is not a complete rule."
2. **Always add an exceptions note.** Be honest about the limits of the shortcut.
3. **Connect to words the learner already knows.** Show the pattern inside existing vocabulary first, then expand.
4. **Never present a shortcut as the full grammar.** Kinyarwanda has a rich noun class and verb conjugation system that goes far beyond these beginner patterns. The app's job is to open the door, not to teach full linguistics.

**Example of correct wording:**
> "In many common Kinyarwanda words, 'nd' at the start often signals that the speaker is the subject — the 'I' of the sentence. This is a useful beginner shortcut. Kinyarwanda verb structure is richer than this — native-speaker verification is still needed."

---

## Writing usage notes and culture notes

`usageNote` — answers "when would you actually use this?" Be specific and warm.

Bad: "Used in formal and informal contexts."
Good: "Say this when grandma speaks too fast and you need her to slow down. It is also used as an encouragement — 'take it easy, step by step.'"

`cultureNote` — only include when there is a genuine cultural layer that helps the learner connect. Never invented, never generic.

Bad: "This word is important in Rwandan culture."
Good: "Asking whether someone has eaten is one of the most common ways of expressing care in Rwandan family culture. When mama says 'waralyiye?', she is really saying 'I love you.'"

---

## Writing completion messages and feedback

**Completion messages** — end of a lesson or call. They should feel earned, not generic:

Bad: "Lesson complete! Great work!"
Good: "You survived the call."
Good: "These phrases will carry you through more conversations than you think."
Good: "Buhoro buhoro. That is how every language opens up."

**Correct feedback** — short, affirming, register-specific when relevant:

Good: "Good. That's the elder-safe version."
Good: "That is exactly what you would say."
Good: "She knows where you are now."

**Wrong feedback** — never shame. Always gentle, always helpful:

Good: "Close — try again."
Good: "Tell her you are well first: Ni meza."
Good: "Build 'I am at home': Ndi mu rugo."

The copy pool lives in `core/copy.ts`.

---

## What never to invent

- **Etymology** — `wordStory` and `etymologyNote` fields on `Word` are blank by default. Only add them when the information is known and verifiable. Never invent a word origin.
- **History** — Lesson 0 history panels are kept simple and emotional. Never make specific historical claims without sourcing.
- **Grammar rules as complete facts** — prefix/suffix patterns are shortcuts, not rules. The exceptions note is required.
- **Proverbs** — use a known proverb or a clearly labeled placeholder. Never present an invented proverb as authentic.

---

## Native-speaker review workflow

Before moving content from `demo_needs_review` to `verified`:

1. A native speaker (or highly fluent speaker of the relevant dialect) reads all text
2. Pronunciation guides are checked against natural speech
3. Usage notes are checked for register accuracy (elder-safe, casual, etc.)
4. Pattern explanations are checked for accuracy and appropriate hedging
5. Culture notes are checked for authenticity
6. Audio is recorded by the native speaker and attached via `audioUrl`

Content that passes review gets `verificationStatus: "verified"`, `verifiedBy: "name/credential"`, and the `VerificationTag` disappears from the UI.

---

## Adding a new language

1. Copy the Kinyarwanda content structure as a template
2. Set all content to `demo_needs_review` immediately — never assume correctness
3. Start with `top_25` frequency words only
4. Write 1–2 lessons before writing Pattern Labs (understand the vocabulary first)
5. Identify a native-speaker collaborator before launching to users
6. Set `status: "coming_soon"` in `languages.ts` until the first lesson is verified
