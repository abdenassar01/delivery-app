'use client';

import React, { createContext, useContext } from 'react';
import type { FormApi } from '@tanstack/react-form';

export const FormContext = createContext<FormApi<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> | null>(null);

export function useFormContext() {
  const form = useContext(FormContext);
  if (!form) {
    throw new Error('useFormContext must be used within a FormProvider!');
  }
  return form;
}
