import { expect, test } from '@playwright/test';
import { CheckoutPage } from '../src/pages/checkout.page';
import { ProductPage } from '../src/pages/product.page';
import { checkoutData, testData, wompiTestCard } from '../src/test-data';

test('paga la orden de prueba con tarjeta en Wompi Sandbox', async ({ page }) => {
  test.setTimeout(120_000);

  const productPage = new ProductPage(page);
  const checkoutPage = new CheckoutPage(page);

  await productPage.open(testData.productUrl);
  const sizeButton = productPage.sizeButton(testData.productSize);
  await expect(sizeButton).toBeVisible();
  await expect(sizeButton).not.toHaveClass(/(?:^|\s)disabled(?:\s|$)/);
  await productPage.selectSize(testData.productSize);
  await expect(productPage.sizeSelect).toHaveValue(testData.productSize);
  await expect(productPage.outOfStockModal).toBeHidden();

  await productPage.addToCart();
  await expect(productPage.addedToCartMessage).toBeVisible();

  await checkoutPage.open();
  await expect(checkoutPage.checkoutForm).toBeVisible();
  await checkoutPage.completeBillingDetails(checkoutData);
  await expect(checkoutPage.placeOrderButton).toBeEnabled();
  await expect(checkoutPage.orderReview).toBeVisible();
  await expect(checkoutPage.orderTotal).toBeVisible();

  await checkoutPage.placeOrder();
  await expect(page).toHaveURL(/\/order-pay\/\d+\//);

  await checkoutPage.payWithCard(checkoutData, wompiTestCard);
  await expect(page).toHaveURL(/\/finalizar-compra\/order-received\/\d+\//, { timeout: 45_000 });
  await expect(checkoutPage.orderDetailsHeading).toBeVisible();
  await expect(checkoutPage.orderSummaryHeading).toBeVisible();
  await expect(checkoutPage.billingAddressHeading).toBeVisible();
  await expect(checkoutPage.shippingAddressHeading).toBeVisible();
});
