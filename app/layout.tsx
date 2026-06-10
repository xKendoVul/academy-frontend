import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Academy",
  description: "Sistema de gestión académica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <nav className="border-b border-neutral-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-3 flex gap-6">
            <a href="/" className="text-sm font-semibold text-neutral-800 hover:text-neutral-600">Academy</a>
            <a href="/estudiantes" className="text-sm text-neutral-500 hover:text-neutral-800">Estudiantes</a>
            <a href="/docentes" className="text-sm text-neutral-500 hover:text-neutral-800">Docentes</a>
            <a href="/perfil" className="text-sm text-neutral-500 hover:text-neutral-800">Mi Perfil</a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}