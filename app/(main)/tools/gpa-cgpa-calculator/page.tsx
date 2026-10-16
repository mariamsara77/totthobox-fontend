import type { Metadata } from "next";
import { GpaCalculator } from "@/components/tools/EducationTools";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import { ToolPage } from "@/components/tools/ToolPage";
export const metadata: Metadata = { title:"GPA / CGPA Calculator | SSC HSC NU", description:"SSC, HSC ও NU-এর জন্য marks-based GPA/CGPA হিসাবের lightweight calculator।", alternates:{canonical:"https://totthobox.com/tools/gpa-cgpa-calculator"}, openGraph:{title:"GPA / CGPA Calculator | Totthobox",description:"বাংলাদেশি শিক্ষার্থীদের জন্য GPA calculator।",url:"https://totthobox.com/tools/gpa-cgpa-calculator",type:"website"}, twitter:{card:"summary_large_image"} };
export default function Page(){return <ToolStructuredData name="GPA / CGPA Calculator" description={metadata.description as string} path="/tools/gpa-cgpa-calculator" applicationCategory="EducationalApplication"><ToolPage title="GPA / CGPA Calculator" description={metadata.description as string} related={[{href:"/tools/resume-builder",label:"Resume Builder"},{href:"/tools/word-and-character-counter",label:"Word Counter"}]}><GpaCalculator/></ToolPage></ToolStructuredData>}
