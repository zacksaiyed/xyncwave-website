import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "../components/static-page";
import { pageHead } from "../lib/seo";
export const Route = createFileRoute("/why-xyncwave")({
  head: () =>
    pageHead(
      "Why Work With XWC",
      "Understand XWC’s approach to decision quality, engineering discipline, flexible capacity, transparent evidence, and accountable delivery.",
      "/why-xyncwave",
    ),
  component: () => (
    <StaticPage
      eyebrow="Why XWC"
      title="A stronger engagement makes the important decisions visible."
      description="The difference is not a claim to have one answer for every technology problem. It is a disciplined way to define the problem, choose the intervention, and assign responsibility for delivery."
      sections={[
        {
          title: "We reduce uncertainty before increasing commitment",
          body: "Discovery is used to expose users, workflows, system dependencies, operating constraints, and unanswered questions. That creates a basis for deciding whether the next move should be integration, software, modernization, data work, automation, additional capacity, or no build at all.",
        },
        {
          title: "The smallest useful intervention can be the strongest one",
          body: "A broad programme is not automatically more strategic. One bounded workflow, interface, reporting foundation, modernization phase, or specialist capability may remove the immediate constraint and produce better evidence for what should follow.",
        },
        {
          title: "Engineering discipline protects future options",
          body: "Architecture, interfaces, testing, release controls, observability, documentation, and ownership affect how safely software can change. Treating them as delivery concerns from the beginning reduces dependence on individual knowledge and makes trade-offs easier to understand.",
        },
        {
          title: "Flexible capacity comes with an ownership model",
          body: "A specialist, pod, extended team, project engagement, and white-label partnership carry different responsibilities. We define who directs priorities, makes technical decisions, reviews quality, communicates with stakeholders, accepts work, and retains knowledge.",
        },
        {
          title: "Business language and technical detail stay connected",
          body: "Executives need to understand the operating consequence; delivery teams need enough precision to act. We keep the relationship visible so technology choices can be challenged against workflow, continuity, user, and commercial needs.",
        },
        {
          title: "We do not use confidence to disguise missing evidence",
          body: "Published case studies state what is supported and where proof remains incomplete. We do not fabricate metrics, clients, quotations, certifications, awards, or production outcomes. When evidence is unavailable, the claim becomes narrower.",
        },
        {
          title: "The objective is useful client ownership",
          body: "A good engagement should leave the client with clearer decisions, understandable systems, accessible knowledge, and an explicit next step. Dependency is not treated as evidence of partnership.",
        },
      ]}
    />
  ),
});
