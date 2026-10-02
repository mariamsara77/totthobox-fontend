import Link from "next/link";
import BrandIcon from "@/components/BrandIcon";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="site-page site-page-auth flex min-h-screen w-full items-center justify-center px-3 py-8 sm:px-4 sm:py-10">
      <div className="w-full max-w-lg space-y-4">
        <header className="flex justify-center">
          <Link href="/">
            <span className="brand-mark flex size-14 items-center justify-center rounded-[1.2rem] p-2"><BrandIcon className="size-10" /></span>
          </Link>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
