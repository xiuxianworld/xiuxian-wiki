# 修仙百科 (Cultivation Wiki)

一个水墨复古风格的修仙知识百科网站，使用 Next.js、TypeScript、Tailwind CSS 和 Prisma 构建。

## 功能特色

### 前台功能
- 🎨 **水墨复古风格设计** - 古代书籍样式的UI界面
- 📚 **九大知识类别** - 灵根、修行境界、修行类别、功法、丹药、符宝、灵兽、灵草、阵法
- 🔍 **智能搜索与筛选** - 支持关键词搜索和多条件筛选
- 📱 **响应式设计** - 适配各种设备屏幕
- ⚡ **快速加载** - 优化的性能和用户体验

### 后台管理
- 🔐 **安全认证** - JWT Token 身份验证
- ✏️ **完整CRUD操作** - 创建、查看、编辑、删除所有类别内容
- 📊 **数据统计** - 实时统计各类别数据概览
- 🎯 **直观界面** - 古风设计的管理界面
- 📤 **批量操作** - 批量导入、导出、删除功能
- 🔍 **智能搜索** - 管理界面内的搜索和筛选
- ✅ **表单验证** - 预定义选项和实时验证
- 👁️ **详情查看** - 完整的内容详情展示

## 技术栈

- **前端**: Next.js 14, React, TypeScript
- **样式**: Tailwind CSS, 自定义水墨风格
- **数据库**: SQLite (Prisma ORM)
- **认证**: JWT + bcryptjs
- **部署**: Vercel Ready

## 快速开始

### 方式一：容器部署（推荐）

项目同时支持 Docker 和 Podman 部署，脚本会自动检测可用的容器运行时。

#### 前提条件
**Docker 部署**:
- Docker 20.10+
- Docker Compose 2.0+

**Podman 部署**:
- Podman 3.0+
- podman-compose 或 docker-compose

#### 一键部署
```bash
# 克隆项目
git clone <repository-url>
cd xiuxian-wiki

# 自动检测并部署（优先使用 Podman）
./deploy.sh

# 明确指定使用 Podman
./deploy.sh --podman
```

#### Docker 手动部署
```bash
# 1. 创建必要目录
mkdir -p data ssl logs

# 2. 配置环境变量
cp .env.production.example .env.production
# 编辑 .env.production 文件，设置安全的 JWT 密钥

# 3. 构建和启动服务
docker-compose up -d --build

# 4. 查看服务状态
docker-compose ps
```

#### Podman 手动部署
```bash
# 1. 设置 Podman 环境
./podman-helper.sh setup

# 2. 使用 Podman Compose 部署
podman-compose -f podman-compose.yml up -d --build

# 3. 查看服务状态
podman ps
```

> 📋 **Podman 详细指南**: 查看 [PODMAN_DEPLOY.md](./PODMAN_DEPLOY.md) 获取完整的 Podman 部署文档，包括 rootless 配置、SELinux 设置和故障排除。

#### 开发环境
```bash
# Docker 开发环境
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Podman 开发环境
podman-compose -f podman-compose.yml up -d
```

### 方式二：本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 设置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，设置数据库URL和JWT密钥
```

### 3. 初始化数据库
```bash
# 生成Prisma客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init

# 填充示例数据
npm run db:seed
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看网站

## 管理后台功能

### 登录访问
- 直接访问: `http://localhost:3000/admin/login`
- 首页底部管理后台链接
- 默认账户: `admin` / `admin123`

### 管理员账号配置

项目支持通过环境变量配置默认管理员账号，提供灵活的账号管理方式。

#### 环境变量配置
在 `.env` 文件中设置以下变量：

```bash
# 默认管理员账号配置
DEFAULT_ADMIN_USERNAME="admin"          # 管理员用户名
DEFAULT_ADMIN_PASSWORD="admin123"       # 管理员密码
DEFAULT_ADMIN_ROLE="admin"              # 管理员角色

```

### 完整的内容管理

#### 1. 内容查看 👁️
- **列表视图**: 支持搜索、筛选、排序的数据表格
- **详情查看**: 完整的内容详情展示，包含所有字段信息
- **图片预览**: 支持图片内容的预览显示
- **统计信息**: 实时显示总数、搜索结果、选中项等统计

#### 2. 内容添加 ➕
- **智能表单**: 根据类别自动生成相应的表单字段
- **预定义选项**: 常用字段提供下拉选择（如品级、类型等）
- **实时验证**: 表单字段的实时验证和错误提示
- **图片支持**: 支持添加图片URL并实时预览
- **必填提示**: 清晰标识必填字段和可选字段

#### 3. 内容修改 ✏️
- **在线编辑**: 直接在管理界面编辑现有内容
- **保留数据**: 编辑时保留原有数据作为默认值
- **字段验证**: 修改时的完整字段验证
- **即时更新**: 修改后立即在列表中反映变化

#### 4. 内容删除 🗑️
- **单项删除**: 支持删除单个条目，有确认提示
- **批量删除**: 可选择多个条目进行批量删除
- **安全确认**: 删除操作需要用户确认，防止误操作
- **选择统计**: 实时显示已选择的条目数量

#### 5. 批量导入 📤
- **JSON格式**: 支持JSON数组格式的批量数据导入
- **格式检查**: 自动检查导入数据的格式正确性
- **批量处理**: 一次性导入多条数据记录
- **错误处理**: 导入失败时提供详细错误信息

#### 6. 数据导出 📥
- **完整导出**: 将当前类别的所有数据导出为JSON文件
- **标准格式**: 导出的数据可直接用于备份或迁移
- **文件下载**: 自动触发文件下载，文件名包含类别信息

