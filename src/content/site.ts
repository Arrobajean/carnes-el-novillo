/** Datos del negocio. Dirección, teléfono y redes proceden de la web anterior del negocio. */
export const SITE = {
  name: "Carnes El Novillo",
  description: "Catálogo y reserva de recogida en tienda para Carnes El Novillo, carnicería de barrio en Independencia, Santiago.",
  address: {
    street: "Pablo Urzúa 1489, local 2",
    district: "Independencia, Santiago, Chile",
    mapsUrl: "https://maps.app.goo.gl/KLxWBLKvu5YvCrQk8",
  },
  phone: { display: "+56 9 5840 4733", href: "tel:+56958404733" },
  email: "contacto@carneselnovillo.cl",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/carneselnovillo/" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61550850388071" },
  ],
  /** Moneda de los importes: pesos chilenos. */
  currency: "CLP",
  /** Zona horaria de las franjas de recogida. */
  timezone: "America/Santiago",
} as const;
