import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = 
{
  title: "CarShop - Магазин подкрылков",
  description: "Продажа подкрылков для авто"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <Header />
        <main className="p-4 max-w-7xl mx-auto flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
} 
