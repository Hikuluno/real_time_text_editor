import "./globals.css";
import { Inter } from "next/font/google";
import { FaUser } from "react-icons/fa"; // Importez l'icône de compte de la bibliothèque React Icons, ou utilisez une autre bibliothèque d'icônes de votre choix.

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Knowledge Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="navbar grid bg-base-100">
          {/* <div className="flex justify-self-end mx-5">
            <FaUser className="mx-5" />
            Account
          </div> */}
        </header>
        {children}
      </body>
    </html>
  );
}
