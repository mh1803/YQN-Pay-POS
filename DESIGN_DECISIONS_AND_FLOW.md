# POS Prototype Design, Flow, and SDLC Notes

## 1. Product Intent
Build a clickable POS payment app prototype for a small merchant. The app should help a cashier accept payments quickly with minimal cognitive load. The product is not a consumer banking app and should not feel like one. It should feel operational, fast, and dependable.

Core promise:
"Take payment in seconds, recover quickly from errors, and always know what happened."

## 2. Primary Users

### Merchant owner
- Wants confidence that payments are being captured correctly.
- Wants a quick view of daily activity.
- Wants low training effort for staff.

### Cashier
- Needs a screen that is obvious under pressure.
- Needs large buttons and clear confirmation.
- Needs to recover fast from payment failures or customer indecision.

## 3. Product Requirements Breakdown

### Functional requirements
- View a current cart or bill summary.
- Accept payment via debit card.
- Accept payment via QR code.
- Show a clear in-progress state while payment is being "processed".
- Show success, failure, timeout, and canceled states.
- Save each mock transaction into a local transaction list.
- View transaction history.
- Open transaction details.
- Trigger a prototype refund or void action for eligible transactions.
- Show basic daily summary metrics.

### Non-functional requirements
- Touch-friendly layout.
- Readable in busy store environments.
- Minimal steps to complete a sale.
- Easy to demo repeatedly.
- No network dependency required for the first version.
- Responsive for desktop and tablet.

### Out of scope
- Real payment gateways.
- Bank connections.
- Hardware integrations.
- Receipts by SMS/email.
- Inventory management.
- Tax complexity beyond simple mocked totals.
- Role permissions beyond simple visual framing.

## 4. Proposed Information Architecture
- `Home / Checkout`
  - Current cart
  - Order total
  - Payment method buttons
  - Primary payment action
- `Payment Flow`
  - Debit card flow
  - QR flow
  - Processing state
  - Success / failure / cancel
- `Transactions`
  - Search/filter
  - Transaction list
  - Transaction detail
  - Refund / void simulation
- `Overview`
  - Today sales total
  - Transaction count
  - Payment method split
  - Failed payment count

## 5. Design Principles

### 5.1 Merchant-first, not brand-first
The interface should prioritize speed and legibility over decorative branding. Branding should exist, but it should never compete with totals, payment actions, or status signals.

### 5.2 Big targets, low ambiguity
Cashiers often operate quickly and may be multitasking. Buttons for payment actions must be large, clearly labeled, and visually distinct.

### 5.3 Status must be impossible to miss
Payment state is the most important feedback in the app. Processing, success, failure, and cancel states need immediate visual differentiation using layout, color, and copy.

### 5.4 One-screen confidence
The checkout screen should answer the main cashier questions at a glance:
- How much is due?
- Which payment method is selected?
- What happens next?
- Did it work?

### 5.5 Recovery is part of the product
Failure handling is core UX, not an edge case. Retry, switch payment method, and cancel actions should be available without forcing the cashier to restart the whole transaction.

## 6. Proposed Visual Direction

### Layout
- Split-view checkout on larger screens:
  - left side for order/cart summary
  - right side for payment actions and step status
- Stacked layout on smaller screens with sticky total and sticky primary action

### Visual tone
- Clean, operational, confident
- Warm-neutral base with one strong action color and one success color
- Avoid neon fintech aesthetics and over-gladuated consumer-wallet styling

### Components
- Large amount card
- Payment method tiles
- Status banners
- Timeline or step chips for flow state
- Dense but readable transaction rows
- Simple metric cards for overview

## 7. Core User Flows

### 7.1 Main happy path: debit card payment
1. Cashier lands on checkout screen.
2. Cart summary and total are already visible.
3. Cashier taps `Debit Card`.
4. App highlights card as the selected method and updates guidance text.
5. Cashier taps `Charge`.
6. App moves to processing state with a short delay.
7. App shows payment success.
8. Transaction is written to local history.
9. Checkout resets for the next customer while preserving a recent-success confirmation for a short time.

Why this flow:
- It matches expected merchant behavior.
- It keeps selection and confirmation in one place.
- It avoids extra confirmation screens unless needed.

