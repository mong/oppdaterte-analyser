'use client'
import React from 'react'
import { RadioGroupField } from '@payloadcms/ui'
import type { RadioFieldClientComponent } from 'payload'

export const DynamicRadioButtons: RadioFieldClientComponent = (props) => {
  return <>
  <p>HEEELLOOO</p>
  <RadioGroupField {...props} />
  </>
}