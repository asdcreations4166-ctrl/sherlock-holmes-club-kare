import DownloadsClient from "./DownloadsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Downloads Cabinet | Sherlock Holmes Club KARE",
  description:
    "Access and download official reference documents, guidelines, syllabus outlines, meeting files, and academic schedules from the Sherlock Holmes Club KARE.",
  keywords: [
    "Sherlock Holmes Club Downloads",
    "KARE Club Documents",
    "Kalasalingam University Club Syllabus",
    "Official Guidelines KARE Club",
    "Rules Manual downloads",
  ],
  openGraph: {
    title: "Downloads Cabinet | Sherlock Holmes Club KARE",
    description:
      "Access and download official reference documents, guidelines, syllabus outlines, meeting files, and academic schedules from the Sherlock Holmes Club KARE.",
    type: "website",
  },
};

export default function Page() {
  return <DownloadsClient />;
}
