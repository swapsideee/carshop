import type { BrandApiDTO } from '@/entities/brand';

const CYRILLIC_PATTERN = /[А-Яа-яІіЇїЄє]/;

export function sortBrands(brands: BrandApiDTO[]): BrandApiDTO[] {
  return [...brands].sort((a, b) => {
    const aName = a?.name || '';
    const bName = b?.name || '';

    const aCyrillic = CYRILLIC_PATTERN.test(aName);
    const bCyrillic = CYRILLIC_PATTERN.test(bName);

    if (aCyrillic !== bCyrillic) return aCyrillic ? 1 : -1;

    return aName.localeCompare(bName, 'uk', { sensitivity: 'base' });
  });
}
