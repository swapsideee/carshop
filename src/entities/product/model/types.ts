export type Product = {
  id: number;

  name?: string | null;
  model?: string | null;

  price_pair?: number | null;
  price_set?: number | null;

  brand_id?: number | null;
  brand_slug?: string | null;

  image?: string | null;

  images?: string[];
  related?: RelatedProduct[];

  [key: string]: unknown;
};

export type RelatedProduct = {
  id: number;
  model?: string | null;
  image?: string | null;
  price_pair?: number | null;
  price_set?: number | null;
  [key: string]: unknown;
};

export type ProductsPagedResult = {
  items: Product[];
  page: number;
  total: number;
  totalPages: number;
};

export type ProductSortBy = 'price_pair' | 'model';
export type SortOrder = 'ASC' | 'DESC';
