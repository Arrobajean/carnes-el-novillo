import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carnes El Novillo",
  description: "Proyecto de demostración en construcción.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
