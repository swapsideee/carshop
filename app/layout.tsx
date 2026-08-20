import './globals.css';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import AppShell from '@/widgets/app-shell';

export const metadata: Metadata = {
  title: 'Iнтернет-магазин PLAST-AVTO',
  description:
    'PLAST-AVTO - надійний інтернет-магазин автозапчастин з досвідом роботи. Пропонуємо підкрилки для понад 250 моделей авто за вигідними цінами. Працюємо онлайн та офлайн - замовляйте зручно або завітайте до нас особисто у мiстi Харкiв!',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="uk">
      <AppShell>{children}</AppShell>
    </html>
  );
}
