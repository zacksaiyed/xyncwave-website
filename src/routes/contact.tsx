import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { LeadForm } from "../components/lead-form";
import { Eyebrow, Hero } from "../components/page-sections";
import { companyContact, companyMapUrl } from "../lib/company-contact";
import { pageHead } from "../lib/seo";
export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead(
      "Contact Xyncwave",
      "Tell Xyncwave what is not working and start a practical technology conversation.",
      "/contact",
    ),
  component: () => (
    <>
      <Hero
        eyebrow="Contact"
        title="Let's start with the problem."
        description="Give us the context. You do not need to have the solution figured out yet."
        primary="Tell Us What You're Trying to Solve"
        primaryTo="#contact-form"
      />
      <section id="contact-form" className="scroll-mt-28 py-section">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:px-8">
          <div className="lg:pt-4">
            <Eyebrow>Direct contact</Eyebrow>
            <h2 className="section-title mt-6">Reach the Xyncwave team.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Prefer email or a call? Contact us directly, or use the form to share enough context
              for a useful first conversation.
            </p>

            <address className="mt-10 divide-y divide-border border-y border-border not-italic">
              <ContactDetail
                icon={Mail}
                label="Email"
                value={companyContact.email}
                href={`mailto:${companyContact.email}`}
              />
              <ContactDetail
                icon={Phone}
                label="Phone"
                value={companyContact.phoneDisplay}
                href={`tel:${companyContact.phoneHref}`}
              />
              <ContactDetail
                icon={MapPin}
                label="Registered office"
                value={companyContact.address}
                href={companyMapUrl}
                external
              />
            </address>
          </div>

          <div className="rounded-card border border-border bg-background p-6 sm:p-10 lg:p-12">
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  ),
});

function ContactDetail({
  icon: Icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group grid grid-cols-[2.75rem_1fr] gap-4 py-6"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </span>
        <span className="mt-1.5 block text-sm leading-6 font-medium transition-colors group-hover:text-primary">
          {value}
        </span>
      </span>
    </a>
  );
}
