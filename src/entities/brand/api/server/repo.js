import 'server-only';

import { getDB } from '@/shared/db';

import { getAllBrandsQuery } from './queries';

export async function getAllBrands() {
  const db = await getDB();
  const [rows] = await db.query(getAllBrandsQuery);
  return rows;
}
