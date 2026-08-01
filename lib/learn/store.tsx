"use client";

import * as React from "react";

import type { AssignmentStatus, ProgressState } from "./types";
import { findLessonById } from "./curriculum";
import { unlockedAchievements } from "./achievements";
import { toast } from "@/components/ui/toast";

const STORAGE_KEY = "lexora-progress-v1";

const INITIAL: ProgressState = {
  xp: 0,
  completed: [],
  bookmarks: [],
  notes: {},
  recent: [],
  quizHistory: [],
  assignments: {},
  streak: { count: 0, lastDay: "" },
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function load(): ProgressState {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    return { ...INITIAL, ...(JSON.parse(raw) as Partial<ProgressState>) };
  } catch {
    return INITIAL;
  }
}

function touchStreak(s: ProgressState): ProgressState {
  const t = today();
  if (s.streak.lastDay === t) return s;
  const count = s.streak.lastDay === yesterday() ? s.streak.count + 1 : 1;
  return { ...s, streak: { count, lastDay: t } };
}

interface ProgressActions {
  completeLesson: (lessonId: string) => void;
  toggleBookmark: (lessonId: string) => void;
  saveNote: (lessonId: string, text: string) => void;
  visitLesson: (lessonId: string) => void;
  recordQuiz: (lessonId: string, score: number, total: number) => void;
  setAssignment: (assignmentId: string, status: AssignmentStatus) => void;
}

interface ProgressContextValue extends ProgressActions {
  state: ProgressState;
  hydrated: boolean;
}

const ProgressContext = React.createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ProgressState>(INITIAL);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or blocked — progress simply won't persist this session
    }
  }, [state, hydrated]);

  const update = React.useCallback((fn: (s: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = touchStreak(fn(prev));
      const before = unlockedAchievements(prev).length;
      const after = unlockedAchievements(next);
      if (after.length > before) {
        const fresh = after[after.length - 1];
        // fire outside the reducer body's concerns; toast is a plain module fn
        setTimeout(() => {
          toast(`Achievement unlocked: ${fresh.title}`, {
            description: fresh.description,
            variant: "success",
          });
        }, 0);
      }
      return next;
    });
  }, []);

  const actions = React.useMemo<ProgressActions>(
    () => ({
      completeLesson: (lessonId) =>
        update((s) => {
          if (s.completed.includes(lessonId)) return s;
          const ref = findLessonById(lessonId);
          return {
            ...s,
            completed: [...s.completed, lessonId],
            xp: s.xp + (ref?.lesson.xp ?? 0),
          };
        }),
      toggleBookmark: (lessonId) =>
        update((s) => ({
          ...s,
          bookmarks: s.bookmarks.includes(lessonId)
            ? s.bookmarks.filter((b) => b !== lessonId)
            : [...s.bookmarks, lessonId],
        })),
      saveNote: (lessonId, text) =>
        update((s) => ({ ...s, notes: { ...s.notes, [lessonId]: text } })),
      visitLesson: (lessonId) =>
        update((s) => ({
          ...s,
          recent: [
            { lessonId, at: Date.now() },
            ...s.recent.filter((r) => r.lessonId !== lessonId),
          ].slice(0, 8),
        })),
      recordQuiz: (lessonId, score, total) =>
        update((s) => ({
          ...s,
          quizHistory: [{ lessonId, score, total, at: Date.now() }, ...s.quizHistory].slice(0, 50),
          xp: s.xp + score * 10,
        })),
      setAssignment: (assignmentId, status) =>
        update((s) => ({
          ...s,
          assignments: { ...s.assignments, [assignmentId]: status },
        })),
    }),
    [update],
  );

  const value = React.useMemo(
    () => ({ state, hydrated, ...actions }),
    [state, hydrated, actions],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = React.useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}
