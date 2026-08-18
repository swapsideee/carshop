import 'dotenv/config';

import mysql from 'mysql2/promise';

import { getApplicationDatabaseConfig } from './lib/database';
import { runMigrations } from './lib/migrations';

const connection = await mysql.createConnection({
  ...getApplicationDatabaseConfig(),
  multipleStatements: true,
});

try {
  await runMigrations(connection);
} finally {
  await connection.end();
}
