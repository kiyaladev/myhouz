import type { Metadata } from "next";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import CartSidebar from "../components/cart/CartSidebar";
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
        <AuthProvider>
          <CartProvider>
            {children}
            <CartSidebar />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
