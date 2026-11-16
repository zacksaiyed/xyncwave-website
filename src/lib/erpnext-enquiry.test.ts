import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { erpnextEnquirySchema, erpnextProjectTypes, erpnextStage } from "./erpnext-enquiry";
import { SITE_ORIGIN } from "./site-origin";

const valid = { name: "ERP Review", workEmail: "review@example.com", company: "Review Company", projectType: "New ERPNext implementation", country: "", role: "", timeline: "", currentSystems: "", message: "", website: "" };
describe("ERPNext enquiry rules", () => {
  test("name is required", () => assert.equal(erpnextEnquirySchema.safeParse({ ...valid, name: " " }).success, false));
  test("business email must be a valid email", () => assert.equal(erpnextEnquirySchema.safeParse({ ...valid, workEmail: "invalid" }).success, false));
  test("company is required", () => assert.equal(erpnextEnquirySchema.safeParse({ ...valid, company: " " }).success, false));
  test("project need is required", () => assert.equal(erpnextEnquirySchema.safeParse({ ...valid, projectType: "" }).success, false));
  test("accepts all six owner-specified project types", () => {
    assert.deepEqual(erpnextProjectTypes, ["New ERPNext implementation", "Upgrade or improve ERPNext", "Customize Frappe", "Integrate systems", "Evaluate ERP replacement", "Other"]);
    for (const projectType of erpnextProjectTypes) assert.equal(erpnextEnquirySchema.safeParse({ ...valid, projectType }).success, true);
  });
  test("country, role, timeline, current systems and message are optional", () => assert.equal(erpnextEnquirySchema.safeParse(valid).success, true));
  test("honeypot blocks automated submissions", () => assert.equal(erpnextEnquirySchema.safeParse({ ...valid, website: "https://spam.example" }).success, false));
  test("stage reflects project need", () => {
    assert.equal(erpnextStage("Upgrade or improve ERPNext"), "upgrade");
    assert.equal(erpnextStage("Integrate systems"), "integration");
    assert.equal(erpnextStage("Evaluate ERP replacement"), "evaluation");
  });
  test("production canonicals use the owner's domain", () => assert.equal(SITE_ORIGIN, "https://xyncwave.com"));
});