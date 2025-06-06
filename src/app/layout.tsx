import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthDisplay from "@/components/AuthDisplay";
import Link from "next/link";
import GlobalLoader from "@/components/GlobalLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mini Job Board",
  description: "Post and browse job listings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <GlobalLoader />
          <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <Link href="/" className="text-3xl font-extrabold text-indigo-600 hover:text-indigo-500 transition-colors">
                Mini Job Board
              </Link>
              <AuthDisplay />
            </nav>
          </header>
          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 mt-4">
            {children}
          </main>
          <footer className="bg-gray-800 text-white text-center p-6">
            <p>&copy; {new Date().getFullYear()} Mini Job Board. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}