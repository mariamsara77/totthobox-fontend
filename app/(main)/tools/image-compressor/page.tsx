import type { Metadata } from "next";
import { ImageCompressor } from "@/components/tools/MediaTools";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import { ToolPage } from "@/components/tools/ToolPage";
export const metadata: Metadata = { title:"Image Compressor & Resizer | অনলাইনে ছবি কমপ্রেস", description:"ছবি browser-এর ভেতরেই resize ও JPEG compress করুন। কোনো upload ছাড়াই client-side processing।", alternates:{canonical:"https://totthobox.com/tools/image-compressor"}, openGraph:{title:"Image Compressor & Resizer | Totthobox",description:"Client-side image compression ও resize tool।",url:"https://totthobox.com/tools/image-compressor",type:"website"}, twitter:{card:"summary_large_image"} };
export default function Page(){return <ToolStructuredData name="Image Compressor & Resizer" description={metadata.description as string} path="/tools/image-compressor"><ToolPage title="Image Compressor & Resizer" description={metadata.description as string} related={[{href:"/tools/image-resizer",label:"Image Resizer"},{href:"/pdf-editor",label:"PDF Editor"}]}><ImageCompressor/></ToolPage></ToolStructuredData>}
