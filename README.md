# 酷OJ 在线判题系统 - 前端

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.5-3178C6?style=flat-square&logo=typescript)
![Arco Design](https://img.shields.io/badge/Arco%20Design-2.49-165DFF?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**一个现代化、功能丰富的在线判题系统前端**

[在线演示](#) | [后端仓库](https://github.com/kukudejin-123/kuoj-backend) | [问题反馈](https://github.com/kukudejin-123/kuoj-frontend/issues)

</div>

---

## 📖 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [核心功能模块](#核心功能模块)
- [项目亮点](#项目亮点)
- [部署指南](#部署指南)

---

## 项目简介

**酷OJ** 是一个面向编程学习者和竞赛选手的在线判题系统前端项目。系统支持多语言代码提交、实时判题、竞赛管理、团队协作等功能，采用现代化的前端技术栈构建，提供流畅的用户体验。

### 🎯 目标用户

- 编程学习者：通过刷题提升编程能力
- 竞赛选手：参加在线算法竞赛
- 教师教练：创建比赛、管理学生
- 技术面试官：组织编程面试

---

## 功能特性

### 🔐 用户系统

| 功能 | 描述 |
|------|------|
| 用户注册/登录 | 安全的用户认证系统 |
| 个人中心 | 管理个人信息、查看提交记录 |
| 权限管理 | 用户/管理员角色权限控制 |

### 📝 题目系统

| 功能 | 描述 |
|------|------|
| 题目浏览 | 支持分页、标签筛选、难度分类 |
| 题目详情 | Markdown渲染题目描述，支持数学公式 |
| 代码编辑 | Monaco Editor集成，支持多语言语法高亮 |
| 在线提交 | 实时获取判题结果，支持轮询等待 |

### 🏆 竞赛系统

| 功能 | 描述 |
|------|------|
| 竞赛列表 | 浏览所有竞赛，支持状态筛选 |
| 竞赛详情 | 查看竞赛信息、题目列表、排行榜 |
| 竞赛答题 | 竞赛期间提交代码，实时排名 |
| 竞赛创建 | 管理员可创建竞赛、添加题目 |

### 👥 团队系统

| 功能 | 描述 |
|------|------|
| 团队创建 | 创建团队、设置团队信息 |
| 成员管理 | 邀请成员、移除成员、转让队长 |
| 团队竞赛 | 团队可组队参加竞赛 |

### 📊 排名系统

| 功能 | 描述 |
|------|------|
| 用户排名 | 根据解题数量和时间排名 |
| 统计数据 | 提交统计、通过率分析 |

---

## 技术栈

### 核心框架

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue.js | 3.2.13 | 渐进式JavaScript框架 |
| TypeScript | 4.5.x | 类型安全的JavaScript超集 |
| Vue Router | 4.x | 官方路由管理器 |
| Vuex | 4.x | 状态管理模式 |

### UI组件库

| 技术 | 版本 | 说明 |
|------|------|------|
| Arco Design Vue | 2.49.1 | 字节跳动企业级UI组件库 |
| Monaco Editor | 0.41.0 | VS Code同款代码编辑器 |
| ByteMD | 1.21.0 | Markdown编辑/渲染组件 |

### 工具库

| 技术 | 说明 |
|------|------|
| Axios | HTTP请求库 |
| Moment.js | 日期处理库 |
| openapi-typescript-codegen | API代码自动生成 |

### 开发工具

| 工具 | 说明 |
|------|------|
| Vue CLI 5 | 项目脚手架 |
| ESLint | 代码检查 |
| Prettier | 代码格式化 |

---

## 项目结构

```
oj-frontend-master/
├── public/                     # 静态资源
├── generated/                  # 自动生成的API代码
│   ├── core/                   # 核心工具类
│   ├── models/                 # TypeScript类型定义
│   └── services/               # API服务类
├── src/
│   ├── access/                 # 权限控制
│   │   ├── accessEnum.ts       # 权限枚举
│   │   ├── checkAccess.ts      # 权限检查
│   │   └── index.ts            # 路由守卫
│   ├── api/                    # 自定义API封装
│   ├── assets/                 # 静态资源
│   ├── components/             # 公共组件
│   │   ├── CodeEditor.vue      # 代码编辑器
│   │   ├── MdEditor.vue        # Markdown编辑器
│   │   ├── MdViewer.vue        # Markdown渲染器
│   │   └── GlobalHeader.vue    # 全局导航栏
│   ├── layouts/                # 布局组件
│   ├── plugins/                # 插件配置
│   ├── router/                 # 路由配置
│   ├── store/                  # Vuex状态管理
│   └── views/                  # 页面视图
│       ├── contest/            # 竞赛模块
│       ├── question/           # 题目模块
│       ├── ranking/            # 排名模块
│       ├── team/               # 团队模块
│       └── user/               # 用户模块
├── .env.development            # 开发环境配置
├── .env.production             # 生产环境配置
├── vue.config.js               # Vue CLI配置
├── tsconfig.json               # TypeScript配置
└── package.json                # 项目依赖
```

---

## 快速开始

### 环境要求

- Node.js >= 14.x
- npm >= 6.x 或 yarn >= 1.x

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/kukudejin-123/kuoj-frontend.git
cd kuoj-frontend

# 2. 安装依赖
npm install
# 或使用 yarn
yarn install

# 3. 配置后端地址
# 编辑 .env.development 文件，修改 API 地址
VUE_APP_API_BASE_URL=http://localhost:8802/api

# 4. 启动开发服务器
npm run serve

# 5. 构建生产版本
npm run build
```

### 开发命令

```bash
npm run serve     # 启动开发服务器
npm run build     # 构建生产版本
npm run lint      # 代码检查
npm run gen-api   # 重新生成API代码（需要后端API文档）
```

### 根据后台生成API代码

```shell
openapi --input http://localhost:8802/api/v2/api-docs --output ./generated --client axios
```

---

## 核心功能模块

### 代码编辑器组件

采用 Monaco Editor（VS Code 同款编辑器），支持：

- **多语言支持**: Java, C++, Python, Go, JavaScript, C
- **语法高亮**: 自动识别语言并高亮显示
- **代码缩进**: 自动格式化和智能缩进
- **迷你地图**: 代码导航迷你地图
- **暗色主题**: 护眼的暗色编辑主题

```vue
<CodeEditor
  :value="code"
  :language="language"
  @change="handleChange"
/>
```

### Markdown 渲染

使用 ByteMD 提供强大的 Markdown 渲染能力：

- 支持 GitHub Flavored Markdown (GFM)
- 代码块语法高亮
- 数学公式渲染
- 表格、任务列表等扩展语法

### 权限控制系统

基于角色的三级权限控制：

| 角色 | 权限 |
|------|------|
| notLogin | 仅可访问公开页面 |
| user | 可做题、参加竞赛、创建团队 |
| admin | 管理题目、竞赛、用户等 |

通过路由守卫实现页面级权限控制：

```typescript
// 路由守卫自动检查权限
router.beforeEach((to, from, next) => {
  // 检查登录状态
  // 检查角色权限
  // 跳转或放行
});
```

### 实时判题状态

采用轮询机制获取判题结果：

- 每 500ms 轮询一次状态
- 最多轮询 60 次（30秒）
- 实时更新判题状态显示

---

## 项目亮点

### 🎨 现代化 UI 设计

- 采用 Arco Design Vue 组件库，界面美观统一
- 响应式布局，适配多种屏幕尺寸
- 暗色主题代码编辑器，保护眼睛

### ⚡ 优秀的开发体验

- TypeScript 全栈类型安全
- OpenAPI 自动生成 API 代码
- 热更新开发服务器

### 🔐 完善的权限系统

- 前后端双重权限验证
- 路由级权限守卫
- 接口级权限控制

### 📦 模块化架构

- 组件化开发，复用性强
- 清晰的目录结构
- 关注点分离设计

---

## 部署指南

### Nginx 部署

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/oj-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8802;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker 部署

```dockerfile
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## 相关链接

- 🖥️ [后端仓库](https://github.com/kukudejin-123/kuoj-backend)
- 📚 [API 文档](#)
- 🐛 [问题反馈](https://github.com/kukudejin-123/kuoj-frontend/issues)

---

## 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star ⭐**

Made with ❤️ by [kukudejin-123](https://github.com/kukudejin-123)

</div>