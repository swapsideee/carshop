import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Iнтернет-магазин VADI-AVTO',
  description:
    'VADI-AVTO - надійний інтернет-магазин автозапчастин з досвідом роботи. Пропонуємо підкрилки для понад 250 моделей авто за вигідними цінами. Працюємо онлайн та офлайн - замовляйте зручно або завітайте до нас особисто у мiстi Харкiв!',
};

export const viewport = {
  width: 'device-width',
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
