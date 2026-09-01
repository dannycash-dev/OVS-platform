# OVS-platform

A fracture-planning storefront prototype for veterinarian surgeons ordering orthopedic hardware.

## Run

Open `index.html` directly in a browser. No build tooling or dependency installation is required.

The prototype includes inventory search and filtering, product details, a client-side order cart, order review and validation, submission confirmation, recent orders, and saved kits.

## Shopify theme

The `layout`, `templates`, `sections`, `assets`, and `config` directories contain a Shopify-compatible theme scaffold. Upload the contents of this repository as a theme, or use Shopify CLI to preview it. Products are rendered from Shopify's `collections.all` catalog and added through Shopify's cart API.

The case workspace is currently a frontend-only workflow. X-rays are not uploaded to Shopify and no AI processing is performed. Connect those actions later through a secure embedded app or backend service. Keep patient images and clinical data outside the public theme assets.

## Unleashed product API

The `server` directory contains a server-side Unleashed adapter. It calls the paginated `GET /Products` endpoint using the required HMAC-SHA256 signature and exposes a normalized response at `GET /api/products`. API credentials belong in environment variables, never in the Shopify theme or browser code.

Setup:

```text
npm install
cp .env.example .env
npm start
```

Fill in `UNLEASHED_API_ID` and `UNLEASHED_API_KEY` in `.env` using the credentials from Unleashed API Access. The API is documented at https://apidocs.unleashedsoftware.com/.

For Shopify, IT should use this endpoint in a scheduled sync that creates or updates Shopify products by SKU. The existing Shopify section then renders the synchronized Shopify catalog and Shopify remains responsible for variants, cart, and checkout. Do not expose `/api/products` publicly without authentication and rate limiting.