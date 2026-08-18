/**
 * Public JSON representation returned by `/api/brands`.
 *
 * It is intentionally separate from the server domain DTO even while their
 * fields are identical. The route serializer is the only place that maps
 * between the two contracts.
 */
export type BrandApiDTO = {
  id: number;
  name: string | null;
  slug: string | null;
  image: string | null;
};
