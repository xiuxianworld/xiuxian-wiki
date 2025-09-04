# Podman 部署指南

本项目现在支持使用 Podman 作为 Docker 的替代方案进行部署。Podman 是一个无守护进程的容器引擎，提供更好的安全性和 rootless 运行能力。

## 🐋 Podman vs Docker

| 特性 | Docker | Podman |
|------|---------|---------|
| 守护进程 | 需要 Docker daemon | 无守护进程架构 |
| Rootless | 需要额外配置 | 原生支持 rootless |
| 安全性 | 需要 root 权限 | 用户权限运行 |
| 系统集成 | systemd 支持有限 | 原生 systemd 集成 |
| OCI 兼容 | 是 | 是 |

## 📦 安装 Podman

### CentOS/RHEL/Fedora
```bash
# Fedora
sudo dnf install podman podman-compose

# CentOS/RHEL 8+
sudo yum install podman podman-compose

# 或使用 dnf (RHEL 8+)
sudo dnf install podman podman-compose
```

### Ubuntu/Debian
```bash
# Ubuntu 20.10+
sudo apt update
sudo apt install podman podman-compose

# 对于较旧版本，添加仓库
echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_$(lsb_release -rs)/ /" | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_$(lsb_release -rs)/Release.key | sudo apt-key add -
sudo apt update
sudo apt install podman
```

### macOS
```bash
# 使用 Homebrew
brew install podman podman-compose

# 初始化 Podman 虚拟机
podman machine init
podman machine start
```

### Arch Linux
```bash
sudo pacman -S podman podman-compose
```

## 🚀 使用 Podman 部署

### 快速部署
```bash
# 直接运行部署脚本（自动检测 Podman）
./deploy.sh

# 或明确指定使用 Podman
./deploy.sh --podman
```

### 手动 Podman 部署
```bash
# 1. 检查 Podman 环境
./podman-helper.sh check

# 2. 设置 Podman 环境
./podman-helper.sh setup

# 3. 使用 Podman Compose 部署
podman-compose -f podman-compose.yml up -d

# 或使用 docker-compose 与 Podman
docker-compose -f podman-compose.yml up -d
```

## ⚙️ Rootless 配置

Podman 的一个主要优势是支持 rootless 模式，无需 root 权限即可运行容器。

### 配置用户命名空间
```bash
# 检查当前配置
cat /etc/subuid
cat /etc/subgid

# 如果没有配置，添加用户子 UID/GID
sudo usermod --add-subuids 100000-165535 $(whoami)
sudo usermod --add-subgids 100000-165535 $(whoami)

# 重新登录或运行
podman system migrate
```

### 启用用户级 systemd 服务（可选）
```bash
# 启用用户级服务
systemctl --user enable podman.socket
systemctl --user start podman.socket

# 设置开机自启动
sudo loginctl enable-linger $(whoami)
```

## 🔒 SELinux 配置

如果系统启用了 SELinux，Podman 可以更好地与其集成：

```bash
# 检查 SELinux 状态
getenforce

# 查看 SELinux 上下文
ls -Z data/

# 如果需要，设置正确的 SELinux 上下文
sudo setsebool -P container_manage_cgroup true
sudo setsebool -P virt_use_nfs true
```

## 🛠️ 故障排除

### 权限问题
```bash
# 检查用户命名空间配置
podman info | grep -A5 "IDMappings"

# 重置 Podman 存储
podman system reset

# 检查存储配置
podman info | grep -A10 "store"
```

### 网络问题
```bash
# 重新创建网络
podman network rm xiuxian_network
podman network create --driver bridge --subnet 172.20.0.0/16 xiuxian_network

# 检查网络配置
podman network ls
podman network inspect xiuxian_network
```

### 存储问题
```bash
# 检查存储驱动
podman info | grep -A5 "GraphDriverName"

# 清理存储
podman system prune -a -f

# 重建存储
podman system reset --force
```

### 端口绑定问题
在 rootless 模式下，Podman 只能绑定到 1024 以上的端口。如果需要使用 80/443 端口：

```bash
# 方法 1: 使用端口转发
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

# 方法 2: 启用 unprivileged port binding
echo 'net.ipv4.ip_unprivileged_port_start=0' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 📊 监控和管理

### 使用 Podman 助手脚本
```bash
# 查看系统信息
./podman-helper.sh info

# 清理资源
./podman-helper.sh cleanup

# 检查环境
./podman-helper.sh check
```

### 常用 Podman 命令
```bash
# 查看运行中的容器
podman ps

# 查看所有容器
podman ps -a

# 查看容器日志
podman logs xiuxian-wiki-app

# 进入容器
podman exec -it xiuxian-wiki-app /bin/bash

# 查看资源使用情况
podman stats

# 查看网络
podman network ls

# 查看卷
podman volume ls
```

## 🔄 从 Docker 迁移到 Podman

如果之前使用 Docker 部署，可以按以下步骤迁移：

```bash
# 1. 停止 Docker 服务
docker-compose down

# 2. 安装 Podman
# (参考上面的安装指南)

# 3. 配置 Podman 环境
./podman-helper.sh setup

# 4. 使用 Podman 重新部署
./deploy.sh

# 5. 验证服务正常运行
curl http://localhost:3000/api/health
```

## 📝 配置文件说明

### `.env.podman`
Podman 专用环境配置文件，包含 rootless 模式和 SELinux 相关配置。

### `podman-compose.yml`
Podman 优化的 Docker Compose 文件，包含：
- SELinux 标签配置 (`:Z` 标志)
- 用户权限映射
- 网络优化配置
- 安全选项设置

### `podman-helper.sh`
Podman 部署助手脚本，提供：
- 环境检查和设置
- 网络配置
- 资源清理
- 系统信息查看

## 🆘 获取帮助

如果在使用 Podman 部署时遇到问题：

1. **检查 Podman 状态**：`./podman-helper.sh info`
2. **查看日志**：`podman logs xiuxian-wiki-app`
3. **检查权限**：确保用户命名空间正确配置
4. **参考官方文档**：[Podman 官方文档](https://docs.podman.io/)
5. **社区支持**：[Podman GitHub](https://github.com/containers/podman)

## 🎯 性能优化

### 存储优化
```bash
# 使用 overlay 存储驱动
echo '[storage]
driver = "overlay"
' | tee ~/.config/containers/storage.conf
```

### 网络优化
```bash
# 配置自定义 DNS
echo '[network]
dns_servers = ["8.8.8.8", "8.8.4.4"]
' | tee -a ~/.config/containers/containers.conf
```

### 内存优化
```bash
# 设置容器内存限制
podman run --memory=512m --cpus=1.0 your-container
```

---

通过以上配置，您可以成功使用 Podman 部署修仙百科项目，享受更高的安全性和更好的系统集成体验。