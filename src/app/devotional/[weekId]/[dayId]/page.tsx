import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDayById, allWeeks } from "@/lib/devotional-service";
import { DevotionalReader } from "@/components/DevotionalReader";

export function generateStaticParams() {
  const paramsList: { weekId: string; dayId: string }[] = [];
  for (const week of allWeeks) {
    for (const day of week.days) {
      paramsList.push({ weekId: week.id, dayId: day.id });
    }
  }
  return paramsList;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ weekId: string; dayId: string }>;
}): Promise<Metadata> {
  const { weekId, dayId } = await params;
  const data = getDayById(weekId, dayId);
  if (!data) {
    return {
      title: "找不到靈修內容 | QT for Youth"
    };
  }

  return {
    title: `${data.day.dayLabel} ${data.day.title} | ${data.week.title} - QT for Youth`,
    description: data.day.subtitle || data.day.goldenVerse
  };
}

export default async function DevotionalDayRoute({
  params
}: {
  params: Promise<{ weekId: string; dayId: string }>;
}) {
  const { weekId, dayId } = await params;
  const data = getDayById(weekId, dayId);

  if (!data) {
    notFound();
  }

  return <DevotionalReader week={data.week} day={data.day} />;
}
