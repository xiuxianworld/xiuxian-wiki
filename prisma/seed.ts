import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Get default admin configuration from environment variables
  const defaultAdminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  const defaultAdminRole = process.env.DEFAULT_ADMIN_ROLE || 'admin';

  console.log(`👤 Creating default admin user: ${defaultAdminUsername}`);

  // Create default admin user
  const hashedPassword = await bcrypt.hash(defaultAdminPassword, 12);
  
  const user = await prisma.user.upsert({
    where: { username: defaultAdminUsername },
    update: {
      // Update password and role if they differ
      password: hashedPassword,
      role: defaultAdminRole,
    },
    create: {
      username: defaultAdminUsername,
      password: hashedPassword,
      role: defaultAdminRole,
    },
  });

  console.log('✅ Created/Updated admin user:', user.username);

  // Sample spiritual roots
  const spiritualRoots = [
    {
      name: '五行灵根',
      type: '五行',
      grade: '中品',
      description: '最常见的灵根类型，包含金木水火土五种属性，修炼平衡但速度一般。',
      properties: '五行平衡，可修炼多种功法',
      rarity: 5,
    },
    {
      name: '天灵根',
      type: '纯属性',
      grade: '天品',
      description: '极其罕见的单属性灵根，修炼速度极快，但只能修炼对应属性功法。',
      properties: '纯净属性，修炼速度极快',
      rarity: 10,
    },
    {
      name: '变异灵根',
      type: '变异',
      grade: '极品',
      description: '由两种或多种属性融合而成的特殊灵根，拥有独特的修炼优势。',
      properties: '属性融合，拥有特殊能力',
      rarity: 8,
    }
  ];

  for (const root of spiritualRoots) {
    await prisma.spiritualRoot.upsert({
      where: { id: root.name }, // Use name as unique identifier for upsert
      update: {},
      create: root,
    });
  }

  // Sample cultivation realms
  const cultivationRealms = [
    {
      name: '炼气期',
      level: 1,
      stage: '初期',
      description: '修仙入门境界，开始吸收天地灵气，淬炼肉身。',
      requirements: '拥有灵根，学会基础吐纳术',
      benefits: '寿命延长至120年，身体素质大幅提升',
      lifespan: '120年',
    },
    {
      name: '筑基期',
      level: 2,
      stage: '初期',
      description: '在丹田内筑建灵力基础，为后续修炼奠定根基。',
      requirements: '炼气期大圆满，筑基丹或天地奇遇',
      benefits: '寿命延长至200年，可御器飞行',
      lifespan: '200年',
    },
    {
      name: '金丹期',
      level: 3,
      stage: '初期',
      description: '将筑基期的液态灵力凝聚成金丹，标志着修仙者的重大突破。',
      requirements: '筑基期大圆满，结丹机缘',
      benefits: '寿命延长至500年，法力深厚',
      lifespan: '500年',
    }
  ];

  for (const realm of cultivationRealms) {
    await prisma.cultivationRealm.upsert({
      where: { id: realm.name },
      update: {},
      create: realm,
    });
  }

  // Sample techniques
  const techniques = [
    {
      name: '九转玄功',
      type: '炼体',
      grade: '天阶',
      level: '高级',
      description: '传说中的炼体神功，共分九转，每一转都能带来脱胎换骨的变化。',
      effects: '大幅提升肉身强度，增强恢复能力',
      requirements: '炼气期以上，需要特殊体质',
      content: '第一转：炼皮，第二转：炼肉，第三转：炼筋...',
      drawbacks: '修炼过程极其痛苦，容易走火入魔',
    },
    {
      name: '太极真经',
      type: '心法',
      grade: '地阶',
      level: '中级',
      description: '道家传承的经典心法，讲究阴阳调和，刚柔并济。',
      effects: '修炼速度稳定，很少出现瓶颈',
      requirements: '悟性较高，需理解阴阳之道',
      content: '无极生太极，太极生两仪，两仪生四象...',
    }
  ];

  for (const technique of techniques) {
    await prisma.technique.upsert({
      where: { id: technique.name },
      update: {},
      create: technique,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });