# YQN Pay POS: Current Design, Flow, and Product Notes

## 1. Product Intent

YQN Pay POS is a frontend-only POS prototype for a small hospitality or cafe-style merchant. It is designed to help a cashier:

- sign into the terminal quickly
- choose takeout or table service
- build an order from a menu
- take a mock payment using cash, card, or QR
- handle success, failure, timeout, and cancel outcomes
- review transactions and basic shift analytics

The product should feel operational, simple, and easy to demo repeatedly.

## 2. Current Scope

### Implemented features

- Cashier lock screen with PIN entry
- Checkout screen with:
  - takeout vs table selection
  - table picker modal
  - menu categories
  - menu item selection
  - quantity modal when adding items
  - basket quantity updates
  - item removal and basket clear confirmation
  - subtotal, VAT, and total summary
- Payment flow with:
  - cash
  - card
  - QR
  - selectable mock outcomes:
    - success
    - failed
    - timed out
    - canceled
- Automatic transaction creation for completed payment attempts
- Transaction history screen with:
  - search
  - status filter
  - sort
  - detail panel
  - print receipt action
  - refund action
  - void action
- Overview screen with:
  - net sales
  - completed / exception counts
  - average ticket
  - top item
  - most used payment method
  - payment mix
  - service mix
  - recent activity
- Local transaction persistence using `localStorage`

### Explicitly not implemented

- Real payment gateway integrations
- Real card terminal hardware integration
- Live QR generation from a payment provider
- Backend, authentication service, or cloud storage
- Real inventory management
- Real tax configuration
- Customer profiles or loyalty system
- Multi-user permissions beyond the simple cashier PIN gate
- Kitchen tickets, printers, or email/SMS receipts

## 3. Current Information Architecture

- `Checkout`
  - amount due
  - order type selection
  - table picker
  - menu catalog
  - current basket
  - payment method flow
- `Transactions`
  - transaction list
  - search, filter, sort
  - transaction detail
  - refund / void simulation
- `Overview`
  - shift summary cards
  - payment and service breakdown
  - recent activity

## 4. Current User Flow

### 4.1 Unlock terminal

1. App opens in a locked state.
2. Cashier enters a PIN.
3. Terminal unlocks and main screens become available.

Current demo PINs:

- `0000` → `Mahdi`
- `1111` → `Adema`

### 4.2 Create order

1. Cashier lands on `Checkout`.
2. Cashier chooses `Takeout` or a table.
3. Cashier selects a menu category.
4. Cashier clicks an item.
5. App opens a quantity modal.
6. Cashier confirms add-to-basket.
7. Basket updates with subtotal, VAT, and total.

### 4.3 Take payment

1. Cashier opens payment method selection.
2. Cashier selects `Cash`, `Debit Card`, or `QR Pay`.
3. App shows the payment status panel.
4. Cashier chooses a mock response scenario when applicable.
5. App resolves the payment and writes a transaction record.
6. Cashier can start a new sale or switch payment method after non-success outcomes.

### 4.4 Review transactions

1. Cashier opens `Transactions`.
2. They search, filter, or sort the list.
3. They select a transaction.
4. Detail view shows status, service, cashier, customer label, and ordered items.
5. Eligible successful transactions can be refunded or voided.

### 4.5 Review shift activity

1. Cashier opens `Overview`.
2. App derives metrics from local transactions.
3. Cashier reviews summary cards, breakdowns, and recent activity.

## 5. Design Principles in the Current Build

### Operational first

The interface prioritizes order creation, payment, and transaction lookup over decorative UI.

### Fast visual scanning

The most important values are visually emphasized:

- total amount
- payment status
- transaction amount
- transaction state

### Touch-friendly controls

Large buttons and clear spacing are used for:

- tabs
- quantity controls
- payment actions
- transaction actions

### Semantic status color

Statuses use semantic color consistently:

- success → green
- failed / canceled → red
- timed out → orange
- refunded / voided → orange

### Demo resilience

The app supports repeat demos without any network dependency and preserves transactions locally between refreshes.

## 6. Current Visual Direction

The current application uses a light POS-oriented UI with:

- soft blue base surfaces
- white and blue-tinted cards
- blue as the main interactive accent
- green, red, and orange for status communication
- compact radii and light shadows
- mono styling for prices and key totals where useful

This is intentionally more operational than consumer-fintech.

## 7. Current Screen Notes

### Checkout

Purpose:

- build the order quickly
- keep basket context visible
- move into payment with minimal friction

Key current elements:

- amount due card
- order type selector
- table modal
- category chips
- menu cards
- basket list
- payment flow

### Transactions

Purpose:

- review what happened
- find a transaction quickly
- perform demo refund / void actions

Key current elements:

- searchable list
- filter and sort controls
- status tags
- detail summary card
- transaction metadata
- order item breakdown

### Overview

Purpose:

- provide a quick shift summary using locally stored transactions

Key current elements:

- net sales hero card
- average ticket
- top item
- most used payment method
- payment mix
- service mix
- recent activity feed

## 8. Current Technical Shape

### Stack

- `React`
- `TypeScript`
- `Vite`
- plain `CSS`

### State approach

- `useReducer` for app-level state
- `useState` for local modal and interaction state
- `localStorage` for transaction persistence

### Main app state currently includes

- active view
- cashier name
- selected table
- selected category
- cart
- selected payment method
- payment status
- payment scenario
- transactions
- active transaction id

## 9. Current Folder Direction

```text
src/
  components/
  screens/
  state/
  styles/
  types/
  utils/
  App.tsx
  main.tsx
```

Key files:

- `src/App.tsx`
- `src/screens/CheckoutScreen.tsx`
- `src/screens/TransactionsScreen.tsx`
- `src/screens/OverviewScreen.tsx`
- `src/state/appReducer.ts`
- `src/state/initialState.ts`
- `src/state/storage.ts`
- `src/styles/globals.css`
- `src/styles/variables.css`

## 10. Current Gaps / Design Constraints

These are known limitations in the current prototype:

- payment outcomes are mocked rather than provider-driven
- transaction persistence is browser-local only
- receipt printing is browser-window based
- there is no true session management or audit trail
- overview metrics are derived from current local transaction data only
- transaction filters are intentionally basic

## 11. Next Features That Could Be Added

These would extend the current product naturally without changing its core shape:

### Higher-value functional additions

- Edit item quantity directly from the basket with a modal picker
- Add notes or modifiers to order items
- Add split payment / split bill flow
- Add partial refund support
- Add “reopen last basket” after canceled payment
- Add transaction export for demo reporting

### Better merchant workflow features

- Shift reset / end-of-day summary action
- Cash drawer summary for cash sales
- Recent successful payment toast or activity rail on checkout
- Table occupancy states that update from sales
- Basic cashier switching without full lock flow reset

### Technical improvements

- Tests for reducer state transitions
- Stronger transaction typing around reversals and receipt actions
- URL-based screen state or routing
- Persist more UI state between refreshes
- Replace mock delays with a pluggable mock payment service layer

## 12. Documentation Rule for Future Updates

This document should describe the current product, not the ideal product.

When the app changes:

- remove features from this file if they are no longer in the app
- add new implemented features only after they exist in the codebase
- keep “future” ideas in the next-features section instead of mixing them into current behavior
