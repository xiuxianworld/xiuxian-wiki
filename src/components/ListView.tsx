'use client';

import React from 'react';
import Link from 'next/link';

interface ListViewProps {
  items: Array<Record<string, any>>;
  basePath: string;
  displayFields: Array<{
    key: string;
    label: string;
    type?: 'text' | 'badge' | 'number';
  }>;
  emptyMessage?: string;
}

export default function ListView({ 
  items, 
  basePath, 
  displayFields, 
  emptyMessage = "暂无数据" 
}: ListViewProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 opacity-30">📜</div>
        <p className="text-ink-gray font-chinese text-lg">{emptyMessage}</p>
      </div>
    );
  }

  const renderFieldValue = (field: typeof displayFields[0], value: any) => {
    if (!value) return null;

    switch (field.type) {
      case 'badge':
        return (
          <span className="inline-block bg-gold/20 border border-gold text-gold px-2 py-1 rounded-full text-xs font-medium">
            {value}
          </span>
        );
      case 'number':
        return (
          <span className="text-crimson font-bold">
            {value}
          </span>
        );
      default:
        return (
          <span className="font-chinese text-ink-gray">
            {value}
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link 
          key={item.id} 
          href={`${basePath}/${item.id}`}
          className="block group"
        >
          <div className="bg-paper-white border-2 border-ink-gray/30 rounded-lg p-6 h-full transition-all duration-300 group-hover:border-gold group-hover:shadow-lg group-hover:scale-105 paper-texture ink-brush">
            {/* Title */}
            <h3 className="text-xl font-bold calligraphy text-ink-black mb-3 group-hover:text-gold transition-colors duration-300">
              {item.name}
            </h3>
            
            {/* Fields */}
            <div className="space-y-2 mb-4">
              {displayFields.slice(0, 3).map((field) => {
                const value = item[field.key];
                if (!value) return null;
                
                return (
                  <div key={field.key} className="flex justify-between items-center">
                    <span className="text-sm text-ink-gray font-medium">
                      {field.label}:
                    </span>
                    <div className="text-sm">
                      {renderFieldValue(field, value)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Description preview */}
            {item.description && (
              <p className="text-sm text-ink-gray font-chinese leading-relaxed line-clamp-3">
                {item.description}
              </p>
            )}
            
            {/* Image preview */}
            {item.imageUrl && (
              <div className="mt-4">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-32 object-cover rounded border-2 border-ink-gray/20"
                />
              </div>
            )}
            
            {/* Hover indicator */}
            <div className="mt-4 text-right">
              <span className="text-xs text-ink-gray group-hover:text-gold font-chinese transition-colors duration-300">
                点击查看详情 →
              </span>
            </div>
            
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>
      ))}
    </div>
  );
}