"use client";

import * as React from 'react';

// Motion types for Web8 compliance
export interface MotionVariants {
  [key: string]: {
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
    transition?: {
      duration?: number;
      type?: string;
      stiffness?: number;
    };
  };
}

export interface AnimationOptions {
  duration: number;
  easing?: string;
  delay?: number;
}

export interface Keyframe {
  offset: number;
  [property: string]: unknown;
}

// Enhanced motion object for Web8
export const motion = {
  div: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
    const { children, ...restProps } = props;
    return React.createElement('div', {
      ...restProps,
      'data-motion': 'div'
    }, children);
  },
  
  section: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => {
    const { children, ...restProps } = props;
    return React.createElement('section', {
      ...restProps,
      'data-motion': 'section'
    }, children);
  },
  
  article: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => {
    const { children, ...restProps } = props;
    return React.createElement('article', {
      ...restProps,
      'data-motion': 'article'
    }, children);
  },

  button: (props: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => {
    const { children, ...restProps } = props;
    return React.createElement('button', {
      ...restProps,
      'data-motion': 'button'
    }, children);
  },

  span: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>>) => {
    const { children, ...restProps } = props;
    return React.createElement('span', {
      ...restProps,
      'data-motion': 'span'
    }, children);
  },

  h1: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => {
    const { children, ...restProps } = props;
    return React.createElement('h1', {
      ...restProps,
      'data-motion': 'h1'
    }, children);
  },

  h2: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => {
    const { children, ...restProps } = props;
    return React.createElement('h2', {
      ...restProps,
      'data-motion': 'h2'
    }, children);
  },

  h3: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => {
    const { children, ...restProps } = props;
    return React.createElement('h3', {
      ...restProps,
      'data-motion': 'h3'
    }, children);
  },

  p: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>>) => {
    const { children, ...restProps } = props;
    return React.createElement('p', {
      ...restProps,
      'data-motion': 'p'
    }, children);
  }
};
