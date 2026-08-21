import { expect, test } from '@playwright/test';

test('renders the public home page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Автомобільні підкрилки' })).toBeVisible();

  const catalogLink = page.getByRole('link', { name: 'Перейти до каталогу', exact: true });
  await expect(catalogLink).toHaveAttribute('href', '/products');
});
