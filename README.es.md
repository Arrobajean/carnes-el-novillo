# Carnes El Novillo

> English version: [README.md](README.md)

Catálogo y reserva de recogida para una carnicería de barrio en Independencia, Santiago de Chile: consultas los cortes, los añades a una reserva, eliges franja de recogida y recibes un código de confirmación. Es un **proyecto de demostración, no un negocio real**. No se cobra, no se paga ni se envía ningún correo, y las reservas solo existen en la memoria del servidor.

| Portada (claro) | Catálogo | Ficha |
|---|---|---|
| ![Portada](docs/screenshots/portada-claro.webp) | ![Catálogo](docs/screenshots/catalogo-claro.webp) | ![Ficha](docs/screenshots/ficha-claro.webp) |

| Reserva | Confirmación | Portada en móvil |
|---|---|---|
| ![Reserva](docs/screenshots/reserva-claro.webp) | ![Confirmación](docs/screenshots/confirmacion-claro.webp) | ![Portada en móvil](docs/screenshots/portada-movil.webp) |

El tema oscuro sigue la preferencia del sistema: ![Portada en tema oscuro](docs/screenshots/portada-oscuro.webp)

## Qué demuestra

- **El servidor nunca se fía de los precios del cliente.** La reserva solo envía identificadores y cantidades. `POST /api/reservas` recalcula cada línea desde el catálogo y rechaza la petición entera si una línea no existe. Un `totalClp` o `priceClp` enviado por el cliente se ignora, y una prueba end-to-end lo demuestra.
- **Franjas de recogida con reglas reales.** Franjas horarias que siguen el horario semanal, al menos 2 horas de antelación, un horizonte de 7 días y 4 reservas por franja. Todas las reglas se evalúan con la hora del local, en `America/Santiago`, y no con la del servidor. Las reglas tienen pruebas unitarias.
- **Estado sin efectos.** La reserva vive en `localStorage`, se valida con zod al leerla y se expone con `useSyncExternalStore`. Un valor corrupto vuelve a una reserva vacía en lugar de romper la página.
- **Lógica separada de la interfaz.** Funciones puras en `src/lib`, estado en `src/hooks`, presentación en `src/components`. Ningún componente llama a `fetch`; hay un solo cliente de API.
- **Accesibilidad como prueba, no como afirmación.** axe revisa todas las páginas en tema claro y oscuro, en escritorio y en móvil, con WCAG 2.1 AA y buenas prácticas. La suite falla ante cualquier infracción.
- **Contenido como datos tipados.** Los 40 productos están en `src/content`. Una prueba comprueba que existe cada foto, que los identificadores son únicos, que los precios son enteros positivos y que cada producto pertenece a una categoría definida. Otra falla si aparece un guion largo o medio en el contenido.
- **Textos honestos.** El horario y la moneda aparecen como pendientes de confirmar en el aviso (`/aviso`). Se han retirado las reseñas, certificaciones y afirmaciones de entrega de la web anterior (ver más abajo).

## Calidad

| Qué | Cómo | Cantidad |
|---|---|---|
| Pruebas unitarias (lógica e integridad del contenido) | Vitest | 50 pruebas en 12 ficheros |
| End-to-end, contrato de la API y accesibilidad | Playwright + axe | 53 ejecuciones: 17 de flujo y API en escritorio, 36 de accesibilidad en 4 proyectos (claro y oscuro, escritorio y móvil) |
| Tipos | `tsc --noEmit`, `strict` + `noUncheckedIndexedAccess` | limpio |
| Lint | ESLint 9, `next/core-web-vitals` | limpio |

La CI (`.github/workflows/ci.yml`) ejecuta lint, tipos, pruebas unitarias, build y Playwright en cada push y pull request.

### Rendimiento medido

Lighthouse 12.8.2, emulación móvil con throttling simulado, build de producción servido en local con `next start` (sin CDN), mediana de 3 pasadas por página, medido el 12-10-2026. La página de reserva se midió con la reserva vacía.

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Portada | 96 | 100 | 100 | 100 | 2,7 s | 0 | 85 ms |
| Catálogo | 90 | 100 | 100 | 100 | 3,6 s | 0 | 53 ms |
| Ficha | 95 | 100 | 100 | 100 | 2,9 s | 0 | 50 ms |
| Reserva (vacía) | 91 | 100 | 100 | 100 | 3,5 s | 0,002 | 91 ms |

Son datos de laboratorio en localhost. Un sitio desplegado tras una CDN dará otros números, y los datos de usuarios reales dirían más que todo esto. El catálogo se volvió a medir tras cargar en modo prioritario las tres primeras fotos; las demás páginas se midieron con el build anterior a ese cambio, que no les afecta.

## Arquitectura

