import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import mysql, { type RowDataPacket } from 'mysql2/promise';

import {
  getApplicationDatabaseConfig,
  getRootDatabaseConfig,
  quoteIdentifier,
} from './lib/database';
import { runMigrations } from './lib/migrations';
import {
  checkCatalogDataIntegrity,
  checkCatalogSchema,
  runCatalogSmokeQueries,
} from './lib/schemaChecks';

type UserAccountRow = RowDataPacket & { Host: string };

const temporaryDatabase = `carshop_schema_smoke_${randomUUID().replaceAll('-', '')}`;
const temporaryDatabaseIdentifier = quoteIdentifier(temporaryDatabase);
const applicationConfig = getApplicationDatabaseConfig(temporaryDatabase);
const rootConnection = await mysql.createConnection(getRootDatabaseConfig());
let applicationConnection: mysql.Connection | undefined;
let grantedHosts: string[] = [];
let databaseCreated = false;
let verificationError: unknown;

try {
  await rootConnection.query(
    `CREATE DATABASE ${temporaryDatabaseIdentifier} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  databaseCreated = true;

  const [accounts] = await rootConnection.execute<UserAccountRow[]>(
    'SELECT Host FROM mysql.user WHERE User = ?',
    [applicationConfig.user],
  );
  grantedHosts = accounts.map((account) => account.Host);

  if (!grantedHosts.length) {
    throw new Error(`No MySQL account exists for ${applicationConfig.user}`);
  }

  for (const host of grantedHosts) {
    await rootConnection.query(
      mysql.format(`GRANT ALL PRIVILEGES ON ${temporaryDatabaseIdentifier}.* TO ?@?`, [
        applicationConfig.user,
        host,
      ]),
    );
  }

  applicationConnection = await mysql.createConnection({
    ...applicationConfig,
    multipleStatements: true,
  });

  await runMigrations(applicationConnection);

  const schemaErrors = await checkCatalogSchema(applicationConnection);
  const dataErrors = await checkCatalogDataIntegrity(applicationConnection);

  if (schemaErrors.length || dataErrors.length) {
    throw new Error([...schemaErrors, ...dataErrors].join('\n'));
  }

  await runCatalogSmokeQueries(applicationConnection);
  console.log('Empty database migration and catalogue smoke check passed');
} catch (error) {
  verificationError = error;
  throw error;
} finally {
  const cleanupErrors: unknown[] = [];

  try {
    await applicationConnection?.end();
  } catch (error) {
    cleanupErrors.push(error);
  }

  for (const host of grantedHosts) {
    try {
      await rootConnection.query(
        mysql.format(`REVOKE ALL PRIVILEGES ON ${temporaryDatabaseIdentifier}.* FROM ?@?`, [
          applicationConfig.user,
          host,
        ]),
      );
    } catch (error) {
      cleanupErrors.push(error);
    }
  }

  if (databaseCreated) {
    try {
      await rootConnection.query(`DROP DATABASE ${temporaryDatabaseIdentifier}`);
    } catch (error) {
      cleanupErrors.push(error);
    }
  }

  try {
    await rootConnection.end();
  } catch (error) {
    cleanupErrors.push(error);
  }

  if (cleanupErrors.length) {
    console.error('Temporary database cleanup failed:', cleanupErrors);

    if (!verificationError) {
      throw new Error('Temporary database cleanup failed');
    }
  }
}
