'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/admin/AuthContext';
import AncientBookLayout from '@/components/AncientBookLayout';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/admin/dashboard');
      } else {
        setError('用户名或密码错误');
      }
    } catch (error) {
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while auth context is initializing
  if (authLoading) {
    return (
      <AncientBookLayout title="初始化中..." subtitle="Initializing...">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-ink-gray font-chinese text-lg">正在初始化系统...</p>
        </div>
      </AncientBookLayout>
    );
  }

  return (
    <AncientBookLayout title="管理员登录" subtitle="Administrator Login">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-crimson/10 border border-crimson text-crimson px-4 py-3 rounded-lg font-chinese">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-ink-gray mb-2 font-chinese">
              用户名
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-paper-white border-2 border-ink-gray/30 rounded-lg font-chinese text-ink-black focus:border-gold focus:outline-none transition-colors duration-300"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink-gray mb-2 font-chinese">
              密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-paper-white border-2 border-ink-gray/30 rounded-lg font-chinese text-ink-black focus:border-gold focus:outline-none transition-colors duration-300"
              placeholder="请输入密码"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold/20 border-2 border-gold text-gold px-6 py-3 rounded-lg font-chinese hover:bg-gold hover:text-paper-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-ink-gray hover:text-gold transition-colors duration-300 font-chinese"
          >
            ← 返回首页
          </button>
        </div>
      </div>
    </AncientBookLayout>
  );
}