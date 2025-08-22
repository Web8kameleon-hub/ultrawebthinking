import React from 'react';
import { css } from '..//css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false 
}: ButtonProps) {
  return (
    <button
      className={css({
        px: 4,
        py: 2,
        borderRadius: 'md',
        fontWeight: 'medium',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        bg: variant === 'primary' ? 'blue.500' : 'gray.200',
        color: variant === 'primary' ? 'white' : 'gray.800',
        _hover: {
          bg: disabled ? undefined : variant === 'primary' ? 'blue.600' : 'gray.300'
        }
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}


export { Button };
