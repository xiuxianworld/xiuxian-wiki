#!/bin/bash

# Podman 部署助手脚本
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# 检查 Podman 环境
check_podman_env() {
    log_info "检查 Podman 环境..."
    
    if ! command -v podman &> /dev/null; then
        log_error "Podman 未安装"
        exit 1
    fi
    
    # 检查 rootless 模式
    if [ "$(id -u)" -ne 0 ]; then
        log_info "使用 Podman rootless 模式"
        
        # 检查用户命名空间配置
        if [ ! -f "/etc/subuid" ] || ! grep -q "$(id -un)" /etc/subuid; then
            log_warning "用户子 UID 配置可能不完整"
            log_info "请运行: sudo usermod --add-subuids 100000-165535 $(id -un)"
        fi
        
        if [ ! -f "/etc/subgid" ] || ! grep -q "$(id -un)" /etc/subgid; then
            log_warning "用户子 GID 配置可能不完整"
            log_info "请运行: sudo usermod --add-subgids 100000-165535 $(id -un)"
        fi
    fi
    
    # 检查 SELinux
    if command -v getenforce &> /dev/null && [ "$(getenforce)" = "Enforcing" ]; then
        log_info "检测到 SELinux 启用，将使用 Z 标志挂载卷"
        export SELINUX_ENABLED=true
    fi
    
    log_success "Podman 环境检查完成"
}

# 设置 Podman 特定的环境变量
setup_podman_env() {
    log_info "设置 Podman 环境变量..."
    
    # 设置当前用户的 UID 和 GID
    export PODMAN_UID=$(id -u)
    export PODMAN_GID=$(id -g)
    
    # 创建 Podman 特定的 .env 文件
    if [ -f ".env.podman" ]; then
        log_info "使用 Podman 特定配置"
        cp .env.podman .env.production
        
        # 更新 UID 和 GID
        sed -i "s/PODMAN_UID=.*/PODMAN_UID=$PODMAN_UID/" .env.production
        sed -i "s/PODMAN_GID=.*/PODMAN_GID=$PODMAN_GID/" .env.production
    fi
    
    log_success "环境变量设置完成"
}

# 配置 Podman 网络
setup_podman_network() {
    log_info "配置 Podman 网络..."
    
    # 删除已存在的网络（如果有）
    podman network rm xiuxian_network 2>/dev/null || true
    
    # 创建自定义网络
    podman network create \
        --driver bridge \
        --subnet 172.20.0.0/16 \
        --gateway 172.20.0.1 \
        xiuxian_network 2>/dev/null || true
    
    log_success "网络配置完成"
}

# 清理 Podman 资源
cleanup_podman() {
    log_info "清理 Podman 资源..."
    
    # 停止所有相关容器
    podman ps -a --filter "name=xiuxian" --format "{{.Names}}" | xargs -r podman rm -f
    
    # 清理未使用的镜像
    podman image prune -f
    
    # 清理未使用的卷
    podman volume prune -f
    
    log_success "资源清理完成"
}

# 显示 Podman 信息
show_podman_info() {
    echo ""
    log_info "Podman 系统信息:"
    echo "   • 版本: $(podman --version)"
    echo "   • 存储根目录: $(podman info --format '{{.Store.GraphRoot}}')"
    echo "   • 运行根目录: $(podman info --format '{{.Store.RunRoot}}')"
    echo "   • 当前用户: $(id -un) (UID: $(id -u), GID: $(id -g))"
    
    if command -v getenforce &> /dev/null; then
        echo "   • SELinux 状态: $(getenforce)"
    fi
    
    echo ""
    log_info "活动容器:"
    podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    log_info "网络信息:"
    podman network ls
    
    echo ""
}

# 主函数
case "$1" in
    "check")
        check_podman_env
        ;;
    "setup")
        check_podman_env
        setup_podman_env
        setup_podman_network
        ;;
    "cleanup")
        cleanup_podman
        ;;
    "info")
        show_podman_info
        ;;
    *)
        echo "使用方法: $0 {check|setup|cleanup|info}"
        echo ""
        echo "  check   - 检查 Podman 环境"
        echo "  setup   - 设置 Podman 环境"
        echo "  cleanup - 清理 Podman 资源"
        echo "  info    - 显示 Podman 信息"
        exit 1
        ;;
esac