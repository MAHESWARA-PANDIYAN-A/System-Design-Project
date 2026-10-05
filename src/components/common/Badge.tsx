import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    info: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };

  const dotStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-indigo-500',
    neutral: 'bg-slate-400',
    purple: 'bg-purple-500',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'AVAILABLE':
    case 'CONFIRMED':
    case 'PAID':
    case 'CAPTURED':
    case 'HEALTHY':
    case 'COMPLETED':
    case 'RESOLVED':
    case 'ACTIVE':
    case 'SUCCESS':
      return <Badge variant="success" dot>{status}</Badge>;

    case 'LOW_STOCK':
    case 'RESERVATION_PRESSURE':
    case 'DEGRADED':
    case 'RETRYING':
    case 'HALF_OPEN':
    case 'WARNING':
    case 'PENDING':
      return <Badge variant="warning" dot>{status.replace('_', ' ')}</Badge>;

    case 'OUT_OF_STOCK':
    case 'FAILED':
    case 'DOWN':
    case 'OPEN':
    case 'EXPIRED':
    case 'CANCELLED':
    case 'DISCARDED':
    case 'ERROR':
      return <Badge variant="error" dot>{status}</Badge>;

    case 'RESERVED':
    case 'PAYMENT_PENDING':
    case 'PROCESSING':
    case 'AUTHORIZED':
    case 'INFO':
    case 'CLOSED':
    case 'CREATED':
    case 'RECOVERING':
    default:
      return <Badge variant="info" dot>{status.replace('_', ' ')}</Badge>;
  }
};
