import type { Page } from '@playwright/test';

export class AccountPage {
  constructor(private readonly page: Page) {}
  get registrationForm() {
    return this.page.locator('#customer_register #form-register');
  }
  get accountDataLink() {
    return this.page.getByRole('link', { name: 'Datos', exact: true }).first();
  }
  get editButton() {
    return this.page.locator('.update-info-btn:visible').first();
  }
  get firstNameField() {
    return this.page.locator('input[name="first_name"]');
  }
  get lastNameField() {
    return this.page.locator('input[name="last_name"]');
  }
  async open(): Promise<void> {
    await this.page.goto('/mi-cuenta/');
  }

  async openRegistrationForm(): Promise<void> {
    await this.page.locator('#show_register').click();
  }

  async register(account: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> {
    // La página también tiene un formulario de login, por eso los campos se acotan al de registro.
    await this.registrationForm.locator('#reg_username').fill(account.id);
    await this.registrationForm.locator('#first_name').fill(account.firstName);
    await this.registrationForm.locator('#last_name').fill(account.lastName);
    await this.registrationForm.locator('#reg_email').fill(account.email);
    await this.registrationForm.locator('#reg_password').fill(account.password);
    await this.registrationForm.locator('#reg_password2').fill(account.password);
    await this.registrationForm.locator('#privacy_policy_reg').check();
    await this.registrationForm.getByRole('button', { name: /registrarme/i }).click();
  }

  async login(id: string, password: string): Promise<void> {
    const loginForm = this.page.locator('#customer_login form');
    await loginForm.locator('#username').fill(id);
    await loginForm.locator('#password').fill(password);
    await loginForm.locator('button[name="login"]').click();
  }

  async openAccountDetails(): Promise<void> {
    await this.accountDataLink.click();
  }

  async openNameEditor(): Promise<void> {
    await this.editButton.click({ force: true });
  }

  async getAccountName(): Promise<{ firstName: string; lastName: string }> {
    await this.openNameEditor();
    return {
      firstName: await this.firstNameField.inputValue(),
      lastName: await this.lastNameField.inputValue(),
    };
  }

  async updateAccountName(firstName: string, lastName: string): Promise<void> {
    if (!(await this.firstNameField.isVisible())) {
      await this.editButton.click();
    }

    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.page.locator('.save-info-btn:visible').first().click();
  }

  async reloadAndOpenNameEditor(): Promise<void> {
    await this.page.reload();
    await this.editButton.click();
  }
}
