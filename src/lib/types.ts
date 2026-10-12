/** Tipos compartidos entre servidor y cliente. Sin lógica. */

export type CategorySlug = "vacuno" | "cerdo" | "aves" | "embutidos" | "promociones" | "congelados";

export type ProductUnit = "kg" | "pack" | "bandeja" | "unidad";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export interface Product {
  slug: string;
  name: string;
  description: string;
  priceClp: number;
  category: CategorySlug;
  unit: ProductUnit;
  /** Ruta pública de la fotografía optimizada, o null si no hay foto. */
  image: string | null;
  featured?: boolean;
}

/** Línea de la cesta: solo identificador y cantidad. El precio se recalcula siempre en servidor. */
export interface CartItem {
  slug: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface PricedLine {
  slug: string;
  name: string;
  unit: ProductUnit;
  quantity: number;
  unitPriceClp: number;
  lineTotalClp: number;
}

export interface PickupSlot {
  date: string;
  time: string;
}

export type SlotRejection = "out_of_range" | "closed" | "too_soon" | "full";

export interface SlotStatus {
  time: string;
  available: boolean;
  reason?: SlotRejection;
}

export interface Reservation {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string };
  pickup: PickupSlot;
  notes: string;
  lines: PricedLine[];
  totalClp: number;
}
