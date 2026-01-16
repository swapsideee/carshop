'use client';

import { toast } from 'react-hot-toast';

import useCartStore from '@/app/store/cartStore';

export function useAddToCart() {
  const addToCart = useCartStore((s) => s.addToCart);

  return ({ product, selectedOption }) => {
    if (!product) return;

    const price = selectedOption === 'pair' ? product.price_pair : product.price_set;

    if (price == null) {
      toast.error('Ціна для обраного варіанту відсутня');
      return;
    }

    const cartItem = {
      id: `${product.id}-${selectedOption}`,
      name: `${product.model} (${selectedOption === 'pair' ? 'Пара' : 'Комплект'})`,
      price,
      image: product.image,
    };

    const res = addToCart(cartItem);

    if (!res?.ok) {
      toast.error(res?.message || 'Не вдалося додати товар');
      return;
    }

    toast.success('Товар додано до кошику');
  };
}
