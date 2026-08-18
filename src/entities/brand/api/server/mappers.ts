import type { BrandRow } from '@/shared/db/schema';

import type { BrandDTO } from '../../model/types';

export function mapBrandRow(row: BrandRow): BrandDTO {
  return {
    id: Number(row.id),
    name: row.name,
    slug: row.slug,
    image: row.image,
  };
}
