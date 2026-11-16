// Additional decision-support depth for Solution and Industry pages.
// Rendered after existing page content; never replaces approved copy.
export type DepthItem = { title: string; body: string };
export type PageDepth = {
  considerationsTitle: string;
  considerations: DepthItem[];
  evaluate: DepthItem[];
  illustrative: string[];
};

export const solutionDepth: Record<string, PageDepth> = {
  "software-engineering": {
    considerationsTitle: "Engineering decisions that shape a custom system",
    considerations: [
      { title: "Domain model before screens", body: "The records, states and rules the business depends on are agreed first, so the interface reflects how work actually moves rather than how a template assumes it does." },
      { title: "Build versus configure", body: "Each component is checked against what existing platforms already do well. Custom code is reserved for the parts that differentiate the workflow or that packaged software handles poorly." },
      { title: "Release safety", body: "Automated tests, review and staged environments are set up early, so the system can keep changing after launch without each release becoming a risk." },
      { title: "Operational ownership", body: "Logging, monitoring, documentation and access control are treated as part of the product, so the client team can run and extend it." },
    ],
    evaluate: [
      { title: "Is the requirement stable enough?", body: "A first release needs a clear core workflow, even if later phases remain open." },
      { title: "Who owns product decisions?", body: "Custom software moves faster when one accountable person can prioritise and accept work." },
      { title: "What must it connect to?", body: "Identity, ERP, payments or data platforms often set the real scope and timeline." },
    ],
    illustrative: ["A field-service application replacing paper job sheets", "A customer portal sitting on top of an existing ERP", "An internal approvals tool that removes email-based sign-off"],
  },
  "digital-transformation": {
    considerationsTitle: "What makes operational change hold",
    considerations: [
      { title: "Map the real workflow", body: "The documented process and the lived process are often different. Observing handoffs, workarounds and spreadsheets shows where information actually breaks." },
      { title: "Sequence by dependency", body: "Some workflows feed others. Digitalizing the upstream step first prevents rework when the next stage is connected." },
      { title: "Adoption is part of delivery", body: "Training, role changes and parallel running are planned alongside the software, because a system people avoid does not change the operation." },
      { title: "Measure what changes", body: "A small set of agreed operational indicators is defined before work starts, so progress can be judged on evidence rather than impression." },
    ],
    evaluate: [
      { title: "Where is the most costly handoff?", body: "Starting where errors or delays are most visible builds momentum and evidence." },
      { title: "Who will run the new process?", body: "Named process owners need to be involved from discovery, not introduced at go-live." },
      { title: "What can stay as it is?", body: "Not every spreadsheet needs replacing. Deciding what stays manual keeps scope honest." },
    ],
    illustrative: ["Moving branch-level order tracking from spreadsheets to one shared workflow", "Replacing WhatsApp-based job dispatch with structured assignments", "Consolidating month-end operational reporting into one source"],
  },
  "ai-automation": {
    considerationsTitle: "Putting AI into a workflow responsibly",
    considerations: [
      { title: "Rules before models", body: "Many steps are better served by deterministic rules. AI is applied where judgement over unstructured input is genuinely needed." },
      { title: "Human review points", body: "The workflow defines where a person confirms, corrects or overrides an automated decision, and what happens when confidence is low." },
      { title: "Data access and privacy", body: "The documents and records an AI step can see are scoped deliberately, with sensitive information handled under the organisation's own policies." },
      { title: "Evaluation and monitoring", body: "Outputs are tested against real examples before release and monitored afterwards, so drift or errors are caught early." },
    ],
    evaluate: [
      { title: "Is the process stable?", body: "Automating an inconsistent process tends to automate the inconsistency." },
      { title: "Is there usable data?", body: "Examples of past inputs and correct outcomes are needed to test whether automation is working." },
      { title: "What is the cost of a wrong answer?", body: "The higher the consequence, the more review and control the design needs." },
    ],
    illustrative: ["Classifying inbound documents before human review", "Drafting responses to routine service requests for approval", "Extracting fields from invoices into a finance workflow"],
  },
  "application-modernization": {
    considerationsTitle: "Managing modernization risk",
    considerations: [
      { title: "Understand before changing", body: "Dependencies, hidden business rules and data quality are mapped first, because legacy systems often encode decisions nobody documented." },
      { title: "Incremental replacement", body: "Where possible, parts of the system are replaced behind stable interfaces, so the business keeps running while the application changes underneath." },
      { title: "Data migration as its own workstream", body: "Migration is planned, rehearsed and reconciled separately rather than treated as a final cut-over task." },
      { title: "Rollback and continuity", body: "Each release has a defined way back, and critical operations have a continuity plan during transition." },
    ],
    evaluate: [
      { title: "What is the actual constraint?", body: "Cost of change, performance, security, skills or vendor support each point to a different intervention." },
      { title: "Who still understands the system?", body: "Knowledge held by a few people needs capturing before any significant change." },
      { title: "What must not break?", body: "Agree the business-critical paths that need protection throughout the work." },
    ],
    illustrative: ["Moving a desktop application to a web interface without changing core logic", "Separating a reporting workload from a transactional database", "Replacing an unsupported framework one module at a time"],
  },
  "cloud-platform-engineering": {
    considerationsTitle: "Foundations that keep delivery reliable",
    considerations: [
      { title: "Infrastructure as code", body: "Environments are defined in version-controlled code, so they can be reviewed, reproduced and recovered consistently." },
      { title: "Delivery pipelines", body: "Build, test and deployment are automated, giving teams a repeatable path from change to production." },
      { title: "Security and access", body: "Identity, network boundaries, secrets and least-privilege access are designed in rather than added after an incident." },
      { title: "Observability and cost", body: "Logs, metrics and alerts show how the platform behaves, and cost visibility prevents cloud spend drifting unnoticed." },
    ],
    evaluate: [
      { title: "What is the platform for?", body: "Workload patterns, availability needs and data residency shape the right architecture." },
      { title: "Who will operate it?", body: "The design should match the skills and on-call capacity of the team that runs it." },
      { title: "Migrate or modernize?", body: "Moving a workload unchanged and redesigning it are different decisions with different costs." },
    ],
    illustrative: ["Standardising environments across development, staging and production", "Introducing automated deployments for a manually released application", "Consolidating scattered cloud accounts under one governed structure"],
  },
  "data-engineering": {
    considerationsTitle: "Making data dependable",
    considerations: [
      { title: "Source ownership", body: "Each important figure is traced to the system and team that owns it, so disagreements can be resolved at the source." },
      { title: "Modelled, tested transformations", body: "Business logic lives in version-controlled models with tests, not in individual spreadsheets or report formulas." },
      { title: "Freshness and failure handling", body: "Pipelines report when data is late or wrong, so users know whether a dashboard can be trusted today." },
      { title: "Definitions people agree on", body: "Shared definitions for key measures prevent each department calculating the same number differently." },
    ],
    evaluate: [
      { title: "Which decisions need better data?", body: "Starting from a small set of real questions keeps the platform focused." },
      { title: "How clean are the sources?", body: "Source data quality often determines more of the effort than the tooling." },
      { title: "Who maintains the models?", body: "A data platform needs ongoing ownership once it is built." },
    ],
    illustrative: ["Replacing manual weekly consolidation with an automated reporting layer", "Moving warehouse logic from stored procedures into tested models", "Creating one operational dashboard across several branch systems"],
  },
  integration: {
    considerationsTitle: "Designing integrations that stay reliable",
    considerations: [
      { title: "System of record", body: "For each piece of information, one system is agreed as the owner, so integrations do not overwrite each other." },
      { title: "Synchronous or event-driven", body: "Some exchanges need an immediate answer; others are better handled as queued events that tolerate delays and outages." },
      { title: "Failure and retry", body: "Every interface defines what happens when the other side is unavailable, including retries, alerts and manual recovery." },
      { title: "Monitoring and traceability", body: "Messages can be traced end to end, so a missing record can be found rather than guessed at." },
    ],
    evaluate: [
      { title: "What actually needs to move?", body: "Listing the records, direction and frequency clarifies scope quickly." },
      { title: "What do the systems allow?", body: "Available APIs, licensing limits and vendor constraints shape the options." },
      { title: "Who handles exceptions?", body: "A named owner for failed or conflicting records prevents silent data loss." },
    ],
    illustrative: ["Synchronising orders between an e-commerce platform and an ERP", "Feeding field-app job updates back into a central system", "Connecting identity, payments and reporting services for a digital product"],
  },
  "engineering-capacity": {
    considerationsTitle: "Making added capacity productive",
    considerations: [
      { title: "Clear ownership model", body: "Before anyone starts, it is agreed who sets priorities, makes technical decisions, reviews work and accepts delivery." },
      { title: "Onboarding into your practices", body: "Engineers work within the client's repositories, standards, tools and ceremonies, rather than a parallel process." },
      { title: "Overlap and communication", body: "Working-hour overlap, meeting rhythm and escalation routes are agreed upfront to avoid slow feedback loops." },
      { title: "Knowledge retention", body: "Documentation and code review keep knowledge in the client team, so capacity can scale down without losing context." },
    ],
    evaluate: [
      { title: "Capacity or capability?", body: "Adding people for volume is different from adding a skill the team does not have." },
      { title: "How long is the need?", body: "Duration helps decide between individual engineers, a pod or a project team." },
      { title: "Who will lead the work?", body: "Added engineers need direction from someone with product and technical context." },
    ],
    illustrative: ["Adding a frontend pod to clear a product backlog", "Bringing in a data engineer for a defined platform build", "Providing white-label delivery capacity for an agency's client"],
  },
  "erp-business-systems": {
    considerationsTitle: "Fitting ERP to the operation",
    considerations: [
      { title: "Configure first, customise carefully", body: "Standard ERP features are used wherever they fit. Customisation is limited to genuine gaps, so upgrades stay manageable." },
      { title: "Extend around the core", body: "Specialist workflows can sit in connected applications, keeping the ERP as the system of record without bending it out of shape." },
      { title: "Master data discipline", body: "Customers, items, locations and accounts need agreed owners and rules before the system goes live." },
      { title: "ERPNext / Frappe where suitable", body: "For organisations that want an open-source, adaptable platform, ERPNext and Frappe can be a practical base for operational workflows." },
    ],
    evaluate: [
      { title: "What does the ERP not cover today?", body: "The gaps people fill with spreadsheets usually define the real requirement." },
      { title: "How standard are your processes?", body: "Highly specific processes may justify extension; common ones rarely do." },
      { title: "Who owns the system internally?", body: "ERP needs ongoing ownership for changes, users and data quality." },
    ],
    illustrative: ["Extending an ERP with a mobile field workflow", "Connecting ERP stock records to warehouse operations", "Implementing ERPNext for a growing multi-branch operation"],
  },
};

