import React from "react";
import type { Metadata } from "next";
import PageBanner from "@/components/common/PageBanner";
import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import { Card } from "@/components/ui/card";
import { Mail, ShieldCheck, Code } from "lucide-react";

export const metadata: Metadata = {
  title: "Website Developer Team | Sherlock Holmes Club KARE",
  description:
    "Meet the official design & development team of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Developed by ASD Creations.",
  keywords: [
    "ASD Creations",
    "Web Developer",
    "Sherlock Holmes Club Developers",
    "KARE Club Portal Developers",
    "ASD Creations 4166",
    "Website Designers KARE",
  ],
  openGraph: {
    title: "Website Developer Team | Sherlock Holmes Club KARE",
    description:
      "Meet the official design & development team of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Developed by ASD Creations.",
    type: "website",
  },
};

export default function DeveloperTeamPage() {
  return (
    <>
      <PageBanner
        title="Developer Team"
        breadcrumbs={[{ label: "Developer Team" }]}
      />

      <Section id="developer-team-details">
        <Container className="max-w-3xl">
          <div className="flex flex-col items-center justify-center gap-8 py-6">
            {/* Design/Dev Code Avatar */}
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 text-primary shadow-inner">
              <Code className="h-10 w-10 stroke-[1.5]" />
            </div>

            {/* Developer Card */}
            <Card className="w-full p-8 sm:p-10 border border-border/80 bg-white/40 dark:bg-card/40 backdrop-blur-md rounded-3xl shadow-lg flex flex-col gap-6 text-center">
              <div>
                <h1 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
                  ASD Creations
                </h1>
                <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  Role: Website Design & Development
                </div>
              </div>

              <div className="h-px bg-border/80 w-full my-1" />

              <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
                This website was professionally designed and developed by ASD Creations for the Sherlock Holmes Club, Kalasalingam Academy of Research and Education (KARE).
              </p>

              <div className="flex flex-col items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Stable Release • Official Portal</span>
                </div>
                
                {/* Modern Email Button */}
                <a
                  href="mailto:asdcreations4166@gmail.com"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/95 font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98] mt-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Developer: asdcreations4166@gmail.com</span>
                </a>
              </div>
            </Card>

            <p className="text-[10px] text-center text-muted-foreground/80 max-w-md leading-normal">
              For security reports, portal maintenance requests, or general design queries, please contact ASD Creations at the email address provided above.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
