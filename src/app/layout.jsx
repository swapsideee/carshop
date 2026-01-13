import './globals.css';

import { Toaster } from 'react-hot-toast';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata = {
  title: 'Iнтернет-магазин PLAST-AVTO',
  description:
    'PLAST-AVTO - надійний інтернет-магазин автозапчастин з досвідом роботи. Пропонуємо підкрилки для понад 250 моделей авто за вигідними цінами. Працюємо онлайн та офлайн - замовляйте зручно або завітайте до нас особисто у мiстi Харкiв!',
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
        <main className="p-4 grow">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
