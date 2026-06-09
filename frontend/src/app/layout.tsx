import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Gestão de Coletas",
  description: "Sistema de gestão de coletas para transportadora",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <AuthProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
