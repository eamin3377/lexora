import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TRACKS, getTrack } from "@/lib/learn/curriculum";
import { TrackOverview } from "@/components/learn/track-overview";

export function generateStaticParams() {
  return TRACKS.map((track) => ({ trackId: track.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackId: string }>;
}): Promise<Metadata> {
  const { trackId } = await params;
  const track = getTrack(trackId);
  return { title: track ? track.title : "Track" };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const { trackId } = await params;
  if (!getTrack(trackId)) notFound();
  return <TrackOverview trackId={trackId} />;
}
