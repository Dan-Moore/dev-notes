import { YouTubeEmbed } from '@next/third-parties/google';
import type { MDXComponents } from 'mdx/types'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}

export const components = {
  YouTubeEmbed
};