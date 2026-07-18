import AnnouncementsClient from "./AnnouncementsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club Announcements | Sherlock Holmes Club KARE",
  description:
    "Read the latest official updates, announcements, project deadlines, induction notices, and event circulars from the Sherlock Holmes Club committee at Kalasalingam Academy of Research and Education (KARE).",
  keywords: [
    "Sherlock Holmes Club Announcements",
    "KARE Club Notices",
    "Kalasalingam University Club Circulars",
    "Official News Sherlock Club",
    "KARE Campus Circulars",
  ],
  openGraph: {
    title: "Club Announcements | Sherlock Holmes Club KARE",
    description:
      "Read the latest official updates, announcements, project deadlines, induction notices, and event circulars from the Sherlock Holmes Club committee at Kalasalingam Academy of Research and Education (KARE).",
    type: "website",
  },
};

export default function Page() {
  return <AnnouncementsClient />;
}
