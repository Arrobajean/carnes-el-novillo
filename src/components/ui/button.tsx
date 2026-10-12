import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-base font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-strong",
  secondary: "border-2 border-ink text-ink hover:bg-surface",
};

export function buttonClass(variant: Variant = "primary"): string {
  return `${BASE} ${VARIANTS[variant]}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({ variant = "primary", className = "", children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={`${buttonClass(variant)} ${className}`} {...rest}>
      {children}
    </button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  children: ReactNode;
}

export function ButtonLink({ href, variant = "primary", children }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClass(variant)}>
      {children}
    </Link>
  );
}
