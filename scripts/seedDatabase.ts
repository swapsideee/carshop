import 'dotenv/config';

import mysql from 'mysql2/promise';

import { seedDevelopmentCatalog } from './lib/catalogSeed';
import { getApplicationDatabaseConfig } from './lib/database';
import { checkCatalogDataIntegrity, checkCatalogSchema } from './lib/schemaChecks';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Development catalogue seed must not run with NODE_ENV=production');
}

const connection = await mysql.createConnection(getApplicationDatabaseConfig());

try {
  const schemaErrors = await checkCatalogSchema(connection);

  if (schemaErrors.length) {
    throw new Error(
      [
        'Database schema is not ready for seeding.',
        'Run `bun run db:migrate` first.',
        ...schemaErrors.map((error) => `- ${error}`),
      ].join('\n'),
    );
  }

  await seedDevelopmentCatalog(connection);

  const dataErrors = await checkCatalogDataIntegrity(connection);

  if (dataErrors.length) {
    throw new Error(
      [
        'Catalogue seed failed the data integrity check:',
        ...dataErrors.map((error) => `- ${error}`),
      ].join('\n'),
    );
  }

  console.log('Development catalogue seed check passed');
} finally {
  await connection.end();
}
