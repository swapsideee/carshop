-- Product 301 (SAIPA Tiba) already carries brand_slug = 'saipa'.
-- brands.id = 33 is the existing canonical Saipa brand; brands.id = 37 is Toyota,
-- and its remaining products are Toyota. The WHERE clause makes this data repair
-- safe to replay if a process fails after the UPDATE but before recording migration 005.
UPDATE products
SET brand_id = 33
WHERE id = 301
  AND brand_id = 37
  AND brand_slug = 'saipa';
