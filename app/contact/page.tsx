import ContactClient from "./ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Sherlock Holmes Club KARE",
  description:
    "Get in touch with the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Submit queries, request collaborations, or find our office location and helpline contacts.",
  keywords: [
    "Contact Sherlock Holmes Club KARE",
    "KARE Club Office Location",
    "Kalasalingam University Club Email",
    "Sherlock Club Helpline",
    "Collaborate with KARE Clubs",
  ],
  openGraph: {
    title: "Contact Us | Sherlock Holmes Club KARE",
    description:
      "Get in touch with the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Submit queries, request collaborations, or find our office location and helpline contacts.",
    type: "website",
  },
};

export default function Page() {
  return <ContactClient />;
}
