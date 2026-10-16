import type { Metadata } from "next";
import { PdfMerger } from "@/components/tools/PdfTools";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import { ToolPage } from "@/components/tools/ToolPage";
export const metadata: Metadata = { title:"PDF Merger | একাধিক PDF একত্র করুন", description:"একাধিক PDF browser-এর ভেতরে merge করে একটি PDF download করুন।", alternates:{canonical:"https://totthobox.com/tools/pdf-merger"}, openGraph:{title:"PDF Merger | Totthobox",description:"Client-side PDF merge tool।",url:"https://totthobox.com/tools/pdf-merger",type:"website"}, twitter:{card:"summary_large_image"} };
export default function Page(){return <ToolStructuredData name="PDF Merger" description={metadata.description as string} path="/tools/pdf-merger"><ToolPage title="PDF Merger" description={metadata.description as string} related={[{href:"/tools/pdf-compressor",label:"PDF Optimizer"},{href:"/pdf-editor",label:"PDF Editor"}]}><PdfMerger/></ToolPage></ToolStructuredData>}
