import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"], // Example of multiple subsets
});

export const metadata = {
  title: "reflct",
  description: "Journal App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider frontendApi={process.env.CLERK_FRONTEND_API}>
      <html lang="en">
        <body className={`${inter.className}`}>
          <div className="bg-[url('/bg.jpg')] opacity-100 -z-10 inset-0" />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
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
