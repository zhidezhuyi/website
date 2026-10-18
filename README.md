# 值得注意科技官网

[zhidezhuyi.com](https://zhidezhuyi.com) 的静态官网，展示公司业务、服务能力与联系方式。使用原生 HTML / CSS / JavaScript，无需安装前端依赖或构建。

## 项目结构

```text
website/
├── AGENTS.md                  # Codex 项目上下文与维护约定
├── README.md                  # 开发入口
├── docs/
│   └── deployment.md          # 服务器架构与部署说明
├── deploy.sh                  # 生产部署脚本
└── site/                      # 完整静态站点，也是部署源目录
    ├── index.html
    ├── css/styles.css
    ├── js/main.js
    └── images/
```

## 本地预览

需要 Python 3。在仓库根目录运行：

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory site
```

打开 [本地预览](http://127.0.0.1:8000)，修改文件后刷新页面即可。按 `Ctrl+C` 停止服务。

## 使用 Codex 维护

在 Codex 中打开本仓库根目录。项目维护约定放在 [`AGENTS.md`](AGENTS.md)，采用 [OpenAI 官方的项目指令约定](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。

原 `CLAUDE.md` 中的项目知识已整理到 `AGENTS.md` 和部署文档，Claude Code 专用权限文件已移除。Codex 的模型选择和本机权限沿用个人设置，仓库无需额外配置。

## 检查

在仓库根目录执行：

```bash
node --check site/js/main.js
bash -n deploy.sh
git diff --check
```

JavaScript 语法检查需要 Node.js；站点本身没有 Node.js 运行时依赖。目前没有自动化测试套件。修改页面后，需在浏览器中检查桌面和移动端布局、导航、动画、二维码及联系表单。联系表单通过 `mailto:` 打开邮件客户端。

## 部署

生产部署命令为 `bash deploy.sh`，会同步文件并执行远端 Docker Compose 命令。服务器架构、前置条件及操作影响见 [`docs/deployment.md`](docs/deployment.md)。本地开发无需运行部署。
