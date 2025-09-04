# 修仙百科 Docker 管理命令
.PHONY: help build up down restart logs ps health clean dev prod

# 默认目标
help:
	@echo "修仙百科 Docker 管理命令"
	@echo "========================="
	@echo "build     - 构建 Docker 镜像"
	@echo "up        - 启动所有服务"
	@echo "down      - 停止所有服务"
	@echo "restart   - 重启所有服务"
	@echo "logs      - 查看日志"
	@echo "ps        - 查看服务状态"
	@echo "health    - 健康检查"
	@echo "clean     - 清理未使用的镜像和容器"
	@echo "dev       - 启动开发环境"
	@echo "prod      - 启动生产环境（包含 Nginx）"

# 构建镜像
build:
	@echo "🔨 构建 Docker 镜像..."
	docker-compose build --no-cache

# 启动服务
up:
	@echo "🚀 启动服务..."
	docker-compose up -d

# 停止服务
down:
	@echo "🛑 停止服务..."
	docker-compose down

# 重启服务
restart:
	@echo "🔄 重启服务..."
	docker-compose restart

# 查看日志
logs:
	@echo "📋 查看日志..."
	docker-compose logs -f

# 查看服务状态
ps:
	@echo "📊 服务状态..."
	docker-compose ps

# 健康检查
health:
	@echo "🏥 健康检查..."
	@curl -f http://localhost:3000/api/health || echo "❌ 健康检查失败"

# 清理
clean:
	@echo "🧹 清理未使用的资源..."
	docker system prune -f
	docker image prune -f

# 开发环境
dev:
	@echo "💻 启动开发环境..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 生产环境
prod:
	@echo "🌐 启动生产环境..."
	docker-compose --profile production up -d

# 完整部署
deploy:
	@echo "📦 执行完整部署..."
	./deploy.sh