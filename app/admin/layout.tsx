/**
 * Admin panel layout
 * Simple token-based authentication
 */

'use client';

import React from 'react';
import { AdminAuthCheck } from './auth-check';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthCheck>{children}</AdminAuthCheck>;
}
