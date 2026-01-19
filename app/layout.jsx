import './globals.css';

import AppShell from '@/widgets/app-shell';

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
    <html lang="uk">
      <AppShell>{children}</AppShell>
    </html>
  );
}