### 7.2 Alternate flow: QR payment
1. Cashier taps `QR Pay`.
2. App presents a generated mock QR state and instructions.
3. Customer scans.
4. Cashier sees status transition from `Waiting for scan` to `Payment received` or `Timed out`.
5. On success, the transaction is saved.
6. On timeout, cashier can retry QR or switch to debit card.

Why this flow:
- QR payments involve waiting and uncertainty, so the UI must make pending states obvious.
- Switching methods should be immediate when the customer changes their mind.

### 7.3 Failed card payment
1. Cashier selects debit card.
2. Payment attempt returns a mocked decline or read error.
3. Error state explains the issue in plain language.
4. Cashier gets direct actions:
   - retry card
   - switch to QR
   - cancel transaction

Why this flow:
- Staff need recovery options without losing cart context.

### 7.4 Transaction lookup and refund
1. Merchant opens transactions view.
2. They review recent transactions with method, amount, and status.
3. They open a transaction detail.
4. If eligible, they tap `Refund` or `Void`.
5. App shows confirmation and records a mock reversal event.

Why this flow:
- A POS prototype feels incomplete without post-payment handling.

## 8. Recommended Screen List
- `Checkout`
- `Processing Payment`
- `Payment Success`
- `Payment Failed`
- `QR Waiting`
- `Transactions`
- `Transaction Detail`
- `Overview / Today`

## 9. State Model for Prototype Logic

### Checkout state
- cart items
- subtotal
- fees or tax if shown
- total
- selected payment method

### Payment state
- idle
- collecting
- processing
- success
- failed
- canceled
- timed_out

### Transaction record
- transaction id
- timestamp
- amount
- method
- status
- cashier name or terminal label
- optional failure reason
- optional refund status

## 10. Error Handling Strategy
- Use plain-language messages such as:
  - "Card was not approved. Try again or choose QR."
  - "QR payment timed out. Generate a new code to continue."
  - "Payment canceled. Cart is still ready."
- Never blame the user.
- Always preserve the cart unless the user explicitly clears it.
- Show a single primary next step in error states.

## 11. Sticky Features for Merchant Retention
These are the product qualities that make the prototype feel habit-forming for merchants:
- Checkout always opens ready to charge.
- Recent payments are visible immediately after success.
- Daily totals provide instant reassurance.
- Retry flows are faster than restarting.
- Transaction history feels close to the checkout flow, not hidden.
- The interface reduces training needs for new staff.

## 12. Suggested Content and Microcopy
- Primary CTA for card: `Charge Card`
- Primary CTA for QR: `Show QR Code`
- Success message: `Payment complete`
- Failure message: `Payment failed`
- Retry CTA: `Try Again`
- Secondary recovery CTA: `Switch Method`
- History section label: `Recent Transactions`
- Overview label: `Today at a Glance`

## 13. Technical Approach for the First Build
- Frontend-only prototype is sufficient.
- Use a simple stack that is easy to build and explain:
  - `Vite`
  - `React`
  - `TypeScript`
  - plain `CSS`
- Use local mock data and local component/app state management.
- Use `useReducer` for the main checkout and transaction state.
- Use `useState` for isolated UI interactions such as tabs, drawers, or temporary banners.
- Add deterministic mock scenarios so demos can show:
  - success
  - decline
  - timeout
  - canceled payment
- Keep transaction persistence lightweight; `localStorage` is acceptable for prototype continuity.

### 13.1 Why this stack
- It is simple and CV-friendly.
- It avoids introducing extra frameworks or state libraries that are not required for the prototype.
- `TypeScript` is valuable here because payment flows rely on clear state transitions and transaction models.
- Plain `CSS` keeps styling straightforward and avoids dependence on utility frameworks.

### 13.2 Recommended technical structure
- One React app with either:
  - a single-page layout with tabs, or
  - lightweight route-based screens if navigation clarity improves the demo
- A shared reducer for:
  - cart state
  - selected payment method
  - payment status
  - transaction history
  - overview metrics derived from transactions
- A small storage utility for saving and loading transactions from `localStorage`

