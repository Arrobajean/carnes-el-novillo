import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "coverage/**", "playwright-report/**", "test-results/**", "next-env.d.ts"]),
  {
    // Un mismo tipo de bandera para toda la base: se prohíbe silenciar tipos.
    rules: {
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-expect-error": "allow-with-description" }],
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    // Los scripts son herramientas de línea de comandos: imprimir es su salida.
    files: ["scripts/**"],
    rules: { "no-console": "off" },
  },
]);
