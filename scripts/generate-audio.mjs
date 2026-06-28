/**
 * Generates Kinyarwanda TTS audio for all caller dialogue lines.
 * Uses facebook/mms-tts-kin via HuggingFace Inference API (free tier).
 *
 * Run: node scripts/generate-audio.mjs
 * Optional: HF_TOKEN=hf_... node scripts/generate-audio.mjs  (faster, higher rate limit)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../public/audio");
const MODEL_URL = "https://api-inference.huggingface.co/models/facebook/mms-tts-kin";

// All family_member lines from both scenarios
const LINES = [
  // grandma-call
  { id: "dl-gc-1",  text: "Muraho! Muraho, murakaza neza!" },
  { id: "dl-gc-3",  text: "Amakuru yawe?" },
  { id: "dl-gc-5",  text: "Uri mu rugo?" },
  { id: "dl-gc-7",  text: "Uzaza ryari?" },
  { id: "dl-gc-9",  text: "Wumvise? Ndakukunda." },
  { id: "dl-gc-11", text: "Nkumva? Nkumva?" },
  { id: "dl-gc-13", text: "Murabeho! Uje vuba." },
  // mama-call
  { id: "dl-mc-1",  text: "Muraho, mwana wanjye! Amakuru?" },
  { id: "dl-mc-3",  text: "Ni meza cyane! Waralyiye?" },
  { id: "dl-mc-5",  text: "Ndi mu rugo. Uzaza ryari?" },
  { id: "dl-mc-7",  text: "Ndakukunda cyane, mwana wanjye." },
  { id: "dl-mc-9",  text: "Murabeho! Uje vuba." },
];

const HEADERS = {
  "Content-Type": "application/json",
  ...(process.env.HF_TOKEN ? { Authorization: `Bearer ${process.env.HF_TOKEN}` } : {}),
};

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generate(id, text, attempt = 1) {
  const filePath = path.join(OUTPUT_DIR, `${id}.wav`);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    process.stdout.write(`  ✓  ${id}.wav  (cached)\n`);
    return true;
  }

  process.stdout.write(`  ↻  ${id}  "${text}" … `);
  try {
    const res = await fetch(MODEL_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ inputs: text }),
    });

    if (res.status === 503) {
      const body = await res.json().catch(() => ({}));
      const wait = Math.ceil((body.estimated_time ?? 20) * 1000);
      process.stdout.write(`model loading, waiting ${(wait / 1000).toFixed(0)}s …\n`);
      await sleep(wait + 1000);
      return generate(id, text, attempt + 1);
    }

    if (res.status === 429) {
      const wait = 15000;
      process.stdout.write(`rate limited, waiting ${wait / 1000}s …\n`);
      await sleep(wait);
      return generate(id, text, attempt);
    }

    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(`HTTP ${res.status}: ${msg}`);
    }

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) throw new Error(`Response too small (${buf.length} bytes) — likely an error`);

    fs.writeFileSync(filePath, buf);
    process.stdout.write(`✓  (${(buf.length / 1024).toFixed(1)} KB)\n`);
    return true;
  } catch (err) {
    if (attempt <= 4) {
      process.stdout.write(`failed (${err.message}), retry ${attempt}/4 …\n`);
      await sleep(4000 * attempt);
      return generate(id, text, attempt + 1);
    }
    process.stdout.write(`✗  FAILED: ${err.message}\n`);
    return false;
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const hasToken = !!process.env.HF_TOKEN;
  console.log(`\n  Roots — Kinyarwanda TTS generator`);
  console.log(`  Model : facebook/mms-tts-kin`);
  console.log(`  Auth  : ${hasToken ? "HF_TOKEN set ✓" : "no token (free tier, may be slow)"}`);
  console.log(`  Output: public/audio/\n`);

  let ok = 0;
  for (const { id, text } of LINES) {
    const success = await generate(id, text);
    if (success) ok++;
    // Small pause between requests to respect rate limits
    await sleep(1200);
  }

  console.log(`\n  Done — ${ok}/${LINES.length} files generated in public/audio/\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
