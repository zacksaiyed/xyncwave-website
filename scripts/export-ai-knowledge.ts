import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

import { industries, solutions } from "../src/lib/content";
import { caseStudies } from "../src/lib/case-studies";
import { batchArticles } from "../src/lib/insights-batch";

/**
 * XWC AI Knowledge Export
 *
 * Converts public XWC website content into Bedrock-ready documents:
 *
 * knowledge-export/
 *   solutions/
 *   industries/
 *   case-studies/
 *   insights/
 *   about/
 *
 * Every Markdown document receives a matching:
 *
 * <filename>.md.metadata.json
 *
 * The metadata is deliberately kept compact because the Knowledge Base
 * uses Amazon S3 Vectors, which has strict metadata-size limits.
 */

const exportRoot = "knowledge-export";

const solutionsOutputDir = join(exportRoot, "solutions");
const industriesOutputDir = join(exportRoot, "industries");
const caseStudiesOutputDir = join(exportRoot, "case-studies");
const insightsOutputDir = join(exportRoot, "insights");
const aboutOutputDir = join(exportRoot, "about");

rmSync(exportRoot, {
  recursive: true,
  force: true,
});

for (const directory of [
  solutionsOutputDir,
  industriesOutputDir,
  caseStudiesOutputDir,
  insightsOutputDir,
  aboutOutputDir,
]) {
  mkdirSync(directory, {
    recursive: true,
  });
}

/**
 * --------------------------------------------------------------------------
 * Metadata helpers
 * --------------------------------------------------------------------------
 */

type MetadataInput = Record<string, string | boolean | number | undefined>;

/**
 * Keep metadata deliberately compact.
 *
 * Example output:
 *
 * {
 *   "metadataAttributes": {
 *     "title": "Digital Transformation",
 *     "content_type": "solution",
 *     "canonical_url": "...",
 *     "source": "xyncwave.com",
 *     "approved": true
 *   }
 * }
 */
function buildMetadata(attributes: MetadataInput) {
  const metadataAttributes: Record<string, string | boolean | number> = {};

  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      metadataAttributes[key] = value;
    }
  }

  return {
    metadataAttributes,
  };
}

function writeKnowledgeDocument({
  directory,
  slug,
  markdown,
  metadata,
}: {
  directory: string;
  slug: string;
  markdown: string;
  metadata: MetadataInput;
}) {
  const filePath = join(directory, `${slug}.md`);

  writeFileSync(filePath, `${markdown.trim()}\n`);

  /**
   * Do not pretty-print metadata.
   *
   * Compact JSON helps keep every metadata sidecar well below
   * the S3 Vectors / Bedrock metadata limits.
   */
  writeFileSync(`${filePath}.metadata.json`, JSON.stringify(buildMetadata(metadata)));
}

/**
 * --------------------------------------------------------------------------
 * Shared Commercial Content Renderer
 *
 * Solutions and Industries share the same CommercialContent structure.
 * --------------------------------------------------------------------------
 */

function renderCommercialContent(item: (typeof solutions)[number] | (typeof industries)[number]) {
  return `
# ${item.title}

${item.heroTitle}

${item.short}

## ${item.openingTitle}

${item.openingBody}

## ${item.frictionsHeading}

${item.frictionsIntro}

${item.frictions
  .map((friction) =>
    `
### ${friction.title}

${friction.body}
`.trim(),
  )
  .join("\n\n")}

## ${item.consequenceTitle}

${item.consequenceBody}

## ${item.futureTitle}

${item.futureBody}

${item.futureSteps.map((step) => `- ${step}`).join("\n")}

## ${item.relevanceTitle}

${item.relevanceBody}

## Capabilities

${item.capabilities
  .map((capability) =>
    `
### ${capability.title}

${capability.body}
`.trim(),
  )
  .join("\n\n")}

## ${item.useCasesTitle}

${item.useCasesIntro}

${item.useCases.map((useCase) => `- ${useCase}`).join("\n")}

## ${item.triggersHeading}

${item.triggersIntro}

${item.triggers.map((trigger) => `- ${trigger}`).join("\n")}

## ${item.engagementTitle}

${item.engagementBody}

${item.engagement
  .map((step) =>
    `
### ${step.title}

${step.body}
`.trim(),
  )
  .join("\n\n")}

## ${item.proofTitle}

${item.proofBody}

## ${item.faqTitle}

${item.faq
  .map(([question, answer]) =>
    `
### ${question}

${answer}
`.trim(),
  )
  .join("\n\n")}

## Final Perspective

${item.finalTitle}

${item.finalBody}
`.trim();
}

