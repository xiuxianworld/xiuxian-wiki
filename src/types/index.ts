export interface SpiritualRoot {
  id: string;
  name: string;
  type: string;
  grade: string;
  description: string;
  properties: string;
  rarity: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CultivationRealm {
  id: string;
  name: string;
  level: number;
  stage: string;
  description: string;
  requirements: string;
  benefits: string;
  lifespan: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CultivationType {
  id: string;
  name: string;
  category: string;
  description: string;
  characteristics: string;
  advantages: string;
  disadvantages: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Technique {
  id: string;
  name: string;
  type: string;
  grade: string;
  level: string;
  description: string;
  effects: string;
  requirements: string;
  drawbacks?: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pill {
  id: string;
  name: string;
  type: string;
  grade: string;
  description: string;
  effects: string;
  ingredients: string;
  refinement: string;
  sideEffects?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Treasure {
  id: string;
  name: string;
  type: string;
  grade: string;
  description: string;
  abilities: string;
  usage: string;
  materials: string;
  restrictions?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpiritualBeast {
  id: string;
  name: string;
  species: string;
  level: string;
  type: string;
  description: string;
  abilities: string;
  habitat: string;
  behavior: string;
  weakness?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpiritualHerb {
  id: string;
  name: string;
  type: string;
  grade: string;
  description: string;
  effects: string;
  growthTime: string;
  habitat: string;
  harvestMethod: string;
  preservation: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Formation {
  id: string;
  name: string;
  type: string;
  grade: string;
  description: string;
  effects: string;
  materials: string;
  arrangement: string;
  weaknesses?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryType = 
  | 'spiritualRoots'
  | 'cultivationRealms'
  | 'cultivationTypes'
  | 'techniques'
  | 'pills'
  | 'treasures'
  | 'spiritualBeasts'
  | 'spiritualHerbs'
  | 'formations';

export interface CategoryInfo {
  key: CategoryType;
  name: string;
  chineseName: string;
  description: string;
  icon: string;
}