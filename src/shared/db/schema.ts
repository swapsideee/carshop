import type { RowDataPacket } from 'mysql2/promise';

export type BrandRow = RowDataPacket & {
  id: number;
  name: string | null;
  slug: string | null;
  image: string | null;
};

export type ProductRow = RowDataPacket & {
  id: number;
  model: string | null;
  name: string | null;
  image: string | null;
  price_pair: number | null;
  price_set: number | null;
  slug: string | null;
  brand_slug: string | null;
  brand_id: number | null;
};

export type ProductImageRow = RowDataPacket & {
  id: number;
  product_id: number;
  image_url: string;
};

export type ReviewRow = RowDataPacket & {
  id: number;
  product_id: number;
  rating: number;
  author_name: string | null;
  comment: string;
  created_at: Date | null;
};
