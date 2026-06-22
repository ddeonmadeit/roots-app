"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { getLesson } from "@/core/data/index";
import LessonPlayer from "@/components/lesson/LessonPlayer";
import AppButton from "@/components/ui/AppButton";

export default function LessonRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const lesson = getLesson(id);

  if (!lesson) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-4">
        <p className="text-text-secondary text-sm">We couldn&apos;t find that lesson.</p>
        <AppButton onClick={() => router.push("/home")}>Back to home</AppButton>
      </div>
    );
  }

  return <LessonPlayer lesson={lesson} />;
}
