import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/content/site";
import { CartLink } from "./cart-link";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-md">
          <Image src="/images/brand/logo.webp" alt="" width={40} height={40} className="size-10 shrink-0" />
          <span className="truncate font-display text-lg font-bold text-ink sm:text-xl">{SITE.name}</span>
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-2 sm:gap-4">
          <Link href="/productos" className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-ink hover:bg-paper">
            Catálogo
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
