import { expect, test } from '@playwright/test';
import { AccountPage } from '../src/pages/account.page';
import { createRandomTestUser } from '../src/test-user-factory';

test('permite registrar una cuenta de pruebas', async ({ page }) => {
  const user = createRandomTestUser();
  const accountPage = new AccountPage(page);

  await accountPage.open();
  await accountPage.openRegistrationForm();
  await expect(accountPage.registrationForm).toBeVisible();

  await accountPage.register(user);
  await expect(accountPage.accountDataLink).toBeVisible();
});
