'use client';

import React from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  chineseTitle: string;
  description: string;
  icon: string;
  href: string;
  count?: number;
}

export default function CategoryCard({ 
  title, 
  chineseTitle, 
  description, 
  icon, 
  href, 
  count 
}: CategoryCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="bg-paper-white border-2 border-ink-gray/30 rounded-lg p-6 h-full transition-all duration-300 group-hover:border-gold group-hover:shadow-xl group-hover:scale-105 ink-brush paper-texture">
        {/* Icon and title */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-2xl font-bold calligraphy text-ink-black mb-1">
            {chineseTitle}
          </h3>
          <p className="text-sm font-chinese text-ink-gray uppercase tracking-wider">
            {title}
          </p>
        </div>
        
        {/* Description */}
        <p className="text-ink-gray font-chinese text-center leading-relaxed mb-4 text-sm">
          {description}
        </p>
        
        {/* Count badge */}
        {count !== undefined && (
          <div className="text-center">
            <span className="inline-block bg-gold/20 border border-gold text-gold px-3 py-1 rounded-full text-xs font-medium">
              {count} 条记录
            </span>
          </div>
        )}
        
        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </Link>
  );
}