# Ortho Vet Supplies

A fracture-planning storefront prototype for veterinary surgeons ordering orthopaedic hardware. The current repository is a prototype and integration scaffold, not a production clinical system.

## Current state

This is a working browser prototype and integration scaffold. It includes inventory search, product details, a client-side hardware request, review flow, case image selection, and a preliminary OpenAI assessment path. It is not a production clinical system and has no authentication, persistent case storage, or production safeguards.

Open the [GitHub Pages demo](https://dannycash-dev.github.io/OVS-platform/) for the static site. The server-backed assessment requires the Express service and is normally opened at `http://localhost:3000` during local development.

See [AGENT_platform.md](AGENT_platform.md) for system boundaries and decisions still required. See [AGENT_implementation.md](AGENT_implementation.md) for the delivery sequence and MVP acceptance criteria.

## Project documentation

- [AGENT_platform.md](AGENT_platform.md): architecture, system boundaries, local setup, deployment, and security decisions.
- [AGENT_implementation.md](AGENT_implementation.md): implementation checklist, delivery sequence, and MVP acceptance criteria.

## Shopify theme

The `layout`, `templates`, `sections`, `assets`, and `config` directories contain a Shopify-compatible theme scaffold. Upload the contents of this repository as a theme, or use Shopify CLI to preview it. Products are rendered from Shopify's `collections.all` catalog and added through Shopify's cart API.

The standalone case workspace sends locally selected raster images to the private server. Shopify remains responsible for the public catalog, variants, cart, and checkout. Radiographs and clinical notes must not be stored in Shopify theme assets or committed to this repository.

Backend setup and deployment instructions are maintained in [AGENT_platform.md](AGENT_platform.md).

## Safety

AI output is preliminary decision support only. Do not use real clinical data with the public GitHub Pages demo until authentication, private storage, access controls, retention rules, and an approved production deployment are in place.