/**
 * --------------------------------------------------------------------------
 * Solutions
 * --------------------------------------------------------------------------
 */

for (const solution of solutions) {
  writeKnowledgeDocument({
    directory: solutionsOutputDir,
    slug: solution.slug,

    markdown: renderCommercialContent(solution),

    metadata: {
      title: solution.title,
      content_type: "solution",
      slug: solution.slug,
      canonical_url: `https://xyncwave.com/solutions/${solution.slug}`,
      source: "xyncwave.com",
      approved: true,
    },
  });
}

/**
 * --------------------------------------------------------------------------
 * Industries
 * --------------------------------------------------------------------------
 */

for (const industry of industries) {
  writeKnowledgeDocument({
    directory: industriesOutputDir,
    slug: industry.slug,

    markdown: renderCommercialContent(industry),

    metadata: {
      title: industry.title,
      content_type: "industry",
      slug: industry.slug,
      canonical_url: `https://xyncwave.com/industries/${industry.slug}`,
      source: "xyncwave.com",
      approved: true,
    },
  });
}

/**
 * --------------------------------------------------------------------------
 * Case Studies
 * --------------------------------------------------------------------------
 */

function renderArchitectureFlow(flow: (typeof caseStudies)[number]["architecture"]["flow"]) {
  return flow
    .map((node) => {
      if ("group" in node) {
        const details = node.details?.length
          ? `\n${node.details.map((detail) => `  - ${detail}`).join("\n")}`
          : "";

        return `- ${node.group.join(" / ")}${details}`;
      }

      return `- ${node.label}${node.sub ? ` — ${node.sub}` : ""}`;
    })
    .join("\n");
}

for (const study of caseStudies) {
  const journey = study.journey
    ? `
## ${study.journey.title}

${study.journey.steps
  .map(([title, body]) =>
    `
### ${title}

${body}
`.trim(),
  )
  .join("\n\n")}
`
    : "";

  const deepDives = study.deepDives?.length
    ? `
## Additional Detail

${study.deepDives
  .map((deepDive) => {
    const body = deepDive.body.join("\n\n");

    const list = deepDive.list?.length
      ? `\n\n${deepDive.list.map((item) => `- ${item}`).join("\n")}`
      : "";

    const flow = deepDive.flow?.length
      ? `\n\n${deepDive.flow.map((item) => `- ${item}`).join("\n")}`
      : "";

    const split = deepDive.split?.length
      ? `\n\n${deepDive.split
          .map((section) =>
            `
### ${section.title}

${section.steps.map((step) => `- ${step}`).join("\n")}
`.trim(),
          )
          .join("\n\n")}`
      : "";

    return `
### ${deepDive.title}

${deepDive.eyebrow}

${body}${list}${flow}${split}
`.trim();
  })
  .join("\n\n")}
`
    : "";

  const outcomeCards = study.outcomeCards?.length
    ? `
## Outcome Detail

${study.outcomeCards
  .map(([title, body]) =>
    `
### ${title}

${body}
`.trim(),
  )
  .join("\n\n")}
`
    : "";

  const markdown = `
# ${study.title}

${study.heroDescription}

## Context

${study.contextTitle}

${study.context.map(([label, value]) => `- **${label}:** ${value}`).join("\n")}

## ${study.challengeTitle}

${study.challengeBody}

${study.challenges
  .map((challenge) =>
    `
### ${challenge.title}

${challenge.body ?? ""}
`.trim(),
  )
  .join("\n\n")}

## ${study.solutionTitle}

${study.solutionBody}

## Capabilities

${study.capabilities.map((capability) => `- ${capability}`).join("\n")}

## ${study.architecture.title}

${study.architecture.caption}

${renderArchitectureFlow(study.architecture.flow)}

${
  study.architecture.aside
    ? `
### ${study.architecture.aside.title}

${study.architecture.aside.items.map((item) => `- ${item}`).join("\n")}
`
    : ""
}

${
  study.architecture.feedback
    ? `
${study.architecture.feedback}
`
    : ""
}

## ${study.howTitle}

${study.howBody}

${study.steps.map((step) => `- ${step}`).join("\n")}

${journey}

## ${study.outcomesLabel}

${study.outcomes.map((outcome) => `- ${outcome}`).join("\n")}

## Solution Outcome

${study.solutionOutcome.intro}

${study.solutionOutcome.outcomes.map((outcome) => `- ${outcome}`).join("\n")}

${outcomeCards}

${deepDives}

## Technologies and Capabilities

${study.tags.map((tag) => `- ${tag}`).join("\n")}

## Final Perspective

${study.ctaTitle}

${study.ctaBody}
`.trim();

  writeKnowledgeDocument({
    directory: caseStudiesOutputDir,
    slug: study.slug,

    markdown,

    metadata: {
      title: study.title,
      content_type: "case_study",
      category: study.category,
      slug: study.slug,
      canonical_url: `https://xyncwave.com/case-studies/${study.slug}`,
      source: "xyncwave.com",
      approved: true,
    },
  });
}

