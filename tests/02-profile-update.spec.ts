import { expect, test } from '@playwright/test';
import { AccountPage } from '../src/pages/account.page';
import { testData } from '../src/test-data';

test('permite actualizar los datos de una cuenta registrada', async ({ page }) => {
  const accountPage = new AccountPage(page);
  await accountPage.open();
  await accountPage.login(testData.id, testData.password);
  await expect(accountPage.accountDataLink).toBeVisible();
  await accountPage.openAccountDetails();

  await expect(accountPage.editButton).toBeVisible();
  const originalName = await accountPage.getAccountName();
  await expect(accountPage.firstNameField).toBeVisible();
  const updatedFirstName = `${originalName.firstName} QA`;
  const updatedLastName = `${originalName.lastName} Test`;

  try {
    await accountPage.updateAccountName(updatedFirstName, updatedLastName);
    await expect(accountPage.editButton).toBeVisible();

    await accountPage.reloadAndOpenNameEditor();
    await expect(accountPage.firstNameField).toHaveValue(updatedFirstName);
    await expect(accountPage.lastNameField).toHaveValue(updatedLastName);
  } finally {
    // Restablece los datos originales para que la prueba sea repetible.
    await accountPage.updateAccountName(originalName.firstName, originalName.lastName);
    await expect(accountPage.editButton).toBeVisible();
  }
});
