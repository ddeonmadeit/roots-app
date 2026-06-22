"use client";

import { useMemo, useState } from "react";
import { Search, Archive, Layers } from "lucide-react";
import type { Word, WordCategory } from "@/core/types";
import { getWords, getPatterns, getLessons } from "@/core/data/index";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import Screen from "@/components/ui/Screen";
import WordCard from "@/components/cards/WordCard";
import PatternCard from "@/components/cards/PatternCard";
import WordDetailModal from "@/components/cards/WordDetailModal";

const LANG = "kinyarwanda";
const allWords = getWords(LANG);
const allPatterns = getPatterns(LANG);
const allLessons = getLessons(LANG);

// Display label override — "Survival Phrases" is the product's "Save Me Phrases".
const CATEGORY_LABEL: Partial<Record<WordCategory, string>> = {
  "Survival Phrases": "Save Me Phrases",
};

// Pinned first, then the rest alphabetically.
const PINNED: WordCategory = "Survival Phrases";

type Tab = "words" | "patterns";
type CatFilter = WordCategory | "all";

export default function InventoryPage() {
  const hydrated = useHasHydrated();
  const collectedWordIds = useRootsStore((s) => s.collectedWordIds);
  const collectedPatternIds = useRootsStore((s) => s.collectedPatternIds);
  const learnerType = useRootsStore((s) => s.learnerType);
  const parentMode = useRootsStore((s) => s.parentMode);
  const childProfile = useRootsStore((s) => s.childProfile);

  const [tab, setTab] = useState<Tab>("words");
  const [category, setCategory] = useState<CatFilter>("all");
  const [query, setQuery] = useState("");
  const [detailWord, setDetailWord] = useState<Word | null>(null);

  const kidsMode =
    learnerType === "child" || (parentMode && !!childProfile && childProfile.ageRange !== "13+");

  // Categories that actually have words, pinned first
  const categories = useMemo<WordCategory[]>(() => {
    const present = Array.from(new Set(allWords.map((w) => w.category)));
    const rest = present.filter((c) => c !== PINNED).sort();
    return present.includes(PINNED) ? [PINNED, ...rest] : rest;
  }, []);

  const filteredWords = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allWords.filter((w) => {
      if (category !== "all" && w.category !== category) return false;
      if (q && !w.word.toLowerCase().includes(q) && !w.translation.toLowerCase().includes(q)) return false;
      return true;
    });
    // Collected first, then locked
    return [...list].sort((a, b) => {
      const ca = collectedWordIds.includes(a.id) ? 0 : 1;
      const cb = collectedWordIds.includes(b.id) ? 0 : 1;
      return ca - cb;
    });
  }, [category, query, collectedWordIds]);

  function lessonForWord(wordId: string) {
    return allLessons.find((l) => l.wordIds.includes(wordId));
  }

  if (!hydrated) {
    return (
      <Screen>
        <div className="h-[60vh] flex items-center justify-center">
          <div className="deboss w-24 h-3 rounded-full opacity-50" />
        </div>
      </Screen>
    );
  }

  const collectedCount = collectedWordIds.length;
  const patternCount = collectedPatternIds.length;

  return (
    <Screen>
      {/* Header */}
      <div className="mb-5 pt-2">
        <h1 className="font-display text-3xl font-bold text-text-primary">Roots Bank</h1>
      </div>

      {/* Stat row */}
      <div className="flex gap-3 mb-5">
        <div className="emboss flex-1 rounded-3xl p-4 text-center">
          <Archive size={18} strokeWidth={1.8} className="text-accent mx-auto mb-2" />
          <div className="font-bold text-text-primary text-xl leading-none">{collectedCount}</div>
          <div className="text-text-secondary text-[11px] mt-1.5">Words collected</div>
        </div>
        <div className="emboss flex-1 rounded-3xl p-4 text-center">
          <Layers size={18} strokeWidth={1.8} className="text-accent mx-auto mb-2" />
          <div className="font-bold text-text-primary text-xl leading-none">{patternCount}</div>
          <div className="text-text-secondary text-[11px] mt-1.5">Patterns noticed</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="deboss rounded-full p-1 flex mb-5">
        {([["words", "Words"], ["patterns", "Patterns I've Noticed"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-full py-2 text-xs font-semibold transition-all ${
              tab === key ? "emboss-sm text-accent-dark" : "text-text-secondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "words" ? (
        <>
          {/* Search */}
          <div className="deboss rounded-2xl px-4 py-2.5 flex items-center gap-2.5 mb-4">
            <Search size={16} strokeWidth={1.8} className="text-text-secondary shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search words"
              className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-secondary/60"
            />
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            <CatChip label="All" active={category === "all"} onClick={() => setCategory("all")} />
            {categories.map((cat) => {
              const total = allWords.filter((w) => w.category === cat).length;
              const got = allWords.filter((w) => w.category === cat && collectedWordIds.includes(w.id)).length;
              return (
                <CatChip
                  key={cat}
                  label={`${CATEGORY_LABEL[cat] ?? cat} ${got}/${total}`}
                  active={category === cat}
                  pinned={cat === PINNED}
                  onClick={() => setCategory(cat)}
                />
              );
            })}
          </div>

          {/* Grid */}
          {filteredWords.length === 0 ? (
            <div className="deboss rounded-3xl p-6 text-center">
              <p className="text-sm text-text-secondary">No words match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredWords.map((w) => (
                <WordCard
                  key={w.id}
                  word={w}
                  locked={!collectedWordIds.includes(w.id)}
                  onTap={setDetailWord}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Patterns tab */
        <div className="space-y-3">
          {allPatterns.map((p) => (
            <PatternCard key={p.id} pattern={p} locked={!collectedPatternIds.includes(p.id)} />
          ))}
        </div>
      )}

      {detailWord && (
        <WordDetailModal
          word={detailWord}
          learnedInLesson={lessonForWord(detailWord.id)}
          kidsMode={kidsMode}
          onClose={() => setDetailWord(null)}
        />
      )}
    </Screen>
  );
}

function CatChip({
  label,
  active,
  pinned,
  onClick,
}: {
  label: string;
  active: boolean;
  pinned?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-all ${
        active ? "emboss-sm text-accent-dark" : "deboss-sm text-text-secondary"
      } ${pinned ? "ring-1 ring-accent/30" : ""}`}
    >
      {label}
    </button>
  );
}
