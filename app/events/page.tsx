import EventsClient from "./EventsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club Events | Sherlock Holmes Club KARE",
  description:
    "Explore upcoming and completed cryptography workshops, logical reasoning challenges, mystery contests, and interactive student hackathons hosted by Sherlock Holmes Club at Kalasalingam Academy (KARE).",
  keywords: [
    "Sherlock Holmes Club Events",
    "KARE Cryptography Workshops",
    "Reasoning Challenges KARE",
    "Kalasalingam University Club Contests",
    "Logical Deduction Puzzle Hackathons",
  ],
  openGraph: {
    title: "Club Events | Sherlock Holmes Club KARE",
    description:
      "Explore upcoming and completed cryptography workshops, logical reasoning challenges, mystery contests, and interactive student hackathons hosted by Sherlock Holmes Club at Kalasalingam Academy (KARE).",
    type: "website",
  },
};

export default function Page() {
  return <EventsClient />;
}
