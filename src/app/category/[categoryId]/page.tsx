'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AncientBookLayout from '@/components/AncientBookLayout';
import SearchAndFilter from '@/components/SearchAndFilter';
import ListView from '@/components/ListView';
import { CATEGORIES, FIELD_DEFINITIONS } from '@/lib/constants';
import { CategoryType } from '@/types';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as CategoryType;
  
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const category = CATEGORIES.find(cat => cat.key === categoryId);
  
  useEffect(() => {
    if (!category) {
      router.push('/');
      return;
    }
    
    fetchItems();
  }, [categoryId, category, router]);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(item => item[key] === value);
      }
    });

    setFilteredItems(filtered);
  };

  const getFilterOptions = () => {
    if (!items.length) return [];

    const options = [];
    
    // Get unique values for filterable fields
    const filterableFields = ['type', 'grade', 'level', 'category', 'species'];
    
    filterableFields.forEach(field => {
      const uniqueValues = [...new Set(items.map(item => item[field]).filter(Boolean))];
      if (uniqueValues.length > 1) {
        options.push({
          key: field,
          label: getFieldLabel(field),
          options: uniqueValues.map(value => ({ value, label: value }))
        });
      }
    });

    return options;
  };

  const getFieldLabel = (field: string) => {
    const fieldMapping: Record<string, string> = {
      type: '类型',
      grade: '品级',
      level: '等级',
      category: '类别',
      species: '种族'
    };
    return fieldMapping[field] || field;
  };

  const getDisplayFields = () => {
    const fieldDefs = FIELD_DEFINITIONS[categoryId];
    if (!fieldDefs) return [];
    
    return fieldDefs.slice(0, 4).map(field => ({
      key: field.key,
      label: field.label,
      type: field.type
    }));
  };

  if (!category) {
    return null;
  }

  return (
    <AncientBookLayout 
      title={category.chineseName}
      subtitle={`${category.name} · ${category.description}`}
    >
      {/* Navigation */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="text-gold hover:text-crimson transition-colors duration-300 font-chinese"
        >
          ← 返回首页
        </button>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        onSearch={setSearchQuery}
        onFilter={setFilters}
        filterOptions={getFilterOptions()}
        placeholder={`搜索${category.chineseName}...`}
      />

      {/* Results count */}
      <div className="mb-6">
        <p className="text-ink-gray font-chinese">
          找到 <span className="font-bold text-ink-black">{filteredItems.length}</span> 条
          {searchQuery || Object.keys(filters).length > 0 ? '符合条件的' : ''}
          {category.chineseName}记录
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-ink-gray font-chinese">正在加载{category.chineseName}信息...</p>
        </div>
      ) : (
        <ListView
          items={filteredItems}
          basePath={`/category/${categoryId}`}
          displayFields={getDisplayFields()}
          emptyMessage={`暂无${category.chineseName}信息`}
        />
      )}
    </AncientBookLayout>
  );
}