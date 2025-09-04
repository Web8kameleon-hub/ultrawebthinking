/**
 * SimpleModular Components - Pure TypeScript + CVA
 * Author: EuroWeb Ultra Platform
 */

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

// SimpleButton with CVA variants
const buttonVariants = cva(
  'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        industrial: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        quantum: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400',
        neural: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500',
        ultra: 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400'
      }
    },
    defaultVariants: {
      variant: 'industrial'
    }
  }
);

export interface SimpleButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  readonly children: React.ReactNode;
}

export const SimpleButton = React.memo<SimpleButtonProps>(({ 
  variant, 
  children, 
  className, 
  ...props 
}) => {
  return (
    <button
      className={buttonVariants({ variant, className })}
      {...props}
    >
      {children}
    </button>
  );
});

SimpleButton.displayName = 'SimpleButton';

