#!/bin/bash

# Podman 部署测试脚本
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

# 测试结果统计
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# 运行测试
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "测试 $TOTAL_TESTS: $test_name"
    
    if eval "$test_command" &>/dev/null; then
        log_success "$test_name - 通过"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        log_error "$test_name - 失败"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# 测试 Podman 安装
test_podman_installation() {
    echo "🐋 测试 Podman 安装"
    echo "===================="
    
    run_test "Podman 可执行文件存在" "command -v podman"
    run_test "Podman 版本检查" "podman --version"
    
    # 检查 Compose 工具
    if command -v podman-compose &>/dev/null; then
        run_test "podman-compose 可用" "podman-compose --version"
    elif command -v docker-compose &>/dev/null; then
        run_test "docker-compose 可用" "docker-compose --version"
        log_warning "建议安装 podman-compose 以获得更好的兼容性"
    else
        log_error "未找到 compose 工具"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    echo ""
}

# 测试 Podman 环境
test_podman_environment() {
    echo "⚙️ 测试 Podman 环境"
    echo "==================="
    
    run_test "Podman 信息获取" "podman info --format '{{.Version.Version}}'"
    
    # 测试 rootless 配置
    if [ "$(id -u)" -ne 0 ]; then
        log_info "测试 rootless 配置..."
        
        if [ -f "/etc/subuid" ] && grep -q "$(id -un)" /etc/subuid; then
            run_test "用户子 UID 配置" "grep $(id -un) /etc/subuid"
        else
            log_warning "用户子 UID 未配置，可能影响 rootless 模式"
        fi
        
        if [ -f "/etc/subgid" ] && grep -q "$(id -un)" /etc/subgid; then
            run_test "用户子 GID 配置" "grep $(id -un) /etc/subgid"
        else
            log_warning "用户子 GID 未配置，可能影响 rootless 模式"
        fi
    fi
    
    # 测试网络
    run_test "Podman 网络功能" "podman network ls"
    
    echo ""
}

# 测试项目文件
test_project_files() {
    echo "📁 测试项目文件"
    echo "==============="
    
    run_test "主部署脚本存在" "[ -f deploy.sh ]"
    run_test "Podman 助手存在" "[ -f podman-helper.sh ]"
    run_test "Podman Compose 文件存在" "[ -f podman-compose.yml ]"
    run_test "Podman 环境配置存在" "[ -f .env.podman ]"
    run_test "Dockerfile 存在" "[ -f Dockerfile ]"
    run_test "部署脚本可执行" "[ -x deploy.sh ]"
    run_test "Podman 助手可执行" "[ -x podman-helper.sh ]"
    
    echo ""
}

# 测试容器操作
test_container_operations() {
    echo "🧪 测试容器操作"
    echo "==============="
    
    # 测试简单容器运行
    run_test "容器运行测试" "podman run --rm alpine:latest echo 'Hello Podman'"
    
    # 测试网络创建
    run_test "网络创建测试" "podman network create test-network && podman network rm test-network"
    
    # 测试卷操作
    run_test "卷操作测试" "podman volume create test-volume && podman volume rm test-volume"
    
    echo ""
}

# 测试 Podman 助手脚本
test_helper_script() {
    echo "🛠️ 测试 Podman 助手脚本"
    echo "======================"
    
    if [ -f "podman-helper.sh" ]; then
        run_test "助手脚本检查功能" "./podman-helper.sh check"
        run_test "助手脚本信息功能" "./podman-helper.sh info"
    else
        log_error "Podman 助手脚本不存在"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    echo ""
}

# 测试部署配置
test_deployment_config() {
    echo "📋 测试部署配置"
    echo "==============="
    
    if [ -f "podman-compose.yml" ]; then
        # 验证 Compose 文件语法
        if command -v podman-compose &>/dev/null; then
            run_test "Podman Compose 文件语法" "podman-compose -f podman-compose.yml config"
        elif command -v docker-compose &>/dev/null; then
            run_test "Docker Compose 文件语法" "docker-compose -f podman-compose.yml config"
        fi
        
        # 检查重要配置项
        run_test "SELinux 标签配置" "grep -q ':Z' podman-compose.yml"
        run_test "用户权限配置" "grep -q 'PODMAN_UID' podman-compose.yml"
        run_test "网络配置存在" "grep -q 'xiuxian_network' podman-compose.yml"
    else
        log_error "Podman Compose 文件不存在"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    echo ""
}

# 显示测试结果
show_test_results() {
    echo "📊 测试结果总结"
    echo "==============="
    echo "总测试数: $TOTAL_TESTS"
    echo -e "通过: ${GREEN}$TESTS_PASSED${NC}"
    echo -e "失败: ${RED}$TESTS_FAILED${NC}"
    echo "成功率: $(( TESTS_PASSED * 100 / TOTAL_TESTS ))%"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo ""
        log_success "所有测试通过！Podman 环境配置正确。"
        echo ""
        echo "🚀 您可以运行以下命令开始部署："
        echo "   ./deploy.sh"
        echo "   或"
        echo "   ./deploy.sh --podman"
        return 0
    else
        echo ""
        log_error "部分测试失败，请检查 Podman 配置。"
        echo ""
        echo "💡 建议操作："
        echo "   1. 检查 Podman 安装: podman --version"
        echo "   2. 配置 rootless: sudo usermod --add-subuids 100000-165535 \$(whoami)"
        echo "   3. 参考文档: 查看 PODMAN_DEPLOY.md"
        return 1
    fi
}

# 显示帮助信息
show_help() {
    echo "Podman 部署测试脚本"
    echo ""
    echo "使用方法:"
    echo "  $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --help, -h     显示此帮助信息"
    echo "  --quick, -q    仅运行快速测试"
    echo "  --full, -f     运行完整测试（默认）"
    echo ""
    echo "示例:"
    echo "  $0              # 运行完整测试"
    echo "  $0 --quick      # 运行快速测试"
    echo ""
}

# 主函数
main() {
    local mode="full"
    
    case "$1" in
        --help|-h)
            show_help
            exit 0
            ;;
        --quick|-q)
            mode="quick"
            ;;
        --full|-f)
            mode="full"
            ;;
    esac
    
    echo "🐋 修仙百科 Podman 兼容性测试"
    echo "=============================="
    echo ""
    
    # 基本测试
    test_podman_installation
    test_project_files
    
    if [ "$mode" = "full" ]; then
        # 完整测试
        test_podman_environment
        test_container_operations
        test_helper_script
        test_deployment_config
    fi
    
    show_test_results
}

# 捕获错误
trap 'log_error "测试过程中发生错误"; exit 1' ERR

# 运行主函数
main "$@"