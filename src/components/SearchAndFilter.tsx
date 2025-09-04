'use client';

import React, { useState } from 'react';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  filterOptions?: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string; }>;
  }>;
  placeholder?: string;
}

export default function SearchAndFilter({ 
  onSearch, 
  onFilter, 
  filterOptions = [],
  placeholder = "搜索..." 
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="bg-paper-white border-2 border-ink-gray/30 rounded-lg p-6 mb-8 paper-texture">
      {/* Search input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-paper-white border-2 border-ink-gray/30 rounded-lg font-chinese text-ink-black placeholder-ink-gray/60 focus:border-gold focus:outline-none transition-colors duration-300"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-gray">
            🔍
          </div>
        </div>
      </div>

      {/* Filters */}
      {filterOptions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterOptions.map((filterOption) => (
            <div key={filterOption.key}>
              <label className="block text-sm font-medium text-ink-gray mb-2 calligraphy">
                {filterOption.label}
              </label>
              <select
                value={filters[filterOption.key] || ''}
                onChange={(e) => handleFilterChange(filterOption.key, e.target.value)}
                className="w-full px-3 py-2 bg-paper-white border-2 border-ink-gray/30 rounded-lg font-chinese text-ink-black focus:border-gold focus:outline-none transition-colors duration-300"
              >
                <option value="">全部</option>
                {filterOption.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Active filters display */}
      {Object.keys(filters).length > 0 && (
        <div className="mt-4 pt-4 border-t border-ink-gray/20">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-ink-gray font-chinese">筛选条件:</span>
            {Object.entries(filters).map(([key, value]) => {
              const filterOption = filterOptions.find(f => f.key === key);
              const option = filterOption?.options.find(o => o.value === value);
              return (
                <span 
                  key={key}
                  className="inline-flex items-center gap-1 bg-gold/20 border border-gold text-gold px-3 py-1 rounded-full text-sm font-medium"
                >
                  {filterOption?.label}: {option?.label}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-1 text-gold hover:text-crimson transition-colors"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}