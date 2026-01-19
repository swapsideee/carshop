'use client';

import { Toaster } from 'react-hot-toast';

import Footer from '@/widgets/layout/footer';
import Header from '@/widgets/layout/header';

export default function AppShell({ children }) {
  return (
    <body className="text-gray-900 flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="grow bg-white">
        <div className="p-4 pb-16">{children}</div>
      </main>

      <Footer />
      <Toaster position="top-center" />
    </body>
  );
}
