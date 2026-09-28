import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "../components/static-page";
import { CTASection } from "../components/page-sections";
import { FounderFeature, TeamComposition, CompanyNews, DeliveryPrinciples, CareersSection } from "../components/about-sections";
import { pageHead } from "../lib/seo";
export const Route=createFileRoute("/about")({head:()=>pageHead("About Xyncwave Corporation LLP","Learn how Xyncwave approaches software, operational technology, engineering decisions, and long-term client responsibility.","/about"),component:()=> <><StaticPage cta={false} eyebrow="About Xyncwave" title="Technology should make the business easier to understand, operate, and change." description="Xyncwave Corporation LLP is an engineering-led technology company working where operating processes, software systems, and delivery capability meet."/><FounderFeature/><TeamComposition/><DeliveryPrinciples/><CompanyNews/><CareersSection/><CTASection/></>});
