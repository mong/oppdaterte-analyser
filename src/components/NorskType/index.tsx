'use client'
import React from 'react'
import { RadioGroupField } from '@payloadcms/ui'
import type { RadioFieldClientComponent } from 'payload'
import { useLocale } from '@payloadcms/ui';

export const NorskType: RadioFieldClientComponent = (props) => {
  const locale = useLocale()
  return locale.code === "no" && <RadioGroupField {...props} />;
}
export default NorskType;