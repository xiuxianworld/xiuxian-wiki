
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function setupAdmin() {
  console.log('🔧 修仙百科管理员设置工具');
  console.log('================================');
  
  try {
    // Get admin details
    const username = await question('请输入管理员用户名 (默认: admin): ') || 'admin';
    const password = await question('请输入管理员密码 (默认: admin123): ') || 'admin123';
    const role = await question('请输入管理员角色 (默认: admin): ') || 'admin';
    
    // Validate password strength
    if (password.length < 6) {
      console.error('❌ 密码长度至少需要6个字符');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create or update admin user
    const user = await prisma.user.upsert({
      where: { username },
      update: {
        password: hashedPassword,
        role,
        updatedAt: new Date(),
      },
      create: {
        username,
        password: hashedPassword,
        role,
      },
    });
    
    console.log('✅ 管理员账号设置成功!');
    console.log(`   用户名: ${user.username}`);
    console.log(`   角色: ${user.role}`);
    console.log(`   创建时间: ${user.createdAt.toLocaleString('zh-CN')}`);
    
    // Update environment file
    const envContent = `
# 默认管理员账号配置 (由 setup-admin 脚本生成)
DEFAULT_ADMIN_USERNAME="${username}"
DEFAULT_ADMIN_PASSWORD="${password}"
DEFAULT_ADMIN_ROLE="${role}"
`;
    
    console.log('');
    console.log('📝 建议将以下配置添加到您的 .env 文件中:');
    console.log(envContent);
    
  } catch (error) {
    console.error('❌ 设置管理员账号时出错:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('修仙百科管理员设置工具');
    console.log('');
    console.log('用法:');
    console.log('  npm run setup:admin           # 交互式设置管理员');
    console.log('  npm run setup:admin -- --env  # 从环境变量设置');
    console.log('');
    return;
  }
  
  if (args.includes('--env')) {
    // Setup from environment variables
    const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const role = process.env.DEFAULT_ADMIN_ROLE || 'admin';
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.upsert({
      where: { username },
      update: {
        password: hashedPassword,
        role,
        updatedAt: new Date(),
      },
      create: {
        username,
        password: hashedPassword,
        role,
      },
    });
    
    console.log('✅ 从环境变量设置管理员账号成功!');
    console.log(`   用户名: ${user.username}`);
    console.log(`   角色: ${user.role}`);
  } else {
    // Interactive setup
    await setupAdmin();
  }
}

main().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});