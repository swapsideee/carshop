import type { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

type IdRow = RowDataPacket & {
  id: number;
};

type SeedBrand = {
  name: string;
  slug: string;
  image: string;
};

type SeedProduct = {
  brandSlug: string;
  model: string;
  name: string;
  image: string;
  pricePair: number | null;
  priceSet: number | null;
  slug: string;
  images: string[];
};

const brands: SeedBrand[] = [
  {
    name: 'Audi',
    slug: 'audi',
    image: '/brands/Audi.webp',
  },
  {
    name: 'BMW',
    slug: 'bmw',
    image: '/brands/Bmw.webp',
  },
  {
    name: 'Ford',
    slug: 'ford',
    image: '/brands/Ford.webp',
  },
];

const products: SeedProduct[] = [
  {
    brandSlug: 'audi',
    model: 'Audi A4 B6 2000-2004',
    name: 'Підкрилки Audi A4 B6',
    image: '/photo/peredni1.jpg',
    pricePair: 900,
    priceSet: 1700,
    slug: 'dev-seed-audi-a4-b6',
    images: ['/photo/peredni1.jpg', '/photo/peredni2.jpg'],
  },
  {
    brandSlug: 'audi',
    model: 'Audi A6 C5 1997-2004',
    name: 'Підкрилки Audi A6 C5',
    image: '/photo/set1.jpg',
    pricePair: 950,
    priceSet: 1800,
    slug: 'dev-seed-audi-a6-c5',
    images: ['/photo/set1.jpg', '/photo/set2.jpg'],
  },
  {
    brandSlug: 'bmw',
    model: 'BMW E46 1998-2005',
    name: 'Підкрилки BMW E46',
    image: '/photo/peredni2.jpg',
    pricePair: 900,
    priceSet: 1750,
    slug: 'dev-seed-bmw-e46',
    images: ['/photo/peredni1.jpg', '/photo/peredni2.jpg'],
  },
  {
    brandSlug: 'bmw',
    model: 'BMW E39 1995-2003',
    name: 'Підкрилки BMW E39',
    image: '/photo/zadni1.jpg',
    pricePair: 850,
    priceSet: 1650,
    slug: 'dev-seed-bmw-e39',
    images: ['/photo/zadni1.jpg', '/photo/zadni2.jpg'],
  },
  {
    brandSlug: 'ford',
    model: 'Ford Focus 2 2004-2011',
    name: 'Підкрилки Ford Focus 2',
    image: '/photo/set2.jpg',
    pricePair: 800,
    priceSet: 1550,
    slug: 'dev-seed-ford-focus-2',
    images: ['/photo/set1.jpg', '/photo/set2.jpg'],
  },
  {
    brandSlug: 'ford',
    model: 'Ford Mondeo 4 2007-2014',
    name: 'Підкрилки Ford Mondeo 4',
    image: '/photo/zadni2.jpg',
    pricePair: 850,
    priceSet: 1600,
    slug: 'dev-seed-ford-mondeo-4',
    images: ['/photo/zadni1.jpg', '/photo/zadni2.jpg'],
  },
];

async function ensureBrand(connection: Connection, brand: SeedBrand): Promise<number> {
  const [rows] = await connection.execute<IdRow[]>(
    'SELECT id FROM brands WHERE slug = ? ORDER BY id ASC',
    [brand.slug],
  );

  if (rows.length > 1) {
    throw new Error(`Expected one brand for slug "${brand.slug}", received ${rows.length}`);
  }

  const existing = rows[0];

  if (existing) {
    await connection.execute(
      `
      UPDATE brands
      SET
        name = ?,
        image = ?
      WHERE id = ?
    `,
      [brand.name, brand.image, existing.id],
    );

    return Number(existing.id);
  }

  const [result] = await connection.execute<ResultSetHeader>(
    `
      INSERT INTO brands (name, slug, image)
      VALUES (?, ?, ?)
    `,
    [brand.name, brand.slug, brand.image],
  );

  return result.insertId;
}

async function upsertSeedProduct(
  connection: Connection,
  product: SeedProduct,
  brandId: number,
): Promise<number> {
  const [rows] = await connection.execute<IdRow[]>(
    'SELECT id FROM products WHERE slug = ? ORDER BY id ASC',
    [product.slug],
  );

  if (rows.length > 1) {
    throw new Error(`Seed product slug "${product.slug}" is not unique: found ${rows.length} rows`);
  }

  const existing = rows[0];

  if (existing) {
    await connection.execute(
      `
        UPDATE products
        SET
          model = ?,
          name = ?,
          image = ?,
          price_pair = ?,
          price_set = ?,
          brand_slug = ?,
          brand_id = ?
        WHERE id = ?
      `,
      [
        product.model,
        product.name,
        product.image,
        product.pricePair,
        product.priceSet,
        product.brandSlug,
        brandId,
        existing.id,
      ],
    );

    return Number(existing.id);
  }

  const [result] = await connection.execute<ResultSetHeader>(
    `
      INSERT INTO products (
        model,
        name,
        image,
        price_pair,
        price_set,
        slug,
        brand_slug,
        brand_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      product.model,
      product.name,
      product.image,
      product.pricePair,
      product.priceSet,
      product.slug,
      product.brandSlug,
      brandId,
    ],
  );

  return result.insertId;
}

async function replaceProductImages(
  connection: Connection,
  productId: number,
  images: string[],
): Promise<void> {
  await connection.execute('DELETE FROM product_images WHERE product_id = ?', [productId]);

  for (const image of images) {
    await connection.execute(
      `
        INSERT INTO product_images (product_id, image_url)
        VALUES (?, ?)
      `,
      [productId, image],
    );
  }
}

export async function seedDevelopmentCatalog(
  connection: Connection,
  log: (message: string) => void = console.log,
): Promise<void> {
  await connection.beginTransaction();

  try {
    const brandIds = new Map<string, number>();

    for (const brand of brands) {
      const brandId = await ensureBrand(connection, brand);
      brandIds.set(brand.slug, brandId);
    }

    for (const product of products) {
      const brandId = brandIds.get(product.brandSlug);

      if (!brandId) {
        throw new Error(`Missing seeded brand "${product.brandSlug}"`);
      }

      const productId = await upsertSeedProduct(connection, product, brandId);

      await replaceProductImages(connection, productId, product.images);
    }

    await connection.commit();

    log(`Development catalogue seed applied: ${brands.length} brands, ${products.length} products`);
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}
