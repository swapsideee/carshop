import type { Connection, RowDataPacket } from 'mysql2/promise';

import {
  catalogSchemaContract,
  type ForeignKeyContract,
  type IndexContract,
  type TableContract,
} from '../../db/schema/catalog';

type ColumnInfo = RowDataPacket & {
  table_name: string;
  column_name: string;
  column_type: string;
  is_nullable: 'YES' | 'NO';
  column_default: string | null;
  extra: string;
  character_set_name: string | null;
};

type TableInfo = RowDataPacket & {
  table_name: string;
  engine: string | null;
};

type IndexInfo = RowDataPacket & {
  table_name: string;
  index_name: string;
  non_unique: 0 | 1;
  seq_in_index: number;
  column_name: string;
};

type ForeignKeyInfo = RowDataPacket & {
  table_name: string;
  constraint_name: string;
  column_name: string;
  ordinal_position: number;
  referenced_table_name: string;
  referenced_column_name: string;
  delete_rule: 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'NO ACTION';
};

type ConstraintInfo = RowDataPacket & {
  constraint_name: string;
  constraint_type: string;
  check_clause: string | null;
};

type DataIntegrityRow = RowDataPacket & {
  orphan_product_brands: number | string;
  orphan_product_images: number | string;
  orphan_reviews: number | string;
  inconsistent_product_brand_slugs: number | string;
  invalid_review_ratings: number | string;
  negative_product_prices: number | string;
};

export type DatabaseCheckResult = {
  schemaErrors: string[];
  dataErrors: string[];
};

function formatColumns(columns: string[]): string {
  return `(${columns.join(', ')})`;
}

function normalizeDefaultValue(value: string | null): string | null {
  return value?.toUpperCase().replace(/\(\)/g, '') ?? null;
}

function normalizeCheckClause(value: string | null): string | null {
  return (
    value
      ?.toLowerCase()
      .replaceAll('`', '')
      .replaceAll(' ', '')
      .replaceAll('(', '')
      .replaceAll(')', '') ?? null
  );
}

function matchesIndex(index: IndexInfo[], contract: IndexContract): boolean {
  const orderedColumns = [...index]
    .sort((left, right) => Number(left.seq_in_index) - Number(right.seq_in_index))
    .map((item) => item.column_name);

  return (
    index[0]?.non_unique === (contract.unique ? 0 : 1) &&
    orderedColumns.length === contract.columns.length &&
    orderedColumns.every((column, indexPosition) => column === contract.columns[indexPosition])
  );
}

function matchesForeignKey(foreignKey: ForeignKeyInfo[], contract: ForeignKeyContract): boolean {
  const orderedColumns = [...foreignKey].sort(
    (left, right) => Number(left.ordinal_position) - Number(right.ordinal_position),
  );

  return (
    foreignKey[0]?.referenced_table_name === contract.referencedTable &&
    normalizeDeleteRule(foreignKey[0]?.delete_rule) === contract.onDelete &&
    orderedColumns.length === contract.columns.length &&
    orderedColumns.every(
      (column, index) =>
        column.column_name === contract.columns[index] &&
        column.referenced_column_name === contract.referencedColumns[index],
    )
  );
}

function normalizeDeleteRule(
  rule: ForeignKeyInfo['delete_rule'] | undefined,
): 'CASCADE' | 'RESTRICT' | undefined {
  if (rule === 'CASCADE') return 'CASCADE';
  if (rule === 'RESTRICT' || rule === 'NO ACTION') return 'RESTRICT';

  return undefined;
}

