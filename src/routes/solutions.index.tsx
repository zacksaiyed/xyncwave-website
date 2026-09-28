import { createFileRoute } from "@tanstack/react-router";
import { ListingPage } from "../components/commercial-pages";
import { pageHead } from "../lib/seo";
export const Route=createFileRoute("/solutions/")({head:()=>pageHead("Enterprise technology solutions","Explore business-first software engineering, digitalization, AI, cloud, data, integration, modernization, and engineering capacity.","/solutions"),component:()=> <ListingPage type="solutions"/>});