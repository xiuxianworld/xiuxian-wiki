'use client';

import React from 'react';
import { AuthProvider } from '@/components/admin/AuthContext';
import NoSSR from '@/components/NoSSR';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NoSSR fallback={
      <div className="min-h-screen bg-paper-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-ink-gray font-chinese text-lg">正在加载...</p>
        </div>
      </div>
    }>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NoSSR>
  );
}