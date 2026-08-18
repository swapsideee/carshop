CREATE TABLE IF NOT EXISTS brands (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(25) NULL,
  slug VARCHAR(25) NULL,
  image VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY brands_slug_unique (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id INT NOT NULL AUTO_INCREMENT,
  model VARCHAR(255) NULL,
  name VARCHAR(255) NULL,
  image VARCHAR(255) NULL,
  price_pair INT NULL,
  price_set INT NULL,
  slug VARCHAR(255) NULL,
  brand_slug VARCHAR(255) NULL,
  brand_id INT NULL,
  PRIMARY KEY (id),
  KEY products_brand_slug_price_pair_idx (brand_slug, price_pair),
  KEY products_brand_slug_model_idx (brand_slug, model),
  KEY products_price_pair_idx (price_pair),
  KEY products_model_idx (model),
  CONSTRAINT products_brand_id_fk
    FOREIGN KEY (brand_id) REFERENCES brands (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_images (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  KEY product_images_product_id_idx (product_id),
  CONSTRAINT product_images_product_id_fk
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  author_name VARCHAR(60) NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY reviews_product_created_at_id_idx (product_id, created_at, id),
  KEY reviews_created_at_id_idx (created_at, id),
  CONSTRAINT reviews_product_id_fk
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
