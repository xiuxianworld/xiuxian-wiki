import { prisma } from './prisma';
import { CategoryType } from '@/types';

// Generic database operations for all categories
export class DatabaseService {
  private getModel(category: CategoryType): any {
    const modelMap = {
      spiritualRoots: prisma.spiritualRoot,
      cultivationRealms: prisma.cultivationRealm,
      cultivationTypes: prisma.cultivationType,
      techniques: prisma.technique,
      pills: prisma.pill,
      treasures: prisma.treasure,
      spiritualBeasts: prisma.spiritualBeast,
      spiritualHerbs: prisma.spiritualHerb,
      formations: prisma.formation,
    };
    
    return modelMap[category];
  }

  async getAll(category: CategoryType) {
    const model = this.getModel(category);
    return await model.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getById(category: CategoryType, id: string) {
    const model = this.getModel(category);
    return await model.findUnique({
      where: { id }
    });
  }

  async create(category: CategoryType, data: any) {
    const model = this.getModel(category);
    return await model.create({
      data
    });
  }

  async update(category: CategoryType, id: string, data: any) {
    const model = this.getModel(category);
    return await model.update({
      where: { id },
      data
    });
  }

  async delete(category: CategoryType, id: string) {
    const model = this.getModel(category);
    return await model.delete({
      where: { id }
    });
  }

  async search(category: CategoryType, query: string) {
    const model = this.getModel(category);
    return await model.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { type: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const db = new DatabaseService();