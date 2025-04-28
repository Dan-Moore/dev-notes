import type { MDXComponents } from 'mdx/types'

import React from "react";
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => (
      <h1 style={{fontSize: '2em' }}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 style={{fontSize: '1.8em' }}>{children}</h2>
    ),

  }
}