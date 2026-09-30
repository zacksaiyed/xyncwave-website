export type Campaign = {
  title: string;
  description: string;
  type: "digitalization" | "engineering" | "ai";
  audience: string;
  points: string[];
};

export const campaigns: Record<string, Campaign> = {
  "connected-logistics": {
    title: "Connect the operational systems behind every shipment.",
    description:
      "For logistics leaders replacing manual handoffs and fragmented tracking with clearer operational visibility.",
    type: "digitalization",
    audience: "Logistics operations",
    points: [
      "Map the current tracking workflow",
      "Identify system and data gaps",
      "Define a focused first intervention",
    ],
  },
  "delivery-capacity": {
    title: "You win the client. We help you deliver.",
    description:
      "Flexible engineering capability for technology businesses facing a deadline, backlog, or specialist gap.",
    type: "engineering",
    audience: "Technology and IT services",
    points: ["Specialist engineers", "Dedicated delivery pods", "White-label project teams"],
  },
  "practical-ai": {
    title: "Find the AI opportunity worth testing.",
    description:
      "A focused exploration for leaders who need a grounded use case, not another disconnected experiment.",
    type: "ai",
    audience: "Operations and technology leaders",
    points: [
      "Start with recurring work",
      "Test available information",
      "Define a bounded proof-of-concept",
    ],
  },
};

export const campaignSlugs = Object.keys(campaigns);
