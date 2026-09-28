import type { AppPath } from "../components/app-link";
import type { LeadType } from "./leads";

export type IndustrySlug = "logistics" | "manufacturing" | "healthcare" | "fintech" | "technology-it-services";

export type ChallengeOption = { value: string; label: string };
export type ProgressiveField = { key: string; label: string; placeholder: string; choices?: string[] };
export type SolutionMap = { problem: string; intervention: string; improvement: string };
export type UseCaseMap = { situation: string; approach: string; capability: string };

export type IndustryConversion = {
  slug: IndustrySlug;
  leadType: LeadType;
  heroMicrocopy: string;
  recognitionEyebrow: string;
  recognitionTitle: string;
  painCta: string;
  futureCta: string;
  proofCta: string;
  triggerCta: string;
  stickyCta: string;
  beforeLabel: string;
  afterLabel: string;
  solutionTitle: string;
  solutionIntro: string;
  solutionMap: SolutionMap[];
  useCases: UseCaseMap[];
  formTitle: string;
  formBody: string;
  challengeLabel: string;
  challengeOptions: ChallengeOption[];
  optionalField?: ProgressiveField;
  progressiveFields?: Record<string, ProgressiveField[]>;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  reassurance: string;
  thankYou: {
    title: string;
    body: string;
    next: string;
    nextTo: AppPath;
    secondary: string;
    secondaryTo: AppPath;
  };
};