/**
 * --------------------------------------------------------------------------
 * Insights
 *
 * batchArticles contains the complete published Insight content.
 * We intentionally do not use the lightweight article cards from content.ts.
 * --------------------------------------------------------------------------
 */

for (const article of batchArticles) {
  const sections = article.sections
    .map((section) => {
      const answer = section.answer ? `\n\n${section.answer}` : "";

      const paragraphs = section.paragraphs?.length ? `\n\n${section.paragraphs.join("\n\n")}` : "";

      const subsections = section.subsections?.length
        ? `\n\n${section.subsections
            .map((subsection) => {
              const subsectionBullets = subsection.bullets?.length
                ? `\n\n${subsection.bullets.map((bullet) => `- ${bullet}`).join("\n")}`
                : "";

              return `
### ${subsection.title}

${subsection.paragraphs.join("\n\n")}${subsectionBullets}
`.trim();
            })
            .join("\n\n")}`
        : "";

      const bullets = section.bullets?.length
        ? `\n\n${section.bullets.map((bullet) => `- ${bullet}`).join("\n")}`
        : "";

      const table = section.table
        ? `

${[
  `| ${section.table.headers.join(" | ")} |`,
  `| ${section.table.headers.map(() => "---").join(" | ")} |`,
  ...section.table.rows.map((row) => `| ${row.join(" | ")} |`),
].join("\n")}
`
        : "";

      const checklist = section.checklist?.length
        ? `\n\n${section.checklist
            .map((item) => `- **${item.label}:** ${item.question}`)
            .join("\n")}`
        : "";

      const links = section.links?.length
        ? `

Related XWC resources:

${section.links.map((link) => `- ${link.label}: https://xyncwave.com${link.to}`).join("\n")}
`
        : "";

      return `
## ${section.title}
${answer}${paragraphs}${subsections}${bullets}${table}${checklist}${links}
`.trim();
    })
    .join("\n\n");

  const faq = article.faq
    .map(([question, answer]) =>
      `
### ${question}

${answer}
`.trim(),
    )
    .join("\n\n");

  const sources = article.sources?.length
    ? article.sources
        .map(
          (source) =>
            `- ${source.name} (${source.year}) — ${source.title}: ${source.url}${
              source.note ? ` — ${source.note}` : ""
            }`,
        )
        .join("\n")
    : "No external sources listed.";

  const markdown = `
# ${article.title}

${article.excerpt}

## Direct Question

${article.directQuestion}

${article.directAnswer}

## Key Takeaways

${article.takeaways.map((takeaway) => `- ${takeaway}`).join("\n")}

${sections}

## Frequently Asked Questions

${faq}

## Research & Sources

${sources}

## Final Perspective

${article.finalHeadline}

${article.finalBody}
`.trim();

  writeKnowledgeDocument({
    directory: insightsOutputDir,
    slug: article.slug,

    markdown,

    metadata: {
      title: article.title,
      content_type: "insight",
      category: article.cluster,
      slug: article.slug,
      published: article.published,
      modified: article.modified,
      canonical_url: `https://xyncwave.com/insights/${article.slug}`,
      source: "xyncwave.com",
      approved: true,
    },
  });
}

