import { expect, Page, test } from '@playwright/test';

const MOCK_PRODUCTS_RESPONSE = {
  items: [
    {
      id: '019c1fb7-f4a5-7b88-a796-0f53a37161d0',
      name: 'Sony Wireless Headphones',
      category: 'Electronics',
      brand: 'Sony',
      price: 150,
      oldPrice: 200,
      rating: 4.8,
      reviews: 320,
      stock: 10,
      badge: 'Sale',
      image: '/images/headphones.jpg',
    },
    {
      id: '019c1fb7-f4a5-7b88-a796-0f53a37161d1',
      name: 'Nike Running Shoes',
      category: 'Fashion',
      brand: 'Nike',
      price: 120,
      oldPrice: 150,
      rating: 4.5,
      reviews: 180,
      stock: 6,
      badge: 'New',
      image: '/images/shoes.jpg',
    },
  ],
  page: 1,
  pageSize: 12,
  totalCount: 2,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

async function clearApplicationState(page: Page): Promise<void> {
  await page.goto('/');

  await page.evaluate(() => {
    localStorage.removeItem('hubshop-auth');
    localStorage.removeItem('hebashop-cart');
    localStorage.removeItem('hubshop-orders');
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
    /*
     * الـ GitHub Actions تشغل الـ Frontend فقط،
     * لذلك نعترض طلب المنتجات ونرجع بيانات اختبار ثابتة.
     */
    await page.route('**/api/products**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PRODUCTS_RESPONSE),
      });
    });

    await clearApplicationState(page);
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

  test('should complete the full purchase journey', async ({ page }) => {
    test.setTimeout(60_000);

    await authenticateUser(page);
    await page.goto('/products');

    const productCard = page
      .locator('app-product-card')
      .filter({
        has: page.locator('button.add-cart-button'),
      })
      .first();

    await expect(productCard).toBeVisible();

    await productCard
      .getByRole('button', {
        name: 'Add to Cart',
        exact: true,
      })
      .click();

    await page.goto('/cart');

    await expect(page.locator('article.cart-item').first()).toBeVisible();

    const checkoutButton = page.locator('button.checkout-button');

    await expect(checkoutButton).toBeVisible();
    await checkoutButton.scrollIntoViewIfNeeded();
    await checkoutButton.click();

    await expect(page).toHaveURL(/\/checkout$/);

    await expect(
      page.getByRole('heading', {
        name: 'Complete Your Order',
        exact: true,
      }),
    ).toBeVisible();

    await page.getByLabel('Full Name', { exact: true }).fill('Heba Magdy');
    await page.getByLabel('Email Address', { exact: true }).fill('heba@example.com');
    await page.getByLabel('Phone Number', { exact: true }).fill('0501234567');
    await page.getByLabel('Country', { exact: true }).selectOption('Saudi Arabia');
    await page.getByLabel('City', { exact: true }).fill('Riyadh');
    await page.getByLabel('Address', { exact: true }).fill('123 King Fahd Road, Riyadh');
    await page.getByLabel('Postal Code', { exact: true }).fill('12345');

    const placeOrderButton = page.locator('aside.order-summary button.place-order-button');

    await expect(placeOrderButton).toBeVisible();
    await expect(placeOrderButton).toBeEnabled();
    await placeOrderButton.scrollIntoViewIfNeeded();
    await placeOrderButton.click();

    await expect(
      page.getByRole('heading', {
        name: 'Thank you for your order',
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.locator('.order-number strong')).toContainText('HS-');

    const viewOrdersLink = page.locator('section.order-success a[href="/account/orders"]');

    await expect(viewOrdersLink).toBeVisible();
    await viewOrdersLink.click();

    await expect(page).toHaveURL(/\/account\/orders$/);
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
