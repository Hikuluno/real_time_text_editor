import Provider from "@/components/Provider";
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { FaUser, FaHome } from "react-icons/fa"; // Importez l'icône de compte de la bibliothèque React Icons, ou utilisez une autre bibliothèque d'icônes de votre choix.

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
      <body className={`${inter.className} overflow-hidden`}>
        <Provider>
          <header className="navbar  bg-base-100">
            <div className="navbar-start">
              <Link className="mx-5" href="/">
                <FaHome className="text-2xl" />
              </Link>
            </div>
            <div className="navbar-end">
              <Link className="text-2xl" href={"/account"}>
                <FaUser className="mx-5" />
              </Link>
            </div>
          </header>
          {children}
        </Provider>
      </body>
    </html>
  );
}
