// tests/page-objects/cart-page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class CartPage extends BasePage {
  private readonly cartItems: Locator;
  private readonly productName: Locator;
  private readonly productQuantity: Locator;
  private readonly productPrice: Locator;
  private readonly checkoutButton: Locator;
  private readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart-item, .line-item, [data-test="cart-item"]');
    this.productName = page.locator('.item-name, .product-name, [data-test="item-name"]');
    this.productQuantity = page.locator('.quantity, [data-test="quantity"]');
    this.productPrice = page.locator('.item-price, .price, [data-test="item-price"]');
    this.checkoutButton = page.locator('button:has-text("Checkout"), a:has-text("Checkout"), [data-test="checkout"]');
    this.emptyCartMessage = page.locator('.empty-cart, .no-items');
  }

  async verifyProductInCart(expectedName: string, expectedQuantity: string = '1'): Promise<void> {
    await expect(this.cartItems).toHaveCount(1);
    await expect(this.productName.first()).toContainText(expectedName);
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickElement(this.checkoutButton);
    await this.waitForPageLoad();
  }

  async verifyCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*cart/);
    await expect(this.cartItems).toHaveCountGreaterThan(0);
  }
}
