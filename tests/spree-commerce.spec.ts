// tests/spree-commerce.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from './page-objects/home-page';
import { AuthPage } from './page-objects/auth-page';
import { ProductPage } from './page-objects/product-page';
import { CartPage } from './page-objects/cart-page';
import { CheckoutPage } from './page-objects/checkout-page';
import { OrderConfirmationPage } from './page-objects/order-confirmation-page';
import { TestData } from './fixtures/test-data';

test.describe('Spree Commerce E2E Tests', () => {
  let homePage: HomePage;
  let authPage: AuthPage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let orderConfirmationPage: OrderConfirmationPage;
  let productDetails: { name: string; price: string };

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    authPage = new AuthPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    orderConfirmationPage = new OrderConfirmationPage(page);
  });

  test('Complete Spree Commerce Shopping Flow', async () => {
    // Step 1: Navigate to Spree Commerce demo store
    await test.step('Navigate to Spree Commerce demo store', async () => {
      await homePage.navigateToHomePage();
      await homePage.verifyHomePage();
    });

    // Step 2: Sign Up as new user (Log out if needed)
    await test.step('Sign up as new user', async () => {
      // Check if already logged in and logout if needed
      if (await homePage.isLoggedIn()) {
        await homePage.logout();
      }

      await homePage.clickUserIcon();
      await homePage.clickSignUp();
      
      await authPage.signUp(
        TestData.user.email,
        TestData.user.password,
        TestData.user.firstName,
        TestData.user.lastName
      );
      
      await authPage.verifySignUpSuccess();
    });

    // Step 3: Login with newly registered user credentials
    await test.step('Login with new user credentials', async () => {
      // Navigate to login if not already logged in from signup
      const currentUrl = await homePage.getCurrentUrl();
      if (!currentUrl.includes('account') && !currentUrl.includes('dashboard')) {
        await homePage.clickUserIcon();
        await homePage.clickLogin();
        
        await authPage.login(TestData.user.email, TestData.user.password);
        await authPage.verifyLoginSuccess();
      }
    });

    // Step 4: Browse products and open product detail page
    await test.step('Browse products and open product detail', async () => {
      await productPage.browseProducts();
      productDetails = await productPage.openFirstProduct();
      await productPage.verifyProductDetails();
      
      expect(productDetails.name).toBeTruthy();
      expect(productDetails.price).toBeTruthy();
    });

    // Step 5: Add product to cart
    await test.step('Add product to cart', async () => {
      await productPage.addToCart(1);
      // Wait a moment for cart to update
      await productPage.page.waitForTimeout(2000);
    });

    // Step 6: Go to cart and verify product details
    await test.step('Verify product in cart', async () => {
      await productPage.goToCart();
      await cartPage.verifyCartPage();
      await cartPage.verifyProductInCart(productDetails.name, '1');
    });

    // Step 7: Proceed to checkout
    await test.step('Complete checkout process', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.verifyCheckoutPage();

      // Add shipping address
      await checkoutPage.fillShippingAddress(TestData.shippingAddress);
      await checkoutPage.continueToNextStep();

      // Select shipping method and verify options
      await checkoutPage.verifyDeliveryOptions();
      const selectedShipping = await checkoutPage.selectShippingMethod();
      expect(selectedShipping).toBeTruthy();
      await checkoutPage.continueToNextStep();

      // Select payment method
      await checkoutPage.selectPaymentMethod();
      await checkoutPage.fillPaymentDetails(TestData.testCard);
      
      // Complete the order
      await checkoutPage.placeOrder();
    });

    // Step 8: Verify order confirmation
    await test.step('Verify order confirmation', async () => {
      const orderNumber = await orderConfirmationPage.verifyOrderConfirmation();
      await orderConfirmationPage.verifySuccessMessage();
      
      expect(orderNumber).toBeTruthy();
      console.log(`Order completed successfully with order number: ${orderNumber}`);
    });
  });
});
