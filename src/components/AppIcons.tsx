import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function IconBase(props: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props} />;
}

export function CashIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.75" />
      <path d="M7 9.5h.01M17 14.5h.01" />
    </IconBase>
  );
}

export function CardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M7 15h3" />
    </IconBase>
  );
}

export function QrIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 4h5v5H4zM15 4h5v5h-5zM4 15h5v5H4z" />
      <path d="M17 15v2m0 3v.01M20 15v5M15 17h2m2 0h1" />
    </IconBase>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.4 4.7-5" />
    </IconBase>
  );
}

export function XCircleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </IconBase>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 4.5 20 19H4l8-14.5Z" />
      <path d="M12 9v4.5M12 16.8h.01" />
    </IconBase>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5l3.5 2" />
    </IconBase>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  );
}

export function PoundIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M15.5 6.5c-.8-.9-1.9-1.5-3.4-1.5-2.5 0-4.1 1.7-4.1 4.2 0 1.2.3 2 .9 3H7.5" />
      <path d="M7.5 13h4.2c-.5 1.8-2 3-4.2 4.5h8.8" />
    </IconBase>
  );
}

export function ReceiptIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 4.5h10v15l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5v-15Z" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </IconBase>
  );
}

export function PlateIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 10.5c.5-2.1 2.6-3.5 6-3.5s5.5 1.4 6 3.5" />
      <path d="M5.5 12.5h13" />
      <path d="M6.5 15h11" />
      <path d="M7.5 17.5h9" />
    </IconBase>
  );
}

export function PaymentIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="6" width="16" height="12" rx="2.5" />
      <path d="M4 10h16M8 14h2.5" />
    </IconBase>
  );
}
