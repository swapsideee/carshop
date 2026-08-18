import 'dotenv/config';

import mysql from 'mysql2/promise';

import { getApplicationDatabaseConfig } from './lib/database';
import { checkCatalogDataIntegrity, checkCatalogSchema } from './lib/schemaChecks';

const schemaOnly = process.argv.includes('--schema-only');
const connection = await mysql.createConnection(getApplicationDatabaseConfig());

try {
  const schemaErrors = await checkCatalogSchema(connection);
  const dataErrors =
    schemaOnly || schemaErrors.length ? [] : await checkCatalogDataIntegrity(connection);
  const errors = [...schemaErrors, ...dataErrors];

  if (errors.length) {
    console.error('Database contract check failed:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
  } else {
    console.log(`Database contract check passed${schemaOnly ? ' (schema only)' : ''}`);
  }
} finally {
  await connection.end();
}