export async function checkCatalogSchema(connection: Connection): Promise<string[]> {
  const tableNames = catalogSchemaContract.map((table) => table.name);
  const tablePlaceholders = tableNames.map(() => '?').join(', ');

  const [tables] = await connection.query<TableInfo[]>(
    `
      SELECT TABLE_NAME AS table_name, ENGINE AS engine
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (${tablePlaceholders})
    `,
    tableNames,
  );
  const [columns] = await connection.query<ColumnInfo[]>(
    `
      SELECT
        TABLE_NAME AS table_name,
        COLUMN_NAME AS column_name,
        COLUMN_TYPE AS column_type,
        IS_NULLABLE AS is_nullable,
        COLUMN_DEFAULT AS column_default,
        EXTRA AS extra,
        CHARACTER_SET_NAME AS character_set_name
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (${tablePlaceholders})
    `,
    tableNames,
  );
  const [indexes] = await connection.query<IndexInfo[]>(
    `
      SELECT
        TABLE_NAME AS table_name,
        INDEX_NAME AS index_name,
        NON_UNIQUE AS non_unique,
        SEQ_IN_INDEX AS seq_in_index,
        COLUMN_NAME AS column_name
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (${tablePlaceholders})
    `,
    tableNames,
  );
  const [foreignKeys] = await connection.query<ForeignKeyInfo[]>(
    `
      SELECT
        kcu.TABLE_NAME AS table_name,
        kcu.CONSTRAINT_NAME AS constraint_name,
        kcu.COLUMN_NAME AS column_name,
        kcu.ORDINAL_POSITION AS ordinal_position,
        kcu.REFERENCED_TABLE_NAME AS referenced_table_name,
        kcu.REFERENCED_COLUMN_NAME AS referenced_column_name,
        rc.DELETE_RULE AS delete_rule
      FROM information_schema.KEY_COLUMN_USAGE kcu
      JOIN information_schema.REFERENTIAL_CONSTRAINTS rc
        ON rc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA
        AND rc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
        AND rc.TABLE_NAME = kcu.TABLE_NAME
      WHERE kcu.CONSTRAINT_SCHEMA = DATABASE()
        AND kcu.TABLE_NAME IN (${tablePlaceholders})
        AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
    `,
    tableNames,
  );
  const [constraints] = await connection.query<ConstraintInfo[]>(
    `
      SELECT
        tc.CONSTRAINT_NAME AS constraint_name,
        tc.CONSTRAINT_TYPE AS constraint_type,
        cc.CHECK_CLAUSE AS check_clause
      FROM information_schema.TABLE_CONSTRAINTS tc
      LEFT JOIN information_schema.CHECK_CONSTRAINTS cc
        ON cc.CONSTRAINT_SCHEMA = tc.CONSTRAINT_SCHEMA
        AND cc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
      WHERE tc.TABLE_SCHEMA = DATABASE()
        AND tc.TABLE_NAME = 'reviews'
        AND tc.CONSTRAINT_NAME = 'reviews_rating_range'
    `,
  );

  const errors: string[] = [];

  for (const tableContract of catalogSchemaContract) {
    const table = tables.find((item) => item.table_name === tableContract.name);

    if (!table) {
      errors.push(`Missing table ${tableContract.name}`);
      continue;
    }

    if (table.engine?.toLowerCase() !== 'innodb') {
      errors.push(`Table ${tableContract.name} must use InnoDB`);
    }

    validateColumns(tableContract, columns, errors);
    validateIndexes(tableContract, indexes, errors);
    validateForeignKeys(tableContract, foreignKeys, errors);
  }

  if (
    !constraints.some(
      (constraint) =>
        constraint.constraint_type === 'CHECK' &&
        normalizeCheckClause(constraint.check_clause) === 'ratingbetween1and5',
    )
  ) {
    errors.push('Missing CHECK constraint reviews_rating_range (rating BETWEEN 1 AND 5)');
  }

  return errors;
}

function validateColumns(
  tableContract: TableContract,
  columns: ColumnInfo[],
  errors: string[],
): void {
  for (const expectedColumn of tableContract.columns) {
    const column = columns.find(
      (item) => item.table_name === tableContract.name && item.column_name === expectedColumn.name,
    );

    if (!column) {
      errors.push(`Missing column ${tableContract.name}.${expectedColumn.name}`);
      continue;
    }

    if (column.column_type.toLowerCase() !== expectedColumn.type) {
      errors.push(
        `Column ${tableContract.name}.${expectedColumn.name} must be ${expectedColumn.type}, received ${column.column_type}`,
      );
    }

    if ((column.is_nullable === 'YES') !== expectedColumn.nullable) {
      errors.push(`Column ${tableContract.name}.${expectedColumn.name} has unexpected nullability`);
    }

    if (normalizeDefaultValue(column.column_default) !== expectedColumn.defaultValue) {
      errors.push(`Column ${tableContract.name}.${expectedColumn.name} has an unexpected default`);
    }

    if (expectedColumn.autoIncrement && !column.extra.toLowerCase().includes('auto_increment')) {
      errors.push(`Column ${tableContract.name}.${expectedColumn.name} must auto-increment`);
    }

    if (expectedColumn.characterSet && column.character_set_name !== expectedColumn.characterSet) {
      errors.push(
        `Column ${tableContract.name}.${expectedColumn.name} must use ${expectedColumn.characterSet}`,
      );
    }
  }
}

function validateIndexes(
  tableContract: TableContract,
  indexes: IndexInfo[],
  errors: string[],
): void {
  const indexesByName = new Map<string, IndexInfo[]>();

  for (const index of indexes.filter((item) => item.table_name === tableContract.name)) {
    const entries = indexesByName.get(index.index_name) ?? [];
    entries.push(index);
    indexesByName.set(index.index_name, entries);
  }

  for (const expectedIndex of tableContract.indexes) {
    const found = [...indexesByName.values()].some((index) => matchesIndex(index, expectedIndex));

    if (!found) {
      errors.push(
        `Missing ${expectedIndex.unique ? 'unique ' : ''}index ${tableContract.name}${formatColumns(expectedIndex.columns)}`,
      );
    }
  }
}

