import type {
  ProductDetailApiDTO,
  ProductListItemApiDTO,
  ProductSelectApiDTO,
  ProductSelectApiResult,
  ProductsPagedApiResult,
  RelatedProductApiDTO,
} from '../../model/apiTypes';
import type {
  ProductDetailDTO,
  ProductListItemDTO,
  ProductSelectItemDTO,
  ProductsPagedResultDTO,
  RelatedProductDTO,
} from '../../model/types';

function toRelatedProductApiDTO(product: RelatedProductDTO): RelatedProductApiDTO {
  return {
    id: product.id,
    model: product.model,
    image: product.image,
    price_pair: product.pricePair,
    price_set: product.priceSet,
  };
}

export function toProductListItemApiDTO(product: ProductListItemDTO): ProductListItemApiDTO {
  return {
    id: product.id,
    name: product.name,
    model: product.model,
    image: product.image,
    price_pair: product.pricePair,
    price_set: product.priceSet,
    slug: product.slug,
    brand_slug: product.brandSlug,
    brand_id: product.brandId,
  };
}

export function toProductSelectApiDTO(product: ProductSelectItemDTO): ProductSelectApiDTO {
  return {
    id: product.id,
    name: product.name,
    model: product.model,
  };
}

export function toProductDetailApiDTO(product: ProductDetailDTO): ProductDetailApiDTO {
  return {
    ...toProductListItemApiDTO(product),
    images: product.images,
    related: product.related.map(toRelatedProductApiDTO),
  };
}

export function toProductsPagedApiResult(result: ProductsPagedResultDTO): ProductsPagedApiResult {
  return {
    items: result.items.map(toProductListItemApiDTO),
    page: result.page,
    total: result.total,
    totalPages: result.totalPages,
  };
}

export function toProductSelectApiResult(products: ProductSelectItemDTO[]): ProductSelectApiResult {
  return {
    items: products.map(toProductSelectApiDTO),
  };
}
