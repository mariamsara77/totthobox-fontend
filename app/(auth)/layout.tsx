import Link from "next/link";
import BrandIcon from "@/components/BrandIcon";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-3 py-6 sm:px-4">
      <div className="w-full max-w-lg space-y-4">
        <header className="flex justify-center">
          <Link href="/" aria-label="তথ্যবক্স হোম পেজ">
            <BrandIcon className="size-12" />
          </Link>
        </header>

        <main id="main-content" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
