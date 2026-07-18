import TeamClient from "./TeamClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club Committee & Team | Sherlock Holmes Club KARE",
  description:
    "Meet the official office bearers, student coordinators, executive committee leaders, and faculty advisors of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE).",
  keywords: [
    "Sherlock Holmes Club Committee",
    "KARE Club Office Bearers",
    "Kalasalingam Academy Faculty Advisors",
    "Student Coordinators KARE",
    "Club Leadership Team",
  ],
  openGraph: {
    title: "Club Committee & Team | Sherlock Holmes Club KARE",
    description:
      "Meet the official office bearers, student coordinators, executive committee leaders, and faculty advisors of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE).",
    type: "website",
  },
};

export default function Page() {
  return <TeamClient />;
}
