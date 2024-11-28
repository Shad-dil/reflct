import { Inter } from "next/font/google";

import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
const inter = Inter({ subset: ["latin"] });
export const metadata = {
  title: "reflct",
  description: "Journal App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <div className="bg-[url('/bg.jpg')] opacity-100 -z-10 inset-0" />
          <Header />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-orange-300 py-12 bg-opacity-10">
            <div className="mx-auto px-4 text-center text-gray-900">
              <p>Made With ❤️ by @Dilshad</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
