#!/bin/sh

echo "🔧 初始化修仙百科数据库..."

# 检查数据库是否已存在
if [ ! -f "/app/data/production.db" ]; then
    echo "📦 创建新数据库..."
    
    # 设置数据库 URL
    export DATABASE_URL="file:/app/data/production.db"
    
    # 运行数据库迁移
    echo "🔄 运行数据库迁移..."
    npx prisma migrate deploy
    
    # 检查迁移是否成功
    if [ $? -eq 0 ]; then
        echo "✅ 数据库迁移成功"
        
        # 运行种子数据
        echo "🌱 填充初始数据..."
        npm run db:seed
        
        if [ $? -eq 0 ]; then
            echo "✅ 初始数据填充成功"
        else
            echo "❌ 初始数据填充失败"
            exit 1
        fi
    else
        echo "❌ 数据库迁移失败"
        exit 1
    fi
    
    echo "🎉 数据库初始化完成!"
else
    echo "ℹ️  数据库已存在，跳过初始化"
    
    # 运行待处理的迁移
    export DATABASE_URL="file:/app/data/production.db"
    echo "🔄 检查待处理的迁移..."
    npx prisma migrate deploy
fi

echo "✨ 数据库准备就绪!"