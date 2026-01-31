import 'server-only';

import type { RowDataPacket } from 'mysql2/promise';

import { getDB } from '@/shared/db';

import type { Brand } from '../../model/types';
import { getAllBrandsQuery } from './queries';

type BrandRow = RowDataPacket & Brand;

export async function getAllBrands(): Promise<BrandRow[]> {
  const db = await getDB();

  const [rows] = await db.query<BrandRow[]>(getAllBrandsQuery);

  return rows;
}
