// tests/page-objects/auth-page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class AuthPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly signUpButton: Locator;
  private readonly loginButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[type="email"], input[name="email"], #user_email');
    this.passwordInput = page.locator('input[type="password"], input[name="password"], #user_password').first();
    this.confirmPasswordInput = page.locator('input[name="password_confirmation"], #user_password_confirmation');
    this.firstNameInput = page.locator('input[name="first_name"], #user_first_name');
    this.lastNameInput = page.locator('input[name="last_name"], #user_last_name');
    this.signUpButton = page.locator('button[type="submit"], input[type="submit"]').filter({ hasText: /sign up|create/i });
    this.loginButton = page.locator('button[type="submit"], input[type="submit"]').filter({ hasText: /login|sign in/i });
    this.successMessage = page.locator('.alert-success, .success, .flash-success');
    this.errorMessage = page.locator('.alert-error, .error, .flash-error');
  }

  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.fillInput(this.confirmPasswordInput, password);
    await this.fillInput(this.firstNameInput, firstName);
    await this.fillInput(this.lastNameInput, lastName);
    await this.clickElement(this.signUpButton);
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async verifySignUpSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/.*account|.*dashboard|.*home/);
  }

  async verifyLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/.*account|.*dashboard|.*home/);
  }
}