export const industryConversions: Record<IndustrySlug, IndustryConversion> = {
  logistics: {
    slug: "logistics", leadType: "digitalization",
    heroMicrocopy: "Bring the operational friction—not a finished technical specification.",
    recognitionEyebrow: "Recognize the constraint", recognitionTitle: "Where does the logistics flow lose continuity?",
    painCta: "See Where the Process Is Breaking", futureCta: "Explore a Connected Operation", proofCta: "Discuss a Similar Challenge", triggerCta: "Tell Us What's Changing", stickyCta: "Map Your Operational Gaps",
    beforeLabel: "Updates distributed across teams and tools", afterLabel: "A connected flow with visible status and ownership",
    solutionTitle: "Connect the operating problem to a practical intervention", solutionIntro: "The useful starting point is the broken handoff—not a predetermined platform replacement.",
    solutionMap: [
      { problem: "Shipment updates move through messages and spreadsheets", intervention: "Operational workflow platform and controlled integrations", improvement: "A consistent status path for teams and customers" },
      { problem: "Warehouse, inventory, and dispatch records disagree", intervention: "Shared events, role-based workflows, and ERP connections", improvement: "Better coordination across stock and movement decisions" },
      { problem: "Completion evidence reaches billing manually", intervention: "Digital proof and billing-ready handoffs", improvement: "A clearer path from completed work to reconciliation" },
    ],
    useCases: [
      { situation: "Dispatchers coordinate assignments across calls and messages", approach: "Create a shared assignment and exception workflow", capability: "Operational platforms" },
      { situation: "Warehouse events do not reach transport teams reliably", approach: "Connect receiving, picking, loading, and dispatch status", capability: "System integration" },
      { situation: "Customers request routine updates from internal teams", approach: "Expose controlled shipment status through a portal", capability: "Customer-facing software" },
      { situation: "Field updates and evidence arrive after the event", approach: "Give drivers or technicians a role-focused mobile workflow", capability: "Mobile engineering" },
    ],
    formTitle: "Where is operational friction showing up?", formBody: "Tell us where the process is breaking down. We'll use the context to understand whether there's a practical digitalization opportunity.", challengeLabel: "Where is the biggest challenge?",
    challengeOptions: ["Dispatch","Fleet","Warehouse","Inventory","Tracking","Billing","Customer visibility","Reporting","ERP / systems integration","Multiple areas","Other"].map(label=>({value:label.toLowerCase().replaceAll(" ","-").replaceAll("/","and"),label})),
    progressiveFields: { "erp-and-systems-integration": [{ key:"current_system", label:"Current ERP or system (optional)", placeholder:"Which system is central today?" }, { key:"systems_to_connect", label:"Systems to connect (optional)", placeholder:"Which records need to move together?" }] },
    messageLabel: "What is happening?", messagePlaceholder: "For example: inventory and dispatch are split across our ERP and spreadsheets as we open another warehouse.", submitLabel: "Share the Challenge", reassurance: "Share the operating context. A Xyncwave team member will review it before reaching out.",
    thankYou: { title:"Thanks—we have the logistics context.", body:"The team will review the workflow, systems, and operational challenge you shared before deciding the most useful next step.", next:"See How the Operation Changed", nextTo:"/case-studies/track-trace", secondary:"Read the digitalization guide", secondaryTo:"/insights/digital-transformation-fragmented-systems" },
  },
  manufacturing: {
    slug:"manufacturing", leadType:"digitalization",
    heroMicrocopy:"Start with one production, inventory, or reporting gap. The wider roadmap can follow.", recognitionEyebrow:"Production reality", recognitionTitle:"Which handoff is making production harder to coordinate?",
    painCta:"Identify the Operational Gap", futureCta:"Explore the Digital Opportunity", proofCta:"Discuss Your Manufacturing Environment", triggerCta:"Tell Us What's Expanding", stickyCta:"Review Your Production Systems",
    beforeLabel:"Production decisions reconstructed from separate records", afterLabel:"Connected workflows around planning, materials, quality, and status",
    solutionTitle:"Map operating friction to a bounded systems improvement", solutionIntro:"A focused workflow or integration can be more useful than assuming every plant system must change at once.",
    solutionMap:[
      {problem:"Production plans and material availability are maintained separately",intervention:"Integrated planning and inventory workflows",improvement:"Better coordination between schedule and available stock"},
      {problem:"Quality records and approvals are difficult to trace",intervention:"Controlled digital records and approval paths",improvement:"Clearer ownership and exception visibility"},
      {problem:"Plant or line reporting requires manual consolidation",intervention:"Connected operational data and role-focused dashboards",improvement:"A more current management view"},
    ],
    useCases:[
      {situation:"Planners reconcile schedule and stock manually",approach:"Connect production requirements with inventory events",capability:"Workflow and integration engineering"},
      {situation:"Maintenance requests move through informal channels",approach:"Create a controlled request, assignment, and status flow",capability:"Operational applications"},
      {situation:"Multiple sites use different reporting practices",approach:"Define shared data and reporting boundaries",capability:"Data engineering"},
      {situation:"ERP screens do not fit shop-floor activity",approach:"Add a role-focused workflow around the ERP",capability:"Purpose-built software"},
    ],
    formTitle:"Which part of your operation needs better connection?", formBody:"Share the workflow, system boundary, or production change that deserves a closer review.", challengeLabel:"What are you trying to improve?",
    challengeOptions:["Production planning","Inventory","Procurement","Quality","Maintenance","Shop-floor workflows","ERP","Reporting","Multiple plants","Other"].map(label=>({value:label.toLowerCase().replaceAll(" ","-"),label})),
    progressiveFields:{ erp:[{key:"current_system",label:"Current ERP (optional)",placeholder:"Which ERP is in use?"}], "multiple-plants":[{key:"locations",label:"Plants or locations (optional)",placeholder:"How many locations are involved?"}] },
    messageLabel:"What is happening?", messagePlaceholder:"Describe the handoff, repeated work, or expansion creating the constraint.", submitLabel:"Review the Challenge", reassurance:"We will review the operating context before suggesting whether a focused intervention is sensible.",
    thankYou:{title:"Thanks—we have the manufacturing context.",body:"The team will review the production environment and systems boundary you described before considering a practical next step.",next:"Review the operational platform pattern",nextTo:"/case-studies/track-trace",secondary:"Explore digital transformation",secondaryTo:"/solutions/digital-transformation"},
  },
  healthcare: {
    slug:"healthcare", leadType:"digitalization",
    heroMicrocopy:"Describe the administrative or departmental workflow. No clinical-system assumption is required.", recognitionEyebrow:"Operational recognition", recognitionTitle:"Where is administrative complexity accumulating?",
    painCta:"Explore the Operational Gap", futureCta:"See a Clearer Workflow", proofCta:"Review the Working Approach", triggerCta:"Tell Us What's Changing", stickyCta:"Discuss the Operational Gap",
    beforeLabel:"Requests, documents, and status reconstructed across departments", afterLabel:"A controlled operational flow with clearer ownership",
    solutionTitle:"Improve the supporting workflow without overstating the answer", solutionIntro:"The scope starts with administrative work, departmental coordination, reporting, portals, and system exchange—not unsupported clinical claims.",
    solutionMap:[
      {problem:"Administrative requests cross departments without clear ownership",intervention:"Role-based workflow and status management",improvement:"More visible responsibility and handoffs"},
      {problem:"Documents and approvals are difficult to trace",intervention:"Controlled intake, review, and audit workflow",improvement:"A clearer operational record"},
      {problem:"Supporting systems cannot exchange required information",intervention:"Validated APIs and integration boundaries",improvement:"Less duplicate entry between approved systems"},
    ],
    useCases:[
      {situation:"Scheduling changes require repeated coordination",approach:"Map the administrative workflow and controlled notifications",capability:"Workflow engineering"},
      {situation:"Departments keep separate copies of the same information",approach:"Define a shared record and appropriate role access",capability:"Application modernization"},
      {situation:"Recurring reports depend on manual exports",approach:"Connect approved sources into a governed reporting flow",capability:"Data engineering"},
      {situation:"A legacy administrative tool no longer fits the work",approach:"Assess modernization, integration, or bounded replacement",capability:"Legacy modernization"},
    ],
    formTitle:"Where is operational complexity building up?", formBody:"Tell us which supporting workflow is becoming difficult to coordinate. We will review the context without assuming a clinical scope.", challengeLabel:"What are you trying to improve?",
    challengeOptions:["Administrative workflows","Scheduling","Department coordination","Data exchange","Reporting","Legacy system","Integrations","Document workflows","Other"].map(label=>({value:label.toLowerCase().replaceAll(" ","-"),label})),
    progressiveFields:{ integrations:[{key:"systems_to_connect",label:"Systems involved (optional)",placeholder:"Which approved systems need to exchange information?"}], "legacy-system":[{key:"current_system",label:"Current system (optional)",placeholder:"What no longer fits the workflow?"}] },
    messageLabel:"Briefly describe the operational gap", messagePlaceholder:"Describe where work, information, or approvals lose continuity.", submitLabel:"Discuss the Operational Gap", reassurance:"A Xyncwave team member will review the requirement before reaching out. No clinical capability is assumed.",
    thankYou:{title:"Thanks—we have the operational context.",body:"The team will review the administrative workflow and system boundaries you shared before considering a practical next step.",next:"Explore workflow modernization",nextTo:"/solutions/digital-transformation",secondary:"Read the modernization guide",secondaryTo:"/insights/application-modernization-refactor-replatform-rebuild-replace"},
  },
  fintech: {
    slug:"fintech", leadType:"engineering",
    heroMicrocopy:"Share the roadmap constraint. A fully scoped workstream is not required to begin.", recognitionEyebrow:"Roadmap pressure", recognitionTitle:"Where is delivery capacity falling behind product priority?",
    painCta:"Identify the Capacity Gap", futureCta:"Explore the Right Engineering Model", proofCta:"Discuss a Workstream", triggerCta:"Tell Us What Needs to Ship", stickyCta:"Discuss Engineering Capacity",
    beforeLabel:"Priorities queue behind vacancies and constrained specialists", afterLabel:"Additional capacity aligned to a defined product workstream",
    solutionTitle:"Match the delivery constraint to the right capacity model", solutionIntro:"The intervention should reflect the workstream, internal ownership, skills, timeframe, and collaboration needed.",
    solutionMap:[
      {problem:"Several vacancies are delaying roadmap work",intervention:"Dedicated engineers or a delivery pod",improvement:"Additional parallel product capacity"},
      {problem:"A partner or API integration has a fixed window",intervention:"A bounded integration workstream",improvement:"Focused capacity around the committed interface"},
      {problem:"Legacy architecture restricts release work",intervention:"A sequenced modernization team",improvement:"Progress without pausing the wider roadmap"},
    ],
    useCases:[
      {situation:"A launch requires frontend and backend work in parallel",approach:"Form a cross-functional pod around the release scope",capability:"Software engineering"},
      {situation:"Partner integrations are accumulating",approach:"Assign a focused API and platform workstream",capability:"API engineering"},
      {situation:"Platform work competes with feature delivery",approach:"Add cloud or platform specialists to a defined backlog",capability:"Cloud and platform engineering"},
      {situation:"Open roles leave a temporary execution gap",approach:"Add capacity with explicit ownership and handover",capability:"Flexible engineering teams"},
    ],
    formTitle:"Where is engineering capacity limiting the roadmap?", formBody:"Share the workstream, capability, or timing constraint. We will review which delivery shape may be relevant.", challengeLabel:"What are you trying to improve?",
    challengeOptions:["Backend","Frontend","APIs / integrations","Cloud / DevOps","Data engineering","Platform modernization","QA","Additional engineering capacity","Product workstream","Other"].map(label=>({value:label.toLowerCase().replaceAll(" ","-").replaceAll("/","and"),label})),
    optionalField:{key:"timeframe",label:"How soon is the capacity needed? (optional)",placeholder:"Select a timeframe",choices:["Immediately","Within 30 days","Within 1–3 months","Exploring options"]},
    progressiveFields:{ "additional-engineering-capacity":[{key:"skills",label:"Required skills (optional)",placeholder:"Which capabilities are missing?"},{key:"capacity",label:"Approximate capacity (optional)",placeholder:"Specialist, engineers, or pod"}], "apis-and-integrations":[{key:"systems_to_connect",label:"Integration context (optional)",placeholder:"Which partner or systems are involved?"}] },
    messageLabel:"What needs to move forward?", messagePlaceholder:"Describe the workstream, current constraint, and any timing that matters.", submitLabel:"Discuss the Roadmap", reassurance:"Share the product context. We will review the requirement before discussing a delivery model.",
    thankYou:{title:"Thanks—we have the roadmap context.",body:"The team will review the workstream, capability, and timing you shared before considering the most useful engineering model.",next:"Review the engineering capacity model",nextTo:"/case-studies/engineering-capacity",secondary:"Compare capacity models",secondaryTo:"/insights/staff-augmentation-vs-dedicated-team-vs-outsourcing"},
  },
  "technology-it-services": {
    slug:"technology-it-services", leadType:"partnership",
    heroMicrocopy:"Start with the client requirement, capability gap, or delivery window—not a procurement package.", recognitionEyebrow:"Delivery pressure", recognitionTitle:"Which commitment is your current team being asked to absorb?",
    painCta:"Review Your Delivery Requirement", futureCta:"Explore a Delivery Model", proofCta:"Discuss a Similar Workstream", triggerCta:"Tell Us What's Starting", stickyCta:"Review Delivery Capacity",
    beforeLabel:"New commitments compete with hiring and existing utilization", afterLabel:"A defined delivery unit with clear ownership and overlap",
    solutionTitle:"Shape external capacity around the delivery obligation", solutionIntro:"The right model depends on whether the requirement is specialist, temporary, project-based, white-label, or an ongoing extension of the team.",
    solutionMap:[
      {problem:"A new client win needs to start before recruitment completes",intervention:"A dedicated engineering pod or project team",improvement:"Additional delivery capacity around the committed scope"},
      {problem:"One project requires a missing specialist capability",intervention:"Targeted specialist support",improvement:"Coverage without reshaping the whole team"},
      {problem:"Client delivery requires controlled white-label participation",intervention:"A defined delivery model with clear communication boundaries",improvement:"Capacity aligned to the client engagement"},
    ],
    useCases:[
      {situation:"A project needs backend and frontend delivery together",approach:"Create a small cross-functional delivery unit",capability:"Dedicated engineering pods"},
      {situation:"A specialist gap blocks an active engagement",approach:"Add a focused engineer or technical lead",capability:"Specialist engineering"},
      {situation:"A client requires collaboration during US hours",approach:"Define overlap, ownership, and communication expectations",capability:"Global delivery collaboration"},
      {situation:"Demand has risen temporarily across several projects",approach:"Add time-bounded capacity with explicit handover",capability:"Flexible delivery support"},
    ],
    formTitle:"What delivery requirement are you trying to cover?", formBody:"Share the client commitment, missing capability, or temporary delivery gap. We will review the most appropriate working model.", challengeLabel:"What are you trying to cover?",
    challengeOptions:["Additional developers","Specialist skills","Dedicated engineering pod","White-label delivery","Project team","US-timezone coverage","Temporary capacity","Backend / frontend","Cloud / DevOps","QA","Other"].map(label=>({value:label.toLowerCase().replaceAll(" ","-").replaceAll("/","and"),label})),
    optionalField:{key:"duration",label:"Expected duration (optional)",placeholder:"For example: one release or six months"},
    progressiveFields:{ "additional-developers":[{key:"skills",label:"Required skills (optional)",placeholder:"Which capabilities are needed?"},{key:"capacity",label:"Approximate capacity (optional)",placeholder:"How many people or what team shape?"}], "specialist-skills":[{key:"skills",label:"Specialist capability (optional)",placeholder:"Which skill is missing?"}] },
    messageLabel:"What does the delivery requirement involve?", messagePlaceholder:"Describe the commitment, workstream, team gap, and timing that matter.", submitLabel:"Explore a Delivery Model", reassurance:"A Xyncwave team member will review the requirement before discussing a delivery structure.",
    thankYou:{title:"Thanks—we have the delivery requirement.",body:"The team will review the client context, capability, overlap, and expected duration before considering a suitable delivery model.",next:"See how the delivery model is structured",nextTo:"/case-studies/engineering-capacity",secondary:"Compare capacity models",secondaryTo:"/insights/staff-augmentation-vs-dedicated-team-vs-outsourcing"},
  },
};

export function getIndustryConversion(slug: string) {
  return industryConversions[slug as IndustrySlug];
}
