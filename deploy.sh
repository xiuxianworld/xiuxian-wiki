#!/bin/bash

# 修仙百科部署脚本
set -e

echo "🚀 开始部署修仙百科..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 全局变量
CONTAINER_RUNTIME=""
COMPOSE_CMD=""

# 日志函数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检测容器运行时
detect_container_runtime() {
    log_info "检测容器运行时..."
    
    if command -v podman &> /dev/null; then
        CONTAINER_RUNTIME="podman"
        if command -v podman-compose &> /dev/null; then
            COMPOSE_CMD="podman-compose"
        elif command -v docker-compose &> /dev/null; then
            COMPOSE_CMD="docker-compose"
            log_warning "使用 docker-compose 与 Podman，建议安装 podman-compose"
        else
            log_error "未找到兼容的 Compose 工具，请安装 podman-compose 或 docker-compose"
            exit 1
        fi
        log_success "检测到 Podman 运行时"
    elif command -v docker &> /dev/null; then
        CONTAINER_RUNTIME="docker"
        if command -v docker-compose &> /dev/null; then
            COMPOSE_CMD="docker-compose"
        elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
            COMPOSE_CMD="docker compose"
        else
            log_error "Docker Compose 未安装或未在 PATH 中"
            exit 1
        fi
        log_success "检测到 Docker 运行时"
    else
        log_error "未找到容器运行时，请安装 Docker 或 Podman"
        exit 1
    fi
    
    log_info "使用容器运行时: $CONTAINER_RUNTIME"
    log_info "使用 Compose 命令: $COMPOSE_CMD"
}

# 检查系统要求
check_requirements() {
    log_info "检查系统要求..."
    
    detect_container_runtime
    
    # 检查 Podman 特定要求
    if [ "$CONTAINER_RUNTIME" = "podman" ]; then
        # 运行 Podman 环境检查
        if [ -f "./podman-helper.sh" ]; then
            log_info "使用 Podman 助手进行环境检查..."
            ./podman-helper.sh check
        else
            # 内置检查
            if [ "$(id -u)" -ne 0 ]; then
                log_info "使用 Podman rootless 模式"
                # 确保用户命名空间配置正确
                if [ ! -f "/etc/subuid" ] || ! grep -q "$(id -un)" /etc/subuid; then
                    log_warning "Podman rootless 模式可能需要额外配置，请参考 Podman 文档"
                fi
            fi
        fi
    fi
    
    log_success "系统要求检查通过"
}

# 创建必要的目录
create_directories() {
    log_info "创建必要的目录..."
    
    mkdir -p data
    mkdir -p ssl
    mkdir -p logs
    
    log_success "目录创建完成"
}

# 检查环境配置
check_env() {
    log_info "检查环境配置..."
    
    # 为 Podman 设置特殊环境
    if [ "$CONTAINER_RUNTIME" = "podman" ]; then
        if [ -f "./podman-helper.sh" ]; then
            log_info "设置 Podman 专用环境..."
            ./podman-helper.sh setup
        else
            # 手动设置 Podman 环境
            export PODMAN_UID=$(id -u)
            export PODMAN_GID=$(id -g)
            
            if [ -f ".env.podman" ]; then
                log_info "使用 Podman 配置文件"
                cp .env.podman .env.production
                # 更新 UID 和 GID
                sed -i "s/PODMAN_UID=.*/PODMAN_UID=$PODMAN_UID/" .env.production
                sed -i "s/PODMAN_GID=.*/PODMAN_GID=$PODMAN_GID/" .env.production
            fi
        fi
    else
        # Docker 环境配置
        if [ ! -f ".env.production" ]; then
            log_warning "未找到 .env.production 文件，使用默认配置"
            cp .env .env.production
        fi
    fi
    
    # 检查 JWT 密钥是否更改
    if grep -q "your-super-secret-jwt-key-change-in-production" .env.production; then
        log_warning "检测到默认的 JWT 密钥，建议更换为更安全的密钥"
    fi
    
    log_success "环境配置检查完成"
}

