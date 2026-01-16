import './globals.css';

import { Toaster } from 'react-hot-toast';

import Footer from '@/widgets/layout/footer/ui/Footer';
import Header from '@/widgets/layout/header/ui/Header';

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
      <body className="text-gray-900 flex flex-col min-h-screen bg-gray-50">
        <Header />

        <main className="grow bg-white">
          <div className="p-4 pb-16">{children}</div>
        </main>

        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
