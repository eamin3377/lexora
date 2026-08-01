import type { AchievementDef, ProgressState } from "./types";
import { TOTAL_LESSONS, TRACKS, flatLessons } from "./curriculum";

function trackDone(s: ProgressState, trackId: string): boolean {
  const track = TRACKS.find((t) => t.id === trackId);
  if (!track) return false;
  return flatLessons(track).every((l) => s.completed.includes(l.id));
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first-token", title: "First Token", description: "Complete your first lesson.", accent: "leaf", icon: "Sparkles", check: (s) => s.completed.length >= 1 },
  { id: "five-lessons", title: "Warming Up", description: "Complete 5 lessons.", accent: "marigold", icon: "Zap", check: (s) => s.completed.length >= 5 },
  { id: "ten-lessons", title: "Maximal Muncher", description: "Complete 10 lessons.", accent: "cobalt", icon: "Gauge", check: (s) => s.completed.length >= 10 },
  { id: "all-lessons", title: "Full Pipeline", description: `Complete all ${TOTAL_LESSONS} lessons.`, accent: "coral", icon: "Rocket", check: (s) => s.completed.length >= TOTAL_LESSONS },
  { id: "quiz-ace", title: "Quiz Ace", description: "Score 100% on any quiz.", accent: "leaf", icon: "Target", check: (s) => s.quizHistory.some((q) => q.total > 0 && q.score === q.total) },
  { id: "quiz-ten", title: "Table Filler", description: "Take 10 quizzes.", accent: "orchid", icon: "ListChecks", check: (s) => s.quizHistory.length >= 10 },
  { id: "streak-3", title: "Kindling", description: "Reach a 3-day streak.", accent: "marigold", icon: "Flame", check: (s) => s.streak.count >= 3 },
  { id: "streak-7", title: "On Fire", description: "Reach a 7-day streak.", accent: "coral", icon: "Flame", check: (s) => s.streak.count >= 7 },
  { id: "xp-500", title: "Level Up", description: "Earn 500 XP.", accent: "cobalt", icon: "TrendingUp", check: (s) => s.xp >= 500 },
  { id: "xp-1500", title: "Grinder", description: "Earn 1,500 XP.", accent: "orchid", icon: "Trophy", check: (s) => s.xp >= 1500 },
  { id: "bookworm", title: "Bookworm", description: "Bookmark 3 lessons.", accent: "leaf", icon: "Bookmark", check: (s) => s.bookmarks.length >= 3 },
  { id: "scribe", title: "Scribe", description: "Write notes on 3 lessons.", accent: "marigold", icon: "PenLine", check: (s) => Object.values(s.notes).filter((n) => n.trim()).length >= 3 },
  { id: "track-foundations", title: "Automaton Whisperer", description: "Finish the Foundations track.", accent: "leaf", icon: "Award", check: (s) => trackDone(s, "foundations") },
  { id: "track-lexical", title: "Certified Scanner", description: "Finish the Lexical Analysis track.", accent: "marigold", icon: "Award", check: (s) => trackDone(s, "lexical") },
  { id: "track-syntax", title: "Grammar Judge", description: "Finish the Syntax & Parsing track.", accent: "cobalt", icon: "Award", check: (s) => trackDone(s, "syntax") },
  { id: "track-semantics", title: "Type Theorist", description: "Finish the Semantics & IR track.", accent: "orchid", icon: "Award", check: (s) => trackDone(s, "semantics") },
  { id: "track-backend", title: "Code Generator", description: "Finish the Optimization & Codegen track.", accent: "coral", icon: "Award", check: (s) => trackDone(s, "backend") },
  { id: "assignment-first", title: "Shipped It", description: "Submit your first assignment.", accent: "cobalt", icon: "Send", check: (s) => Object.values(s.assignments).some((a) => a !== "todo") },
];

export function unlockedAchievements(s: ProgressState): AchievementDef[] {
  return ACHIEVEMENTS.filter((a) => a.check(s));
}

/* ── XP levels ──────────────────────────────────────────────── */

export const LEVELS = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000];

export function levelFor(xp: number): { level: number; into: number; span: number; pct: number } {
  let level = 1;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i]) {
      level = i + 1;
      break;
    }
  }
  const floor = LEVELS[level - 1];
  const ceil = LEVELS[level] ?? floor + 1500;
  const span = ceil - floor;
  const into = xp - floor;
  return { level, into, span, pct: Math.min(100, Math.round((into / span) * 100)) };
}
