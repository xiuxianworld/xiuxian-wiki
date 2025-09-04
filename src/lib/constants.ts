import { CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  {
    key: 'spiritualRoots',
    name: 'Spiritual Roots',
    chineseName: '灵根',
    description: '修仙者天赋根基，决定修炼速度与潜力',
    icon: '🌿'
  },
  {
    key: 'cultivationRealms',
    name: 'Cultivation Realms',
    chineseName: '修行境界',
    description: '修仙道路上的各个境界等级',
    icon: '⛰️'
  },
  {
    key: 'cultivationTypes',
    name: 'Cultivation Types',
    chineseName: '修行类别',
    description: '不同的修炼方向与道路选择',
    icon: '🗡️'
  },
  {
    key: 'techniques',
    name: 'Techniques',
    chineseName: '功法',
    description: '修炼所需的心法秘籍与招式',
    icon: '📜'
  },
  {
    key: 'pills',
    name: 'Pills & Elixirs',
    chineseName: '丹药',
    description: '辅助修炼的各种灵丹妙药',
    icon: '💊'
  },
  {
    key: 'treasures',
    name: 'Treasures',
    chineseName: '符宝',
    description: '神奇的法器宝物与符箓',
    icon: '⚔️'
  },
  {
    key: 'spiritualBeasts',
    name: 'Spiritual Beasts',
    chineseName: '灵兽',
    description: '修仙界中的各种灵兽妖怪',
    icon: '🐉'
  },
  {
    key: 'spiritualHerbs',
    name: 'Spiritual Herbs',
    chineseName: '灵草',
    description: '珍贵的天材地宝与灵草仙药',
    icon: '🌱'
  },
  {
    key: 'formations',
    name: 'Formations',
    chineseName: '阵法',
    description: '神秘的阵法禁制与布阵之道',
    icon: '🔮'
  }
];

export const FIELD_DEFINITIONS = {
  spiritualRoots: [
    { key: 'type', label: '灵根类型', type: 'badge' as const },
    { key: 'grade', label: '品级', type: 'badge' as const },
    { key: 'rarity', label: '稀有度', type: 'number' as const },
    { key: 'properties', label: '特性', type: 'text' as const },
    { key: 'description', label: '详细描述', type: 'long-text' as const }
  ],
  cultivationRealms: [
    { key: 'level', label: '境界等级', type: 'number' as const },
    { key: 'stage', label: '阶段', type: 'badge' as const },
    { key: 'lifespan', label: '寿命', type: 'text' as const },
    { key: 'requirements', label: '突破要求', type: 'long-text' as const },
    { key: 'benefits', label: '境界益处', type: 'long-text' as const },
    { key: 'description', label: '详细描述', type: 'long-text' as const }
  ],
  cultivationTypes: [
    { key: 'category', label: '修炼类别', type: 'badge' as const },
    { key: 'characteristics', label: '特点', type: 'long-text' as const },
    { key: 'advantages', label: '优势', type: 'long-text' as const },
    { key: 'disadvantages', label: '劣势', type: 'long-text' as const },
    { key: 'description', label: '详细描述', type: 'long-text' as const }
  ],
  techniques: [
    { key: 'type', label: '功法类型', type: 'badge' as const },
    { key: 'grade', label: '品级', type: 'badge' as const },
    { key: 'level', label: '等级', type: 'badge' as const },
    { key: 'effects', label: '修炼效果', type: 'long-text' as const },
    { key: 'requirements', label: '修炼要求', type: 'long-text' as const },
    { key: 'drawbacks', label: '副作用', type: 'text' as const },
    { key: 'content', label: '功法内容', type: 'long-text' as const },
    { key: 'description', label: '详细描述', type: 'long-text' as const }
  ],
  pills: [
    { key: 'type', label: '丹药类型', type: 'badge' as const },
    { key: 'grade', label: '品级', type: 'badge' as const },
    { key: 'effects', label: '药效', type: 'long-text' as const },
    { key: 'ingredients', label: '主要材料', type: 'text' as const },
    { key: 'refinement', label: '炼制方法', type: 'long-text' as const },
    { key: 'sideEffects', label: '副作用', type: 'text' as const },
    { key: 'description', label: '详细描述', type: 'long-text' as const }
  ],
  treasures: [
    { key: 'type', label: '宝物类型', type: 'badge' as const },
    { key: 'grade', label: '品级', type: 'badge' as const },
    { key: 'abilities', label: '能力', type: 'long-text' as const },
    { key: 'usage', label: '使用方法', type: 'long-text' as const },
    { key: 'materials', label: '制作材料', type: 'text' as const },
    { key: 'restrictions', label: '使用限制', type: 'text' as const },
    { key: 'description', label: '详细描述', type: 'long-text' as const }
  ],
  spiritualBeasts: [
    { key: 'species', label: '种族', type: 'badge' as const },
    { key: 'level', label: '等级', type: 'badge' as const },
    { key: 'type', label: '类型', type: 'badge' as const },
    { key: 'abilities', label: '天赋技能', type: 'long-text' as const },
    { key: 'habitat', label: '栖息地', type: 'text' as const },
    { key: 'behavior', label: '习性', type: 'long-text' as const },
    { key: 'weakness', label: '弱点', type: 'text' as const },
    { key: 'description', label: '详细描述', type: 'long-text' as const }
  ],
  spiritualHerbs: [
    { key: 'type', label: '草药类型', type: 'badge' as const },
    { key: 'grade', label: '品级', type: 'badge' as const },
    { key: 'effects', label: '功效', type: 'long-text' as const },
    { key: 'growthTime', label: '生长周期', type: 'text' as const },
    { key: 'habitat', label: '生长环境', type: 'text' as const },
    { key: 'harvestMethod', label: '采集方法', type: 'text' as const },
    { key: 'preservation', label: '保存方法', type: 'text' as const },
    { key: 'description', label: '详细描述', type: 'long-text' as const }
  ],
  formations: [
    { key: 'type', label: '阵法类型', type: 'badge' as const },
    { key: 'grade', label: '品级', type: 'badge' as const },
    { key: 'effects', label: '阵法效果', type: 'long-text' as const },
    { key: 'materials', label: '布阵材料', type: 'text' as const },
    { key: 'arrangement', label: '布阵方法', type: 'long-text' as const },
    { key: 'weaknesses', label: '破阵方法', type: 'text' as const },
    { key: 'description', label: '详细描述', type: 'long-text' as const }
  ]
};