### 13.3 Recommended TypeScript models
- `PaymentMethod`
- `PaymentStatus`
- `TransactionStatus`
- `CartItem`
- `Transaction`
- `AppState`
- `AppAction`

### 13.4 Recommended folder direction
- `src/components`
- `src/screens`
- `src/state`
- `src/types`
- `src/utils`
- `src/styles`

This is intentionally small. The first version should remain easy to reason about and easy to demo.

### 13.5 Suggested project structure
```text
src/
  components/
    AmountCard/
    CartList/
    PaymentMethodSelector/
    PaymentStatusPanel/
    TransactionList/
    TransactionDetail/
    OverviewCards/
    Header/
  screens/
    CheckoutScreen.tsx
    TransactionsScreen.tsx
    OverviewScreen.tsx
  state/
    appReducer.ts
    initialState.ts
    storage.ts
  types/
    payment.ts
    transaction.ts
    cart.ts
    state.ts
  utils/
    currency.ts
    dates.ts
    mockScenarios.ts
  styles/
    globals.css
    variables.css
  App.tsx
  main.tsx
```

## 14. Component Map

### `App`
- Owns the top-level layout.
- Handles main section switching if the app stays single-page.
- Connects reducer state to screen components.

### `CheckoutScreen`
- Displays current cart summary.
- Shows current total.
- Hosts payment method selection.
- Hosts payment state panel and main action button.

### `TransactionsScreen`
- Shows recent transactions.
- Supports basic filtering by method or status.
- Opens transaction detail for refund/void simulation.

### `OverviewScreen`
- Shows daily totals, success count, failure count, and payment method split.
- Gives the merchant a quick operational summary.

### `AmountCard`
- Highlights the amount due.
- Should remain visually dominant on the checkout screen.

### `CartList`
- Renders line items, quantities, and subtotal.
- Can stay mock-driven in the first version.

### `PaymentMethodSelector`
- Shows large selectable tiles:
  - debit card
  - QR pay
- Makes the active method obvious.

### `PaymentStatusPanel`
- Shows idle, processing, success, failed, canceled, and timed out states.
- Provides the correct next action for each state.

### `TransactionList`
- Renders transaction rows with:
  - amount
  - time
  - method
  - status

### `TransactionDetail`
- Displays a single transaction in more detail.
- Supports prototype refund or void action when relevant.

### `OverviewCards`
- Displays lightweight metrics in a fast-to-scan format.

## 15. State and Reducer Shape

### Suggested `AppState`
```ts
type PaymentMethod = 'card' | 'qr' | null;

type PaymentStatus =
  | 'idle'
  | 'collecting'
  | 'processing'
  | 'success'
  | 'failed'
  | 'canceled'
  | 'timed_out';

type TransactionStatus =
  | 'success'
  | 'failed'
  | 'canceled'
  | 'refunded'
  | 'voided';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  method: Exclude<PaymentMethod, null>;
  status: TransactionStatus;
  failureReason?: string;
}

interface AppState {
  cart: CartItem[];
  selectedPaymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactions: Transaction[];
  activeTransactionId: string | null;
}
```

### Suggested reducer responsibilities
- select payment method
- start payment
- resolve payment success
- resolve payment failure
- cancel payment
- timeout payment
- reset checkout
- open transaction detail
- refund transaction
- void transaction
- load transactions from storage

## 16. Suggested User Interface Layout

### Desktop / tablet
- Header at the top with app title and section navigation
- Main content in two columns on checkout:
  - left column: cart and amount
  - right column: payment selection and status
- Transactions and overview can use full-width layouts

### Mobile
- Stack cart above payment actions
- Keep amount and primary action near the bottom with sticky behavior if needed
- Preserve large button sizing

## 17. Suggested Build Milestones

### Milestone 1: structure
- Set up Vite React TypeScript app
- Add base file structure
- Add global CSS variables and layout rules

### Milestone 2: checkout
- Build checkout screen
- Render mock cart
- Add payment method selector
- Add amount summary

### Milestone 3: payment logic
- Add reducer
- Implement mocked card and QR flow states
- Implement success, failure, cancel, and timeout outcomes

### Milestone 4: transaction management
- Save transactions locally
- Build transaction list
- Build transaction detail
- Add refund/void simulation

