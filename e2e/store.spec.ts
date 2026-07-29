import { expect, Page, test } from '@playwright/test';

async function clearAuthentication(page: Page): Promise<void> {
  await page.goto('/');

  await page.evaluate(() => {
    localStorage.removeItem('hubshop-auth');

    sessionStorage.removeItem('hubshop-auth');
  });
}

async function authenticateUser(page: Page): Promise<void> {
  await page.goto('/');

  await page.evaluate(() => {
    localStorage.setItem('hubshop-auth', 'authenticated');

    sessionStorage.removeItem('hubshop-auth');
  });
}

test.describe('HubShop frontend', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthentication(page);
  });

  test('should open the products catalog', async ({ page }) => {
    await page.goto('/products');

    await expect(
      page.getByRole('heading', {
        name: 'All Products',
      }),
    ).toBeVisible();

    await expect(page.locator('app-product-card').first()).toBeVisible();
  });

  test('should open the forgot password page', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    await expect(
      page.getByRole('heading', {
        name: 'Forgot Your Password?',
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: 'Send Reset Instructions',
      }),
    ).toBeVisible();
  });

  test('should redirect an unauthenticated user from checkout to login', async ({ page }) => {
    await page.goto('/checkout');

    await expect(page).toHaveURL(/\/auth\/login\?.*returnUrl/);

    await expect(
      page.getByRole('heading', {
        name: /welcome back|sign in/i,
      }),
    ).toBeVisible();
  });

  test('should allow an authenticated user to open the admin dashboard', async ({ page }) => {
    await authenticateUser(page);

    await page.goto('/admin/dashboard');

    await expect(
      page.getByRole('heading', {
        name: 'Dashboard',
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', {
        name: 'Products',
      }),
    ).toBeVisible();

    await expect(
      page
        .getByRole('navigation', {
          name: 'Admin navigation',
        })
        .getByRole('link', {
          name: 'Orders',
          exact: true,
        }),
    ).toBeVisible();
  });

  test('should display products in the admin catalog', async ({ page }) => {
    await authenticateUser(page);

    await page.goto('/admin/products');

    await expect(
      page.getByRole('heading', {
        name: 'Products',
      }),
    ).toBeVisible();

    await expect(page.locator('tbody tr').first()).toBeVisible();
  });

  test('should open the admin orders page', async ({ page }) => {
    await authenticateUser(page);

    await page.goto('/admin/orders');

    await expect(
      page.getByRole('heading', {
        name: 'Orders',
        level: 1,
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.getByPlaceholder('Search order, customer or email')).toBeVisible();
  });

  test('should sign out from the admin area', async ({ page }) => {
    await authenticateUser(page);

    await page.goto('/admin/dashboard');

    await page
      .getByRole('button', {
        name: 'Sign Out',
      })
      .click();

    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should redirect unknown URLs to the not found page', async ({ page }) => {
    await page.goto('/route-that-does-not-exist');

    await expect(page).toHaveURL(/\/not-found/);
  });
});
