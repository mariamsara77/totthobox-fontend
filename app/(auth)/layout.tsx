import Link from "next/link";
import BrandIcon from "@/components/BrandIcon";
import { AppProviders } from "../providers";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
  <div className="flex h-screen  items-center justify-center w-full p-4">
    <div className="w-md space-y-4">
  <header className="flex justify-center">
    <Link href="/">
      <BrandIcon className="size-12" />
    </Link>
  </header>
  
  <main>
    <AppProviders>{children}</AppProviders>
  </main>
    </div>
</div>
  );
}