### Milestone 5: overview and polish
- Add sales overview metrics
- Improve motion and feedback
- Add reset demo control
- Review responsiveness

## 18. Screen Wireframe Notes

### 18.1 Checkout screen
Purpose:
This is the main operational screen. It should be usable with almost no training.

Primary regions:
- Header with app name and section tabs
- Cart summary panel
- Amount due card
- Payment method selector
- Payment status/action panel

Suggested layout:
```text
+--------------------------------------------------------------+
| Logo / POS Name         Checkout | Transactions | Overview   |
+--------------------------------------------------------------+
| Cart Summary                    | Amount Due                |
| - Coffee x2                     | $24.50                    |
| - Sandwich x1                   |                           |
| - Tax / subtotal                | Payment Methods           |
|                                 | [ Debit Card ] [ QR Pay ] |
|                                 |                           |
|                                 | Status Panel              |
|                                 | Ready to take payment     |
|                                 | [ Charge Card ]           |
+--------------------------------------------------------------+
```

Behavior notes:
- The amount due should be the strongest visual element.
- The selected payment method should change the CTA label and guidance text.
- The cart should remain visible throughout the payment process.

### 18.2 Processing screen/state
Purpose:
Show that the transaction is actively being attempted and prevent duplicate submissions.

Suggested content:
- Large payment status label: `Processing payment`
- Short instruction: `Do not close or restart the sale`
- Spinner or progress indicator
- Disabled primary button
- Optional secondary action only if canceling is allowed by the mock flow

Behavior notes:
- Do not allow repeated clicks on the main CTA.
- Keep the amount and selected method visible.

### 18.3 Card failure state
Purpose:
Help the cashier recover quickly without confusion.

Suggested content:
- Error banner: `Payment failed`
- Plain-language reason such as `Card was not approved`
- Recovery actions:
  - `Try Again`
  - `Switch to QR`
  - `Cancel`

Behavior notes:
- The cart and total should remain unchanged.
- The failure reason should be short and operational, not technical.

### 18.4 QR payment state
Purpose:
Represent the waiting period clearly and reduce uncertainty while the customer scans.

Suggested layout:
```text
+--------------------------------------+
| QR Payment                           |
| [ Mock QR Block ]                    |
| Customer scans to pay $24.50         |
| Status: Waiting for scan             |
| [ Regenerate QR ] [ Switch Method ]  |
+--------------------------------------+
```

Behavior notes:
- QR should have distinct waiting and timeout states.
- The cashier should be able to switch back to card without losing the sale.

### 18.5 Success state
Purpose:
Give immediate reassurance that payment is complete.

Suggested content:
- Large success message: `Payment complete`
- Confirmed amount
- Payment method used
- Reference id
- CTA: `New Sale`
- Secondary visibility of `View Transaction`

Behavior notes:
- The confirmation should be unmissable.
- A new sale reset should be one tap away.

### 18.6 Transactions screen
Purpose:
Let the merchant review recent activity quickly.

Primary regions:
- Filter/search row
- Transaction table or stacked list
- Detail panel or modal

Suggested columns:
- time
- amount
- method
- status
- reference id

Behavior notes:
- Most recent transactions should appear first.
- Failed and refunded transactions should be visually distinguishable.

### 18.7 Overview screen
Purpose:
Provide fast end-of-day or current-shift visibility.

Suggested metric cards:
- total sales
- number of successful payments
- number of failed payments
- card vs QR split
- refunded amount

Behavior notes:
- Keep this light and summary-driven.
- It should complement checkout, not overshadow it.

## 19. Interaction and Motion Notes

### Micro-interactions
- Selected payment tiles should respond instantly.
- Processing should animate enough to signal activity, but not distract.
- Success should include a brief confirmation emphasis such as a scale-in card or status flash.
- Error banners should appear directly in the payment panel, not detached from the action area.

### Timing suggestions
- Card processing mock delay: 1.5 to 2.5 seconds
- QR waiting mock delay before result: 2 to 4 seconds
- Success banner persistence before reset option emphasis: 2 seconds

### Accessibility notes
- Maintain strong color contrast.
- Do not rely on color alone for status.
- Buttons should remain clearly labeled in all states.
- Keyboard support is beneficial even if the primary target is touch.

