import type { BrandApiDTO } from '../../model/apiTypes';
import type { BrandDTO } from '../../model/types';

/**
 * Serializes the internal brand DTO at the HTTP boundary.
 *
 * Keep this explicit even though the current field names match: the API wire
 * contract can then evolve independently from the server domain model.
 */
export function toBrandApiDTO(brand: BrandDTO): BrandApiDTO {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    image: brand.image,
  };
}
