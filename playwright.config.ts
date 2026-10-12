import { defineConfig, devices } from "@playwright/test";

const PORT = 3202;
// En local se puede apuntar a un Chromium ya instalado; en CI se usa el de `playwright install`.
const executablePath = process.env.PW_CHROMIUM_PATH;
const launchOptions = executablePath ? { executablePath } : {};

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "es-ES",
    timezoneId: "Europe/Madrid",
    trace: "retain-on-failure",
    launchOptions,
  },
  projects: [
    // Flujos y contrato de API: escritorio, tema claro.
    {
      name: "desktop",
      testIgnore: /a11y\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], colorScheme: "light", launchOptions },
    },
    // Accesibilidad: cada página en claro y oscuro, en escritorio y en móvil.
    {
      name: "a11y-desktop-light",
      testMatch: /a11y\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], colorScheme: "light", launchOptions },
    },
    {
      name: "a11y-desktop-dark",
      testMatch: /a11y\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], colorScheme: "dark", launchOptions },
    },
    {
      name: "a11y-mobile-light",
      testMatch: /a11y\.spec\.ts/,
      use: { ...devices["Pixel 7"], colorScheme: "light", launchOptions },
    },
    {
      name: "a11y-mobile-dark",
      testMatch: /a11y\.spec\.ts/,
      use: { ...devices["Pixel 7"], colorScheme: "dark", launchOptions },
    },
  ],
  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
