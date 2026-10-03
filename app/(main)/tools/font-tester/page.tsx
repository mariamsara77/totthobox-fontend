import type { Metadata } from "next";
import FontTester from "@/components/tools/FontTester";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import { ToolPage } from "@/components/tools/ToolPage";
export const metadata: Metadata = { title:"Live Font Tester | বাংলা ফন্ট প্রিভিউ", description:"ব্রাউজারেই বাংলা ও English লেখা দিয়ে font family, size ও weight live preview করুন।", alternates:{canonical:"https://totthobox.com/tools/font-tester"}, openGraph:{title:"Live Font Tester | Totthobox",description:"বাংলা ও English font live preview tool।",url:"https://totthobox.com/tools/font-tester",type:"website"}, twitter:{card:"summary_large_image"} };
export default function Page(){return <ToolStructuredData name="Live Font Tester" description={metadata.description as string} path="/tools/font-tester"><ToolPage title="Live Font Tester" description={metadata.description as string} related={[{href:"/software/all",label:"Software Directory"},{href:"/tools/bangla-typing",label:"Bangla Typing"}]}><FontTester/></ToolPage></ToolStructuredData>}