/**
 * --------------------------------------------------------------------------
 * About
 *
 * about-content.ts imports JPG files.
 *
 * Importing the module directly from this Node/tsx script would make the
 * exporter depend on Vite's asset handling.
 *
 * Instead, we parse the TypeScript source and extract its public literal data.
 * Image references are intentionally ignored.
 * --------------------------------------------------------------------------
 */

const aboutSourcePath = "src/lib/about-content.ts";

const aboutSourceText = readFileSync(aboutSourcePath, "utf8");

const aboutSourceFile = ts.createSourceFile(
  aboutSourcePath,
  aboutSourceText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);

function evaluateLiteral(node: ts.Node): unknown {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements
      .map((element) => evaluateLiteral(element))
      .filter((value) => value !== undefined);
  }

  if (ts.isObjectLiteralExpression(node)) {
    const result: Record<string, unknown> = {};

    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) {
        continue;
      }

      let key: string | undefined;

      if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) {
        key = property.name.text;
      }

      if (!key) {
        continue;
      }

      const value = evaluateLiteral(property.initializer);

      /**
       * Imported image references resolve to undefined here
       * and are intentionally excluded.
       */
      if (value !== undefined) {
        result[key] = value;
      }
    }

    return result;
  }

  if (
    ts.isAsExpression(node) ||
    ts.isTypeAssertionExpression(node) ||
    ts.isParenthesizedExpression(node)
  ) {
    return evaluateLiteral(node.expression);
  }

  return undefined;
}

function readExportedConstant(name: string): unknown {
  for (const statement of aboutSourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === name &&
        declaration.initializer
      ) {
        return evaluateLiteral(declaration.initializer);
      }
    }
  }

  throw new Error(`Could not extract "${name}" from ${aboutSourcePath}`);
}

type AboutFounder = {
  name: string;
  role: string;
  paragraphs: string[];
  principles: string[];
};

type AboutTeamMember = {
  name: string;
  role: string;
};

type AboutNewsItem = {
  date: string;
  category: string;
  title: string;
  excerpt: string;
  href?: string | null;
};

const founder = readExportedConstant("founder") as AboutFounder;

const teamMembers = readExportedConstant("teamMembers") as AboutTeamMember[];

const companyNews = readExportedConstant("companyNews") as AboutNewsItem[];

const aboutMarkdown = `
# About Xyncwave

## Founder

### ${founder.name}

**Role:** ${founder.role}

${founder.paragraphs.join("\n\n")}

## Operating Principles

${founder.principles.map((principle) => `- ${principle}`).join("\n")}

## Team

${teamMembers
  .map((member) =>
    `
### ${member.name}

${member.role}
`.trim(),
  )
  .join("\n\n")}

## Company Updates

${companyNews
  .map((item) =>
    `
### ${item.title}

**Date:** ${item.date}

**Category:** ${item.category}

${item.excerpt}

${item.href ? `Related page: https://xyncwave.com${item.href}` : ""}
`.trim(),
  )
  .join("\n\n")}
`.trim();

writeKnowledgeDocument({
  directory: aboutOutputDir,
  slug: "about-xyncwave",

  markdown: aboutMarkdown,

  metadata: {
    title: "About Xyncwave",
    content_type: "about",
    slug: "about-xyncwave",
    canonical_url: "https://xyncwave.com/about",
    source: "xyncwave.com",
    approved: true,
  },
});

/**
 * --------------------------------------------------------------------------
 * Export summary
 * --------------------------------------------------------------------------
 */

const totalDocuments =
  solutions.length + industries.length + caseStudies.length + batchArticles.length + 1;

console.log("");
console.log("XWC AI knowledge export complete.");
console.log("");

console.log(`Solutions:    ${solutions.length}`);

console.log(`Industries:   ${industries.length}`);

console.log(`Case Studies: ${caseStudies.length}`);

console.log(`Insights:     ${batchArticles.length}`);

console.log("About:        1");

console.log("----------------");

console.log(`Total:        ${totalDocuments}`);

console.log("");
console.log(`Output: ${exportRoot}/`);
