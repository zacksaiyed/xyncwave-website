import { createFileRoute, notFound } from "@tanstack/react-router";
import { SolutionPage } from "../components/commercial-pages";
import { getSolution } from "../lib/content";
import { pageHead } from "../lib/seo";
export const Route=createFileRoute("/solutions/$slug")({loader:({params})=>{const item=getSolution(params.slug);if(!item)throw notFound();return item},head:({loaderData})=>loaderData?pageHead(loaderData.metaTitle,loaderData.metaDescription,`/solutions/${loaderData.slug}`):pageHead("Solution unavailable","The requested solution could not be found.","/solutions"),component:Page,notFoundComponent:()=> <div className="mx-auto max-w-3xl px-5 py-32"><h1 className="text-5xl font-bold">Solution not found.</h1></div>});
function Page(){return <SolutionPage solution={Route.useLoaderData()}/>}