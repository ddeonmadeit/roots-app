"use client";

import { getLessons } from "@/core/data/index";
import { useRootsStore } from "@/store/useRootsStore";
import { useHasHydrated } from "@/store/useHasHydrated";

export default function DebugPage() {
  const hydrated = useHasHydrated();
  const store = useRootsStore();
  const lessons = getLessons("kinyarwanda");

  if (!hydrated) {
    return (
      <div style={{ padding: "2rem", fontFamily: "monospace" }}>
        Loading store…
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", fontSize: "13px", maxWidth: "700px" }}>
      <h1 style={{ fontSize: "18px", marginBottom: "1rem" }}>Phase 1 Debug</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "15px", marginBottom: "0.5rem" }}>Store State</h2>
        <pre style={{ background: "#f4f4f4", padding: "1rem", borderRadius: "8px", overflow: "auto" }}>
          {JSON.stringify(
            {
              hasOnboarded: store.hasOnboarded,
              selectedLanguageId: store.selectedLanguageId,
              streakDays: store.streakDays,
              xp: store.xp,
              completedLessonIds: store.completedLessonIds,
              collectedWordIds: store.collectedWordIds,
              weakWordIds: store.weakWordIds,
              parentMode: store.parentMode,
              lastActivityLabel: store.lastActivityLabel,
            },
            null,
            2,
          )}
        </pre>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "15px", marginBottom: "0.5rem" }}>
          Lessons ({lessons.length})
        </h2>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Title</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Focus</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Words</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Exercises</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Completed</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "6px 8px" }}>{lesson.id}</td>
                <td style={{ padding: "6px 8px" }}>{lesson.title}</td>
                <td style={{ padding: "6px 8px" }}>{lesson.learningFocus ?? "—"}</td>
                <td style={{ padding: "6px 8px" }}>{lesson.wordIds.length}</td>
                <td style={{ padding: "6px 8px" }}>{lesson.exercises.length}</td>
                <td style={{ padding: "6px 8px" }}>
                  {store.completedLessonIds.includes(lesson.id) ? "✓" : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "15px", marginBottom: "0.5rem" }}>Actions</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() =>
              store.completeLesson(
                "lesson-1-grandma",
                [
                  "kin-muraho", "kin-amakuru", "kin-ni-meza", "kin-ndumva",
                  "kin-buhoro", "kin-murakoze", "kin-ndi", "kin-mu-rugo",
                  "kin-ndaza", "kin-vuba", "kin-ndashaka", "kin-ndafite",
                ],
              )
            }
            style={{ padding: "6px 12px", background: "#D2641E", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Complete Lesson 1
          </button>
          <button
            onClick={() => store.startLearnerDemo()}
            style={{ padding: "6px 12px", background: "#4F7A52", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Seed Learner Demo
          </button>
          <button
            onClick={() => store.startParentDemo()}
            style={{ padding: "6px 12px", background: "#6E5938", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Seed Parent Demo
          </button>
          <button
            onClick={() => store.markWeakWord("kin-buhoro")}
            style={{ padding: "6px 12px", background: "#B94A3A", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Mark buhoro weak
          </button>
          <button
            onClick={() => store.clearWeakWord("kin-buhoro")}
            style={{ padding: "6px 12px", background: "#888", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Clear buhoro weak
          </button>
          <button
            onClick={() => store.resetDemo()}
            style={{ padding: "6px 12px", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Reset Demo
          </button>
        </div>
      </section>

      <p style={{ color: "#888", fontSize: "11px" }}>
        Temporary debug page — remove before Phase 6 polish.
      </p>
    </div>
  );
}
