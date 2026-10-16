import type { Metadata } from "next";
import { BanglaNumberWords } from "@/components/tools/TextUtilities";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import { ToolPage } from "@/components/tools/ToolPage";
export const metadata: Metadata = { title:"বাংলা সংখ্যা থেকে শব্দ | Number to Bangla Words", description:"সংখ্যাকে বাংলা শব্দে রূপান্তর করার দ্রুত client-side converter।", alternates:{canonical:"https://totthobox.com/tools/bangla-number-to-words"}, openGraph:{title:"বাংলা সংখ্যা থেকে শব্দ | Totthobox",description:"Number to Bangla words converter।",url:"https://totthobox.com/tools/bangla-number-to-words",type:"website"}, twitter:{card:"summary_large_image"} };
export default function Page(){return <ToolStructuredData name="বাংলা সংখ্যা থেকে শব্দ" description={metadata.description as string} path="/tools/bangla-number-to-words"><ToolPage title="বাংলা সংখ্যা থেকে শব্দ" description={metadata.description as string} related={[{href:"/converter/number-to-word",label:"Number to Word"},{href:"/tools/word-and-character-counter",label:"Word Counter"}]}><BanglaNumberWords/></ToolPage></ToolStructuredData>}
