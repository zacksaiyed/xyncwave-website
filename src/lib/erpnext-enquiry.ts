import { z } from "zod";

export const erpnextProjectTypes = ["New ERPNext implementation", "Upgrade or improve ERPNext", "Customize Frappe", "Integrate systems", "Evaluate ERP replacement", "Other"] as const;

export const erpnextEnquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  workEmail: z.string().trim().email("Please enter a valid business email.").max(255),
  company: z.string().trim().min(1, "Please enter your company.").max(160),
  projectType: z.enum(erpnextProjectTypes),
  country: z.string().trim().max(120),
  role: z.string().trim().max(120),
  timeline: z.string().trim().max(120),
  currentSystems: z.string().trim().max(500),
  message: z.string().trim().max(3000),
  website: z.string().max(0, "Please try again."),
});

export function erpnextStage(projectType: typeof erpnextProjectTypes[number]) {
  if (projectType === "Upgrade or improve ERPNext") return "upgrade";
  if (projectType === "Integrate systems" || projectType === "Customize Frappe") return "integration";
  if (projectType === "New ERPNext implementation") return "active_implementation";
  return "evaluation";
}