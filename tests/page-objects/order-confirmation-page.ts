// tests/page-objects/order-confirmation-page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class OrderConfirmationPage extends BasePage {
  private readonly orderNumber: Locator;
  private readonly successMessage: Locator;
  private readonly orderDetails: Locator;

  constructor(page: Page) {
    super(page);
    this.orderNumber = page.locator('.order-number, [data-test="order-number"], .confirmation-number');
    this.successMessage = page.locator('.success, .confirmation-message, .thank-you');
    this.orderDetails = page.locator('.order-details, .order-summary');
  }

  async verifyOrderConfirmation(): Promise<string> {
    await expect(this.page).toHaveURL(/.*orders|.*confirmation|.*thank/);
    await expect(this.successMessage).toBeVisible();
    
    const orderNumber = await this.orderNumber.textContent() || '';
    expect(orderNumber).toBeTruthy();
    
    return orderNumber.trim();
  }

  async verifySuccessMessage(): Promise<void> {
    await expect(this.successMessage).toContainText(/success|thank|confirmed|complete/i);
  }
}
