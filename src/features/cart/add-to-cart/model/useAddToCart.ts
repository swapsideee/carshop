'use client';

import { toast } from 'react-hot-toast';

import { useCartStore } from '@/features/cart';

type SelectedOption = 'pair' | 'set';

type ProductForAddToCart = {
  id: string | number;
  model: string;
  image?: string | null;
  price_pair?: number | null;
  price_set?: number | null;
};

type AddToCartArgs = {
  product?: ProductForAddToCart | null;
  selectedOption: SelectedOption;
};

export function useAddToCart() {
  const addToCart = useCartStore((s) => s.addToCart);

  return ({ product, selectedOption }: AddToCartArgs) => {
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
      image: product.image ?? undefined,
    };

    const res = addToCart(cartItem);

    if (!res?.ok) {
      toast.error(('message' in res && res.message) || 'Не вдалося додати товар');
      return;
    }

    toast.success('Товар додано до кошику');
  };
}
