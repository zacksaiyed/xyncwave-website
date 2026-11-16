import type { BatchArticle } from "./insights-batch";

const manufacturingErp: BatchArticle = {
  slug: "multi-site-manufacturing-erp-rollout-readiness-africa",
  cluster: "Manufacturing · ERP & Business Systems",
  title: "Multi-Site Manufacturing ERP Rollouts: How to Prepare Plants, Data and Workflows Before Implementation",
  seoTitle: "Multi-Site Manufacturing ERP Rollout Readiness Guide | Xyncwave",
  metaDescription: "A preparation guide for multi-plant ERP rollouts in African manufacturing: current-state mapping, master data cleanup, centralise-vs-local decisions, migration rehearsal and shop-floor adoption.",
  excerpt: "Multi-plant ERP rollouts stall on differences between plants, not on software configuration. A readiness guide for mapping, cleaning and sequencing before implementation begins.",
  read: "22 min",
  published: "2026-11-06",
  modified: "2026-11-06",
  directQuestion: "What makes a multi-site manufacturing ERP rollout succeed or stall?",
  directAnswer: "Multi-site ERP rollouts stall less on software configuration than on unmanaged differences between plants: item codes, bills of materials, warehouse structures, approval authority, goods-movement habits and reporting timing. Readiness means mapping each plant's actual workflow, deciding deliberately what will be standardised and what will legitimately stay local, cleaning master data before migration, rehearsing the cutover and preparing the shop floor—before the implementation partner configures anything.",
  takeaways: [
    "A multi-plant ERP rollout is an operating-model decision before it is a software project.",
    "Map the real order-to-dispatch flow at each plant; the differences between plants are the project's actual scope.",
    "Master data—items, BOMs, locations, suppliers, customers—is the most underestimated workstream and the most common cause of stalled go-lives.",
    "Standardise what must be comparable across the group; deliberately permit local variation where regulation, customers or physics demand it.",
    "Rehearse migration with real data and real transactions; a phased rollout usually beats a big bang across multiple plants.",
  ],
  toc: [
    { id: "problem", label: "Why multi-site rollouts stall" },
    { id: "readiness-framework", label: "The Plant-to-ERP Readiness Framework" },
    { id: "current-state", label: "Mapping the real workflow" },
    { id: "master-data", label: "Master data: the underestimated workstream" },
    { id: "centralise-local", label: "What to centralise, what to keep local" },
    { id: "erp-boundary", label: "ERP, MES and the integration layer" },
    { id: "migration", label: "Migration and cutover" },
    { id: "adoption", label: "Shop-floor adoption" },
    { id: "roadmap", label: "A 90-day preparation roadmap" },
    { id: "governance", label: "Who owns what" },
    { id: "faq", label: "Frequently asked questions" },
    { id: "sources", label: "Research & Sources" },
  ],
  sections: [
    {
      id: "problem",
      title: "Why multi-site rollouts stall",
      paragraphs: [
        "The triggers are familiar across African manufacturers: a new plant comes online, a second site is acquired, stock control across locations becomes unmanageable, or head office can no longer reconcile what each plant is producing, holding and shipping. The decision is made to implement—or extend—an ERP across the group. Eighteen months later, one plant is live, one is resisting, and the group's reporting still runs through spreadsheets.",
        "The stall is rarely caused by the software. It is caused by the discovery, mid-implementation, that the plants do not actually operate the same way. Item codes differ. One plant's bill of materials includes packaging; another's does not. Approval authority for purchase orders differs by site history rather than by policy. Warehouse locations exist physically but not in any system. Each difference is small. Hundreds of them, discovered during configuration, turn a rollout into a negotiation.",
        "Readiness work moves that discovery earlier, when it is cheap. The manufacturer's task before implementation is not to choose screens and modules. It is to produce an honest map of how each plant actually runs, a decision about what the group will standardise, and master data clean enough to migrate. An implementation partner can configure against those inputs. No partner can invent them.",
      ],
      links: [
        { label: "Manufacturing digitalization in Africa", to: "/insights/manufacturing-digitalization-africa" },
        { label: "Manufacturing industry page", to: "/industries/manufacturing" },
      ],
    },
    {
      id: "readiness-framework",
      title: "The Plant-to-ERP Readiness Framework",
      variant: "framework",
      answer: "Five readiness workstreams run before and alongside configuration: workflow mapping, master data, standardisation decisions, migration rehearsal and adoption preparation. Each has an owner and an output the implementation team consumes.",
      table: {
        headers: ["Workstream", "Core question", "Output"],
        rows: [
          ["Workflow mapping", "How does work actually flow at each plant today?", "Current-state maps with named handoff owners"],
          ["Master data", "Are items, BOMs, locations and parties clean and consistent?", "Cleansed, governed master data ready to migrate"],
          ["Standardisation", "What must be identical across plants, and what may differ?", "A signed centralise-vs-local decision register"],
          ["Migration rehearsal", "Can real data and transactions survive the move?", "Mock-migration results and reconciliation evidence"],
          ["Adoption preparation", "Can each shift execute the new process on day one?", "Role-based training, SOPs and exception ownership"],
        ],
      },
      paragraphs: [
        "The framework's discipline is sequencing. Workflow mapping informs standardisation. Standardisation defines what master data must look like. Clean master data makes migration rehearsal meaningful. Rehearsal reveals what adoption preparation must cover. Running them in reverse order—configuring first and discovering later—is the expensive path most stalled rollouts took.",
      ],
    },
    {
      id: "current-state",
      title: "Map the real workflow, plant by plant",
      paragraphs: [
        "Current-state mapping follows one order through each plant: order intake → material issue → inventory movement → production → quality → dispatch → invoicing. At every step, record who creates the record, in which system or book, who acts on it next, and where the same fact is written down twice. The point is not documentation for its own sake; it is to find the handoffs where information is re-entered, delayed or lost.",
        "Do this per plant, not for an idealised composite plant. The differences that emerge—one site issues material against a works order, another against a verbal instruction; one records quality at the line, another at dispatch—are the rollout's real scope. A useful mapping session includes the people who actually do the work, not only the people who supervise it, because the informal steps are precisely the ones that break a configured process.",
        "Name an owner for every handoff discovered. When the ERP later routes that handoff through a screen instead of a phone call, that owner becomes the person who validates the new behaviour—and the person who raises the flag when reality does not match the configuration.",
      ],
    },
    {
      id: "master-data",
      title: "Master data is the workstream everyone underestimates",
      answer: "Item masters, units of measure, BOMs, routings, stock locations, suppliers, customers and costing assumptions must be cleaned, de-duplicated and governed before migration. This work routinely consumes more effort than the software configuration itself.",
      subsections: [
        { title: "Items and units of measure", paragraphs: ["The same raw material exists under three codes across two plants; one site buys in kilograms and issues in litres. De-duplication and unit-of-measure conversion rules must be agreed before migration, because every downstream record inherits them."] },
        { title: "Bills of materials and routings", paragraphs: ["BOMs that live in the production manager's spreadsheet or memory must be captured, validated against actual consumption and versioned. A BOM that is wrong in the ERP produces wrong material requirements at scale—faster and more confidently than before."] },
        { title: "Stock locations", paragraphs: ["Physical locations that exist but are not systematised—overflow yards, quarantine cages, the shelf behind the line—must be modelled, or stock accuracy collapses on the first day."] },
        { title: "Suppliers, customers and tax fields", paragraphs: ["Duplicate supplier records, inconsistent customer naming and incomplete registration or tax fields corrupt purchasing, invoicing and statutory reporting. Country-specific tax configuration belongs with a qualified local adviser; the readiness task is to ensure the underlying party data is clean enough to configure against."] },
        { title: "Costing assumptions", paragraphs: ["Standard versus actual costing, overhead allocation and scrap treatment differ between plants more often than finance expects. These are policy decisions, not data-entry tasks, and they belong in the standardisation register."] },
      ],
    },
    {
      id: "centralise-local",
      title: "Decide deliberately what to centralise and what to keep local",
      paragraphs: [
        "The default failure mode is to standardise everything by aspiration and then grant exceptions under pressure, one plant at a time, until the template is meaningless. The better approach is a decision register: every process, data structure and rule is explicitly classified as group-standard or plant-local, with a reason.",
        "Group-standard candidates are the things head office must compare or consolidate: item coding, chart of accounts mapping, BOM structure conventions, stock valuation, approval thresholds and the definitions behind management reports. Plant-local candidates are the things shaped by physical layout, customer-specific requirements, local regulation or genuinely different product processes.",
        "Multi-entity groups add two further decisions: inter-company transactions—transfer pricing, stock transfers, shared services—need agreed rules before go-live, and multi-currency operations need a stated policy on rates, revaluation and consolidation timing. Neither is exotic; both are routinely deferred until they become month-end emergencies.",
      ],
    },
    {
      id: "erp-boundary",
      title: "ERP, MES and the integration layer: get the boundary right",
      paragraphs: [
        "An ERP is a system of record for orders, inventory, production orders, purchasing and finance. It is not automatically the right tool for second-by-second line control, machine data collection or laboratory workflows. Manufacturing execution systems, weighbridge applications, quality tools and plant-floor devices all have legitimate roles. The readiness question is where each record lives and how the systems exchange it.",
        "The ISA-95 model is a useful reference here—not as a mandatory architecture, but as a vocabulary for separating business planning (what the ERP owns) from operations execution (what plant systems own) and defining the information that crosses between them. A manufacturer that can state this boundary clearly avoids the two classic mistakes: forcing the ERP to behave like a line-control system, and leaving plant data stranded outside the record that finance and planning rely on.",
        "Where an open, modular platform is preferred, ERPNext and the Frappe framework are one option worth evaluating for manufacturing and distribution workflows—particularly where the business wants to extend standard modules with custom workflows. It is one possibility among several, appropriate where fit is verified against the plant maps and the standardisation register, not a universal answer. Xyncwave's ERP and business-systems work includes ERPNext/Frappe implementation where the fit supports it.",
      ],
      links: [
        { label: "ERP & Business Systems", to: "/solutions/erp-business-systems" },
        { label: "ERP vs custom software", to: "/insights/erp-vs-custom-software" },
        { label: "API & System Integration", to: "/solutions/integration" },
      ],
    },
    {
      id: "migration",
      title: "Rehearse the migration; do not improvise it",
      answer: "Migration readiness means cleansed data, tested mappings, rehearsed cutover runs with real volumes, reconciliation evidence and a deliberate choice between phased rollout and big bang.",
      subsections: [
        { title: "Cleanse before you map", paragraphs: ["De-duplicate, archive the obsolete and complete the missing fields in the source systems first. Mapping dirty data into a new structure produces a clean-looking system with rotten foundations."] },
        { title: "Run mock migrations", paragraphs: ["Load real data into a test environment, run real transactions against it—receive, issue, produce, dispatch, invoice—and reconcile the results against the source. Repeat until the reconciliation is boring. Each rehearsal shortens the real cutover and surfaces mapping errors while they are still cheap."] },
        { title: "Choose phased or big bang deliberately", paragraphs: ["Across multiple plants, a phased rollout—pilot plant first, then waves—usually beats a simultaneous big bang: the pilot exposes template weaknesses before they replicate. The trade-off is a longer coexistence period where old and new run in parallel, which needs its own reconciliation discipline."] },
        { title: "Plan the cutover weekend like an operation", paragraphs: ["Stock takes, open-order capture, in-flight production and cut-off times all need owners and timings. The cutover runbook should read like a plant shutdown plan, because operationally that is what it is."] },
      ],
    },
    {
      id: "adoption",
      title: "The shop floor decides whether the rollout worked",
      paragraphs: [
        "An ERP can be perfectly configured and still fail at 06:10 on a Monday when the first shift cannot issue material the way the screen expects. Adoption preparation is therefore a readiness workstream, not a post-go-live activity. Role-based training—stores clerks, production supervisors, quality inspectors, dispatch—should be built around each role's actual transactions, practised on the migrated data from the final mock run.",
        "Connectivity and continuity deserve honest planning. Where plant connectivity is unreliable, define the offline fallback: which transactions can be captured on paper or offline devices, how they are back-entered, and who reconciles them. A fallback that is designed is a contingency; one that is improvised is a data-integrity incident.",
        "Standard operating procedures change when the system changes. Update them, print them, and name the exception owner for each: when the system will not let a transaction through and the truck is waiting, everyone should know who can decide what happens next. That single piece of clarity prevents more go-live damage than any training deck.",
      ],
    },
    {
      id: "roadmap",
      title: "An illustrative 90-day preparation roadmap",
      variant: "framework",
      paragraphs: [
        "The sequence below is illustrative—real timelines depend on plant count, data condition and team availability. The dependencies matter more than the durations.",
        "Ninety days of preparation feels slow until it is compared with eighteen months of stalled rollout. The output of this phase is not a configured system; it is the set of decisions and evidence that let configuration proceed without renegotiating the operating model every week.",
      ],
      table: {
        headers: ["Phase", "Focus", "Key outputs"],
        rows: [
          ["Days 1–30", "Current-state mapping at each plant; handoff owners named; standardisation register opened", "Workflow maps; decision register v1"],
          ["Days 31–60", "Master data cleansing and governance; centralise-vs-local decisions signed; integration boundary agreed", "Cleansed masters; signed register; system boundary"],
          ["Days 61–90", "Mock migration and transaction rehearsal; cutover runbook drafted; role-based training plan built", "Reconciliation evidence; runbook; training plan"],
        ],
      },
    },
    {
      id: "governance",
      title: "Who owns what",
      paragraphs: [
        "Multi-site rollouts fail governance before they fail technology. The minimum cast: a business owner with authority to settle standardisation disputes; operational SMEs from each plant who own the accuracy of the workflow maps; a process mapper who keeps the current-state documentation honest; an implementation lead who runs the partner relationship; a data owner accountable for master-data quality; and a validation owner—often finance—who signs off reconciliation evidence at each rehearsal.",
        "In a 50-to-500-person manufacturer, one person may hold two of these roles. What cannot be shared is accountability for the standardisation register: when plant A and plant B disagree about how a process should work, someone with group authority must decide, write it down and move on. Rollouts stall in the meetings where that decision is avoided.",
        "Regional context shapes the work but does not change its logic. UNIDO's industrial development reporting and the World Bank's logistics and enterprise research consistently point to infrastructure, skills and informality constraints across African manufacturing—realities that make offline fallbacks, role-based training and phased sequencing more important, not less. Country-specific regulatory and tax configuration should always be confirmed with qualified local advisers.",
      ],
      links: [
        { label: "Digital Transformation", to: "/solutions/digital-transformation" },
        { label: "Data Engineering & Analytics", to: "/solutions/data-engineering" },
      ],
    },
  ],
  assessment: {
    title: "Plant-to-ERP Readiness Check",
    intro: "Six questions about your rollout preparation. Your result appears before any contact details are requested.",
    leadType: "digitalization",
    cta: "Discuss a Multi-Site ERP Readiness Review",
    disclaimer: "This is a directional planning aid, not an implementation assessment of your specific environment.",
    questions: [
      { key: "mapping", prompt: "Has each plant's real order-to-dispatch workflow been mapped?", choices: [{ label: "Yes, per plant", value: "yes", score: 2 }, { label: "Partially", value: "partial", score: 1 }, { label: "Not yet", value: "no", score: 0 }] },
      { key: "master-data", prompt: "What is the state of item, BOM and location data?", choices: [{ label: "Cleansed and governed", value: "clean", score: 2 }, { label: "Known issues", value: "issues", score: 1 }, { label: "Unassessed", value: "unassessed", score: 0 }] },
      { key: "standardisation", prompt: "Is there a signed decision on what is standard vs local across plants?", choices: [{ label: "Yes", value: "yes", score: 2 }, { label: "In progress", value: "progress", score: 1 }, { label: "No", value: "no", score: 0 }] },
      { key: "rehearsal", prompt: "Has a mock migration with real data been run?", choices: [{ label: "Yes, with reconciliation", value: "yes", score: 2 }, { label: "Planned", value: "planned", score: 1 }, { label: "No", value: "no", score: 0 }] },
      { key: "adoption", prompt: "Is role-based shop-floor training prepared on real migrated data?", choices: [{ label: "Yes", value: "yes", score: 2 }, { label: "Generic training only", value: "generic", score: 1 }, { label: "Not started", value: "no", score: 0 }] },
      { key: "authority", prompt: "Can someone with group authority settle cross-plant process disputes?", choices: [{ label: "Yes, named", value: "yes", score: 2 }, { label: "Informally", value: "informal", score: 1 }, { label: "Unclear", value: "unclear", score: 0 }] },
    ],
    results: [
      { min: 0, title: "Pre-readiness", body: "The rollout would likely stall in configuration. Start with per-plant workflow mapping and a standardisation register before any implementation partner configures modules.", actions: ["Map one plant end to end", "Open the decision register", "Assess master data condition"] },
      { min: 5, title: "Partially prepared", body: "Some readiness workstreams are moving and others are not. Master data and migration rehearsal are the most common gaps—close them before committing to a go-live date.", actions: ["Cleanse item and BOM data", "Schedule a mock migration", "Name the dispute-settling authority"] },
      { min: 9, title: "Approaching ready", body: "The preparation discipline is largely in place. Confirm rehearsal evidence and the cutover runbook, then sequence plants deliberately rather than all at once.", actions: ["Verify reconciliation evidence", "Draft the cutover runbook", "Choose the pilot plant"] },
    ],
  },
  faq: [
    ["What is a multi-site manufacturing ERP rollout?", "The deployment of one ERP across several plants or sites, which requires standardising shared processes and data while deliberately permitting local variation where operations genuinely differ."],
    ["Why do manufacturing ERP implementations fail?", "Most stall on unmanaged differences between plants—item codes, BOMs, approval rules, warehouse structures—discovered during configuration rather than during preparation, plus master data that was never cleansed before migration."],
    ["Should all plants use identical processes?", "No. Standardise what the group must compare or consolidate—coding, valuation, approval thresholds, reporting definitions—and deliberately permit local variation where regulation, customers or physical operations demand it."],
    ["Is ERPNext suitable for manufacturing?", "ERPNext and the Frappe framework are one option worth evaluating for manufacturing and distribution workflows, particularly where custom workflow extension matters. Fit should be verified against mapped plant processes rather than assumed."],
    ["Phased rollout or big bang across plants?", "A phased rollout—pilot plant, then waves—usually reduces risk because template weaknesses surface once instead of everywhere. The cost is a longer parallel-running period that needs its own reconciliation discipline."],
    ["How long should ERP preparation take before implementation?", "Long enough to map each plant, cleanse master data, sign the standardisation register and rehearse migration with real data. An illustrative 90-day preparation phase is common for a small multi-plant group; complex estates take longer."],
  ],
  sources: [
    { name: "International Society of Automation", year: "2024", title: "ISA-95 / IEC 62264 — Enterprise-Control System Integration", url: "https://www.isa.org/standards-and-publications/isa-standards/isa95-standard", note: "Reference model for separating business planning from operations execution; used here as vocabulary, not mandated architecture." },
    { name: "UNIDO", year: "2025", title: "Industrial Development Report", url: "https://www.unido.org/resources-publications-flagship-publications-industrial-development-report-series", note: "Industrial development context for African manufacturing; consult the current edition for country data." },
    { name: "World Bank", year: "2023", title: "Connecting to Compete — Logistics Performance Index", url: "https://lpi.worldbank.org/", note: "Cross-country logistics context relevant to multi-site distribution planning." },
    { name: "Frappe", year: "2026", title: "ERPNext Manufacturing Documentation", url: "https://docs.frappe.io/erpnext", note: "Vendor documentation for ERPNext manufacturing modules; one evaluated option, not an endorsement." },
  ],
  finalHeadline: "The rollout succeeds in the preparation, not the configuration.",
  finalCta: "Discuss a Multi-Site ERP Readiness Review",
  finalBody: "Bring the plant maps you have, the ones you do not, and the go-live date you are working toward. Xyncwave will help you test whether the operation is ready for the system you are about to buy.",
  related: [
    { label: "Manufacturing digitalization in Africa", to: "/insights/manufacturing-digitalization-africa" },
    { label: "ERP & Business Systems", to: "/solutions/erp-business-systems" },
    { label: "ERP vs custom software", to: "/insights/erp-vs-custom-software" },
  ],
};

export const batchEightCArticles: BatchArticle[] = [manufacturingErp];
