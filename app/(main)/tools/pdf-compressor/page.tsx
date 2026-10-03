import type { Metadata } from "next";
import { PdfCompressor } from "@/components/tools/PdfTools";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import { ToolPage } from "@/components/tools/ToolPage";
export const metadata: Metadata = { title:"PDF Compressor & Optimizer | PDF কমপ্রেস", description:"PDF structure optimize করে browser থেকেই নতুন PDF তৈরি করুন।", alternates:{canonical:"https://totthobox.com/tools/pdf-compressor"}, openGraph:{title:"PDF Compressor & Optimizer | Totthobox",description:"Client-side PDF optimization tool।",url:"https://totthobox.com/tools/pdf-compressor",type:"website"}, twitter:{card:"summary_large_image"} };
export default function Page(){return <ToolStructuredData name="PDF Compressor & Optimizer" description={metadata.description as string} path="/tools/pdf-compressor"><ToolPage title="PDF Compressor & Optimizer" description={metadata.description as string} related={[{href:"/tools/pdf-merger",label:"PDF Merger"},{href:"/pdf-editor",label:"PDF Editor"}]}><PdfCompressor/></ToolPage></ToolStructuredData>}
