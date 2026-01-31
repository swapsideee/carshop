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
export * from './model/selectors';
export * as productSelectors from './model/selectors';
export type {
  Product,
  ProductSortBy,
  ProductsPagedResult,
  RelatedProduct,
  SortOrder,
} from './model/types';
export * from './model/useProduct';
export { default as ProductCard } from './ui/ProductCard/ProductCard';
