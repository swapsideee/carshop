/**
 * Entity: product — server-only public API (DB/queries).
 *
 * Use only in:
 *   - Next Route Handlers (app/api/*)
 *   - Server Components
 *
 * Example:
 *   import { getProductsPaged } from '@/entities/product/server';
 */

import 'server-only';

export { getProductDetailsById, getProductsPaged } from './api/server';
export type {
  Product,
  ProductSortBy,
  ProductsPagedResult,
  RelatedProduct,
  SortOrder,
} from './model/types';
