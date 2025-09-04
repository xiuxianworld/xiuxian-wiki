'use client';

import React from 'react';

interface ContentDetailProps {
  title: string;
  data: Record<string, any>;
  fields: Array<{
    key: string;
    label: string;
    type?: 'text' | 'number' | 'badge' | 'long-text';
  }>;
}

export default function ContentDetail({ title, data, fields }: ContentDetailProps) {
  const renderField = (field: typeof fields[0], value: any) => {
    if (!value) return null;

    switch (field.type) {
      case 'badge':
        return (
          <span className="inline-block bg-gold/20 border border-gold text-gold px-3 py-1 rounded-full text-sm font-medium">
            {value}
          </span>
        );
      case 'number':
        return (
          <span className="text-crimson font-bold text-lg">
            {value}
          </span>
        );
      case 'long-text':
        return (
          <div className="prose prose-lg font-chinese text-ink-black leading-relaxed">
            {value.split('\n').map((line: string, index: number) => (
              <p key={index} className="mb-2">{line}</p>
            ))}
          </div>
        );
      default:
        return (
          <span className="font-chinese text-ink-black">
            {value}
          </span>
        );
    }
  };

  return (
    <div className="bg-paper-white border-2 border-ink-gray/30 rounded-lg p-8 scroll-shadow paper-texture">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold calligraphy text-ink-black mb-2 ink-drip">
          {data.name || title}
        </h1>
        <div className="w-16 h-1 bg-gold mx-auto rounded"></div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const value = data[field.key];
          if (!value) return null;

          return (
            <div 
              key={field.key} 
              className={`${field.type === 'long-text' ? 'md:col-span-2' : ''}`}
            >
              <div className="border-l-4 border-gold pl-4 py-2">
                <dt className="text-sm font-medium text-ink-gray uppercase tracking-wider mb-1">
                  {field.label}
                </dt>
                <dd className="text-base">
                  {renderField(field, value)}
                </dd>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image if available */}
      {data.imageUrl && (
        <div className="mt-8 text-center">
          <div className="inline-block border-4 border-gold/30 rounded-lg overflow-hidden">
            <img 
              src={data.imageUrl} 
              alt={data.name} 
              className="max-w-full h-auto max-h-96 object-cover"
            />
          </div>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-gold/30"></div>
      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-gold/30"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-gold/30"></div>
      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-gold/30"></div>
    </div>
  );
}