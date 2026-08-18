import { getDbEnv } from '../../src/shared/config/env';

export type DatabaseConnectionConfig = {
  database?: string;
  host: string;
  password: string;
  port: number;
  user: string;
};

export function getApplicationDatabaseConfig(database?: string): DatabaseConnectionConfig {
  const dbEnv = getDbEnv();

  return {
    host: dbEnv.host,
    user: dbEnv.user,
    password: dbEnv.password,
    database: database ?? dbEnv.name,
    port: dbEnv.port,
  };
}

export function getRootDatabaseConfig(): DatabaseConnectionConfig {
  const dbEnv = getDbEnv({ includeRootPassword: true });

  return {
    host: dbEnv.host,
    user: 'root',
    password: dbEnv.rootPassword,
    port: dbEnv.port,
  };
}

export function quoteIdentifier(identifier: string): string {
  if (!/^[A-Za-z0-9_]+$/.test(identifier)) {
    throw new Error(`Unsafe SQL identifier: ${identifier}`);
  }

  return `\`${identifier}\``;
}
