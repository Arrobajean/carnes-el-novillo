import type { Category } from "@/lib/types";

/** Categorías del catálogo, en el orden en que se muestran. */
export const CATEGORIES: readonly Category[] = [
  { slug: "vacuno", name: "Vacuno", description: "Cortes de res para asado, guiso y plancha." },
  { slug: "cerdo", name: "Cerdo", description: "Chuletas, costillar, pulpa y tocineta." },
  { slug: "aves", name: "Aves", description: "Pollo entero, cortes y carne molida de pollo." },
  { slug: "embutidos", name: "Embutidos", description: "Longanizas, anticuchos y otros elaborados." },
  { slug: "promociones", name: "Combos", description: "Packs armados para asados y la semana." },
  { slug: "congelados", name: "Congelados", description: "Vegetales y frutas congeladas." },
];