```
src/
  app/          Solo rutas: páginas, manejadores de la API, metadatos e icono
  components/   Presentación: props dentro, callbacks fuera (ui, layout, home, catalog, product, reservation)
  hooks/        Estado: use-cart, use-reservation-form, use-slots, use-add-to-cart
  lib/          Lógica pura: precios, cesta, franjas, fechas, esquemas, reservas, almacenes. Sin React
  content/      Datos tipados: productos, categorías, horario, textos, aviso
e2e/            Especificaciones de Playwright: flujo de compra y reserva, contrato de la API, accesibilidad
scripts/        Optimización de imágenes (images-src a public/images, en WebP)
```

## Decisiones y compromisos

| Decisión | Elección | Compromiso |
|---|---|---|
| Dinero | Pesos chilenos enteros, sin decimales | El formato solo se aplica en la frontera (`formatClp`) |
| Filtros del catálogo | Categoría y búsqueda viven en la URL y se aplican en el servidor | Funciona sin JavaScript y se puede compartir; la página se genera en cada petición |
| Persistencia de la reserva | `localStorage` + zod, sin sesión en servidor | La reserva no sigue al usuario entre dispositivos |
| Almacén de reservas | Repositorio en memoria tras la interfaz `ReservationRepository` | Las reservas se pierden al reiniciar; una base de datos es una implementación más |
| Límite de peticiones | Ventana deslizante en memoria, 40 peticiones por 10 minutos y por IP | Por instancia; con varias instancias hace falta un almacén compartido |
| Movimiento | Solo transiciones CSS, desactivadas con `prefers-reduced-motion`; sin librería de animación | Poca coreografía, y sin peso extra en el bundle |
| Tema | Claro u oscuro según la preferencia del sistema, un tema por página | Todavía no hay selector manual |
| Fotos | Una WebP por producto, 800 px como máximo, generada desde originales que no van a git | Los productos sin foto muestran un marcador neutro |

## Retirado de la web anterior

La web anterior publicaba afirmaciones que esta reconstrucción no repite, porque nada en el repositorio las demuestra:

- **Opiniones de clientes.** Venían con avatares y nombres genéricos de banco de imágenes, así que se trataron como inventadas y se retiraron.
- **Año de fundación, proveedores certificados y afirmaciones de sostenibilidad.** No verificadas, retiradas.
- **Entrega a domicilio y medios de pago.** Esta demostración no entrega ni cobra, así que se retiraron.
- **Valores nutricionales por producto.** No tenían fuente, así que se retiraron.
- **Dos categorías vacías** (cordero y parrilleros) que no tenían productos.

## Limitaciones conocidas

- **Las reservas no son duraderas.** Viven en la memoria del servidor y se pierden al reiniciarlo.
- **La comprobación de aforo no es atómica.** Dos peticiones simultáneas pueden pasarla a la vez. Una base de datos real necesita una transacción en `ReservationRepository.save`, documentada en la interfaz.
- **Sin pagos, correos ni vista para el personal.** No hay una pantalla en el local para las reservas entrantes.
- **Horario y moneda pendientes de confirmar.** El horario publicado viene de la web anterior y se muestra con esa advertencia en `/aviso`.
- **La política de aforo y antelación es un valor de demostración** (4 por franja, 2 horas, 7 días) y figura como pendiente en `/aviso`.
- **Sin festivos.** El horario es solo semanal.
- **Solo en español.**

## Cómo ejecutarlo

```bash
pnpm install
pnpm images                  # solo si tienes los originales en images-src/ (no versionados)
pnpm dev                     # http://localhost:3202
```

| Script | Qué hace |
|---|---|
| `pnpm lint` / `pnpm typecheck` | ESLint / TypeScript |
| `pnpm test` | Pruebas unitarias con Vitest |
| `pnpm build && pnpm test:e2e` | Build de producción y después Playwright (arranca `next start` en el puerto 3202) |
| `pnpm images` | Convierte los originales de `images-src/` (no versionados) a WebP en `public/images/` |

Define `PW_CHROMIUM_PATH` para usar un Chromium ya instalado en la suite E2E; si no, ejecuta una vez `pnpm exec playwright install chromium`.

## Sobre este repositorio

Es una reconstrucción desde cero de un prototipo anterior. No se conservó nada del código, los estilos ni la configuración anteriores. Los textos de producto, los precios, las fotografías, el nombre del negocio y los datos de contacto se trasladaron de la web anterior y se revisaron; las afirmaciones listadas arriba se retiraron. El historial de aquí es el historial real de la construcción.

## Licencia

El código es MIT (ver [LICENSE](LICENSE)). Las fotografías de `public/images` y los textos de producto de `src/content/products.ts` **no** están cubiertos por esa licencia. Pertenecen a sus titulares y se incluyen solo para la demostración.
