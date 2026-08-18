import 'dotenv/config';

import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import mysql, { type RowDataPacket } from 'mysql2/promise';

type AppliedMigrationRow = RowDataPacket & { id: string };

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} environment variable`);
  return value;
}

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const migrationsDir = resolve(rootDir, 'db', 'migrations');

const connection = await mysql.createConnection({
  host: requiredEnv('DB_HOST'),
  user: requiredEnv('DB_USER'),
  password: requiredEnv('DB_PASS'),
  database: requiredEnv('DB_NAME'),
  port: Number(process.env.DB_PORT) || 3306,
  multipleStatements: true,
});

try {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id VARCHAR(255) NOT NULL,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const [appliedRows] = await connection.query<AppliedMigrationRow[]>(
    'SELECT id FROM schema_migrations',
  );
  const appliedMigrationIds = new Set(appliedRows.map((row) => row.id));
  const migrationFiles = (await readdir(migrationsDir))
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort();

  for (const file of migrationFiles) {
    const id = file.replace(/\.sql$/, '');
    if (appliedMigrationIds.has(id)) continue;

    const sql = await readFile(resolve(migrationsDir, file), 'utf8');
    console.log(`Applying migration ${id}`);
    await connection.query(sql);
    await connection.execute('INSERT INTO schema_migrations (id) VALUES (?)', [id]);
  }

  console.log('Database migrations are up to date');
} finally {
  await connection.end();
}