export const industryDepth: Record<string, PageDepth> = {
  logistics: {
    considerationsTitle: "System and data considerations in logistics",
    considerations: [
      { title: "Status from the field", body: "Trip, delivery and job status needs to come from the people doing the work, through tools that work on mobile and with patchy connectivity." },
      { title: "Cost at trip level", body: "Fuel, tolls, allowances and other trip costs are easier to control when captured against the trip rather than reconciled later. Xyncwave's TripOps product is built around this workflow." },
      { title: "Connecting ERP, warehouse and fleet", body: "Stock, orders, vehicles and billing often sit in separate systems; integration decides whether the operation has one view or several." },
      { title: "Proof of delivery and evidence", body: "Photos, signatures and timestamps support billing and dispute resolution when they are attached to the right record." },
    ],
    evaluate: [
      { title: "Where does visibility break?", body: "Identify the point where dispatch, warehouse or finance stops seeing what is happening." },
      { title: "What do drivers and technicians use today?", body: "Field adoption depends on fitting their existing habits and devices." },
      { title: "Which systems must stay?", body: "Existing ERP or accounting platforms usually remain and need connecting." },
    ],
    illustrative: ["Tracking trip expenses and budgets alongside dispatch", "Bringing technician job updates into a central platform", "Linking warehouse stock movements to delivery records"],
  },
  manufacturing: {
    considerationsTitle: "System and data considerations in manufacturing",
    considerations: [
      { title: "Plan to production to dispatch", body: "Planning, production, quality and dispatch often run on different tools; connecting the handoffs matters more than any single system." },
      { title: "Traceability", body: "Batch, lot and material records need to follow the product, so quality issues can be traced without manual searching." },
      { title: "Shop-floor data capture", body: "Data entered on the floor must be quick and simple, or it will be recorded late or not at all." },
      { title: "ERP as the backbone", body: "Inventory, costing and orders usually belong in the ERP, with specialist workflows connected around it." },
    ],
    evaluate: [
      { title: "Which handoff causes most delay?", body: "Start where information waits longest between teams." },
      { title: "How is quality recorded today?", body: "Paper and spreadsheet quality records are a common first digitalization target." },
      { title: "What data already exists?", body: "Machine and ERP data may already answer questions people assume need new systems." },
    ],
    illustrative: ["Digitalizing quality inspection records", "Connecting production output to ERP inventory", "Building a daily plant performance view from existing data"],
  },
  healthcare: {
    considerationsTitle: "System and data considerations in healthcare",
    considerations: [
      { title: "Administrative workflow first", body: "Scheduling, departmental handoffs, billing and records administration are often where operational friction is greatest." },
      { title: "Role-based access", body: "Who can see and change each record is designed carefully, in line with the organisation's own policies and obligations." },
      { title: "Validated data pipelines", body: "Records moving between systems pass through visible validation stages, so errors are found before they reach billing or reporting." },
      { title: "Working with existing systems", body: "Most organisations already run core systems; new work usually connects to them rather than replacing them." },
    ],
    evaluate: [
      { title: "Which workflow causes most rework?", body: "Duplicate entry and manual handoffs are common starting points." },
      { title: "What policies apply?", body: "Your data-handling and privacy requirements shape the design from day one." },
      { title: "Who will own the change?", body: "Clinical and administrative stakeholders both need a voice." },
    ],
    illustrative: ["Connecting departmental workflows in a hospital operations platform", "Validating records through a monitored data pipeline", "Consolidating operational reporting across departments"],
  },
  fintech: {
    considerationsTitle: "System and data considerations in fintech",
    considerations: [
      { title: "Clear state ownership", body: "Accounts, balances, orders and transactions need one authoritative owner, with every other service treating its data as a copy." },
      { title: "Asynchronous, recoverable workflows", body: "Payment, settlement and partner interactions are designed to survive delays and failures without losing or duplicating transactions." },
      { title: "Partner and API ecosystem", body: "Identity, payments, market data and banking partners each bring their own interfaces and limits that shape the architecture." },
      { title: "Auditability", body: "Changes to financial records are traceable, supporting the organisation's own control and reporting requirements." },
    ],
    evaluate: [
      { title: "What is core versus commodity?", body: "Decide which capabilities differentiate the product and which can be integrated." },
      { title: "How will it scale?", body: "Growth in users and transactions changes architecture and team needs." },
      { title: "What do partners require?", body: "Partner onboarding and technical requirements often set the critical path." },
    ],
    illustrative: ["Connecting onboarding, authentication and transaction workflows", "Building reliable reporting from transaction data", "Adding engineering capacity for a post-funding roadmap"],
  },
  "technology-it-services": {
    considerationsTitle: "Delivery considerations for technology companies",
    considerations: [
      { title: "White-label delivery", body: "Engineering can work under the client's brand and process, with clear rules about communication and ownership of client relationships." },
      { title: "Specialist skills on demand", body: "Cloud, data or modernization skills can be added for a defined period without permanent hiring." },
      { title: "Shared engineering standards", body: "Code review, testing and documentation follow the client's standards so work is indistinguishable from in-house delivery." },
      { title: "Scaling up and down", body: "Capacity is planned around delivery commitments, with knowledge kept in the client's repositories." },
    ],
    evaluate: [
      { title: "What commitment is at risk?", body: "A specific client deadline or roadmap item helps size the right support." },
      { title: "Who directs the work?", body: "Added capacity needs a lead with product and technical context." },
      { title: "How visible should we be?", body: "Decide early whether delivery is white-label or jointly branded." },
    ],
    illustrative: ["Supporting an agency with white-label application delivery", "Adding a modernization specialist to an existing team", "Providing a pod to absorb a temporary roadmap peak"],
  },
};
