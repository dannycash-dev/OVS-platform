# OVS Implementation Checklist

This checklist is the working delivery plan. Items marked **Now** are required for the first usable release. Items marked **Later** must not expand the MVP without an explicit scope decision.

## 1. Confirm the product boundary

- [ ] **Now** Confirm the MVP is a web application integrated with Shopify and Unleashed; defer a native mobile client.
- [ ] **Now** Define the application shell and routes: sign in, dashboard, new case, case detail, hardware library, request review, order status, and account.
- [ ] **Now** Assign system ownership for catalog, inventory, checkout, identity, case data, AI results, and payment status.
- [ ] **Now** Record production domains, clinic support contact, privacy policy owner, and New Zealand tax/shipping assumptions.

## 2. Establish security and clinical controls

- [ ] **Now** Choose an identity provider and clinic membership model, including account approval and role permissions.
- [ ] **Now** Define session handling, passwordless/SMS or authenticator-based MFA, rate limits, audit events, and account recovery.
- [ ] **Now** Choose private storage for radiographs and clinical notes; define encryption, retention, deletion, access logging, and export rules.
- [ ] **Now** Document the AI disclaimer, clinician review requirement, confidence/uncertainty display, and failure or escalation path.
- [ ] **Now** Confirm that browser code and Shopify theme assets never contain service credentials or protected case data.

## 3. Deliver the MVP workflows

### Identity and access

- [ ] **Now** User sign-up and sign-in for approved veterinary clinics.
- [ ] **Now** Account recovery and a verified second factor.
- [ ] **Later** SMS invitation/fallback flow for an unregistered recipient. Define the recipient, consent, expiry, and anti-abuse rules before implementation.

### Case planning

- [ ] **Now** Create a case with a non-identifying patient/case reference, species, weight, study views, and clinical notes.
- [ ] **Now** Upload supported radiographs with file type, size, malware, and upload-error validation.
- [ ] **Now** Send the case to the approved AI service through the secure backend, not directly from the browser.
- [ ] **Now** Display the assessment as a draft recommendation with provenance, uncertainty, limitations, and clinician confirmation.
- [ ] **Now** Allow the clinician to edit or reject suggested hardware before adding it to a request.

### Commerce and fulfilment

- [ ] **Now** Synchronize products and stock from Unleashed into Shopify using stable SKU mappings.
- [ ] **Now** Recheck stock before request/order submission and handle unavailable or changed quantities clearly.
- [ ] **Now** Populate a request/cart from the reviewed hardware selection and show quantities, pricing, shipping method, and estimated total.
- [ ] **Now** Require a final confirmation that the clinician reviewed the selection before handing off to Shopify checkout.
- [ ] **Now** Show order status and errors from Shopify/payment callbacks using verified webhooks.
- [ ] **Later** Add direct payment-status handling only after the payment provider and webhook contract are approved.

### History and reporting

- [ ] **Later** Display recent transactions for the signed-in clinic.
- [ ] **Later** Add anonymised similar-case history only after defining consent, de-identification, access controls, and retention. Do not expose raw case data between clinics.

## 4. Operational readiness

- [ ] Add automated tests for auth boundaries, upload validation, AI failure handling, stock changes, checkout handoff, and webhook signatures.
- [ ] Add structured logs, request IDs, health checks, error monitoring, and alerts for sync, AI, and payment failures.
- [ ] Protect integration endpoints with authentication, authorization, rate limiting, and appropriate CORS policy.
- [ ] Document local setup, environment variables, deployment, rollback, backup, and incident response.
- [ ] Run an accessibility review and test the core workflows on supported desktop and mobile browsers.

## 5. Hosting and integration delivery

### Current prototype status

- [x] Static browser prototype published on GitHub Pages at `https://dannycash-dev.github.io/OVS-platform/`.
- [x] Express `POST /api/assess` route added for OpenAI-backed preliminary image review.
- [x] Unleashed product adapter available at `GET /api/products`.
- [ ] Configure a public backend host for the Express service. Render is the recommended pilot option; Azure App Service and AWS App Runner are alternatives.
- [ ] Configure backend secrets and the provider-assigned `PORT` without committing credentials.
- [ ] Configure CORS for the GitHub Pages origin and add authentication before exposing clinical workflows.
- [ ] Configure the frontend with the deployed backend URL; GitHub Pages cannot serve `/api/assess` itself.
- [ ] Verify the deployed assessment path with non-sensitive test images and confirm failures are shown clearly.

### Production hardening

- [ ] Add persistent private case storage with encryption, access control, retention, deletion, and audit logging.
- [ ] Add malware scanning, stricter image limits, request timeouts, abuse controls, and model/provider failure handling.
- [ ] Confirm OpenAI data-processing terms and the approved clinical review policy before using real radiographs.
- [ ] Add a deployment health check, monitoring, backups, rollback procedure, and incident response runbook.

## MVP acceptance criteria

The MVP is ready for pilot use when an approved clinic user can sign in, create a case, securely upload radiographs, receive an explicitly non-diagnostic AI planning draft, review and edit the hardware request, complete Shopify checkout, and see a truthful order/payment status. Failures must be recoverable, auditable, and understandable to the user.