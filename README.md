# YQN Pay POS

Lightweight POS demo built with React, TypeScript, and Vite.

## Requirements

- Node.js 18+ recommended
- npm

## Install

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Vite will print a local URL, usually:

```text
http://localhost:5173
```

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Demo Access

Cashier PINs used by the app:

- `0000` → `Mahdi`
- `1111` → `Adema`

## What The App Includes

- Checkout flow with takeout/table selection
- Menu category and item selection
- Basket quantity updates and item removal
- Payment method flow for cash, card, and QR
- Mock payment outcomes: success, declined, timeout, canceled
- Transactions list and transaction detail view
- Overview dashboard for shift metrics
- Local transaction persistence in browser storage

## Project Structure

- [`src/App.tsx`](/home/mahdi/Projects/YQN-Pay-POS/src/App.tsx): app shell and main state wiring
- [`src/components`](/home/mahdi/Projects/YQN-Pay-POS/src/components): reusable UI pieces
- [`src/screens`](/home/mahdi/Projects/YQN-Pay-POS/src/screens): top-level app screens
- [`src/state`](/home/mahdi/Projects/YQN-Pay-POS/src/state): reducer, initial state, and storage helpers
- [`src/styles`](/home/mahdi/Projects/YQN-Pay-POS/src/styles): theme variables and global styles

## Notes

- Transactions are stored in browser local storage, so data is per browser/profile.
- The project includes a local palette reference file: [`pos-colour-scheme-light.html`](/home/mahdi/Projects/YQN-Pay-POS/pos-colour-scheme-light.html).