## 20. Requirement Matrix

| Area | Requirement | Priority | Notes |
|---|---|---:|---|
| Checkout | View current cart and total | High | Always visible on checkout |
| Checkout | Select debit card or QR | High | Large touch targets |
| Payment | Simulate processing state | High | Prevent duplicate actions |
| Payment | Show success state | High | Must save transaction |
| Payment | Show failure state | High | Must support retry |
| Payment | Show canceled/timed out states | Medium | Important for realism |
| Transactions | List past transactions | High | Reverse chronological order |
| Transactions | Open transaction detail | High | Include method and status |
| Transactions | Simulate refund/void | Medium | Prototype only |
| Overview | Show daily summary metrics | Medium | Merchant reassurance |
| Persistence | Save to localStorage | High | Needed for continuity |
| UX | Responsive desktop/tablet layout | High | Merchant demo target |
| UX | Large buttons and clear copy | High | Core merchant requirement |

## 21. Implementation Notes for Simplicity

### Keep the first version intentionally narrow
- Hardcode a small mock cart.
- Do not build cart editing unless it becomes necessary for the demo.
- Use a static merchant name and terminal id.
- Avoid authentication unless a splash/login frame is explicitly needed for presentation.

### Keep logic predictable
- Use predefined mock outcomes that can be triggered in code.
- Prefer deterministic development behavior over random outcomes.
- If a random demo mode is added later, keep it optional.

### Keep styling manageable
- Use CSS variables for:
  - primary color
  - success color
  - warning/error color
  - background surfaces
  - spacing scale
- Use a small set of reusable utility classes only if they reduce repetition.

## 22. SDLC Breakdown

### Discovery
- Confirm target device sizes.
- Confirm whether the prototype is demo-only or intended for user testing.
- Confirm how realistic the cart needs to be.

### Requirements definition
- Lock the primary journeys before building.
- Define required states for every payment method.
- Define what counts as "clickable complete" for the demo.

### UX design
- Create the screen map.
- Create low-fidelity wireframes.
- Validate the speed of the checkout flow.
- Decide visual hierarchy before polishing colors.

### UI implementation
- Build reusable primitives:
  - amount card
  - action tile
  - status banner
  - transaction row
- Implement the checkout shell first.
- Add payment flows second.
- Add overview and history third.

### QA
- Verify every flow from checkout to saved transaction.
- Verify failure recovery paths.
- Verify responsive behavior on tablet and desktop widths.
- Verify state reset for repeated demos.

### Handoff / demo readiness
- Include one reset-demo control.
- Include a short explanation of supported flows.
- Make mock scenarios easy to trigger if a presenter needs them.

## 23. Acceptance Criteria
- The user can complete a mock debit card payment in one clear flow.
- The user can complete a mock QR payment in one clear flow.
- The user can recover from a failed payment without losing cart context.
- The user can review recent transactions and inspect one in detail.
- The interface is visually optimized for merchant operation rather than consumer browsing.
- The prototype is understandable without verbal narration.

## 24. Risks and Mitigations

### Risk: prototype becomes visually polished but operationally weak
Mitigation:
Prioritize flow state design before decorative styling.

### Risk: too many features reduce clarity
Mitigation:
Keep v1 limited to checkout, payment states, history, and overview.

### Risk: QR flow feels fake or confusing
Mitigation:
Use explicit waiting, timeout, and paid states with simple copy.

### Risk: card and QR flows diverge too much
Mitigation:
Keep a shared payment-state framework with method-specific collection UI.

## 25. Recommended Build Order
1. Define screen architecture and mock state model.
2. Build checkout screen and persistent cart summary.
3. Add card payment flow states.
4. Add QR generation and waiting states.
5. Add transaction history and detail.
6. Add overview metrics.
7. Add polish, motion, and reset/demo tools.

## 26. Decision Summary
- The prototype should center on checkout speed.
- Card and QR are the two payment rails in scope.
- Transaction visibility is part of the core experience, not a secondary admin tool.
- Failure recovery is a first-class requirement.
- Frontend-only mocked logic is sufficient for the first release of the prototype.
