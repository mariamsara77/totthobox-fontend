import type { Metadata } from "next";
import { CaseConverter } from "@/components/tools/TextUtilities";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import { ToolPage } from "@/components/tools/ToolPage";
export const metadata: Metadata = { title:"Case Converter | Uppercase Lowercase Title Case", description:"English text uppercase, lowercase, title case ও sentence case-এ রূপান্তর করুন।", alternates:{canonical:"https://totthobox.com/tools/case-converter"}, openGraph:{title:"Case Converter | Totthobox",description:"Fast client-side text case converter।",url:"https://totthobox.com/tools/case-converter",type:"website"}, twitter:{card:"summary_large_image"} };
export default function Page(){return <ToolStructuredData name="Case Converter" description={metadata.description as string} path="/tools/case-converter"><ToolPage title="Case Converter" description={metadata.description as string} related={[{href:"/tools/word-and-character-counter",label:"Word Counter"},{href:"/tools/csv-text-tools",label:"CSV Tools"}]}><CaseConverter/></ToolPage></ToolStructuredData>}
