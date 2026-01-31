import type { Product } from './types';

export function isProductSlug(slug: unknown): boolean {
  return !Number.isNaN(Number(slug));
}

export function getBrandSlug(product: Product | null | undefined): string {
  return (
    (product?.brand_slug as string | undefined) ||
    (product?.brand as string | undefined) ||
    (product?.brandName as string | undefined) ||
    (product?.brand_name as string | undefined) ||
    ((product?.brand as { slug?: string } | undefined)?.slug ?? '') ||
    ''
  );
}

export function getProductImages(product: Product | null | undefined): string[] {
  const base = product?.image ? [String(product.image)] : [];
  const extra = Array.isArray(product?.images) ? product.images : [];
  return [...base, ...extra].filter(Boolean);
}

export type ProductOption = 'pair' | 'set';

export function getDefaultOption(product: Product | null | undefined): ProductOption {
  if (!product) return 'pair';
  const hasPair = product.price_pair !== null && product.price_pair !== undefined;
  const hasSet = product.price_set !== null && product.price_set !== undefined;

  if (hasPair && !hasSet) return 'pair';
  if (hasSet && !hasPair) return 'set';
  return 'pair';
}

export function getPriceState(product: Product | null | undefined, selectedOption: ProductOption) {
  const hasPair = product?.price_pair !== null && product?.price_pair !== undefined;
  const hasSet = product?.price_set !== null && product?.price_set !== undefined;

  const bothPricesAvailable = Boolean(hasPair && hasSet);
  const onlyPair = Boolean(hasPair && !hasSet);
  const onlySet = Boolean(hasSet && !hasPair);
  const noPrice = Boolean(!hasPair && !hasSet);

  const currentPrice = selectedOption === 'pair' ? product?.price_pair : product?.price_set;
  const selectedLabel = selectedOption === 'pair' ? 'Пара' : 'Комплект';

  return { bothPricesAvailable, onlyPair, onlySet, noPrice, currentPrice, selectedLabel };
}
