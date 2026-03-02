# Repository Agent Guide

## Purpose
This repository is for a clickable prototype of a merchant-facing POS payment app. The goal is to demonstrate the payment experience, not to implement real payment processing.

## Delivery Priorities
1. Optimize for merchant speed and confidence.
2. Keep flows short, obvious, and touch-friendly.
3. Prefer clarity over feature density.
4. Simulate logic locally; do not add real payment integrations.
5. Keep the app demo-ready on desktop and tablet-sized layouts.

## Product Boundaries
- No live payment rails.
- No external APIs or scraped content.
- No customer accounts.
- No backend dependency is required for the first prototype unless needed for local mock state.
- Use generic branding only.

## UX Expectations
- Large tap targets for cashier use.
- High contrast and readable type.
- Primary actions must remain visible without hunting through menus.
- Errors must be plain-language and recoverable.
- The cashier should always know:
  - current cart total
  - selected payment method
  - current step
  - whether payment succeeded, failed, or is pending

## Required Prototype Areas
- Login or store start screen if needed for framing.
- Main checkout screen with cart summary and payment actions.
- Debit card payment flow.
- QR payment flow.
- Transaction success and failure states.
- Transactions overview/history.
- Refund or void action in prototype form.
- End-of-day or summary snapshot in lightweight form.

## Interaction Rules
- Assume cashier-first behavior: fast repeat transactions, low training overhead.
- Minimize modal overload.
- Keep each flow to the fewest screens possible.
- Preserve state clearly when moving between checkout and transaction history.
- Use realistic mock data that helps the demo feel operational.

## Engineering Rules
- Start simple. Favor a small component structure and local state first.
- Separate UI components from mock transaction/state logic.
- Keep prototype state deterministic and easy to reset for demos.
- Add comments only where flow logic is not immediately obvious.
- Avoid premature abstractions unless multiple screens genuinely reuse them.

## Quality Bar
- The prototype should be clickable end-to-end.
- Every primary action should produce visible feedback.
- Empty, loading, error, success, and canceled states should be represented where relevant.
- The design should feel merchant-ready, not like a consumer wallet app.

## Suggested Build Sequence
1. Define route/screen map.
2. Build checkout shell and cart state.
3. Add debit card flow states.
4. Add QR flow states.
5. Add transaction history and detail drawer/page.
6. Add summary metrics and reset/demo controls.
7. Polish spacing, hierarchy, and microcopy.

## Definition of Done
- A user can complete a mocked sale by card.
- A user can complete a mocked sale by QR.
- A user can observe failed and retry states.
- A user can review past transactions.
- A user can understand the product without explanation from the presenter.