### 管理界面特色

#### 🎨 **古风设计**
- 保持与前台一致的水墨复古风格
- 古代书籍样式的管理界面
- 优雅的中文字体和色彩搭配

#### 📊 **数据统计**
- 实时统计各类别的数据数量
- 管理首页显示总体概览
- 搜索结果和选择状态的即时反馈

#### 🔍 **智能搜索**
- 支持按名称、描述等字段搜索
- 实时搜索结果更新
- 搜索结果数量统计

#### 🔐 **安全保护**
- JWT身份认证保护所有写入操作
- 管理员权限验证
- 自动登录状态检查

## 项目结构

```
xiuxian-wiki/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # 管理后台页面
│   │   ├── api/               # API路由
│   │   ├── category/          # 类别详情页面
│   │   └── page.tsx           # 首页
│   ├── components/            # 可复用组件
│   │   ├── admin/             # 管理后台组件
│   │   ├── AncientBookLayout.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── ContentDetail.tsx
│   │   ├── ListView.tsx
│   │   └── SearchAndFilter.tsx
│   ├── lib/                   # 工具函数
│   │   ├── auth.ts            # 认证逻辑
│   │   ├── constants.ts       # 常量定义
│   │   ├── database.ts        # 数据库操作
│   │   └── prisma.ts          # Prisma客户端
│   ├── styles/                # 样式文件
│   └── types/                 # TypeScript类型定义
├── prisma/                    # 数据库配置
│   ├── schema.prisma          # 数据库模式
│   └── seed.ts                # 种子数据
└── public/                    # 静态资源
```

## 数据库模式

### 核心模型

1. **灵根 (SpiritualRoot)** - 修仙者的天赋根基
2. **修行境界 (CultivationRealm)** - 修仙道路上的等级
3. **修行类别 (CultivationType)** - 不同的修炼方向
4. **功法 (Technique)** - 修炼所需的心法秘籍
5. **丹药 (Pill)** - 辅助修炼的灵丹妙药
6. **符宝 (Treasure)** - 神奇的法器和符箓
7. **灵兽 (SpiritualBeast)** - 修仙界的各种灵兽
8. **灵草 (SpiritualHerb)** - 珍贵的天材地宝
9. **阵法 (Formation)** - 神秘的阵法禁制

### 用户系统
- **用户 (User)** - 管理员账户系统

## API文档

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取当前用户信息

### 内容接口
每个类别都有标准的CRUD接口：
- `GET /api/{category}` - 获取列表
- `POST /api/{category}` - 创建条目
- `GET /api/{category}/{id}` - 获取详情
- `PUT /api/{category}/{id}` - 更新条目
- `DELETE /api/{category}/{id}` - 删除条目

支持的类别：
- spiritualRoots, cultivationRealms, cultivationTypes
- techniques, pills, treasures
- spiritualBeasts, spiritualHerbs, formations

## 开发指南

### 添加新类别
1. 在 `prisma/schema.prisma` 中定义模型
2. 更新 `src/types/index.ts` 中的类型定义
3. 在 `src/lib/constants.ts` 中添加类别信息
4. 创建对应的API路由
5. 运行数据库迁移

### 自定义样式
- 修改 `tailwind.config.js` 中的主题配置
- 编辑 `src/styles/globals.css` 中的全局样式
- 组件中使用 Tailwind CSS 类名

### 部署到生产环境

#### 环境配置
1. 复制环境配置文件：
```bash
cp .env.production .env.local
```

2. 编辑环境变量：
```bash
# 修改 JWT 密钥（至少 32 位字符）
JWT_SECRET="your-super-secure-jwt-secret-key-here"

# 设置生产域名
NEXTAUTH_URL="https://your-domain.com"

# 配置端口
PORT=3000
NGINX_PORT=80
NGINX_SSL_PORT=443
```

#### SSL 证书配置
如需启用 HTTPS，请将 SSL 证书放入 `ssl/` 目录：
```bash
ssl/
├── cert.pem    # SSL 证书
└── key.pem     # 私钥
```

#### 服务器要求
- **CPU**: 最低 1 核，推荐 2 核以上
- **内存**: 最低 1GB，推荐 2GB 以上
- **存储**: 最低 5GB 可用空间
- **网络**: 外网 IP 和域名（可选）
1. 设置生产环境变量
2. 构建应用：`npm run build`
3. 启动生产服务器：`npm start`

## Docker 部署命令

### 基本命令
```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f xiuxian-wiki

# 重启服务
docker-compose restart

# 重新构建和启动
docker-compose up -d --build
```

### 数据管理
```bash
# 备份数据库
docker-compose exec xiuxian-wiki cp /app/data/production.db /app/data/backup.db

# 进入容器
docker-compose exec xiuxian-wiki sh

# 查看数据库状态
docker-compose exec xiuxian-wiki npx prisma db pull
```

### 生产环境部署
```bash
# 使用 Nginx 反向代理
docker-compose --profile production up -d

# 仅启动应用，不启动 Nginx
docker-compose up -d xiuxian-wiki
```

### 日志和监控
```bash
# 实时查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs xiuxian-wiki

# 查看近100行日志
docker-compose logs --tail=100 xiuxian-wiki

# 健康检查
curl http://localhost:3000/api/health
```

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
npm run lint             # 代码检查

# 数据库
npm run db:seed          # 填充示例数据
npm run db:reset         # 重置数据库
npx prisma studio        # 打开数据库管理界面
npx prisma migrate dev   # 运行数据库迁移
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**探索仙道奥秘，传承修真智慧** ✨