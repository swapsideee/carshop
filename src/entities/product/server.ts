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

export type { GetProductsPagedArgs, ProductsRequest } from './api/server';
export {
  getProductDetailsById,
  getProductsForCheckout,
  getProductsForSelect,
  getProductsPaged,
  parseProductId,
  parseProductsRequest,
  toProductDetailApiDTO,
  toProductSelectApiResult,
  toProductsPagedApiResult,
} from './api/server';
export type {
  CheckoutProduct,
  ProductDetailDTO,
  ProductListItemDTO,
  ProductSelectItemDTO,
  ProductSortBy,
  ProductsPagedResultDTO,
  RelatedProductDTO,
  SortOrder,
} from './model/types';
