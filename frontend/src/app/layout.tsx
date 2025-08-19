import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyHouz - Plateforme de Rénovation et Décoration",
  description: "Trouvez l'inspiration, des professionnels et des produits pour votre maison",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
