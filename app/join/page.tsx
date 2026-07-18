import JoinClient from "./JoinClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Club | Sherlock Holmes Club KARE",
  description:
    "Enroll and become an official member of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Check registration status, criteria, and submit applications online.",
  keywords: [
    "Join Sherlock Holmes Club KARE",
    "KARE Student Club Registration",
    "Kalasalingam University Club Membership",
    "Cryptography Student Group Enrolment",
    "Apply to KARE Student Clubs",
  ],
  openGraph: {
    title: "Join the Club | Sherlock Holmes Club KARE",
    description:
      "Enroll and become an official member of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Check registration status, criteria, and submit applications online.",
    type: "website",
  },
};

export default function Page() {
  return <JoinClient />;
}
