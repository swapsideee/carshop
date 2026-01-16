export function isProductSlug(slug) {
  return !isNaN(Number(slug));
}

export function getBrandSlug(product) {
  return (
    product?.brand_slug ||
    product?.brand ||
    product?.brandName ||
    product?.brand_name ||
    product?.brand?.slug ||
    ''
  );
}

export function getProductImages(product) {
  const base = product?.image ? [product.image] : [];
  const extra = Array.isArray(product?.images) ? product.images : [];
  return [...base, ...extra].filter(Boolean);
}

export function getDefaultOption(product) {
  if (!product) return 'pair';
  const hasPair = product.price_pair !== null && product.price_pair !== undefined;
  const hasSet = product.price_set !== null && product.price_set !== undefined;

  if (hasPair && !hasSet) return 'pair';
  if (hasSet && !hasPair) return 'set';
  return 'pair';
}

export function getPriceState(product, selectedOption) {
  const hasPair = product?.price_pair !== null && product?.price_pair !== undefined;
  const hasSet = product?.price_set !== null && product?.price_set !== undefined;

  const bothPricesAvailable = hasPair && hasSet;
  const onlyPair = hasPair && !hasSet;
  const onlySet = hasSet && !hasPair;
  const noPrice = !hasPair && !hasSet;

  const currentPrice = selectedOption === 'pair' ? product?.price_pair : product?.price_set;
  const selectedLabel = selectedOption === 'pair' ? 'Пара' : 'Комплект';

  return { bothPricesAvailable, onlyPair, onlySet, noPrice, currentPrice, selectedLabel };
}
