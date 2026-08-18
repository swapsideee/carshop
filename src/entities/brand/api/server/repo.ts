import 'server-only';

import { getDB } from '@/shared/db';
import type { BrandRow } from '@/shared/db/schema';

import type { BrandDTO } from '../../model/types';
import { mapBrandRow } from './mappers';
import { getAllBrandsQuery } from './queries';

export async function getAllBrands(): Promise<BrandDTO[]> {
  const db = await getDB();

  const [rows] = await db.query<BrandRow[]>(getAllBrandsQuery);

  return rows.map(mapBrandRow);
}
