import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "CarShop - Магазин подкрылков",
  description: "Продажа подкрылков для авто",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <Header />
        <main className="p-4 flex-grow">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
