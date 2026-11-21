# CRICPASS

CRICPASS is a cricket match discovery and interactive stadium seat-preview website. It is a frontend demonstration: fixture data and seat availability are sample data, and bookings are local previews only.

## Features

- Match discovery with fixture details and starting prices.
- A guided stadium tour with browser speech narration.
- 3D stand and seat exploration with individual seat-view previews.
- A sample checkout summary and printable booking preview.
- Responsive layouts and reduced-motion support.

## Run locally

Requirements: Node.js 20.19+ or 22.12+, with npm.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

Vite prints the local address for the development and preview servers.

## Build and deployment

`npm run build` creates the static production bundle in `dist/`. Deploy that directory to a static hosting provider. Configure the provider to serve `index.html` for unknown paths if you add client-side routes. No environment variables are currently required.

## Before accepting real bookings

The current app does not connect to a ticket inventory service, database, authentication provider, or payment gateway. Its fixtures, availability, checkout, references, and ticket screens are demonstrations; no reservation, payment, or entry pass is created. Connect and validate those services on a trusted backend before enabling real sales. Do not collect payment credentials in this frontend-only preview.

The voice tour uses the browser's speech synthesis and the voices installed on the visitor's device. It can be muted, and captions remain available.
