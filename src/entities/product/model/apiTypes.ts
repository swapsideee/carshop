export type ProductListItemApiDTO = {
  id: number;
  name: string | null;
  model: string | null;
  image: string | null;
  price_pair: number | null;
  price_set: number | null;
  slug: string | null;
  brand_slug: string | null;
  brand_id: number | null;
};

export type RelatedProductApiDTO = {
  id: number;
  model: string | null;
  image: string | null;
  price_pair: number | null;
  price_set: number | null;
};

export type ProductDetailApiDTO = ProductListItemApiDTO & {
  images: string[];
  related: RelatedProductApiDTO[];
};

export type ProductsPagedApiResult = {
  items: ProductListItemApiDTO[];
  page: number;
  total: number;
  totalPages: number;
};
