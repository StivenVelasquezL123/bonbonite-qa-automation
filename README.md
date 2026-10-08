# Automatización QA — Bon-bonite

Pruebas E2E con Playwright y TypeScript sobre la tienda [Bon-bonite](https://www.bon-bonite.com).

## Escenarios

| # | Spec | Qué valida |
|---|------|------------|
| 1 | `01-account-registration.spec.ts` | Registro de un usuario sintético único. |
| 2 | `02-profile-update.spec.ts` | Login, edición de nombre y apellido, verificación tras recargar y restauración de los valores originales. |
| 3 | `03-product-purchase.spec.ts` | Selección de talla, carrito, checkout, pago con Wompi (tarjeta `4242 4242 4242 4242`) y confirmación del pedido. |

Los escenarios son independientes entre sí. Todas las aserciones (`expect`) están en los specs; los page objects solo contienen acciones y locators.

> Registro y compra crean datos reales (cuentas y pedidos) en el sitio configurado en `BASE_URL`.

## Requisitos

- Node.js 20 o superior y npm.

## Instalación

```bash
npm install
npx playwright install chromium
```

## Configuración

Copia `.env.example` a `.env` y completa los valores (`.env` está excluido de Git):

| Variable | Descripción |
|----------|-------------|
| `BASE_URL` | Sitio a probar. |
| `E2E_TEST_ID`, `E2E_TEST_PASSWORD` | Cuenta ya registrada para el escenario de perfil. |
| `E2E_CHECKOUT_ID`, `_FIRST_NAME`, `_LAST_NAME`, `_EMAIL`, `_PHONE`, `_ADDRESS`, `_DEPARTMENT`, `_CITY`, `_GENDER` | Datos del checkout. El correo debe ser válido y el celular colombiano de 10 dígitos. |
| `E2E_PRODUCT_URL`, `E2E_PRODUCT_SIZE` | Producto y talla con inventario. |

El pago solo se aprueba si el comercio usa Wompi en modo Sandbox (llave `pub_test_`).

## Ejecución

```bash
npm exec tsc -- --noEmit   # verificación de tipos
npm test                   # todos los escenarios
npm run test:headed        # con navegador visible
npm run test:report        # abre el reporte HTML
```

Para un solo escenario: `npx playwright test tests/01-account-registration.spec.ts`.

## Estructura

```text
├── playwright.config.ts
├── src/
│   ├── pages/
│   │   ├── account.page.ts
│   │   ├── checkout.page.ts
│   │   └── product.page.ts
│   ├── test-data.ts
│   └── test-user-factory.ts
└── tests/
    ├── 01-account-registration.spec.ts
    ├── 02-profile-update.spec.ts
    └── 03-product-purchase.spec.ts
```

## Límites

- La disponibilidad de productos y tallas, y los textos del sitio, pueden cambiar.
- El escenario de compra depende de Wompi; si el formulario del comprador no habilita "Continuar con tu pago" o el pago es rechazado, el test falla.
