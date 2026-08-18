import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Connection, RowDataPacket } from 'mysql2/promise';

type AppliedMigrationRow = RowDataPacket & { id: string };

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const migrationsDir = resolve(rootDir, 'db', 'migrations');

async function ensureMigrationTable(connection: Connection): Promise<void> {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id VARCHAR(255) NOT NULL,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

export async function runMigrations(
  connection: Connection,
  log: (message: string) => void = console.log,
): Promise<void> {
  await ensureMigrationTable(connection);

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
    log(`Applying migration ${id}`);
    await connection.query(sql);
    await connection.execute('INSERT INTO schema_migrations (id) VALUES (?)', [id]);
  }

  log('Database migrations are up to date');
}
