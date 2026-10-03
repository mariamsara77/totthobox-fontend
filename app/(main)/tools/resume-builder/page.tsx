import type { Metadata } from "next";
import { ResumeBuilder } from "@/components/tools/EducationTools";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import { ToolPage } from "@/components/tools/ToolPage";
export const metadata: Metadata = { title:"Bio-Data & Resume Builder | PDF Download", description:"সহজ bio-data ও resume তৈরি করে client-side PDF export করুন।", alternates:{canonical:"https://totthobox.com/tools/resume-builder"}, openGraph:{title:"Bio-Data & Resume Builder | Totthobox",description:"Simple resume builder with client-side PDF export।",url:"https://totthobox.com/tools/resume-builder",type:"website"}, twitter:{card:"summary_large_image"} };
export default function Page(){return <ToolStructuredData name="Bio-Data & Resume Builder" description={metadata.description as string} path="/tools/resume-builder" applicationCategory="EducationalApplication"><ToolPage title="Bio-Data & Resume Builder" description={metadata.description as string} related={[{href:"/tools/gpa-cgpa-calculator",label:"GPA Calculator"},{href:"/about-us",label:"About Totthobox"}]}><ResumeBuilder/></ToolPage></ToolStructuredData>}
