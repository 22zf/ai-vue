<template>
  <div class="detail-page">
    <header class="home-header">
      <div class="header-content">
        <div class="header-left" @click="router.push('/')">
          <el-icon :size="28" color="#4a9e85"><Monitor /></el-icon>
          <span class="logo-text">心理健康AI助手</span>
        </div>
        <nav class="header-nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/chat" class="nav-link">AI咨询</router-link>
          <router-link to="/mood" class="nav-link">情绪日记</router-link>
          <router-link to="/knowledge" class="nav-link active">知识库</router-link>
          <span class="nav-link logout-link" @click="handleLogout">退出登录</span>
        </nav>
      </div>
    </header>

    <div class="detail-body">
      <div v-if="loading" class="loading-state">加载中...</div>
      <template v-else-if="article">
        <div class="article-info-card">
          <div class="info-top">
            <el-tag v-if="article.categoryName" size="small" type="warning" effect="plain">
              {{ article.categoryName }}
            </el-tag>
            <span class="info-date">
              <el-icon :size="14"><Calendar /></el-icon>
              {{ formatDate(article.createTime) }}
            </span>
          </div>
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-summary" v-if="article.summary">
            {{ article.summary }}
          </div>
          <div class="info-meta">
            <span class="meta-item">
              <el-icon :size="14"><User /></el-icon>
              {{ article.author || '系统管理员' }}
            </span>
            <span class="meta-item">
              <el-icon :size="14"><View /></el-icon>
              {{ article.readCount || 0 }} 次阅读
            </span>
          </div>
        </div>

        <div class="article-content-card">
          <div class="content-title">正文内容</div>
          <div class="article-content" v-html="article.content"></div>
        </div>

        <div class="tags-card" v-if="article.tags && article.tags.length">
          <div class="tags-label">相关标签</div>
          <div class="tags-list">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="tag-item"
            >{{ tag }}</span>
          </div>
        </div>
      </template>
      <div v-else class="loading-state">文章不存在</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Monitor, User, Calendar, View } from '@element-plus/icons-vue'
import { articleDetail } from '@/api/admin'

const router = useRouter()
const route = useRoute()
const article = ref(null)
const loading = ref(false)

function formatDate(timeStr) {
  if (!timeStr) return ''
  const d = new Date(timeStr)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function fetchDetail() {
  const id = route.params.id
  if (!id) return
  loading.value = true
  articleDetail(id)
    .then(data => {
      article.value = data
    })
    .catch(() => {
      ElMessage.error('加载文章详情失败')
    })
    .finally(() => {
      loading.value = false
    })
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  ElMessage.success('已退出登录')
  router.push('/')
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f2f5;
  overflow-y: auto;
}

.home-header {
  background: #fff;
  padding: 0 40px;
  height: 60px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  font-size: 15px;
  color: #606266;
  text-decoration: none;
  cursor: pointer;
}

.nav-link:hover,
.nav-link.active {
  color: #303133;
  font-weight: 500;
}

.nav-link.active {
  position: relative;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: #4a9e85;
  border-radius: 1px;
}

.logout-link {
  user-select: none;
}

.detail-body {
  flex: 1;
  padding: 24px;
  max-width: 820px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-info-card {
  background: #fafafa;
  border-radius: 12px;
  padding: 28px;
}

.info-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.info-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px;
  line-height: 1.4;
}

.article-summary {
  border-left: 4px solid #c8e6a0;
  background: #f6fbe8;
  padding: 12px 16px;
  font-size: 14px;
  color: #555;
  line-height: 1.7;
  margin-bottom: 16px;
}

.info-meta {
  display: flex;
  align-items: center;
  gap: 20px;
}

.info-meta .meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #606266;
}

.article-content-card {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
}

.content-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.article-content {
  font-size: 15px;
  color: #333;
  line-height: 1.8;
}

.article-content :deep(h2),
.article-content :deep(h3) {
  font-weight: 700;
  color: #1a1a1a;
  margin: 20px 0 10px;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  padding-left: 24px;
  margin: 8px 0;
}

.article-content :deep(li) {
  margin: 4px 0;
}

.article-content :deep(p) {
  margin: 8px 0;
}

.article-content :deep(strong) {
  font-weight: 700;
  color: #1a1a1a;
}

.tags-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 28px;
}

.tags-label {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  background: #f0f2f5;
  border: 1px solid #e4e7ed;
  cursor: default;
}

.loading-state {
  text-align: center;
  padding: 60px 0;
  font-size: 14px;
  color: #c0c4cc;
}
</style>
