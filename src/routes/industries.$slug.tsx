import { createFileRoute, notFound } from "@tanstack/react-router";
import { IndustryPage } from "../components/commercial-pages";
import { getIndustry } from "../lib/content";
import { pageHead } from "../lib/seo";
export const Route=createFileRoute("/industries/$slug")({loader:({params})=>{const item=getIndustry(params.slug);if(!item)throw notFound();return item},head:({loaderData})=>loaderData?pageHead(loaderData.metaTitle,loaderData.metaDescription,`/industries/${loaderData.slug}`):pageHead("Industry unavailable","The requested industry page could not be found.","/industries"),component:Page});
function Page(){return <IndustryPage industry={Route.useLoaderData()}/>}