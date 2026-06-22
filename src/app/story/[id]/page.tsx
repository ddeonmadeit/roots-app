"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { Word } from "@/core/types";
import { getStory, getWordsByIds, getProverb } from "@/core/data/index";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import ProgressBar from "@/components/ui/ProgressBar";
import AppButton from "@/components/ui/AppButton";
import ExercisePlayer from "@/components/exercises/ExercisePlayer";
import StoryPanelView from "@/components/story/StoryPanelView";
import StoryComplete from "@/components/story/StoryComplete";
import WordPopover from "@/components/story/WordPopover";

export default function StoryRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const hydrated = useHasHydrated();
  const story = getStory(id);

  const completeStory = useRootsStore((s) => s.completeStory);
  const collectedWordIds = useRootsStore((s) => s.collectedWordIds);

  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [popoverWord, setPopoverWord] = useState<Word | null>(null);

  if (!story) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-4">
        <p className="text-text-secondary text-sm">We couldn&apos;t find that story.</p>
        <AppButton onClick={() => router.push("/home")}>Back to home</AppButton>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="deboss w-24 h-3 rounded-full opacity-50" />
      </div>
    );
  }

  if (finished) {
    return (
      <StoryComplete
        story={story}
        unlockedWords={getWordsByIds(story.unlockedWordIds)}
        proverb={story.unlockedProverbId ? getProverb(story.unlockedProverbId) : undefined}
        onDone={() => router.push("/home")}
      />
    );
  }

  const panel = story.panels[index];
  const isLast = index >= story.panels.length - 1;
  const progress = ((index + 1) / story.panels.length) * 100;

  function advance() {
    if (isLast) {
      completeStory(story!.id, story!.unlockedWordIds, story!.unlockedProverbId);
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <div className="flex flex-col min-h-dvh px-5 pb-10">
      {/* Top bar */}
      <div className="flex items-center gap-3 pt-2 pb-6">
        <button
          onClick={() => router.push("/home")}
          aria-label="Close story"
          className="emboss-sm w-9 h-9 rounded-full flex items-center justify-center text-text-secondary shrink-0 active:scale-95 transition-transform"
        >
          <X size={18} strokeWidth={2} />
        </button>
        <div className="flex-1">
          <ProgressBar value={progress} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <StoryPanelView
          key={panel.id}
          panel={panel}
          highlightWords={getWordsByIds(panel.highlightedWordIds ?? [])}
          onWordTap={setPopoverWord}
        />

        {/* Mid-story question or simple continue */}
        <div className="mt-6">
          {panel.question ? (
            <div className="emboss-sm rounded-[1.75rem] p-5">
              <ExercisePlayer
                key={panel.question.id}
                exercise={panel.question}
                onContinue={advance}
                continueLabel={isLast ? "Finish story →" : "Continue →"}
              />
            </div>
          ) : (
            <AppButton fullWidth onClick={advance}>
              {isLast ? "Finish story →" : "Continue →"}
            </AppButton>
          )}
        </div>
      </div>

      {popoverWord && (
        <WordPopover
          word={popoverWord}
          collected={collectedWordIds.includes(popoverWord.id)}
          onClose={() => setPopoverWord(null)}
        />
      )}
    </div>
  );
}
