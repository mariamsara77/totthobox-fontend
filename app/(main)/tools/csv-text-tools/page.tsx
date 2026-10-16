import type { Metadata } from "next";
import { CsvTextTools } from "@/components/tools/TextUtilities";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import { ToolPage } from "@/components/tools/ToolPage";
export const metadata: Metadata = { title:"CSV & Text Tools | অনলাইন CSV টুল", description:"CSV normalize, line count ও text statistics browser-এর ভেতরেই ব্যবহার করুন।", alternates:{canonical:"https://totthobox.com/tools/csv-text-tools"}, openGraph:{title:"CSV & Text Tools | Totthobox",description:"Lightweight CSV ও text utility tools।",url:"https://totthobox.com/tools/csv-text-tools",type:"website"}, twitter:{card:"summary_large_image"} };
export default function Page(){return <ToolStructuredData name="CSV & Text Tools" description={metadata.description as string} path="/tools/csv-text-tools"><ToolPage title="CSV & Text Tools" description={metadata.description as string} related={[{href:"/tools/word-and-character-counter",label:"Word Counter"},{href:"/tools/case-converter",label:"Case Converter"}]}><CsvTextTools/></ToolPage></ToolStructuredData>}
