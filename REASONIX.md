# Reasonix project memory

Notes the user pinned via the `#` prompt prefix. The whole file is
loaded into the immutable system prefix every session — keep it terse.

- 项目部署上下文
## 项目概述
心理健康AI助手前端项目，基于 Vue 3 + Element Plus + Vite 8。

## 部署目标
项目部署在腾讯云 EdgeOne Pages，通过 GitHub 仓库 22zf/ai-vue 自动构建部署。

## 后端地址
http://159.75.169.224:1235 （腾讯云服务器上的后端服务）

## 当前问题
### 现象
前端页面加载正常（Nginx 部署了首页），但 API 请求返回 Network Error。

### 请求链路
### 配置文件说明 1. src/utils/request.js
- baseURL: '' （空字符串，走相对路径）
- timeout: 5000
- Axios 请求拦截器注入 token 到 headers
- Axios 响应拦截器解析后端 { success, data } 格式，处理 token 过期自动跳转登录 2. vite.config.js
- base: './'
- server.host: '0.0.0.0'
- server.proxy 配置了 /api 和 /files 转发到后端（这仅在本地 dev 模式使用，与 EdgeOne 部署无关） 3. src/api/admin.js
- 所有 Axios API 调用都使用相对路径 /api/xxx
- streamChat 函数使用 fetch('/api/psychological-chat/stream', ...) 也是相对路径 4. edge-functions/api/index.js（EdgeOne Pages 边缘函数）
- 路径： edge-functions/api/index.js （EdgeOne Pages 固定识别 edge-functions/ 目录）
- 导出格式： export async function onRequest(context)
- 功能：代理 /api/* 到 http://159.75.169.224:1235
- 包含 CORS 预检处理（OPTIONS 返回 204）
- 透传 Content-Type 和 token 请求头
- 添加 CORS 响应头 Access-Control-Allow-Origin: * 5. edge-functions/files/index.js
- 路径： edge-functions/files/index.js
- 功能：代理 /files/* 到 http://159.75.169.224:1235
## 已经排查/尝试过的内容
1. ✅ 后端服务可达（本地 curl 测试返回 200）
2. ✅ 前端静态页面正常加载（index.html 正常渲染）
3. ✅ 资源路径使用相对路径（ base: './' ）
4. ✅ CORS 预检处理已添加
5. ✅ 函数目录名正确（ edge-functions/ 而非 functions/ ）
6. ✅ 函数导出格式为 async function onRequest
7. ❌ 请求仍然失败
## 可能的故障原因（待排查）
1. EdgeOne 边缘函数可能不支持或阻止对 HTTP 地址的出站请求 （类似 Cloudflare Workers 默认阻止 HTTP）
2. EdgeOne 边缘函数运行时与代码不兼容
3. 边缘函数没有正确触发 （函数代码没有被调用到）
4. 后端服务器防火墙/安全组未放行 EdgeOne IP 范围
5. fetch 请求头或 body 透传有问题
- 项目部署上下文
## 项目概述
心理健康AI助手前端项目，基于 Vue 3 + Element Plus + Vite 8。

## 部署目标
项目部署在腾讯云 EdgeOne Pages，通过 GitHub 仓库 22zf/ai-vue 自动构建部署。

## 后端地址
http://159.75.169.224:1235 （腾讯云服务器上的后端服务）

## 当前问题
### 现象
前端页面加载正常（Nginx 部署了首页），但 API 请求返回 Network Error。

### 请求链路
### 配置文件说明 1. src/utils/request.js
- baseURL: '' （空字符串，走相对路径）
- timeout: 5000
- Axios 请求拦截器注入 token 到 headers
- Axios 响应拦截器解析后端 { success, data } 格式，处理 token 过期自动跳转登录 2. vite.config.js
- base: './'
- server.host: '0.0.0.0'
- server.proxy 配置了 /api 和 /files 转发到后端（这仅在本地 dev 模式使用，与 EdgeOne 部署无关） 3. src/api/admin.js
- 所有 Axios API 调用都使用相对路径 /api/xxx
- streamChat 函数使用 fetch('/api/psychological-chat/stream', ...) 也是相对路径 4. edge-functions/api/index.js（EdgeOne Pages 边缘函数）
- 路径： edge-functions/api/index.js （EdgeOne Pages 固定识别 edge-functions/ 目录）
- 导出格式： export async function onRequest(context)
- 功能：代理 /api/* 到 http://159.75.169.224:1235
- 包含 CORS 预检处理（OPTIONS 返回 204）
- 透传 Content-Type 和 token 请求头
- 添加 CORS 响应头 Access-Control-Allow-Origin: * 5. edge-functions/files/index.js
- 路径： edge-functions/files/index.js
- 功能：代理 /files/* 到 http://159.75.169.224:1235
## 已经排查/尝试过的内容
1. ✅ 后端服务可达（本地 curl 测试返回 200）
2. ✅ 前端静态页面正常加载（index.html 正常渲染）
3. ✅ 资源路径使用相对路径（ base: './' ）
4. ✅ CORS 预检处理已添加
5. ✅ 函数目录名正确（ edge-functions/ 而非 functions/ ）
6. ✅ 函数导出格式为 async function onRequest
7. ❌ 请求仍然失败
## 可能的故障原因（待排查）
1. EdgeOne 边缘函数可能不支持或阻止对 HTTP 地址的出站请求 （类似 Cloudflare Workers 默认阻止 HTTP）
2. EdgeOne 边缘函数运行时与代码不兼容
3. 边缘函数没有正确触发 （函数代码没有被调用到）
4. 后端服务器防火墙/安全组未放行 EdgeOne IP 范围
5. fetch 请求头或 body 透传有问题根据已知信息排查问题