function validateForeignKeys(
  tableContract: TableContract,
  foreignKeys: ForeignKeyInfo[],
  errors: string[],
): void {
  const foreignKeysByName = new Map<string, ForeignKeyInfo[]>();

  for (const foreignKey of foreignKeys.filter((item) => item.table_name === tableContract.name)) {
    const entries = foreignKeysByName.get(foreignKey.constraint_name) ?? [];
    entries.push(foreignKey);
    foreignKeysByName.set(foreignKey.constraint_name, entries);
  }

  for (const expectedForeignKey of tableContract.foreignKeys ?? []) {
    const found = [...foreignKeysByName.values()].some((foreignKey) =>
      matchesForeignKey(foreignKey, expectedForeignKey),
    );

    if (!found) {
      errors.push(
        `Missing foreign key ${tableContract.name}${formatColumns(expectedForeignKey.columns)} → ${expectedForeignKey.referencedTable}${formatColumns(expectedForeignKey.referencedColumns)}`,
      );
    }
  }
}

export async function checkCatalogDataIntegrity(connection: Connection): Promise<string[]> {
  const [[row]] = await connection.query<DataIntegrityRow[]>(`
    SELECT
      (
        SELECT COUNT(*)
        FROM products p
        LEFT JOIN brands b ON b.id = p.brand_id
        WHERE p.brand_id IS NOT NULL AND b.id IS NULL
      ) AS orphan_product_brands,
      (
        SELECT COUNT(*)
        FROM product_images pi
        LEFT JOIN products p ON p.id = pi.product_id
        WHERE p.id IS NULL
      ) AS orphan_product_images,
      (
        SELECT COUNT(*)
        FROM reviews r
        LEFT JOIN products p ON p.id = r.product_id
        WHERE p.id IS NULL
      ) AS orphan_reviews,
      (
        SELECT COUNT(*)
        FROM products p
        JOIN brands b ON b.id = p.brand_id
        WHERE p.brand_slug IS NULL OR b.slug IS NULL OR p.brand_slug <> b.slug
      ) AS inconsistent_product_brand_slugs,
      (SELECT COUNT(*) FROM reviews WHERE rating NOT BETWEEN 1 AND 5) AS invalid_review_ratings,
      (
        SELECT COUNT(*)
        FROM products
        WHERE price_pair < 0 OR price_set < 0
      ) AS negative_product_prices
  `);

  if (!row) return ['Data integrity query returned no result'];

  const errors: string[] = [];
  const checks: Array<[keyof DataIntegrityRow, string]> = [
    ['orphan_product_brands', 'Products reference missing brands'],
    ['orphan_product_images', 'Product images reference missing products'],
    ['orphan_reviews', 'Reviews reference missing products'],
    [
      'inconsistent_product_brand_slugs',
      'Products contain a brand_slug that disagrees with their brand_id',
    ],
    ['invalid_review_ratings', 'Reviews contain ratings outside 1–5'],
    ['negative_product_prices', 'Products contain negative prices'],
  ];

  for (const [field, message] of checks) {
    const count = Number(row[field]) || 0;
    if (count > 0) errors.push(`${message}: ${count}`);
  }

  return errors;
}

export async function runCatalogSmokeQueries(connection: Connection): Promise<void> {
  await connection.query('SELECT id, name, slug, image FROM brands ORDER BY name ASC LIMIT 1');
  await connection.query(
    'SELECT id, model, name, image, price_pair, price_set, slug, brand_slug, brand_id FROM products ORDER BY price_pair ASC LIMIT 1',
  );
  await connection.query('SELECT id, name, model FROM products ORDER BY model ASC LIMIT 1');
  await connection.query('SELECT image_url FROM product_images WHERE product_id = ? LIMIT 1', [0]);
  await connection.query(
    `
      SELECT id, product_id, rating, author_name, comment, created_at
      FROM reviews
      WHERE product_id = ?
      ORDER BY created_at DESC, id DESC
      LIMIT ? OFFSET ?
    `,
    [0, 10, 0],
  );
  await connection.query(`
    SELECT r.id, r.rating, r.author_name, r.comment, r.created_at, p.model, p.name
    FROM reviews r
    JOIN products p ON r.product_id = p.id
    ORDER BY r.created_at DESC
    LIMIT 0, 10
  `);
}
