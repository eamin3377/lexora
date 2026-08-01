export type Accent = "leaf" | "marigold" | "cobalt" | "orchid" | "coral";

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export type LessonBlock =
  | { kind: "p"; text: string }
  | { kind: "code"; lang: string; code: string }
  | { kind: "callout"; tone: "tip" | "warn" | "info"; title: string; text: string }
  | { kind: "list"; items: string[] };

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  xp: number;
  summary: string;
  content: LessonBlock[];
  quiz: QuizQuestion[];
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Track {
  id: string;
  title: string;
  accent: Accent;
  tagline: string;
  description: string;
  chapters: Chapter[];
}

export interface Assignment {
  id: string;
  trackId: string;
  title: string;
  description: string;
  xp: number;
  due: string;
}

export type AssignmentStatus = "todo" | "submitted" | "graded";

export interface QuizRecord {
  lessonId: string;
  score: number;
  total: number;
  at: number;
}

export interface RecentEntry {
  lessonId: string;
  at: number;
}

export interface ProgressState {
  xp: number;
  completed: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  recent: RecentEntry[];
  quizHistory: QuizRecord[];
  assignments: Record<string, AssignmentStatus>;
  streak: { count: number; lastDay: string };
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  accent: Accent;
  icon: string; // lucide icon name key
  check: (s: ProgressState) => boolean;
}
