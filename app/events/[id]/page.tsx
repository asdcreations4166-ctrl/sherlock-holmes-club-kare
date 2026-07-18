import EventDetailsClient from "./EventDetailsClient";
import type { Metadata } from "next";
import { getEventById } from "@/services/clubService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const event = await getEventById(id);
    if (event) {
      return {
        title: `${event.title} | Sherlock Holmes Club KARE`,
        description:
          event.description?.substring(0, 160) ||
          `Official details for the event ${event.title} hosted by the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE).`,
        keywords: [
          event.title,
          event.category || "Club Event",
          "Sherlock Holmes Club KARE",
          "KARE campus activities",
        ],
        openGraph: {
          title: `${event.title} | Sherlock Holmes Club KARE`,
          description: event.description?.substring(0, 160),
          type: "article",
        },
      };
    }
  } catch (error) {
    console.error("Metadata generation error:", error);
  }

  return {
    title: "Event Details | Sherlock Holmes Club KARE",
    description:
      "Official event details and registration guidelines for workshops and hackathons hosted by the Sherlock Holmes Club KARE.",
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  return <EventDetailsClient params={params} />;
}
