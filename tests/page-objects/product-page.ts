// tests/page-objects/product-page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class ProductPage extends BasePage {
  private readonly productLinks: Locator;
  private readonly productTitle: Locator;
  private readonly productPrice: Locator;
  private readonly addToCartButton: Locator;
  private readonly quantityInput: Locator;
  private readonly cartIcon: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.productLinks = page.locator('a[href*="/products/"], .product-link, .product-item a');
    this.productTitle = page.locator('h1, .product-title, [data-test="product-name"]');
    this.productPrice = page.locator('.price, .product-price, [data-test="product-price"]');
    this.addToCartButton = page.locator('button:has-text("Add to Cart"), input[value*="Add to Cart"], [data-test="add-to-cart"]');
    this.quantityInput = page.locator('input[name="quantity"], #quantity');
    this.cartIcon = page.locator('[data-test="cart"], .cart-link, a[href*="cart"]');
    this.successMessage = page.locator('.alert-success, .success, .flash-success');
  }

  async browseProducts(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  async openFirstProduct(): Promise<{ name: string; price: string }> {
    await this.clickElement(this.productLinks.first());
    await this.waitForPageLoad();
    
    const name = await this.productTitle.textContent() || '';
    const price = await this.productPrice.textContent() || '';
    
    return { name: name.trim(), price: price.trim() };
  }

  async addToCart(quantity: number = 1): Promise<void> {
    if (await this.quantityInput.isVisible()) {
      await this.fillInput(this.quantityInput, quantity.toString());
    }
    await this.clickElement(this.addToCartButton);
  }

  async goToCart(): Promise<void> {
    await this.clickElement(this.cartIcon);
    await this.waitForPageLoad();
  }

  async verifyProductDetails(): Promise<void> {
    await expect(this.productTitle).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
  }
}
