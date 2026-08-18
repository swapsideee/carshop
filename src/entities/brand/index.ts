/**
 * Entity: brand — client-safe public API.
 *
 * Import from here in UI/widgets/features:
 *   import { getBrands } from '@/entities/brand';
 *
 * Server-only API lives in `./server.ts`.
 */

export * from './api/client';
export type { BrandApiDTO } from './model/apiTypes';
