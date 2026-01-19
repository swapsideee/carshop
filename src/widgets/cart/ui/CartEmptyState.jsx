'use client';

import { motion } from 'framer-motion';

import PastOrders from '@/widgets/past-orders';

export default function CartEmptyState({ pastOrders }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-xl text-gray-900 space-y-6"
    >
      <p className="mb-30 text-gray-400 text-normal font-semibold">Кошик порожній</p>
      {pastOrders?.length > 0 && <PastOrders orders={pastOrders} />}
    </motion.div>
  );
}
