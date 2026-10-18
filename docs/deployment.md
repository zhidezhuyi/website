# 生产部署

## 站点与服务器

以下信息来自原项目说明及当前 `deploy.sh`，迁移时未连接服务器核验。

| 项目 | 配置 |
| --- | --- |
| 主站 | `zhidezhuyi.com`（HTTPS） |
| 知食 API | `knoweat.zhidezhuyi.com` |
| SSH 目标 | `root@14.103.220.143` |
| 静态文件目录 | `/srv/zhidezhuyi/website/` |
| Nginx Compose 文件 | `/srv/nginx/docker-compose.yml` |
| DNS | 阿里云托管，原记录指向 `14.103.220.143` |
| HTTPS | Nginx + Let's Encrypt 证书 |

## 服务器架构

```text
/srv/
├── nginx/                     # 公共 Nginx，独立服务
│   ├── docker-compose.yml     # Nginx 容器定义
│   ├── conf.d/default.conf    # 主站配置 + 知食代理
│   ├── html/                  # 默认 HTML 目录
│   ├── logs/                  # Nginx 日志
│   └── certbot/www/           # ACME 验证目录
├── zhidezhuyi/
│   └── website/               # 本仓库 site/ 的内容，Nginx 直接读取
│       ├── index.html
│       ├── css/
│       ├── js/
│       └── images/
└── knoweat/                    # 知食后端，独立 Docker Compose 服务
```

Nginx 与 `knoweat-server` 通过 `shared` 网络通信。这些 Nginx、Docker Compose 和证书配置位于服务器上，未包含在本仓库中。

## 部署操作

前置条件：

- 本机具备 Bash、SSH 和 rsync，并已配置目标服务器的 SSH 访问。
- 服务器已安装 Docker Compose，且上述 Nginx 配置与证书已就绪。
- 在仓库根目录执行命令，确保 `site/` 内容就是要发布的版本。

先进行本地检查：

```bash
node --check site/js/main.js
bash -n deploy.sh
git diff --check
```

确认需要发布到生产环境后运行：

```bash
bash deploy.sh
```

脚本依次执行：

1. 检查本地 `site/index.html` 是否存在。
2. 通过 SSH 创建远端静态文件目录。
3. 使用 `rsync -avz --delete`，将 `site/` 的内容同步至 `/srv/zhidezhuyi/website/`。
4. 在远端执行 `docker compose -f /srv/nginx/docker-compose.yml up -d --build`。

`--delete` 会删除远端目标目录内本地不存在的文件。只将站点资源放入 `site/`，服务器目录也应专用于本站静态文件。

最后一步作用于共享 Nginx 服务；`up -d --build` 会按需构建、创建或更新容器，并不保证每次重启容器或重载 Nginx 配置。不要将执行部署脚本当作可靠的配置重载方式。

## 发布后检查

- 打开主站，确认本次内容已更新，CSS、JavaScript 和二维码加载正常。
- 检查移动端菜单、页内导航及联系表单的邮件链接。
- 若涉及共享 Nginx 配置，检查知食 API 是否仍可用。

目前脚本直接同步生产目录，没有自动备份或原子切换。需要回退时，先在本地恢复到已知可用的站点版本，再按相同部署流程发布。
