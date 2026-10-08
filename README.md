# Automatización QA — Bon-bonite

Proyecto E2E con Playwright y TypeScript que cubre estos escenarios:

1. **Registro:** genera y registra usuarios sintéticos únicos.
2. **Actualización de perfil:** modifica el nombre y apellido de una cuenta de pruebas existente y restaura sus valores originales.
3. **Compra de prueba:** selecciona la talla configurada, completa el checkout, abre Wompi y paga con la tarjeta de prueba `4242 4242 4242 4242` (Wompi Sandbox).

La ejecución incluye únicamente estos tres escenarios. Registro y compra crean datos reales en el sitio configurado en `BASE_URL`.

## Requisitos y ejecución

- Node.js 20 o superior y npm.
- Instala dependencias y Chromium:

```bash
npm install
npx playwright install chromium
```

Configura `.env` con el dominio de staging/sandbox y datos de pruebas. El `.env` local está excluido de Git. Ejecuta:

```bash
npm exec tsc -- --noEmit
npm test
npm run test:headed
npm run test:report
```

## Configuración

Registro y compra crean datos persistentes. Copia `.env.example` a `.env` y completa:

- `BASE_URL` con el sitio a probar.
- `E2E_TEST_ID` y `E2E_TEST_PASSWORD`: cuenta de pruebas ya registrada para el escenario de perfil.
- `E2E_CHECKOUT_*`: datos válidos para el checkout; `E2E_CHECKOUT_EMAIL` debe ser una dirección válida y `E2E_CHECKOUT_PHONE` un número colombiano de 10 dígitos.
- `E2E_PRODUCT_URL` y `E2E_PRODUCT_SIZE`: producto y talla disponibles.

El pago solo se aprueba si el comercio usa Wompi en modo Sandbox (llave `pub_test_`).

## Estructura

```text
bonbonite-qa-automation/
├── playwright.config.ts
├── src/
│   ├── pages/
│   │   ├── account.page.ts
│   │   ├── checkout.page.ts
│   │   ├── product.page.ts
│   ├── test-data.ts
│   └── test-user-factory.ts
└── tests/
    ├── 01-account-registration.spec.ts
    ├── 02-profile-update.spec.ts
    └── 03-product-purchase.spec.ts
```

## Límites

- La disponibilidad de productos, tallas y textos puede cambiar.
