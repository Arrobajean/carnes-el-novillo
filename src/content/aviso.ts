/** Texto del aviso legal y de demostración. Se muestra en /aviso y en el pie de página. */
export const DEMO_NOTICE = {
  short: "Sitio de demostración. No se cobra nada ni se envía ningún correo.",
  title: "Aviso de demostración",
};

export const AVISO_SECTIONS: readonly { title: string; paragraphs: readonly string[] }[] = [
  {
    title: "Qué es este sitio",
    paragraphs: [
      "Este sitio es una demostración técnica. Carnes El Novillo no ha contratado su desarrollo ni lo gestiona como canal de venta oficial.",
      "Los productos, precios y textos proceden de la web anterior del negocio y pueden no estar actualizados.",
      "Las opiniones de la portada son reseñas de ejemplo, no son reales. Sus nombres son ficticios.",
    ],
  },
  {
    title: "Reservas y pagos",
    paragraphs: [
      "Las reservas son ficticias: no hay pasarela de pago, no se cobra ningún importe y no se envía ningún correo ni mensaje.",
      "Las reservas se guardan solo en la memoria del servidor de demostración y se pierden al reiniciarlo.",
    ],
  },
  {
    title: "Datos personales",
    paragraphs: [
      "Para reservar se piden nombre y teléfono. Se usan únicamente para mostrar la confirmación. No se comparten con terceros.",
    ],
  },
  {
    title: "Datos pendientes de confirmar",
    paragraphs: [
      "Horario de atención: por confirmar con el negocio.",
      "Correo de contacto: por confirmar con el negocio.",
      "Precios en pesos chilenos (CLP). Los importes son los de la web anterior y pueden no estar actualizados.",
      "Políticas de reserva (antelación, aforo por franja y plazo de 7 días): valores de demostración, por confirmar.",
    ],
  },
  {
    title: "Propiedad de fotos y textos",
    paragraphs: [
      "El código de este repositorio tiene licencia MIT. Las fotografías y los textos de producto no están cubiertos por esa licencia y pertenecen a sus titulares.",
    ],
  },
];
