'use client';

import React from 'react';
import { AuthProvider } from '@/components/context/AuthProvider';

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};