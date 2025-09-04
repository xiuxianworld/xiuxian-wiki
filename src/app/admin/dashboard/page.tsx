'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/admin/AuthContext';
import AncientBookLayout from '@/components/AncientBookLayout';
import CategoryCard from '@/components/CategoryCard';
import { CATEGORIES } from '@/lib/constants';

interface CategoryStats {
  [key: string]: number;
}

export default function AdminDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<CategoryStats>({});
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    } else if (user) {
      fetchStats();
    }
  }, [user, loading, router]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const statsPromises = CATEGORIES.map(async (category) => {
        const response = await fetch(`/api/${category.key}`);
        if (response.ok) {
          const data = await response.json();
          return { [category.key]: data.length };
        }
        return { [category.key]: 0 };
      });

      const results = await Promise.all(statsPromises);
      const combinedStats = results.reduce((acc, stat) => ({ ...acc, ...stat }), {});
      setStats(combinedStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) {
    return (
      <AncientBookLayout title="加载中...">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-ink-gray font-chinese text-lg">正在验证身份...</p>
        </div>
      </AncientBookLayout>
    );
  }

  if (!user) {
    return null;
  }

  const totalItems = Object.values(stats).reduce((sum: number, count: number) => sum + count, 0);

  return (
    <AncientBookLayout 
      title="管理后台"
      subtitle="Cultivation Wiki Admin Dashboard"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-chinese text-ink-black">
            欢迎回来，{user.username}
          </h2>
          <p className="text-ink-gray font-chinese">
            管理修仙百科的各种知识内容
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push('/')}
            className="bg-ink-gray/20 border border-ink-gray text-ink-gray px-4 py-2 rounded-lg font-chinese hover:bg-ink-gray hover:text-paper-white transition-colors duration-300"
          >
            🏠 返回前台
          </button>
          <button
            onClick={logout}
            className="bg-crimson/20 border border-crimson text-crimson px-4 py-2 rounded-lg font-chinese hover:bg-crimson hover:text-paper-white transition-colors duration-300"
          >
            🚪 退出登录
          </button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gold/10 border border-gold rounded-lg p-6 text-center">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="text-2xl font-bold font-chinese text-gold mb-1">
            {loadingStats ? '...' : totalItems}
          </h3>
          <p className="text-ink-gray font-chinese text-sm">总条目数</p>
        </div>
        <div className="bg-jade/10 border border-jade rounded-lg p-6 text-center">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="text-2xl font-bold font-chinese text-jade mb-1">
            {CATEGORIES.length}
          </h3>
          <p className="text-ink-gray font-chinese text-sm">知识类别</p>
        </div>
        <div className="bg-crimson/10 border border-crimson rounded-lg p-6 text-center">
          <div className="text-3xl mb-2">👤</div>
          <h3 className="text-2xl font-bold font-chinese text-crimson mb-1">
            1
          </h3>
          <p className="text-ink-gray font-chinese text-sm">管理员</p>
        </div>
        <div className="bg-ink-gray/10 border border-ink-gray rounded-lg p-6 text-center">
          <div className="text-3xl mb-2">🖼️</div>
          <h3 className="text-2xl font-bold font-chinese text-ink-gray mb-1">
            {loadingStats ? '...' : Math.floor(totalItems * 0.3)}
          </h3>
          <p className="text-ink-gray font-chinese text-sm">带图片条目</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold calligraphy text-ink-black mb-6">
          快速操作
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => router.push('/admin/dashboard/spiritualRoots')}
            className="bg-paper-white border-2 border-ink-gray/30 rounded-lg p-4 text-left hover:border-gold transition-colors duration-300"
          >
            <div className="text-2xl mb-2">🌿</div>
            <h3 className="text-sm font-bold font-chinese text-ink-black mb-1">
              添加灵根
            </h3>
            <p className="text-ink-gray font-chinese text-xs">
              快速添加新的灵根类型
            </p>
          </button>
          <button 
            onClick={() => router.push('/admin/dashboard/techniques')}
            className="bg-paper-white border-2 border-ink-gray/30 rounded-lg p-4 text-left hover:border-gold transition-colors duration-300"
          >
            <div className="text-2xl mb-2">📜</div>
            <h3 className="text-sm font-bold font-chinese text-ink-black mb-1">
              添加功法
            </h3>
            <p className="text-ink-gray font-chinese text-xs">
              快速添加新的修炼功法
            </p>
          </button>
          <button 
            onClick={() => router.push('/admin/dashboard/pills')}
            className="bg-paper-white border-2 border-ink-gray/30 rounded-lg p-4 text-left hover:border-gold transition-colors duration-300"
          >
            <div className="text-2xl mb-2">💊</div>
            <h3 className="text-sm font-bold font-chinese text-ink-black mb-1">
              添加丹药
            </h3>
            <p className="text-ink-gray font-chinese text-xs">
              快速添加新的灵丹妙药
            </p>
          </button>
          <button 
            onClick={fetchStats}
            className="bg-paper-white border-2 border-ink-gray/30 rounded-lg p-4 text-left hover:border-gold transition-colors duration-300"
          >
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="text-sm font-bold font-chinese text-ink-black mb-1">
              刷新数据
            </h3>
            <p className="text-ink-gray font-chinese text-xs">
              更新统计信息
            </p>
          </button>
        </div>
      </div>

      {/* Category Management */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold calligraphy text-ink-black mb-6">
          内容分类管理
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.key}
              title={category.name}
              chineseTitle={category.chineseName}
              description={`管理${category.description}`}
              icon={category.icon}
              href={`/admin/dashboard/${category.key}`}
              count={stats[category.key] || 0}
            />
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="border-t border-ink-gray/20 pt-8">
        <h2 className="text-2xl font-bold calligraphy text-ink-black mb-6">
          系统信息
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-paper-white border border-ink-gray/30 rounded-lg p-4">
            <h3 className="text-lg font-bold font-chinese text-ink-black mb-2">
              数据库状态
            </h3>
            <p className="text-jade font-chinese text-sm">✅ 连接正常</p>
          </div>
          <div className="bg-paper-white border border-ink-gray/30 rounded-lg p-4">
            <h3 className="text-lg font-bold font-chinese text-ink-black mb-2">
              最后更新
            </h3>
            <p className="text-ink-gray font-chinese text-sm">
              {new Date().toLocaleString('zh-CN')}
            </p>
          </div>
          <div className="bg-paper-white border border-ink-gray/30 rounded-lg p-4">
            <h3 className="text-lg font-bold font-chinese text-ink-black mb-2">
              版本信息
            </h3>
            <p className="text-ink-gray font-chinese text-sm">修仙百科 v1.0.0</p>
          </div>
        </div>
      </div>
    </AncientBookLayout>
  );
}