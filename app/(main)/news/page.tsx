import { redirect } from "next/navigation";

export const revalidate = 1800;

export default function NewsRedirect() {
  redirect("/news/headlines");
}
