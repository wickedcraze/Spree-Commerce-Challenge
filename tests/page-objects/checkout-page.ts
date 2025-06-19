// tests/page-objects/checkout-page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  zipCode: string;
  phone: string;
}

interface PaymentDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export class CheckoutPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly address1Input: Locator;
  private readonly address2Input: Locator;
  private readonly cityInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly phoneInput: Locator;
  private readonly countrySelect: Locator;
  private readonly stateSelect: Locator;
  private readonly continueButton: Locator;
  private readonly shippingMethods: Locator;
  private readonly paymentMethods: Locator;
  private readonly cardNumberInput: Locator;
  private readonly expiryInput: Locator;
  private readonly cvvInput: Locator;
  private readonly cardNameInput: Locator;
  private readonly placeOrderButton: Locator;
  private readonly orderTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[name*="first_name"], #order_bill_address_attributes_firstname');
    this.lastNameInput = page.locator('input[name*="last_name"], #order_bill_address_attributes_lastname');
    this.address1Input = page.locator('input[name*="address1"], #order_bill_address_attributes_address1');
    this.address2Input = page.locator('input[name*="address2"], #order_bill_address_attributes_address2');
    this.cityInput = page.locator('input[name*="city"], #order_bill_address_attributes_city');
    this.zipCodeInput = page.locator('input[name*="zipcode"], #order_bill_address_attributes_zipcode');
    this.phoneInput = page.locator('input[name*="phone"], #order_bill_address_attributes_phone');
    this.countrySelect = page.locator('select[name*="country"], #order_bill_address_attributes_country_id');
    this.stateSelect = page.locator('select[name*="state"], #order_bill_address_attributes_state_id');
    this.continueButton = page.locator('button:has-text("Continue"), input[value*="Continue"]');
    this.shippingMethods = page.locator('input[name*="shipping"], .shipping-method');
    this.paymentMethods = page.locator('input[name*="payment"], .payment-method');
    this.cardNumberInput = page.locator('input[name*="number"], #card_number');
    this.expiryInput = page.locator('input[name*="expiry"], #card_expiry');
    this.cvvInput = page.locator('input[name*="cvv"], #card_code');
    this.cardNameInput = page.locator('input[name*="name"], #card_name');
    this.placeOrderButton = page.locator('button:has-text("Place Order"), input[value*="Place Order"]');
    this.orderTotal = page.locator('.order-total, .total, [data-test="order-total"]');
  }

  async fillShippingAddress(address: ShippingAddress): Promise<void> {
    await this.fillInput(this.firstNameInput, address.firstName);
    await this.fillInput(this.lastNameInput, address.lastName);
    await this.fillInput(this.address1Input, address.address1);
    if (address.address2) {
      await this.fillInput(this.address2Input, address.address2);
    }
    await this.fillInput(this.cityInput, address.city);
    await this.fillInput(this.zipCodeInput, address.zipCode);
    await this.fillInput(this.phoneInput, address.phone);
    
    // Select country and state if visible
    if (await this.countrySelect.isVisible()) {
      await this.selectOption(this.countrySelect, 'US');
    }
    if (await this.stateSelect.isVisible()) {
      await this.stateSelect.first().selectOption({ index: 1 });
    }
  }

  async continueToNextStep(): Promise<void> {
    await this.clickElement(this.continueButton);
    await this.waitForPageLoad();
  }

  async selectShippingMethod(): Promise<string> {
    const shippingOptions = await this.shippingMethods.all();
    if (shippingOptions.length > 0) {
      await shippingOptions[0].click();
      const selectedMethod = await shippingOptions[0].textContent() || '';
      return selectedMethod.trim();
    }
    return '';
  }

  async verifyDeliveryOptions(): Promise<void> {
    await expect(this.shippingMethods).toHaveCountGreaterThan(0);
  }

  async selectPaymentMethod(): Promise<void> {
    const paymentOptions = await this.paymentMethods.all();
    if (paymentOptions.length > 0) {
      await paymentOptions[0].click();
    }
  }

  async fillPaymentDetails(payment: PaymentDetails): Promise<void> {
    if (await this.cardNumberInput.isVisible()) {
      await this.fillInput(this.cardNumberInput, payment.number);
      await this.fillInput(this.expiryInput, payment.expiry);
      await this.fillInput(this.cvvInput, payment.cvv);
      await this.fillInput(this.cardNameInput, payment.name);
    }
  }

  async placeOrder(): Promise<void> {
    await this.clickElement(this.placeOrderButton);
    await this.waitForPageLoad();
  }

  async verifyCheckoutPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout/);
  }
}