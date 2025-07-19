/**
 * EuroWeb Web8 - Simple Index Component
 * Pure Panda CSS - No styled-system - Industrial Grade
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client';

import React from 'react';
import { css } from '../styled-system/css';

// Pure TypeScript component - NO default export (forbidden)
const IndexSimple = (): React.ReactElement => {
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '2xl',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'blue.700',
        backgroundImage: 'linear-gradient(135deg, blue.700, blue.900)',
        textAlign: 'center',
        padding: '8',
        fontFamily: 'Inter, sans-serif'
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4'
        })}
      >
        <h1
          className={css({
            fontSize: '4xl',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          })}
        >
          Web8 UltraThinking
        </h1>
        <p
          className={css({
            fontSize: 'xl',
            color: 'blue.100',
            fontWeight: 'medium'
          })}
        >
          Kristal Engine Ready
        </p>
        <div
          className={css({
            display: 'flex',
            gap: '2',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '4'
          })}
        >
          <div
            className={css({
              width: '3',
              height: '3',
              backgroundColor: 'green.500',
              borderRadius: 'full',
              animation: 'pulse 2s infinite'
            })}
          />
          <span
            className={css({
              fontSize: 'sm',
              color: 'green.300',
              fontWeight: 'medium'
            })}
          >
            System Active
          </span>
        </div>
      </div>
    </div>
  );
};

// Named export (required by EuroWeb Web8 standards)
export { IndexSimple };