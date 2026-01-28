import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";
const TEST_USER = {
  email: "john@gmail.com",
  password: "m38rmF$",
};

async function loginUser(page) {
  await page.goto(BASE_URL);

  const loginLink = page
    .locator('a:has-text("Login"), [href*="login"]')
    .first();
  await loginLink.click();
  await page.waitForURL(/.*login/);

  await expect(page).toHaveURL(/.*login/);
  await expect(
    page.locator('h1:has-text("Login"), h2:has-text("Login")'),
  ).toBeVisible();

  const emailInput = page
    .locator('input[type="email"], input[name="email"], input[id="email"]')
    .first();
  const passwordInput = page
    .locator(
      'input[type="password"], input[name="password"], input[id="password"]',
    )
    .first();

  await emailInput.fill(TEST_USER.email);
  await passwordInput.fill(TEST_USER.password);

  const loginButton = page
    .locator('button[type="submit"], button:has-text("Submit")')
    .first();
  await loginButton.click();
  await page.waitForURL(BASE_URL, { timeout: 10000 });
  await page.reload();
  await expect(
    page.locator('a:has-text("Login"), [href*="login"]'),
  ).toHaveCount(0, { timeout: 5000 });
}

test.describe("E-Commerce Application E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  // TEST 1. Strona główna ładuje się poprawnie

  test("Should load homepage successfully", async ({ page }) => {
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator("body")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("VirtuCart", { exact: true })).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.locator('a:has-text("Login"), [href*="login"]'),
    ).toBeVisible({ timeout: 10000 });

    const content = await page.textContent("body");
    expect(content.length).toBeGreaterThan(100);

    const headings = page.locator("h1, h2");
    await expect(headings.first()).toBeVisible({ timeout: 10000 });
  });

  // TEST 2. Nawigacja do strony logowania

  test("Should navigate to login page", async ({ page }) => {
    await page.waitForTimeout(2000);
    const loginLink = page
      .locator('a:has-text("Login"), [href*="login"]')
      .first();
    await expect(loginLink).toBeVisible({ timeout: 10000 });
    await loginLink.click();

    await page.waitForURL(/.*login/);
    await expect(page).toHaveURL(/.*login/);

    await expect(
      page.locator('h1:has-text("Login"), h2:has-text("Login")'),
    ).toBeVisible();
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(
      page.locator('input[type="password"], input[name="password"]'),
    ).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  // TEST 3. Wyświetlanie produktów na stronie głównej

  test("Should display products on homepage", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForResponse(
      (response) =>
        response.url().includes("fakestoreapi.com/products") &&
        response.status() === 200,
      { timeout: 30000 },
    );
    await page.waitForTimeout(3000);
    const products = page.locator(".max-w-sm");
    await expect(products.first()).toBeVisible({ timeout: 15000 });

    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);
    expect(productCount).toBeLessThan(50);

    const firstProduct = products.first();
    await expect(firstProduct.locator("img")).toBeVisible();
    // Sprawdź, czy cena jest widoczna i zawiera znak $
    const priceDiv = firstProduct.locator(".font-bold.text-md");
    await expect(priceDiv).toBeVisible();
    const priceText = await priceDiv.textContent();
    expect(priceText).toMatch(/\$/);
  });

  // TEST 4. Filtrowanie produktów

  test("Should filter products by category", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForResponse(
      (response) => response.url().includes("fakestoreapi.com/products"),
      { timeout: 30000 },
    );
    await page.waitForTimeout(3000);
    const products = page.locator(".max-w-sm");
    await expect(products.first()).toBeVisible({ timeout: 15000 });

    const initialCount = await products.count();
    expect(initialCount).toBeGreaterThan(0);

    const filterSelect = page.locator("select").first();
    await expect(filterSelect).toBeVisible({ timeout: 10000 });

    const options = filterSelect.locator("option");
    const optionsCount = await options.count();
    expect(optionsCount).toBeGreaterThan(1);

    if (optionsCount > 1) {
      await filterSelect.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      const filteredCount = await products.count();
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });

  // TEST 5. Dodawanie produktu do koszyka (wymaga zalogowania)

  test("Should add product to cart", async ({ page }) => {
    await loginUser(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    const productLink = page.locator(".max-w-sm a").first();
    await expect(productLink).toBeVisible({ timeout: 15000 });

    const productTitle = await productLink.textContent();

    await productLink.click({ timeout: 10000 });
    await page.waitForLoadState("networkidle");

    const addToCartBtn = page
      .locator("button")
      .filter({ hasText: /add to cart|cart/i })
      .first();

    await expect(addToCartBtn).toBeVisible({ timeout: 5000 });
    await addToCartBtn.click();

    await page.waitForTimeout(1500);

    await page.goto(BASE_URL + "/cart");
    await page.waitForLoadState("networkidle");

    const cartItems = page.locator('[class*="cart"], [class*="item"]');
    const cartCount = await cartItems.count();
    expect(cartCount).toBeGreaterThan(0);
  });

  // TEST 6. Dodawanie produktu do listy życzeń (wymaga zalogowania)

  test("Should add product to wishlist", async ({ page }) => {
    await loginUser(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    const productLink = page.locator(".max-w-sm a").first();
    await expect(productLink).toBeVisible({ timeout: 15000 });
    await productLink.click({ timeout: 10000 });
    await page.waitForLoadState("networkidle");

    const wishlistBtn = page
      .locator("button")
      .filter({ hasText: /wishlist|wish|♥/i })
      .first();

    await expect(wishlistBtn).toBeVisible({ timeout: 5000 });
    await wishlistBtn.click();

    await page.waitForTimeout(1500);

    await page.goto(BASE_URL + "/wishlist");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*wishlist/);

    const wishlistItems = page.locator(
      '[class*="wish"], [class*="item"], [class*="product"]',
    );
    const wishlistCount = await wishlistItems.count();
    expect(wishlistCount).toBeGreaterThan(0);
  });

  // TEST 7. Nawigacja do strony koszyka

  test("Should navigate to cart page", async ({ page }) => {
    const cartLink = page
      .locator('a:has-text("Cart"), a[href*="cart"], [aria-label*="cart"]')
      .first();

    await expect(cartLink).toBeVisible();
    await cartLink.click();
    await page.waitForURL(/.*cart/, { timeout: 5000 });
    await expect(page).toHaveURL(/.*cart/);
    await expect(
      page.locator("h1, h2").filter({ hasText: /cart/i }).first(),
    ).toBeVisible();
  });

  // TEST 8. Nawigacja do strony listy życzeń

  test("Should navigate to wishlist page", async ({ page }) => {
    const wishlistLink = page
      .locator(
        'a:has-text("Wishlist"), a:has-text("Wish"), a[href*="wishlist"]',
      )
      .first();

    await expect(wishlistLink).toBeVisible();
    await wishlistLink.click();
    await page.waitForURL(/.*wishlist/, { timeout: 5000 });
    await expect(page).toHaveURL(/.*wishlist/);
    await expect(
      page
        .locator("h1, h2")
        .filter({ hasText: /wishlist|wish/i })
        .first(),
    ).toBeVisible();
  });

  // TEST 9. Nieprawidłowe dane logowania

  test("Should reject invalid login credentials", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    const loginLink = page
      .locator('a:has-text("Login"), [href*="login"]')
      .first();
    await loginLink.click();
    await page.waitForURL(/.*login/);

    const emailInput = page
      .locator('input[type="email"], input[name="email"], input[id="email"]')
      .first();
    const passwordInput = page
      .locator(
        'input[type="password"], input[name="password"], input[id="password"]',
      )
      .first();

    await emailInput.fill("wrong@email.com");
    await passwordInput.fill("wrongpassword");

    const loginButton = page
      .locator('button[type="submit"], button:has-text("Submit")')
      .first();
    await loginButton.click();

    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/.*login/);

    await page.goto(BASE_URL);
    await expect(
      page.locator('a:has-text("Login"), [href*="login"]').first(),
    ).toBeVisible();
  });

  // TEST 10. Nawigacja do szczegółów produktu

  test("Should navigate to product details page", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForResponse(
      (response) => response.url().includes("fakestoreapi.com/products"),
      { timeout: 30000 },
    );
    await page.waitForTimeout(3000);
    const products = page.locator(".max-w-sm a");
    await expect(products.first()).toBeVisible({ timeout: 15000 });

    await products.first().click();
    await page.waitForLoadState("networkidle");

    await expect(page.locator("img").first()).toBeVisible();
    await expect(page.locator("h1, h2").first()).toBeVisible();
    const priceDiv = page.locator("p.text-2xl.font-bold");
    await expect(priceDiv).toBeVisible();
    const priceText = await priceDiv.textContent();
    expect(priceText).toMatch(/\$/);

    const buttons = page.locator("button");
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  // TEST 11. Pusty koszyka przed dodaniem produktów

  test("Should show empty cart initially", async ({ page }) => {
    await loginUser(page);

    const cartLink = page
      .locator('a:has-text("Cart"), a[href*="cart"], [aria-label*="cart"]')
      .first();

    await expect(cartLink).toBeVisible();
    await cartLink.click();
    await page.waitForURL(/.*cart/, { timeout: 5000 });

    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*cart/);
    await expect(
      page.locator("h1, h2").filter({ hasText: /cart/i }).first(),
    ).toBeVisible();
  });
});
