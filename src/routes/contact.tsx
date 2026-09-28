import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "../components/lead-form";
import { Hero } from "../components/page-sections";
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
        <div className="mx-auto max-w-4xl px-5">
          <LeadForm />
        </div>
      </section>
    </>
  ),
});
