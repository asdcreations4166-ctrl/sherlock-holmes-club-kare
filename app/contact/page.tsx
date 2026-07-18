"use client";

import React, { useEffect, useState } from "react";
import PageBanner from "@/components/common/PageBanner";
import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Heading from "@/components/common/Heading";
import ContactForm from "@/components/common/ContactForm";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Mail, Phone, Share2, Map } from "lucide-react";
import { subscribeContactInfo } from "@/services/clubService";
import { ContactInfo } from "@/types";

export default function ContactPage() {
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeContactInfo((data) => {
      setInfo(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <PageBanner
        title="Contact Us"
        breadcrumbs={[{ label: "Contact" }]}
      />

      <Section>
        <Container className="space-y-12">
          <Heading
            title="Get in Touch"
            subtitle="Have inquiries or suggestions? Reach out using the official campus communication details below."
            align="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Side: Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="p-6 border border-border/80 bg-white/50 dark:bg-card/50 backdrop-blur-xs rounded-3xl space-y-6">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Club Office Contacts
                </h3>

                <div className="space-y-5 text-xs sm:text-sm text-muted-foreground">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    {loading ? (
                      <div className="space-y-2 flex-1 pt-1">
                        <Skeleton className="h-4 w-3/4 bg-secondary" />
                        <Skeleton className="h-4 w-5/6 bg-secondary" />
                      </div>
                    ) : info?.officeLocation ? (
                      <div>
                        <p className="font-bold text-foreground">Office Location</p>
                        <p className="whitespace-pre-wrap">{info.officeLocation}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-foreground">Office Location</p>
                        <p>Kalasalingam Academy of Research and Education</p>
                        <p>Anand Nagar, Krishnankoil - 626126</p>
                        <p>Tamil Nadu, India</p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    {loading ? (
                      <div className="space-y-2 flex-1 pt-1">
                        <Skeleton className="h-4 w-2/3 bg-secondary" />
                      </div>
                    ) : info?.emailAddress ? (
                      <div>
                        <p className="font-bold text-foreground">Email Address</p>
                        <a href={`mailto:${info.emailAddress}`} className="hover:text-primary transition-colors">
                          {info.emailAddress}
                        </a>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-foreground">Email Address</p>
                        <p>sherlockholmes@kla.ac.in</p>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    {loading ? (
                      <div className="space-y-2 flex-1 pt-1">
                        <Skeleton className="h-4 w-1/2 bg-secondary" />
                      </div>
                    ) : info?.phoneHelpline ? (
                      <div>
                        <p className="font-bold text-foreground">Phone Helpline</p>
                        <p>{info.phoneHelpline}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-foreground">Phone Helpline</p>
                        <p>+91 (4563) 289012</p>
                      </div>
                    )}
                  </div>

                  {/* Social Media */}
                  <div className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Share2 className="h-5 w-5" />
                    </div>
                    {loading ? (
                      <div className="space-y-2 flex-1 pt-1">
                        <Skeleton className="h-4 w-3/4 bg-secondary" />
                      </div>
                    ) : info?.socials ? (
                      <div className="space-y-1">
                        <p className="font-bold text-foreground">Social Networks</p>
                        <div className="flex gap-2 flex-wrap text-xs">
                          {info.socials.linkedin && (
                            <a href={info.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline">
                              LinkedIn
                            </a>
                          )}
                          {info.socials.instagram && (
                            <a href={info.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline">
                              Instagram
                            </a>
                          )}
                          {info.socials.github && (
                            <a href={info.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline">
                              GitHub
                            </a>
                          )}
                          {info.socials.twitter && (
                            <a href={info.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline">
                              Twitter
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-foreground">Social Networks</p>
                        <p>Social handles are syncing from database.</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Google Map Placeholder */}
              <div className="aspect-video w-full bg-secondary/35 rounded-3xl border border-border/80 flex flex-col items-center justify-center gap-2 relative overflow-hidden shadow-xs">
                <Map className="h-10 w-10 text-muted-foreground stroke-[1.5]" />
                <span className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Campus Map Placeholder
                </span>
                <span className="font-sans text-[10px] text-muted-foreground">
                  Google Map iframe coordinates will be linked.
                </span>
              </div>
            </div>

            {/* Right Side: Message Submission Form */}
            <div className="lg:col-span-7 bg-white/70 dark:bg-card/70 border border-border/80 p-8 rounded-3xl shadow-sm backdrop-blur-xs">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
