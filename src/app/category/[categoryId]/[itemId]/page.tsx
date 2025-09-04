'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AncientBookLayout from '@/components/AncientBookLayout';
import ContentDetail from '@/components/ContentDetail';
import { CATEGORIES, FIELD_DEFINITIONS } from '@/lib/constants';
import { CategoryType } from '@/types';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as CategoryType;
  const itemId = params.itemId as string;
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = CATEGORIES.find(cat => cat.key === categoryId);
  
  useEffect(() => {
    if (!category) {
      router.push('/');
      return;
    }
    
    fetchItem();
  }, [categoryId, itemId, category, router]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/${categoryId}/${itemId}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data);
      } else if (response.status === 404) {
        setError('未找到该条记录');
      } else {
        setError('加载数据时出错');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      setError('网络连接错误');
    } finally {
      setLoading(false);
    }
  };

  const getFieldDefinitions = () => {
    return FIELD_DEFINITIONS[categoryId] || [];
  };

  if (!category) {
    return null;
  }

  if (loading) {
    return (
      <AncientBookLayout title="加载中...">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-ink-gray font-chinese text-lg">正在加载详细信息...</p>
        </div>
      </AncientBookLayout>
    );
  }

  if (error) {
    return (
      <AncientBookLayout title="出错了">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-ink-gray font-chinese text-lg mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => router.push(`/category/${categoryId}`)}
              className="bg-gold/20 border border-gold text-gold px-6 py-2 rounded-lg font-chinese hover:bg-gold hover:text-paper-white transition-colors duration-300"
            >
              返回{category.chineseName}列表
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-ink-gray/20 border border-ink-gray text-ink-gray px-6 py-2 rounded-lg font-chinese hover:bg-ink-gray hover:text-paper-white transition-colors duration-300"
            >
              返回首页
            </button>
          </div>
        </div>
      </AncientBookLayout>
    );
  }

  if (!item) {
    return (
      <AncientBookLayout title="未找到">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-ink-gray font-chinese text-lg">未找到相关信息</p>
        </div>
      </AncientBookLayout>
    );
  }

  return (
    <AncientBookLayout 
      title={item.name}
      subtitle={`${category.chineseName} · ${category.description}`}
    >
      {/* Navigation */}
      <div className="mb-8 flex items-center space-x-4">
        <button
          onClick={() => router.push('/')}
          className="text-gold hover:text-crimson transition-colors duration-300 font-chinese"
        >
          首页
        </button>
        <span className="text-ink-gray">→</span>
        <button
          onClick={() => router.push(`/category/${categoryId}`)}
          className="text-gold hover:text-crimson transition-colors duration-300 font-chinese"
        >
          {category.chineseName}
        </button>
        <span className="text-ink-gray">→</span>
        <span className="text-ink-gray font-chinese">{item.name}</span>
      </div>

      {/* Content Detail */}
      <ContentDetail
        title={item.name}
        data={item}
        fields={getFieldDefinitions()}
      />

      {/* Action buttons */}
      <div className="text-center mt-12 space-x-4">
        <button
          onClick={() => router.push(`/category/${categoryId}`)}
          className="bg-gold/20 border border-gold text-gold px-6 py-3 rounded-lg font-chinese hover:bg-gold hover:text-paper-white transition-colors duration-300"
        >
          返回{category.chineseName}列表
        </button>
        <button
          onClick={() => router.push('/')}
          className="bg-ink-gray/20 border border-ink-gray text-ink-gray px-6 py-3 rounded-lg font-chinese hover:bg-ink-gray hover:text-paper-white transition-colors duration-300"
        >
          返回首页
        </button>
      </div>
    </AncientBookLayout>
  );
}