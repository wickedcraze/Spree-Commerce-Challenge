// tests/page-objects/home-page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  private readonly userIcon: Locator;
  private readonly loginLink: Locator;
  private readonly signUpLink: Locator;
  private readonly logoutLink: Locator;
  private readonly productsSection: Locator;

  constructor(page: Page) {
    super(page);
    this.userIcon = page.locator('[data-test="account-button"], .account-link, [href*="account"]').first();
    this.loginLink = page.getByText('Login', { exact: true });
    this.signUpLink = page.getByText('Sign Up', { exact: true });
    this.logoutLink = page.getByText('Logout', { exact: true });
    this.productsSection = page.locator('.products, [data-test="products"]');
  }

  async navigateToHomePage(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  async clickUserIcon(): Promise<void> {
    await this.clickElement(this.userIcon);
  }

  async clickSignUp(): Promise<void> {
    await this.clickElement(this.signUpLink);
  }

  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginLink);
  }

  async logout(): Promise<void> {
    await this.clickUserIcon();
    await this.clickElement(this.logoutLink);
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.clickUserIcon();
      await this.logoutLink.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async verifyHomePage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*demo\.spreecommerce\.org/);
    await expect(this.page).toHaveTitle(/spree/i);
  }
}
