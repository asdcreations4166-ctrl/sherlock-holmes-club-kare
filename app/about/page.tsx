import AboutClient from "./AboutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Sherlock Holmes Club KARE",
  description:
    "Learn about the mission, vision, objectives, and history of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Fostering logical deduction and analytical solving.",
  keywords: [
    "About Sherlock Holmes Club KARE",
    "Kalasalingam Club Vision",
    "KARE Club Mission",
    "Club Objectives",
    "Logic Club History",
    "KARE Campus Student Forums",
  ],
  openGraph: {
    title: "About Us | Sherlock Holmes Club KARE",
    description:
      "Learn about the mission, vision, objectives, and history of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Fostering logical deduction and analytical solving.",
    type: "website",
  },
};

export default function Page() {
  return <AboutClient />;
}
