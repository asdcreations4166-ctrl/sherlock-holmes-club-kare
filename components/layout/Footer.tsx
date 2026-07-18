import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-white/40 dark:bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Brief Description */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-white border border-border/40 shrink-0">
                  <img src="/logo.jpg" alt="SH Logo" className="h-full w-full object-cover" />
                </div>
                <div className="h-5 w-px bg-border/80" />
                <div className="h-6 w-auto shrink-0 max-w-[60px]">
                  <img src="/kare-logo.png" alt="KARE Logo" className="h-full object-contain" />
                </div>
              </div>
              <span className="font-heading text-sm font-semibold tracking-tight text-foreground uppercase">
                SHERLOCK HOLMES CLUB
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Official student club at Kalasalingam Academy of Research and Education. Cultivating critical thinking and logical reasoning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Events", href: "/events" },
                { label: "Gallery", href: "/gallery" },
                { label: "Team", href: "/team" },
                { label: "Contact", href: "/contact" },
                { label: "Developer Team", href: "/developer-team" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Placeholders */}
          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-center space-x-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                <span>KARE Campus, Anand Nagar, Krishnankoil</span>
              </li>
              <li className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                <span>sherlockholmes@kla.ac.in</span>
              </li>
              <li className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                <span>+91 4563 289012</span>
              </li>
            </ul>
          </div>

          {/* Socials & External */}
          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Social Links
            </h3>
            <div className="flex space-x-3.5 mb-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 bg-secondary text-muted-foreground hover:text-primary hover:bg-secondary-foreground/10 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/sherlockholmesclub.kare?igsh=N2lrYXJpMjFjZzY="
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 bg-secondary text-muted-foreground hover:text-primary hover:bg-secondary-foreground/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Kalasalingam Academy of Research and Education (Deemed to be University).
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="text-[11px] text-muted-foreground text-center md:text-left">
              &copy; {currentYear} ASD Creations. All rights reserved.
            </p>
            <p className="text-[11px] text-muted-foreground/70 text-center md:text-left">
              Website Designed & Developed by{" "}
              <Link href="/developer-team" className="text-primary hover:underline font-semibold">
                ASD Creations
              </Link>
            </p>
          </div>
          <div className="flex space-x-4 text-[11px] text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
