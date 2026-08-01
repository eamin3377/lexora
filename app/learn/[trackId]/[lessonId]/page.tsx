import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TRACKS, findLesson, flatLessons } from "@/lib/learn/curriculum";
import { LessonViewer } from "@/components/learn/lesson-viewer";

export function generateStaticParams() {
  return TRACKS.flatMap((track) =>
    flatLessons(track).map((lesson) => ({ trackId: track.id, lessonId: lesson.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackId: string; lessonId: string }>;
}): Promise<Metadata> {
  const { trackId, lessonId } = await params;
  const ref = findLesson(trackId, lessonId);
  return { title: ref ? ref.lesson.title : "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ trackId: string; lessonId: string }>;
}) {
  const { trackId, lessonId } = await params;
  if (!findLesson(trackId, lessonId)) notFound();
  return <LessonViewer trackId={trackId} lessonId={lessonId} />;
}
