'use client';

import { Suspense } from 'react';

import OrderCheckout from '@/widgets/order-checkout';

import PaymentBanner from './PaymentBanner';

export default function OrderPage() {
  return (
    <>
      <Suspense fallback={null}>
        <PaymentBanner />
      </Suspense>

      <OrderCheckout />
    </>
  );
}
