export const testData = {
  id: process.env.E2E_TEST_ID ?? '',
  password: process.env.E2E_TEST_PASSWORD ?? '',
  productUrl:
    process.env.E2E_PRODUCT_URL ??
    'https://www.bon-bonite.com/producto/baleta-en-cuero-borgona/',
  productSize: process.env.E2E_PRODUCT_SIZE ?? '35',
};

// Tarjeta de Wompi Sandbox que genera una transacción APPROVED.
export const wompiTestCard = { number: '4242424242424242', cvc: '123' };

export const checkoutData = {
  id: process.env.E2E_CHECKOUT_ID ?? '',
  firstName: process.env.E2E_CHECKOUT_FIRST_NAME ?? '',
  lastName: process.env.E2E_CHECKOUT_LAST_NAME ?? '',
  email: process.env.E2E_CHECKOUT_EMAIL ?? '',
  phone: process.env.E2E_CHECKOUT_PHONE ?? '',
  address: process.env.E2E_CHECKOUT_ADDRESS ?? '',
  department: process.env.E2E_CHECKOUT_DEPARTMENT ?? '',
  city: process.env.E2E_CHECKOUT_CITY ?? '',
  gender: process.env.E2E_CHECKOUT_GENDER ?? '',
};
