# Ortho Vet Supplies (OVS)

## Product purpose

OVS is a New Zealand e-commerce and clinical planning platform for veterinary surgeons. It sells veterinary orthopaedic hardware, including plates, screws, pins, wires, and related tools. The planning experience helps a clinician organise a fracture case and prepare a hardware request; it does not replace clinical judgement.

The product must be designed for professional use, including clear stock status, traceable order state, clinician review, and careful handling of animal, clinic, and radiograph data.

## Current architecture

The repository contains three related surfaces:

1. **Browser prototype**: `index.html`, `styles.css`, `portal.css`, and `portal.js`. This demonstrates the case workspace, image selection, inventory browsing, request review, and sample data. It is connected to the local `/api/assess` prototype route for OpenAI-backed image review, but not to authentication, payments, or persistent storage.
2. **Shopify theme**: `layout/`, `templates/`, `sections/`, `assets/`, and `config/`. Shopify owns the public catalog, product variants, cart, checkout, and customer-facing commerce workflow.
3. **Private integration service**: `server/`. The Node/Express service signs requests to Unleashed and exposes a normalized product response at `GET /api/products`. It must run server-side and must not be treated as a public, unauthenticated production API.

### System ownership

| Concern | System of record | Integration boundary |
| --- | --- | --- |
| Product and variant catalog | Shopify, synchronized from Unleashed | Scheduled or authenticated server-side sync |
| Inventory quantities | Unleashed | Private server adapter |
| Cart and checkout | Shopify | Shopify cart and checkout APIs |
| User and clinic identity | To be selected before implementation | Authenticated application/backend |
| Cases, radiographs, assessments | Prototype server route; production store still to be selected | Secure backend or embedded app, never theme assets |
| Payment status | Shopify/payment provider | Verified webhook or provider callback |

Do not put Unleashed credentials, AI credentials, patient/case images, or clinical notes in Shopify theme code, browser JavaScript, or public assets.

## Local integration setup

The server requires Node.js with built-in `fetch` support. Copy `.env.example` to `.env`, fill in the Unleashed and OpenAI credentials, export the values, and run `npm start`. The default local URL is `http://localhost:3000`.

The service currently exposes:

- `POST /api/assess`: accepts up to four JPEG, PNG, or WebP data URLs and case context, then calls the OpenAI Responses API. The default model is `gpt-4o`; override it with `OPENAI_MODEL`.
- `GET /api/products`: retrieves and caches normalized products from Unleashed.

The browser currently calls `/api/assess` as a same-origin request. A hosted frontend on GitHub Pages needs a deployed backend URL and a frontend API-base configuration before the assessment can work remotely.

## Deployment model

GitHub Pages is suitable for the static frontend only. Deploy the Express service separately on a Node-compatible host. Render is the simplest pilot option; Azure App Service and AWS App Runner are suitable alternatives when the project already has an Azure or AWS operational environment.

For a hosted deployment:

1. Set `OPENAI_API_KEY`, `OPENAI_MODEL`, `UNLEASHED_API_ID`, `UNLEASHED_API_KEY`, `UNLEASHED_API_URL`, `UNLEASHED_CLIENT_TYPE`, and `UNLEASHED_PAGE_SIZE` as platform secrets or environment variables.
2. Configure the service to listen on the host-provided `PORT`.
3. Use HTTPS and configure CORS to allow only the approved frontend origin, currently `https://dannycash-dev.github.io`.
4. Configure the frontend to call the deployed backend URL instead of a relative `/api/assess` path.
5. Add health checks, logs, alerts, rate limits, authentication, and request size limits before sharing the endpoint.

Never put `OPENAI_API_KEY` or Unleashed credentials in GitHub Pages, frontend JavaScript, committed files, or public build output. Do not send real radiographs through the public demo until private storage, access control, retention, consent, and audit requirements have been approved.

## Product principles

- Recommendations are decision support only. Every AI result must show uncertainty and require clinician review before an order can be submitted.
- Use a non-identifying case reference where possible. Separate clinic/account identity from clinical case data and define retention and deletion rules before storing radiographs.
- Treat stock as time-sensitive. Recheck availability before order creation and show when a quantity was last synchronized.
- Make order state explicit: draft, awaiting review, submitted, payment pending, paid, fulfilment in progress, fulfilled, cancelled, or failed.
- Keep Shopify responsible for checkout unless a later decision explicitly moves payment into the application.

## Decisions still required

- Confirm the authentication provider and whether clinic accounts require approval.
- Select the secure storage and processing service for radiographs and AI results.
- Confirm the production AI model/provider, data-processing terms, retention period, and human-review policy. The prototype currently defaults to OpenAI `gpt-4o` through `POST /api/assess`.
- Define the Shopify-to-Unleashed sync direction, frequency, SKU rules, and conflict handling.
- Confirm payment provider, webhook verification, refund handling, and order status mapping.
- Confirm production domains, support contact details, privacy policy, and New Zealand tax/shipping rules.

## Naming and domain notes

Potential domains: `ovsltd.co.nz` and `orthovetsupplies.co.nz`. Ownership, canonical domain, email address, and phone number are not yet recorded in this repository and must be confirmed before launch.