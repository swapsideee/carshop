import type { ProductImageRow, ProductRow } from '@/shared/db/schema';

import type {
  CheckoutProduct,
  ProductDetailDTO,
  ProductListItemDTO,
  ProductSelectItemDTO,
  RelatedProductDTO,
} from '../../model/types';

export type RelatedProductRow = Pick<
  ProductRow,
  'id' | 'image' | 'model' | 'price_pair' | 'price_set'
>;

export type ProductImageUrlRow = Pick<ProductImageRow, 'image_url'>;

export type CheckoutProductRow = Pick<
  ProductRow,
  'id' | 'model' | 'name' | 'price_pair' | 'price_set'
>;

export type ProductSelectRow = Pick<ProductRow, 'id' | 'model' | 'name'>;

export function mapProductRow(row: ProductRow): ProductListItemDTO {
  return {
    id: Number(row.id),
    name: row.name,
    model: row.model,
    image: row.image,
    pricePair: row.price_pair == null ? null : Number(row.price_pair),
    priceSet: row.price_set == null ? null : Number(row.price_set),
    slug: row.slug,
    brandSlug: row.brand_slug,
    brandId: row.brand_id == null ? null : Number(row.brand_id),
  };
}

export function mapRelatedProductRow(row: RelatedProductRow): RelatedProductDTO {
  return {
    id: Number(row.id),
    model: row.model,
    image: row.image,
    pricePair: row.price_pair == null ? null : Number(row.price_pair),
    priceSet: row.price_set == null ? null : Number(row.price_set),
  };
}

export function mapProductDetail(
  productRow: ProductRow,
  imageRows: ProductImageUrlRow[],
  relatedRows: RelatedProductRow[],
): ProductDetailDTO {
  return {
    ...mapProductRow(productRow),
    images: imageRows.map((row) => row.image_url),
    related: relatedRows.map(mapRelatedProductRow),
  };
}

export function mapCheckoutProductRow(row: CheckoutProductRow): CheckoutProduct {
  return {
    id: Number(row.id),
    name: row.name,
    model: row.model,
    pricePair: row.price_pair == null ? null : Number(row.price_pair),
    priceSet: row.price_set == null ? null : Number(row.price_set),
  };
}

export function mapProductSelectRow(row: ProductSelectRow): ProductSelectItemDTO {
  return {
    id: Number(row.id),
    name: row.name,
    model: row.model,
  };
}
