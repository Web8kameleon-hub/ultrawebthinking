// AGI-powered component që përdor Panda CSS tokens
import React from 'react';
import { css } from '../styled-system/css';
import { stack, container } from '../styled-system/patterns';
import { agiCore } from '../lib/AGICore';

interface AGIPanelProps {
  className?: string;
  children?: React.ReactNode;
}

export default function AGIPanel({ className, children }: AGIPanelProps) {
  const memory = agiCore.getMemory();
  const isAGIActive = memory.agi.responses.length > 0;
  
  return (
    <div
      className={css({
        background: 'linear-gradient(135deg, {colors.neutral.50} 0%, {colors.neutral.100} 100%)',
        borderRadius: 'xl',
        padding: 'lg',
        border: '1px solid {colors.neutral.200}',
        boxShadow: isAGIActive ? 'glow' : 'md',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'glow-lg',
          borderColor: '{colors.primary.300}'
        },
        _active: {
          transform: 'translateY(0)',
        },
        animation: isAGIActive ? 'pulse 2s infinite' : 'none'
      })}
    >
      <div className={stack({ direction: 'column', gap: 'md', align: 'center' })}>
        {/* AGI Status Indicator */}
        <div className={css({
          width: '12px',
          height: '12px',
          borderRadius: 'full',
          background: isAGIActive 
            ? 'linear-gradient(45deg, {colors.primary.500}, {colors.secondary.500})'
            : '{colors.neutral.300}',
          animation: isAGIActive ? 'glow 1.5s ease-in-out infinite' : 'none'
        })} />
        
        {/* AGI Status Text */}
        <div className={css({
          fontSize: 'sm',
          fontWeight: '600',
          color: isAGIActive ? '{colors.primary.600}' : '{colors.neutral.500}',
          textAlign: 'center'
        })}>
          AGI Status: {isAGIActive ? 'Active' : 'Standby'}
        </div>
        
        {/* Memory Info */}
        <div className={css({
          fontSize: 'xs',
          color: '{colors.neutral.400}',
          textAlign: 'center'
        })}>
          Responses: {memory.agi.responses.length} | 
          Theme: {memory.ui.theme}
        </div>
        
        {children}
      </div>
    </div>
  );
}

// Real-time AGI Metrics Component
export function AGIMetrics() {
  const memory = agiCore.getMemory();
  
  const metrics = [
    { label: 'AGI Responses', value: memory.agi.responses.length, color: 'primary' },
    { label: 'UI Theme', value: memory.ui.theme, color: 'secondary' },
    { label: 'User History', value: memory.user.history.length, color: 'accent' }
  ];
  
  return (
    <div className={container({ maxW: '4xl' })}>
      <div className={stack({ direction: 'row', gap: 'lg', justify: 'center' })}>
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={css({
              background: `linear-gradient(135deg, {colors.${metric.color}.50} 0%, {colors.${metric.color}.100} 100%)`,
              borderRadius: 'lg',
              padding: 'md',
              border: `1px solid {colors.${metric.color}.200}`,
              textAlign: 'center',
              minWidth: '120px',
              transition: 'all 0.2s ease',
              _hover: {
                transform: 'scale(1.05)',
                boxShadow: 'lg'
              }
            })}
          >
            <div className={css({
              fontSize: '2xl',
              fontWeight: '700',
              color: `{colors.${metric.color}.600}`,
              marginBottom: 'xs'
            })}>
              {typeof metric.value === 'string' ? metric.value : metric.value}
            </div>
            <div className={css({
              fontSize: 'sm',
              color: `{colors.${metric.color}.500}`,
              fontWeight: '500'
            })}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Interactive AGI Button
export function AGIButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  ...props 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  
  const sizeStyles = {
    sm: { padding: 'sm md', fontSize: 'sm' },
    md: { padding: 'md lg', fontSize: 'base' },
    lg: { padding: 'lg xl', fontSize: 'lg' }
  };
  
  return (
    <button
      onClick={onClick}
      className={css({
        background: `linear-gradient(135deg, {colors.${variant}.500} 0%, {colors.${variant}.600} 100%)`,
        color: 'white',
        border: 'none',
        borderRadius: 'lg',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        outline: 'none',
        ...sizeStyles[size],
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 20px rgba(var(--colors-${variant}-500-rgb), 0.3)`,
          background: `linear-gradient(135deg, {colors.${variant}.400} 0%, {colors.${variant}.500} 100%)`
        },
        _active: {
          transform: 'translateY(0)',
        },
        _focus: {
          boxShadow: `0 0 0 3px rgba(var(--colors-${variant}-500-rgb), 0.2)`
        }
      })}
      {...props}
    >
      {children}
    </button>
  );
}
