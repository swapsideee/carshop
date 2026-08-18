import 'server-only';

import type { Pool } from 'mysql2/promise';
import mysql from 'mysql2/promise';

import { getDbEnv } from '@/shared/config/env';

let pool: Pool | undefined;

export async function getDB(): Promise<Pool> {
  if (!pool) {
    const dbEnv = getDbEnv();

    pool = mysql.createPool({
      host: dbEnv.host,
      user: dbEnv.user,
      password: dbEnv.password,
      database: dbEnv.name,
      port: dbEnv.port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
}
