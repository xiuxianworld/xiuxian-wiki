'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/admin/AuthContext';
import AncientBookLayout from '@/components/AncientBookLayout';
import AdminForm from '@/components/admin/AdminForm';
import { CATEGORIES, FIELD_DEFINITIONS } from '@/lib/constants';
import { CategoryType } from '@/types';

export default function AdminCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const categoryId = params.category as CategoryType;
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  const [viewingItem, setViewingItem] = useState<any>(null);

  const category = CATEGORIES.find(cat => cat.key === categoryId);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
      return;
    }
    
    if (category) {
      fetchItems();
    }
  }, [categoryId, category, user, authLoading, router]);

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

  const handleCreate = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/${categoryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await fetchItems();
        setShowForm(false);
        alert('创建成功！');
      } else {
        const error = await response.json();
        alert(`创建失败: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating item:', error);
      alert('创建失败，请重试');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/${categoryId}/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await fetchItems();
        setShowForm(false);
        setEditingItem(null);
        alert('更新成功！');
      } else {
        const error = await response.json();
        alert(`更新失败: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('更新失败，请重试');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个条目吗？此操作不可撤销。')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/${categoryId}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchItems();
        alert('删除成功！');
      } else {
        const error = await response.json();
        alert(`删除失败: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('删除失败，请重试');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      alert('请先选择要删除的条目');
      return;
    }

    if (!confirm(`确定要删除选中的 ${selectedItems.size} 个条目吗？此操作不可撤销。`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const deletePromises = Array.from(selectedItems).map(id =>
        fetch(`/api/${categoryId}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );

      await Promise.all(deletePromises);
      await fetchItems();
      setSelectedItems(new Set());
      alert('批量删除成功！');
    } catch (error) {
      console.error('Error in bulk delete:', error);
      alert('批量删除失败，请重试');
    }
  };

  const handleImport = async () => {
    try {
      const data = JSON.parse(importData);
      if (!Array.isArray(data)) {
        alert('导入数据格式错误，请使用JSON数组格式');
        return;
      }

      const token = localStorage.getItem('token');
      const createPromises = data.map(item =>
        fetch(`/api/${categoryId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(item)
        })
      );

      await Promise.all(createPromises);
      await fetchItems();
      setShowImport(false);
      setImportData('');
      alert(`成功导入 ${data.length} 条数据！`);
    } catch (error) {
      console.error('Error importing data:', error);
      alert('导入失败，请检查数据格式');
    }
  };

  const handleExport = () => {
    const exportData = JSON.stringify(items, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${categoryId}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  if (authLoading || !user) {
    return (
      <AncientBookLayout title="验证中...">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-ink-gray font-chinese text-lg">正在验证权限...</p>
        </div>
      </AncientBookLayout>
    );
  }

  if (!category) {
    return (
      <AncientBookLayout title="页面未找到">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-ink-gray font-chinese text-lg">未找到该类别</p>
        </div>
      </AncientBookLayout>
    );
  }

  // Detail view modal
  if (viewingItem) {
    const fields = FIELD_DEFINITIONS[categoryId] || [];
    return (
      <AncientBookLayout 
        title={viewingItem.name}
        subtitle={`${category.chineseName} 详情`}
      >
        <div className="mb-6">
          <button
            onClick={() => setViewingItem(null)}
            className="text-gold hover:text-crimson transition-colors duration-300 font-chinese"
          >
            ← 返回列表
          </button>
        </div>
        
        <div className="bg-paper-white border-2 border-ink-gray/30 rounded-lg p-8">
          {/* Image */}
          {viewingItem.imageUrl && (
            <div className="text-center mb-6">
              <img 
                src={viewingItem.imageUrl} 
                alt={viewingItem.name}
                className="max-w-md mx-auto rounded border-2 border-gold/30"
              />
            </div>
          )}
          
          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => {
              const value = viewingItem[field.key];
              if (!value) return null;
              
              return (
                <div key={field.key} className={field.type === 'long-text' ? 'md:col-span-2' : ''}>
                  <div className="border-l-4 border-gold pl-4 py-2">
                    <dt className="text-sm font-medium text-ink-gray uppercase tracking-wider mb-1">
                      {field.label}
                    </dt>
                    <dd className="text-base">
                      {field.type === 'badge' ? (
                        <span className="inline-block bg-gold/20 border border-gold text-gold px-3 py-1 rounded-full text-sm font-medium">
                          {value}
                        </span>
                      ) : field.type === 'number' ? (
                        <span className="text-crimson font-bold text-lg">
                          {value}
                        </span>
                      ) : field.type === 'long-text' ? (
                        <div className="prose prose-lg font-chinese text-ink-black leading-relaxed">
                          {value.split('\n').map((line: string, index: number) => (
                            <p key={index} className="mb-2">{line}</p>
                          ))}
                        </div>
                      ) : (
                        <span className="font-chinese text-ink-black">
                          {value}
                        </span>
                      )}
                    </dd>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-ink-gray/20">
            <button
              onClick={() => {
                setEditingItem(viewingItem);
                setViewingItem(null);
                setShowForm(true);
              }}
              className="bg-gold/20 border border-gold text-gold px-4 py-2 rounded-lg font-chinese hover:bg-gold hover:text-paper-white transition-colors duration-300"
            >
              ✏️ 编辑条目
            </button>
            <button
              onClick={() => {
                setViewingItem(null);
                handleDelete(viewingItem.id);
              }}
              className="bg-crimson/20 border border-crimson text-crimson px-4 py-2 rounded-lg font-chinese hover:bg-crimson hover:text-paper-white transition-colors duration-300"
            >
              🗑️ 删除条目
            </button>
          </div>
        </div>
      </AncientBookLayout>
    );
  }

  // Form view
  if (showForm) {
    return (
      <AncientBookLayout 
        title={editingItem ? '编辑条目' : '新增条目'}
        subtitle={`${category.chineseName} 管理`}
      >
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            className="text-gold hover:text-crimson transition-colors duration-300 font-chinese"
          >
            ← 返回列表
          </button>
        </div>
        
        <AdminForm
          category={categoryId}
          item={editingItem}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      </AncientBookLayout>
    );
  }

  return (
    <AncientBookLayout 
      title={`${category.chineseName}管理`}
      subtitle={`${category.name} Administration`}
    >
      {/* Header Actions */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gold hover:text-crimson transition-colors duration-300 font-chinese"
          >
            ← 返回管理首页
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gold/20 border border-gold text-gold px-4 py-2 rounded-lg font-chinese hover:bg-gold hover:text-paper-white transition-colors duration-300"
          >
            ➕ 新增条目
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="bg-jade/20 border border-jade text-jade px-4 py-2 rounded-lg font-chinese hover:bg-jade hover:text-paper-white transition-colors duration-300"
          >
            📤 批量导入
          </button>
          <button
            onClick={handleExport}
            className="bg-ink-gray/20 border border-ink-gray text-ink-gray px-4 py-2 rounded-lg font-chinese hover:bg-ink-gray hover:text-paper-white transition-colors duration-300"
          >
            📥 导出数据
          </button>
          {selectedItems.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-crimson/20 border border-crimson text-crimson px-4 py-2 rounded-lg font-chinese hover:bg-crimson hover:text-paper-white transition-colors duration-300"
            >
              🗑️ 批量删除 ({selectedItems.size})
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`搜索${category.chineseName}...`}
          className="w-full px-4 py-3 bg-paper-white border-2 border-ink-gray/30 rounded-lg font-chinese text-ink-black focus:border-gold focus:outline-none transition-colors duration-300"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gold/10 border border-gold rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gold">{items.length}</div>
          <div className="text-sm text-ink-gray font-chinese">总条目数</div>
        </div>
        <div className="bg-jade/10 border border-jade rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-jade">{filteredItems.length}</div>
          <div className="text-sm text-ink-gray font-chinese">搜索结果</div>
        </div>
        <div className="bg-crimson/10 border border-crimson rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-crimson">{selectedItems.size}</div>
          <div className="text-sm text-ink-gray font-chinese">已选择</div>
        </div>
        <div className="bg-ink-gray/10 border border-ink-gray rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-ink-gray">
            {items.filter(item => item.imageUrl).length}
          </div>
          <div className="text-sm text-ink-gray font-chinese">有图片</div>
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-paper-white border-2 border-gold rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold calligraphy text-ink-black mb-4">
              批量导入{category.chineseName}
            </h3>
            <p className="text-ink-gray font-chinese mb-4">
              请输入JSON格式的数据数组。每个对象应包含所需的字段。
            </p>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full h-64 px-4 py-3 bg-paper-white border-2 border-ink-gray/30 rounded-lg font-mono text-sm text-ink-black focus:border-gold focus:outline-none transition-colors duration-300"
              placeholder={`[
  {
    "name": "示例名称",
    "description": "示例描述",
    // 其他必要字段...
  }
]`}
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleImport}
                className="flex-1 bg-jade/20 border border-jade text-jade px-4 py-2 rounded-lg font-chinese hover:bg-jade hover:text-paper-white transition-colors duration-300"
              >
                确认导入
              </button>
              <button
                onClick={() => {
                  setShowImport(false);
                  setImportData('');
                }}
                className="flex-1 bg-ink-gray/20 border border-ink-gray text-ink-gray px-4 py-2 rounded-lg font-chinese hover:bg-ink-gray hover:text-paper-white transition-colors duration-300"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-ink-gray font-chinese">正在加载数据...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-ink-gray font-chinese text-lg">
            {searchQuery ? '没有找到匹配的条目' : `暂无${category.chineseName}数据`}
          </p>
        </div>
      ) : (
        <div className="bg-paper-white border-2 border-ink-gray/30 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-ink-gray/5 border-b border-ink-gray/20 p-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4"
                />
                <span className="font-chinese text-ink-gray">全选</span>
              </label>
              <span className="font-chinese text-ink-gray">
                共 {filteredItems.length} 条记录
              </span>
            </div>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-ink-gray/20">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 hover:bg-ink-gray/5 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelection(item.id)}
                    className="w-4 h-4 mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-ink-black mb-2">
                          {item.name}
                        </h3>
                        <p className="text-ink-gray font-chinese text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.type && (
                            <span className="bg-gold/20 border border-gold text-gold px-2 py-1 rounded text-xs">
                              {item.type}
                            </span>
                          )}
                          {item.grade && (
                            <span className="bg-jade/20 border border-jade text-jade px-2 py-1 rounded text-xs">
                              {item.grade}
                            </span>
                          )}
                          {item.level && (
                            <span className="bg-crimson/20 border border-crimson text-crimson px-2 py-1 rounded text-xs">
                              {item.level}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-ink-gray/60">
                          创建时间: {new Date(item.createdAt).toLocaleString('zh-CN')}
                        </div>
                      </div>
                      
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded border border-ink-gray/20 ml-4"
                        />
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setViewingItem(item)}
                        className="bg-ink-gray/20 border border-ink-gray text-ink-gray px-3 py-1 rounded text-sm font-chinese hover:bg-ink-gray hover:text-paper-white transition-colors duration-300"
                      >
                        👁️ 查看详情
                      </button>
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowForm(true);
                        }}
                        className="bg-gold/20 border border-gold text-gold px-3 py-1 rounded text-sm font-chinese hover:bg-gold hover:text-paper-white transition-colors duration-300"
                      >
                        ✏️ 编辑
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-crimson/20 border border-crimson text-crimson px-3 py-1 rounded text-sm font-chinese hover:bg-crimson hover:text-paper-white transition-colors duration-300"
                      >
                        🗑️ 删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AncientBookLayout>
  );
}