import GalleryClient from "./GalleryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club Gallery | Sherlock Holmes Club KARE",
  description:
    "View images and visual highlights from workshops, inductions, cryptographic events, and competitions hosted by the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE).",
  keywords: [
    "Sherlock Holmes Club Gallery",
    "KARE Club Event Photos",
    "Kalasalingam University Club Images",
    "Cryptography Contest Pictures",
    "Deduction Workshops Photo Archive",
  ],
  openGraph: {
    title: "Club Gallery | Sherlock Holmes Club KARE",
    description:
      "View images and visual highlights from workshops, inductions, cryptographic events, and competitions hosted by the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE).",
    type: "website",
  },
};

export default function Page() {
  return <GalleryClient />;
}
