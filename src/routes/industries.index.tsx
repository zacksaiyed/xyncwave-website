import { createFileRoute } from "@tanstack/react-router";
import { ListingPage } from "../components/commercial-pages";
import { pageHead } from "../lib/seo";
export const Route=createFileRoute("/industries/")({head:()=>pageHead("Industries","Explore how Xyncwave approaches connected digital systems across logistics, manufacturing, healthcare, fintech, and technology services.","/industries"),component:()=> <ListingPage type="industries"/>});