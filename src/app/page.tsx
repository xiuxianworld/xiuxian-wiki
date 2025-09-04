'use client';

import React from 'react';
import AncientBookLayout from '@/components/AncientBookLayout';
import CategoryCard from '@/components/CategoryCard';
import { CATEGORIES } from '@/lib/constants';

export default function HomePage() {
  return (
    <AncientBookLayout 
      title="修仙百科"
      subtitle="仙道知识宝典 · Cultivation Knowledge Compendium"
    >
      {/* Introduction */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <p className="text-lg font-chinese text-ink-gray leading-relaxed mb-6">
          欢迎来到修仙百科，这里汇集了修仙界的各种知识与奥秘。
          从灵根资质到修行境界，从功法秘籍到灵丹妙药，
          一切修仙所需的知识都在此处等待您的探索。
        </p>
        <div className="flex justify-center space-x-4 text-2xl">
          <span>✨</span>
          <span>🗡️</span>
          <span>📜</span>
          <span>🔮</span>
          <span>✨</span>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.key}
            title={category.name}
            chineseTitle={category.chineseName}
            description={category.description}
            icon={category.icon}
            href={`/category/${category.key}`}
          />
        ))}
      </div>

      {/* Features Section */}
      <div className="border-t-2 border-gold/30 pt-12">
        <h2 className="text-3xl font-bold calligraphy text-center text-ink-black mb-8">
          功能特色
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold font-chinese text-ink-black mb-2">
              丰富内容
            </h3>
            <p className="text-ink-gray font-chinese">
              涵盖修仙世界的各个方面，从基础知识到高深奥义
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold font-chinese text-ink-black mb-2">
              智能搜索
            </h3>
            <p className="text-ink-gray font-chinese">
              快速找到您需要的修仙知识，支持多种筛选条件
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold font-chinese text-ink-black mb-2">
              古韵设计
            </h3>
            <p className="text-ink-gray font-chinese">
              水墨复古风格，仿佛置身于古代典籍之中
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t border-ink-gray/20">
        <div className="mb-4">
          <a
            href="/admin/login"
            className="inline-flex items-center gap-2 bg-ink-gray/10 border border-ink-gray/30 text-ink-gray px-4 py-2 rounded-lg font-chinese hover:bg-ink-gray hover:text-paper-white transition-colors duration-300"
          >
            🔐 管理后台
          </a>
        </div>
        <p className="text-ink-gray font-chinese text-sm">
          © 2024 修仙百科 · 探索仙道奥秘，传承修真智慧
        </p>
      </div>
    </AncientBookLayout>
  );
}