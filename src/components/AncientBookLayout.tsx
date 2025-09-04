'use client';

import React from 'react';

interface AncientBookLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AncientBookLayout({ children, title, subtitle }: AncientBookLayoutProps) {
  return (
    <div className="min-h-screen bg-paper-white paper-texture">
      {/* Background ink wash effect */}
      <div className="fixed inset-0 bg-ink-wash opacity-30 pointer-events-none"></div>
      
      {/* Main content area styled as ancient book */}
      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <div className="ancient-border bg-paper-white scroll-shadow p-8 rounded-lg">
          {/* Book header with title */}
          {title && (
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold calligraphy text-ink-black mb-4 ink-drip">
                {title}
              </h1>
              {subtitle && (
                <h2 className="text-xl md:text-2xl font-chinese text-ink-gray">
                  {subtitle}
                </h2>
              )}
              <div className="w-24 h-1 bg-gold mx-auto mt-6 rounded"></div>
            </div>
          )}
          
          {/* Content */}
          <div className="fade-in">
            {children}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold opacity-50"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gold opacity-50"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gold opacity-50"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold opacity-50"></div>
        </div>
      </div>
    </div>
  );
}