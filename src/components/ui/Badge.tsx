import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'urgent' | 'normal' | 'positive' | 'negative' | 'neutral' | 'pending' | 'responded' | 'resolved';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant, size = 'sm' }) => {
  const variants = {
    urgent: 'bg-red-100 text-red-800 border-red-200',
    normal: 'bg-blue-100 text-blue-800 border-blue-200',
    positive: 'bg-green-100 text-green-800 border-green-200',
    negative: 'bg-red-100 text-red-800 border-red-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    responded: 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-green-100 text-green-800 border-green-200'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full font-medium border',
      variants[variant],
      sizes[size]
    )}>
      {children}
    </span>
  );
};