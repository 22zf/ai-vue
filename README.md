# 心理健康AI助手

一个基于 Vue 3 的心理健康 AI 咨询平台，提供 AI 智能对话、情绪日记、心理知识库等功能，帮助用户在深夜或焦虑时刻获得温暖的陪伴与支持。

## 功能特性

- **AI 智能咨询** - 基于 SSE 流式传输的实时 AI 对话，支持会话管理与情绪分析
- **情绪日记** - 记录每日心情与情绪变化，释放内心情感
- **心理知识库** - 浏览心理健康文章，支持分类筛选与详情查看
- **后台管理** - 数据分析仪表盘、知识文章管理、咨询记录查看、情绪日志管理
- **用户系统** - 注册、登录、退出登录，Token 鉴权

## 技术栈

| 类别       | 技术                                                                      |
| -------- | ----------------------------------------------------------------------- |
| 框架       | [Vue 3](https://vuejs.org/) 3.5.34 (Composition API + `<script setup>`) |
| 构建工具     | [Vite](https://vitejs.dev/) 8.0.12                                      |
| UI 组件库   | [Element Plus](https://element-plus.org/) 2.14.0                        |
| 状态管理     | [Pinia](https://pinia.vuejs.org/) 3.0.4                                 |
| 路由       | [Vue Router](https://router.vuejs.org/) 4.6.4                           |
| HTTP 客户端 | [Axios](https://axios-http.com/) + Fetch (SSE 流式请求)                     |
| 富文本编辑器   | [wangEditor](https://www.wangeditor.com/) 5.x                           |
| 数据可视化    | [ECharts](https://echarts.apache.org/) 6.1.0                            |
| CSS 预处理  | SCSS                                                                    |

## 项目结构

```
ai-vue/
├── public/                    # 静态资源
├── src/
│   ├── api/                   # API 接口封装
│   │   └── admin.js           # 所有后端接口（用户、文章、咨询、情绪日记等）
│   ├── assets/                # 图片等静态资源
│   ├── components/            # 公共组件
│   │   ├── Backendlayout.vue  # 后台管理布局
│   │   ├── DataTable.vue      # 数据表格
│   │   ├── MenuBack.vue       # 后台侧边菜单
│   │   ├── NavbarBack.vue     # 后台顶栏
│   │   ├── PageHead.vue       # 页面头部
│   │   ├── RichTextEditor.vue # 富文本编辑器
│   │   ├── TablePagination.vue# 分页组件
│   │   └── TableSearch.vue    # 搜索筛选组件
│   ├── router/                # 路由配置
│   │   └── index.js
│   ├── stores/                # Pinia 状态管理
│   │   ├── index.js           # Pinia 实例
│   │   └── admin.js           # 后台状态（侧边栏折叠等）
│   ├── utils/                 # 工具函数
│   │   ├── request.js         # Axios 请求封装（拦截器、Token 注入、错误处理）
│   │   └── menu.js            # 后台菜单配置
│   ├── views/                 # 页面视图
│   │   ├── Home.vue           # 首页
│   │   ├── Chat.vue           # AI 咨询对话
│   │   ├── Mood.vue           # 情绪日记
│   │   ├── Knowledge.vue      # 知识库列表
│   │   ├── ArticleDetail.vue  # 文章详情
│   │   ├── Login.vue          # 登录
│   │   ├── Register.vue       # 注册
│   │   ├── Dashboard.vue      # 后台 - 数据分析
│   │   ├── Comment.vue        # 后台 - 知识文章管理
│   │   ├── Message.vue        # 后台 - 咨询记录
│   │   └── UserFilled.vue     # 后台 - 情绪日志
│   ├── App.vue                # 根组件
│   ├── main.js                # 入口文件
│   └── style.css              # 全局样式
├── index.html                 # HTML 入口
├── vite.config.js             # Vite 配置
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm / pnpm / yarn

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 代理配置

开发服务器已配置 API 代理，`/api` 和 `/files` 请求会转发到后端服务。如需修改后端地址，请编辑 [vite.config.js](vite.config.js) 中的 `server.proxy` 配置。

## 路由说明

| 路径                 | 页面    | 说明           |
| ------------------ | ----- | ------------ |
| `/`                | 首页    | 产品介绍与入口      |
| `/login`           | 登录    | 用户登录         |
| `/register`        | 注册    | 用户注册         |
| `/chat`            | AI 咨询 | 与 AI 心理咨询师对话 |
| `/mood`            | 情绪日记  | 记录情绪与心情      |
| `/knowledge`       | 知识库   | 浏览心理健康文章     |
| `/knowledge/:id`   | 文章详情  | 查看文章内容       |
| `/back/dashboard`  | 数据分析  | 后台数据概览（需登录）  |
| `/back/comment`    | 知识文章  | 后台文章管理（需登录）  |
| `/back/message`    | 咨询记录  | 后台咨询管理（需登录）  |
| `/back/userFilled` | 情绪日志  | 后台情绪管理（需登录）  |

