import { DemoScenario, PaymentMethod, PaymentStatus, TransactionStatus } from '../types/state';

export function getProcessingDelay(method: PaymentMethod): number {
  if (method === 'qr') {
    return 2600;
  }

  if (method === 'cash') {
    return 900;
  }

  return 1800;
}

export function getStartStatus(method: PaymentMethod): PaymentStatus {
  return method === 'qr' ? 'collecting' : 'processing';
}

export function getStatusMessage(method: PaymentMethod, status: PaymentStatus, scenario: DemoScenario): string {
  if (status === 'collecting' && method === 'qr') {
    return 'QR is live. Ask the customer to scan and complete payment.';
  }

  if (status === 'processing') {
    if (method === 'card') {
      return 'Processing card payment.';
    }

    if (method === 'cash') {
      return 'Confirming cash received.';
    }

    return 'Confirming QR payment.';
  }

  if (status === 'success') {
    return 'Payment complete. Receipt-ready and saved in transactions.';
  }

  if (status === 'failed' && scenario === 'declined') {
    return method === 'cash'
      ? 'Cash could not be confirmed. Try again or choose another payment method.'
      : 'Card was not approved. Try again or switch payment method.';
  }

  if (status === 'timed_out') {
    return 'Payment timed out. Generate a new QR or retry card.';
  }

  if (status === 'canceled') {
    return 'Payment canceled. Cart is still ready.';
  }

  return 'Ready to take payment.';
}

export function getOutcomeStatus(scenario: DemoScenario): PaymentStatus {
  switch (scenario) {
    case 'declined':
      return 'failed';
    case 'timeout':
      return 'timed_out';
    case 'canceled':
      return 'canceled';
    case 'success':
    default:
      return 'success';
  }
}

export function getTransactionStatus(scenario: DemoScenario): TransactionStatus {
  switch (scenario) {
    case 'declined':
      return 'failed';
    case 'timeout':
      return 'timed_out';
    case 'canceled':
      return 'canceled';
    case 'success':
    default:
      return 'success';
  }
}
