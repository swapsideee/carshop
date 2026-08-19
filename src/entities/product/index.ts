/**
 * Entity: product — client-safe public API.
 *
 * Import from here in UI/widgets/features:
 *   import { getProducts, ProductCard, useProduct } from '@/entities/product';
 *
 * Do NOT export server-only code from this file.
 * Server-only API lives in `./server.ts`.
 */

export * from './api/client';
export type {
  ProductDetailApiDTO,
  ProductListItemApiDTO,
  ProductListSortApiValue,
  ProductSelectApiDTO,
  ProductSelectApiResult,
  ProductsPagedApiResult,
  RelatedProductApiDTO,
} from './model/apiTypes';
export { isProductListSortApiValue, normalizeProductListSortApiValue } from './model/apiTypes';
export * from './model/selectors';
export * as productSelectors from './model/selectors';
export type {
  ProductDetailDTO,
  ProductListItemDTO,
  ProductSelectItemDTO,
  ProductSortBy,
  ProductsPagedResultDTO,
  RelatedProductDTO,
  SortOrder,
} from './model/types';
export * from './model/useProduct';
export { default as ProductCard } from './ui/ProductCard/ProductCard';
