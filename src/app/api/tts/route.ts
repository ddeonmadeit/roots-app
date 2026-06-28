import { NextRequest, NextResponse } from "next/server";

// Authentic Kinyarwanda TTS via ElevenLabs multilingual v3.
// Runs server-side so the API key stays off the client.
// Each unique phrase is cached in-process — HF fallback removed.

const EL_URL = (voiceId: string) =>
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

// Module-level cache: same text is never synthesized twice per server process
const cache = new Map<string, Buffer>();

function sanitizeForTTS(raw: string): string {
  return raw
    .replace(/!/g, ".")        // exclamations → calm period (stops exaggerated prosody)
    .replace(/\?/g, ".")       // questions → period (prevents upward vowel stretching)
    .replace(/…/g, ",")        // ellipsis → short pause
    .replace(/[–—]/g, ",")     // em/en dash → short pause
    .replace(/["""'']/g, "")   // smart quotes → nothing
    .replace(/\s{2,}/g, " ")   // collapse extra spaces
    .trim();
}

async function synthesize(text: string): Promise<Buffer | null> {
  const clean = sanitizeForTTS(text);
  if (cache.has(clean)) return cache.get(clean)!;

  const apiKey  = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    console.error("[tts] Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local");
    return null;
  }

  let res: Response;
  try {
    res = await fetch(EL_URL(voiceId), {
      method: "POST",
      headers: {
        "xi-api-key":   apiKey,
        "Content-Type": "application/json",
        "Accept":       "audio/mpeg",
      },
      body: JSON.stringify({
        text: clean,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability:        0.55, // slightly more expressive
          similarity_boost: 0.80,
          style:            0.25, // light emotional colouring
          use_speaker_boost: true,
        },
      }),
    });
  } catch (err) {
    console.error("[tts] fetch error:", err);
    return null;
  }

  if (!res.ok) {
    console.error(`[tts] ElevenLabs error ${res.status}:`, await res.text().catch(() => ""));
    return null;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) return null;

  cache.set(clean, buf);
  return buf;
}

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text")?.trim();
  if (!text) return NextResponse.json({ error: "missing ?text=" }, { status: 400 });

  const buf = await synthesize(text);
  if (!buf) return NextResponse.json({ error: "TTS unavailable" }, { status: 503 });

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type":   "audio/mpeg",
      "Content-Length": String(buf.length),
      "Cache-Control":  "public, max-age=31536000, immutable",
    },
  });
}
