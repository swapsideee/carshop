-- Existing databases may predate the migration history. MySQL 8.0 does not
-- support ADD COLUMN/INDEX IF NOT EXISTS, so every change is guarded through
-- information_schema before its DDL is executed.

SET @catalog_schema_name := DATABASE();

SET @catalog_ddl := IF(
  EXISTS(
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @catalog_schema_name
      AND TABLE_NAME = 'reviews'
      AND COLUMN_NAME = 'author_name'
  ),
  'SELECT 1',
  'ALTER TABLE reviews ADD COLUMN author_name VARCHAR(60) NULL AFTER rating'
);
PREPARE catalog_statement FROM @catalog_ddl;
EXECUTE catalog_statement;
DEALLOCATE PREPARE catalog_statement;

SET @catalog_ddl := IF(
  EXISTS(
    SELECT 1
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @catalog_schema_name
      AND TABLE_NAME = 'brands'
      AND NON_UNIQUE = 0
      AND INDEX_NAME <> 'PRIMARY'
    GROUP BY INDEX_NAME
    HAVING COUNT(*) = 1
      AND MAX(CASE WHEN SEQ_IN_INDEX = 1 AND COLUMN_NAME = 'slug' THEN 1 ELSE 0 END) = 1
  ),
  'SELECT 1',
  'ALTER TABLE brands ADD UNIQUE INDEX brands_slug_unique (slug)'
);
PREPARE catalog_statement FROM @catalog_ddl;
EXECUTE catalog_statement;
DEALLOCATE PREPARE catalog_statement;

SET @catalog_ddl := IF(
  EXISTS(
    SELECT 1
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @catalog_schema_name
      AND TABLE_NAME = 'products'
      AND NON_UNIQUE = 1
    GROUP BY INDEX_NAME
    HAVING COUNT(*) = 2
      AND MAX(CASE WHEN SEQ_IN_INDEX = 1 AND COLUMN_NAME = 'brand_slug' THEN 1 ELSE 0 END) = 1
      AND MAX(CASE WHEN SEQ_IN_INDEX = 2 AND COLUMN_NAME = 'price_pair' THEN 1 ELSE 0 END) = 1
  ),
  'SELECT 1',
  'ALTER TABLE products ADD INDEX products_brand_slug_price_pair_idx (brand_slug, price_pair)'
);
PREPARE catalog_statement FROM @catalog_ddl;
EXECUTE catalog_statement;
DEALLOCATE PREPARE catalog_statement;

SET @catalog_ddl := IF(
  EXISTS(
    SELECT 1
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @catalog_schema_name
      AND TABLE_NAME = 'products'
      AND NON_UNIQUE = 1
    GROUP BY INDEX_NAME
    HAVING COUNT(*) = 2
      AND MAX(CASE WHEN SEQ_IN_INDEX = 1 AND COLUMN_NAME = 'brand_slug' THEN 1 ELSE 0 END) = 1
      AND MAX(CASE WHEN SEQ_IN_INDEX = 2 AND COLUMN_NAME = 'model' THEN 1 ELSE 0 END) = 1
  ),
  'SELECT 1',
  'ALTER TABLE products ADD INDEX products_brand_slug_model_idx (brand_slug, model)'
);
PREPARE catalog_statement FROM @catalog_ddl;
EXECUTE catalog_statement;
DEALLOCATE PREPARE catalog_statement;

SET @catalog_ddl := IF(
  EXISTS(
    SELECT 1
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @catalog_schema_name
      AND TABLE_NAME = 'products'
      AND NON_UNIQUE = 1
    GROUP BY INDEX_NAME
    HAVING COUNT(*) = 1
      AND MAX(CASE WHEN SEQ_IN_INDEX = 1 AND COLUMN_NAME = 'price_pair' THEN 1 ELSE 0 END) = 1
  ),
  'SELECT 1',
  'ALTER TABLE products ADD INDEX products_price_pair_idx (price_pair)'
);
PREPARE catalog_statement FROM @catalog_ddl;
EXECUTE catalog_statement;
DEALLOCATE PREPARE catalog_statement;

SET @catalog_ddl := IF(
  EXISTS(
    SELECT 1
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @catalog_schema_name
      AND TABLE_NAME = 'products'
      AND NON_UNIQUE = 1
    GROUP BY INDEX_NAME
    HAVING COUNT(*) = 1
      AND MAX(CASE WHEN SEQ_IN_INDEX = 1 AND COLUMN_NAME = 'model' THEN 1 ELSE 0 END) = 1
  ),
  'SELECT 1',
  'ALTER TABLE products ADD INDEX products_model_idx (model)'
);
PREPARE catalog_statement FROM @catalog_ddl;
EXECUTE catalog_statement;
DEALLOCATE PREPARE catalog_statement;

SET @catalog_ddl := IF(
  EXISTS(
    SELECT 1
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @catalog_schema_name
      AND TABLE_NAME = 'reviews'
      AND NON_UNIQUE = 1
    GROUP BY INDEX_NAME
    HAVING COUNT(*) = 3
      AND MAX(CASE WHEN SEQ_IN_INDEX = 1 AND COLUMN_NAME = 'product_id' THEN 1 ELSE 0 END) = 1
      AND MAX(CASE WHEN SEQ_IN_INDEX = 2 AND COLUMN_NAME = 'created_at' THEN 1 ELSE 0 END) = 1
      AND MAX(CASE WHEN SEQ_IN_INDEX = 3 AND COLUMN_NAME = 'id' THEN 1 ELSE 0 END) = 1
  ),
  'SELECT 1',
  'ALTER TABLE reviews ADD INDEX reviews_product_created_at_id_idx (product_id, created_at, id)'
);
PREPARE catalog_statement FROM @catalog_ddl;
EXECUTE catalog_statement;
DEALLOCATE PREPARE catalog_statement;

SET @catalog_ddl := IF(
  EXISTS(
    SELECT 1
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @catalog_schema_name
      AND TABLE_NAME = 'reviews'
      AND NON_UNIQUE = 1
    GROUP BY INDEX_NAME
    HAVING COUNT(*) = 2
      AND MAX(CASE WHEN SEQ_IN_INDEX = 1 AND COLUMN_NAME = 'created_at' THEN 1 ELSE 0 END) = 1
      AND MAX(CASE WHEN SEQ_IN_INDEX = 2 AND COLUMN_NAME = 'id' THEN 1 ELSE 0 END) = 1
  ),
  'SELECT 1',
  'ALTER TABLE reviews ADD INDEX reviews_created_at_id_idx (created_at, id)'
);
PREPARE catalog_statement FROM @catalog_ddl;
EXECUTE catalog_statement;
DEALLOCATE PREPARE catalog_statement;