# 构建和启动服务
deploy() {
    log_info "构建容器镜像..."
    
    # 选择正确的 compose 文件
    local compose_file="docker-compose.yml"
    if [ "$CONTAINER_RUNTIME" = "podman" ] && [ -f "podman-compose.yml" ]; then
        compose_file="podman-compose.yml"
        log_info "使用 Podman 专用配置文件"
    fi
    
    # 停止现有服务
    $COMPOSE_CMD -f $compose_file down 2>/dev/null || true
    
    # Podman 特定的预处理
    if [ "$CONTAINER_RUNTIME" = "podman" ]; then
        # 清理可能的遗留容器
        podman container prune -f 2>/dev/null || true
        # 确保网络不存在冲突
        podman network rm xiuxian_network 2>/dev/null || true
        
        # 运行 Podman 网络设置
        if [ -f "./podman-helper.sh" ]; then
            ./podman-helper.sh setup >/dev/null 2>&1 || true
        fi
    fi
    
    # 构建镜像
    $COMPOSE_CMD -f $compose_file build --no-cache
    
    log_success "镜像构建完成"
    
    log_info "启动服务..."
    
    # 启动服务
    $COMPOSE_CMD -f $compose_file up -d
    
    log_success "服务启动完成"
}

# 等待服务就绪
wait_for_services() {
    log_info "等待服务就绪..."
    
    # 选择正确的 compose 文件
    local compose_file="docker-compose.yml"
    if [ "$CONTAINER_RUNTIME" = "podman" ] && [ -f "podman-compose.yml" ]; then
        compose_file="podman-compose.yml"
    fi
    
    # 等待应用启动
    timeout=60
    counter=0
    
    while [ $counter -lt $timeout ]; do
        if curl -f http://localhost:3000/api/health &>/dev/null; then
            log_success "应用服务已就绪"
            break
        fi
        
        echo -n "."
        sleep 2
        counter=$((counter + 2))
    done
    
    if [ $counter -ge $timeout ]; then
        log_error "服务启动超时"
        $COMPOSE_CMD -f $compose_file logs xiuxian-wiki
        exit 1
    fi
}

# 显示部署信息
show_deployment_info() {
    local compose_file="docker-compose.yml"
    if [ "$CONTAINER_RUNTIME" = "podman" ] && [ -f "podman-compose.yml" ]; then
        compose_file="podman-compose.yml"
    fi
    
    echo ""
    echo "🎉 部署完成！"
    echo ""
    echo "📋 服务信息:"
    echo "   • 容器运行时: $CONTAINER_RUNTIME"
    echo "   • 应用地址: http://localhost:3000"
    echo "   • 管理后台: http://localhost:3000/admin/login"
    echo "   • 健康检查: http://localhost:3000/api/health"
    echo ""
    echo "🔧 常用命令:"
    echo "   • 查看日志: $COMPOSE_CMD -f $compose_file logs -f"
    echo "   • 重启服务: $COMPOSE_CMD -f $compose_file restart"
    echo "   • 停止服务: $COMPOSE_CMD -f $compose_file down"
    echo "   • 查看状态: $COMPOSE_CMD -f $compose_file ps"
    if [ "$CONTAINER_RUNTIME" = "podman" ]; then
        echo "   • Podman 信息: podman info"
        echo "   • 容器列表: podman ps -a"
    fi
    echo ""
    echo "👤 默认管理员账户:"
    echo "   • 用户名: admin"
    echo "   • 密码: admin123"
    echo ""
}

# 主函数
main() {
    echo "🏮 修仙百科部署脚本"
    if [ "$1" = "--podman" ] || command -v podman &> /dev/null && ! command -v docker &> /dev/null; then
        echo "🐋 Podman 容器运行时"
    else
        echo "🐳 Docker 容器运行时"
    fi
    echo "================================"
    
    check_requirements
    create_directories
    check_env
    deploy
    wait_for_services
    show_deployment_info
    
    # Podman 特定的后续指导
    if [ "$CONTAINER_RUNTIME" = "podman" ]; then
        echo "📖 Podman 使用提示:"
        echo "   • 查看 Podman 信息: ./podman-helper.sh info"
        echo "   • 清理资源: ./podman-helper.sh cleanup"
        echo "   • 如遇权限问题，请检查 SELinux 和用户命名空间配置"
        echo "   • Rootless 模式文档: https://docs.podman.io/en/latest/markdown/podman.1.html"
        echo ""
    fi
}

# 错误处理
trap 'log_error "部署过程中发生错误，请检查日志"; exit 1' ERR

# 执行主函数
main "$@"