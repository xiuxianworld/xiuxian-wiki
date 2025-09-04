'use client';

import React, { useState } from 'react';
import { FIELD_DEFINITIONS } from '@/lib/constants';
import { CategoryType } from '@/types';

interface AdminFormProps {
  category: CategoryType;
  item?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// Predefined options for select fields
const FIELD_OPTIONS = {
  // Spiritual Roots
  spiritualRootType: ['金', '木', '水', '火', '土', '雷', '冰', '风', '五行', '变异'],
  spiritualRootGrade: ['下品', '中品', '上品', '极品', '天品'],
  
  // Cultivation Realms
  cultivationStage: ['初期', '中期', '后期', '大圆满'],
  
  // Cultivation Types
  cultivationCategory: ['体修', '法修', '剑修', '丹修', '器修', '阵修', '符修'],
  
  // Techniques
  techniqueType: ['攻击', '防御', '身法', '心法', '辅助', '特殊'],
  techniqueGrade: ['黄阶', '玄阶', '地阶', '天阶'],
  techniqueLevel: ['初级', '中级', '高级', '顶级'],
  
  // Pills
  pillType: ['疗伤', '增进修为', '辅助突破', '解毒', '补充灵力', '延寿'],
  pillGrade: ['一品', '二品', '三品', '四品', '五品', '六品', '七品', '八品', '九品'],
  
  // Treasures
  treasureType: ['符箓', '法器', '灵器', '宝器', '法宝', '先天灵宝'],
  treasureGrade: ['下品', '中品', '上品', '极品', '绝品'],
  
  // Spiritual Beasts
  beastLevel: ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶'],
  beastType: ['攻击型', '防御型', '辅助型', '速度型', '特殊型'],
  
  // Spiritual Herbs
  herbType: ['药草', '毒草', '灵果', '仙花', '神木'],
  herbGrade: ['普通', '灵级', '宝级', '王级', '帝级'],
  
  // Formations
  formationType: ['攻击阵', '防御阵', '迷阵', '聚灵阵', '传送阵', '禁制阵'],
  formationGrade: ['一级', '二级', '三级', '四级', '五级', '六级', '七级', '八级', '九级']
};

export default function AdminForm({ 
  category, 
  item, 
  onSubmit, 
  onCancel, 
  loading = false 
}: AdminFormProps) {
  const [formData, setFormData] = useState(item || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fields = FIELD_DEFINITIONS[category] || [];

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate required name field
    if (!formData.name?.trim()) {
      newErrors.name = '名称不能为空';
    }
    
    // Validate required fields for each category
    fields.forEach(field => {
      if (field.key !== 'name' && field.key !== 'imageUrl' && !formData[field.key]?.toString().trim()) {
        newErrors[field.key] = `${field.label}不能为空`;
      }
    });
    
    // Validate image URL format if provided
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = '请输入有效的图片URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
  };

  const getFieldOptions = (field: typeof fields[0]) => {
    const key = `${category}${field.key.charAt(0).toUpperCase() + field.key.slice(1)}` as keyof typeof FIELD_OPTIONS;
    return FIELD_OPTIONS[key] || FIELD_OPTIONS[field.key as keyof typeof FIELD_OPTIONS];
  };

  const renderField = (field: typeof fields[0]) => {
    const value = formData[field.key] || '';
    const options = getFieldOptions(field);
    const hasError = errors[field.key];

    // Select field for predefined options
    if (options && (field.key === 'type' || field.key === 'grade' || field.key === 'level' || field.key === 'stage' || field.key === 'category')) {
      return (
        <div>
          <select
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className={`w-full px-4 py-3 bg-paper-white border-2 rounded-lg font-chinese text-ink-black focus:outline-none transition-colors duration-300 ${
              hasError ? 'border-crimson' : 'border-ink-gray/30 focus:border-gold'
            }`}
          >
            <option value="">请选择{field.label}</option>
            {options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {hasError && (
            <p className="mt-1 text-sm text-crimson font-chinese">{hasError}</p>
          )}
        </div>
      );
    }

    // Long text area
    if (field.type === 'long-text') {
      return (
        <div>
          <textarea
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className={`w-full px-4 py-3 bg-paper-white border-2 rounded-lg font-chinese text-ink-black focus:outline-none transition-colors duration-300 min-h-[120px] resize-y ${
              hasError ? 'border-crimson' : 'border-ink-gray/30 focus:border-gold'
            }`}
            placeholder={`请输入${field.label}`}
          />
          {hasError && (
            <p className="mt-1 text-sm text-crimson font-chinese">{hasError}</p>
          )}
        </div>
      );
    }

    // Number input
    if (field.type === 'number') {
      return (
        <div>
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.key, Number(e.target.value))}
            min="1"
            max={field.key === 'rarity' ? '10' : undefined}
            className={`w-full px-4 py-3 bg-paper-white border-2 rounded-lg font-chinese text-ink-black focus:outline-none transition-colors duration-300 ${
              hasError ? 'border-crimson' : 'border-ink-gray/30 focus:border-gold'
            }`}
            placeholder={`请输入${field.label}`}
          />
          {field.key === 'rarity' && (
            <p className="mt-1 text-xs text-ink-gray font-chinese">稀有度范围：1-10（10为最稀有）</p>
          )}
          {hasError && (
            <p className="mt-1 text-sm text-crimson font-chinese">{hasError}</p>
          )}
        </div>
      );
    }

    // Default text input
    return (
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className={`w-full px-4 py-3 bg-paper-white border-2 rounded-lg font-chinese text-ink-black focus:outline-none transition-colors duration-300 ${
            hasError ? 'border-crimson' : 'border-ink-gray/30 focus:border-gold'
          }`}
          placeholder={`请输入${field.label}`}
        />
        {hasError && (
          <p className="mt-1 text-sm text-crimson font-chinese">{hasError}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name field (always required and first) */}
        <div>
          <label className="block text-sm font-medium text-ink-gray mb-2 font-chinese">
            名称 *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className={`w-full px-4 py-3 bg-paper-white border-2 rounded-lg font-chinese text-ink-black focus:outline-none transition-colors duration-300 ${
              errors.name ? 'border-crimson' : 'border-ink-gray/30 focus:border-gold'
            }`}
            placeholder="请输入名称"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-crimson font-chinese">{errors.name}</p>
          )}
        </div>

        {/* Dynamic fields based on category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => {
            if (field.key === 'name') return null; // Skip name as it's already rendered
            
            return (
              <div key={field.key} className={field.type === 'long-text' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-ink-gray mb-2 font-chinese">
                  {field.label} *
                </label>
                {renderField(field)}
              </div>
            );
          })}
        </div>

        {/* Image URL field */}
        <div>
          <label className="block text-sm font-medium text-ink-gray mb-2 font-chinese">
            图片链接
          </label>
          <input
            type="url"
            value={formData.imageUrl || ''}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            className={`w-full px-4 py-3 bg-paper-white border-2 rounded-lg font-chinese text-ink-black focus:outline-none transition-colors duration-300 ${
              errors.imageUrl ? 'border-crimson' : 'border-ink-gray/30 focus:border-gold'
            }`}
            placeholder="请输入图片URL（可选）"
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-crimson font-chinese">{errors.imageUrl}</p>
          )}
          {formData.imageUrl && isValidUrl(formData.imageUrl) && (
            <div className="mt-2">
              <img 
                src={formData.imageUrl} 
                alt="预览" 
                className="max-w-xs h-32 object-cover rounded border border-ink-gray/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4 pt-6 border-t border-ink-gray/20">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gold/20 border-2 border-gold text-gold px-6 py-3 rounded-lg font-chinese hover:bg-gold hover:text-paper-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '保存中...' : (item ? '✅ 更新条目' : '➕ 创建条目')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-ink-gray/20 border-2 border-ink-gray text-ink-gray px-6 py-3 rounded-lg font-chinese hover:bg-ink-gray hover:text-paper-white transition-colors duration-300 disabled:opacity-50"
          >
            ❌ 取消
          </button>
        </div>
      </form>
    </div>
  );
}