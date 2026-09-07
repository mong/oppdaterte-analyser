'use client'
import { RadioGroupField } from '@payloadcms/ui'
import type { RadioFieldClientComponent } from 'payload'
import { useLocale } from '@payloadcms/ui';

const NorskType: RadioFieldClientComponent = (props) => {
  const locale = useLocale()
  return locale.code === "no" && <RadioGroupField {...props} />;
}
export default NorskType;