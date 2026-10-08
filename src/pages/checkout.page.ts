import type { Page } from '@playwright/test';

export interface CheckoutDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  city: string;
  gender: string;
}

export interface TestCard {
  number: string;
  cvc: string;
}

export class CheckoutPage {
  constructor(private readonly page: Page) {}
  get checkoutForm() {
    return this.page.locator('form.checkout');
  }
  get orderReview() {
    return this.page.locator('#order_review');
  }
  get orderTotal() {
    return this.page.locator('#order_review .order-total');
  }
  get placeOrderButton() {
    return this.page.locator('#place_order');
  }
  get orderDetailsHeading() {
    return this.page.getByRole('heading', { name: /detalles del pedido/i });
  }
  get orderSummaryHeading() {
    return this.page.getByRole('heading', { name: /resumen de la compra/i });
  }
  get billingAddressHeading() {
    return this.page.getByRole('heading', { name: /dirección de facturación/i });
  }
  get shippingAddressHeading() {
    return this.page.getByRole('heading', { name: /dirección de envío/i });
  }
  async open(): Promise<void> {
    await this.page.goto('/finalizar-compra/');
    await this.page.locator('.resume-cta').click({ force: true });
    await this.page.locator('.guest-cta').evaluate(element => (element as HTMLAnchorElement).click());
  }

  async completeBillingDetails(details: CheckoutDetails): Promise<void> {
    const checkout = this.checkoutForm;
    await checkout.locator('#billing_tipo_documento').selectOption('CC');
    const identificationField = checkout.locator('#billing_user_login');
    if (await identificationField.inputValue() === details.id) {
      await identificationField.fill('');
    }
    const dniCheck = this.page.waitForResponse(response => {
      const request = response.request();
      return (
        new URL(response.url()).pathname === '/wp-admin/admin-ajax.php' &&
        request.postData()?.includes('action=check_dni_exists') === true &&
        request.postData()?.includes(details.id) === true
      );
    });
    await identificationField.fill(details.id);
    await checkout.locator('#billing_first_name').fill(details.firstName);
    await dniCheck;
    await this.page.locator('#dni-loader').waitFor({ state: 'hidden' });

    const registeredIdModal = this.page.locator('#dni-login-modal');
    if (await registeredIdModal.isVisible()) {
      await registeredIdModal.locator('#dni-continue-guest').click();
      await registeredIdModal.waitFor({ state: 'hidden' });
    }

    await checkout.locator('#billing_last_name').fill(details.lastName);
    await checkout.locator('#billing_gender').selectOption(details.gender);
    await checkout.locator('#billing_email').fill(details.email);
    await checkout.locator('#billing_phone').fill(details.phone);
    await checkout.locator('#billing_country').selectOption('CO');
    await checkout.locator('#billing_state').selectOption(details.department);
    await checkout.locator('#billing_city').selectOption({ label: details.city });
    await checkout.locator('#billing_address_1').fill(details.address);

    await checkout.locator('input[name="payment_method"][value="cheque"]').check();
    await checkout.locator('#terms').check();
  }

  async placeOrder(): Promise<void> {
    const checkoutOverlays = this.page.locator('.blockUI.blockOverlay');
    await checkoutOverlays.first().waitFor({ state: 'hidden' });
    await checkoutOverlays.last().waitFor({ state: 'hidden' });
    await this.placeOrderButton.click();
  }

  async payWithCard(details: CheckoutDetails, card: TestCard): Promise<void> {
    await this.page.getByRole('button', { name: /paga con wompi/i }).click();

    const paymentWidget = this.page.getByRole('dialog', { name: /pagar/i }).frameLocator('iframe').first();
    await paymentWidget.getByRole('button', { name: /tarjeta/i }).first().click();
    const fullNameField = paymentWidget.locator('input[name="fullName"]');
    const emailField = paymentWidget.locator('input[name="email"]');
    const phoneField = paymentWidget.locator('input[name="number"], #phoneNumber').first();
    await fullNameField.pressSequentially(`${details.firstName} ${details.lastName}`, { delay: 30 });
    await emailField.pressSequentially(details.email, { delay: 30 });
    await phoneField.fill('');
    await phoneField.pressSequentially(details.phone, { delay: 50 });
    await phoneField.press('Tab');
    await paymentWidget.getByRole('button', { name: /continuar con tu pago/i }).click({ timeout: 10_000 });

    await paymentWidget.locator('#cardNumber').fill(card.number);
    // Se elige el último mes y año disponibles para garantizar una fecha futura.
    for (const selectId of ['expirationMonth', 'expirationYear']) {
      const select = paymentWidget.locator(`#${selectId}`);
      await select.selectOption({ index: (await select.locator('option').count()) - 1 });
    }
    await paymentWidget.locator('#code').fill(card.cvc);
    await paymentWidget.locator('#cardHolder').fill(`${details.firstName} ${details.lastName}`);
    await paymentWidget.locator('#legal_id_number').fill(details.id);
    for (const consentId of ['acceptance', 'acceptancePersonal']) {
      const consent = paymentWidget.locator(`#${consentId}`);
      if (!(await consent.isChecked())) {
        await consent.evaluate(element => {
          if (!(element instanceof HTMLInputElement)) {
            throw new TypeError(`El consentimiento ${consentId} no es un checkbox.`);
          }
          element.click();
        });
      }
    }
    await paymentWidget.getByRole('button', { name: /pagar sin guardar/i }).click({ timeout: 10_000 });
  }
}
