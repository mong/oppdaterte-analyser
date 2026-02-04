import React from 'react'

import type { RawHTMLBlock as RawHTMLBlockProps } from '@/payload-types'

export const RawHTMLBlock: React.FC<RawHTMLBlockProps> = ({ html }) =>
  <div dangerouslySetInnerHTML={{ __html: html }} />;

