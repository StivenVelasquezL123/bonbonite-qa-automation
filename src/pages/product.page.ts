import type { Page } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}
  get sizeSelect() {
    return this.page.locator('#pa_talla');
  }
  get outOfStockModal() {
    return this.page.locator('#out-of-stock-modal');
  }
  get addedToCartMessage() {
    return this.page.locator('.woocommerce-message').first();
  }
  sizeButton(size: string) {
    return this.page.getByRole('button', { name: size, exact: true });
  }

  async open(productUrl: string): Promise<void> {
    await this.page.goto(productUrl);
    await this.dismissCookieBanner();
  }

  async selectSize(size: string): Promise<void> {
    await this.sizeButton(size).click();
  }

  async addToCart(): Promise<void> {
    await this.dismissCookieBanner();
    await this.page.getByRole('button', { name: /añadir al carrito/i }).click();
  }

  private async dismissCookieBanner(): Promise<void> {
    await this.page.locator('#cookiescript_reject').evaluateAll(elements => {
      const rejectCookies = elements[0];
      if (!(rejectCookies instanceof HTMLElement)) {
        return;
      }

      const styles = window.getComputedStyle(rejectCookies);
      const isVisible =
        styles.display !== 'none' &&
        styles.visibility !== 'hidden' &&
        styles.opacity !== '0' &&
        rejectCookies.getClientRects().length > 0;

      if (isVisible) {
        rejectCookies.click();
      }
    });
  }
}
