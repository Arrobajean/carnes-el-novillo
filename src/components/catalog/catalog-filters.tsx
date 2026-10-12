import Link from "next/link";
import { CATEGORIES } from "@/content/categories";
import type { CategorySlug } from "@/lib/types";
import { INPUT_CLASS } from "@/components/ui/field";
import { buttonClass } from "@/components/ui/button";

interface CatalogFiltersProps {
  category?: CategorySlug | undefined;
  query: string;
}

/** Búsqueda por formulario GET (funciona sin JavaScript) y enlaces de categoría. */
export function CatalogFilters({ category, query }: CatalogFiltersProps) {
  const chip = "inline-flex min-h-11 items-center whitespace-nowrap rounded-full border-2 px-4 text-sm font-semibold";
  return (
    <div className="space-y-5">
      <form role="search" action="/productos" method="get" className="flex flex-col gap-3 sm:flex-row">
        {category ? <input type="hidden" name="categoria" value={category} /> : null}
        <label htmlFor="busqueda" className="sr-only">
          Buscar producto
        </label>
        <input
          id="busqueda"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Busca un corte o un combo"
          className={`${INPUT_CLASS} sm:max-w-md`}
        />
        <button type="submit" className={buttonClass("primary")}>
          Buscar
        </button>
      </form>
      <nav aria-label="Categorías">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={query ? `/productos?q=${encodeURIComponent(query)}` : "/productos"}
              aria-current={category ? undefined : "page"}
              className={`${chip} ${!category ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink"}`}
            >
              Todo
            </Link>
          </li>
          {CATEGORIES.map((item) => {
            const active = item.slug === category;
            return (
              <li key={item.slug}>
                <Link
                  href={`/productos?categoria=${item.slug}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                  aria-current={active ? "page" : undefined}
                  className={`${chip} ${active ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink"}`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
