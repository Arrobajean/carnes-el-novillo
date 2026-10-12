/**
 * Reseñas de EJEMPLO (mock). No son opiniones reales de clientes: los nombres son ficticios,
 * no hay fotografías de personas y el bloque que las muestra siempre lleva el rótulo REVIEWS_LABEL.
 */
export const REVIEWS_LABEL = "Reseñas de ejemplo, no son reales";

export interface ExampleReview {
  /** Nombre ficticio. */
  author: string;
  text: string;
}

export const EXAMPLE_REVIEWS: readonly ExampleReview[] = [
  {
    author: "Camila R. (ficticia)",
    text: "Ejemplo de texto: elegí la franja por la web y pasé a recoger a la hora indicada.",
  },
  {
    author: "Javier M. (ficticio)",
    text: "Ejemplo de texto: buena selección de cortes para el fin de semana.",
  },
  {
    author: "Daniela P. (ficticia)",
    text: "Ejemplo de texto: me gustó ver el precio de cada corte antes de ir al local.",
  },
];
