export type ProductListItemDTO = {
  id: number;
  name: string | null;
  model: string | null;
  image: string | null;
  pricePair: number | null;
  priceSet: number | null;
  slug: string | null;
  brandSlug: string | null;
  brandId: number | null;
};

export type RelatedProductDTO = {
  id: number;
  model: string | null;
  image: string | null;
  pricePair: number | null;
  priceSet: number | null;
};

export type ProductDetailDTO = ProductListItemDTO & {
  images: string[];
  related: RelatedProductDTO[];
};

export type ProductSelectItemDTO = {
  id: number;
  name: string | null;
  model: string | null;
};

export type ProductsPagedResultDTO = {
  items: ProductListItemDTO[];
  page: number;
  total: number;
  totalPages: number;
};

export type CheckoutProduct = {
  id: number;
  name: string | null;
  model: string | null;
  pricePair: number | null;
  priceSet: number | null;
};

export type ProductSortBy = 'price_pair' | 'model';
export type SortOrder = 'ASC' | 'DESC';
