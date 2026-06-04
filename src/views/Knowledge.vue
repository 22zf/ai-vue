<template>
  <div class="knowledge-page">
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

    <div class="knowledge-banner">
      <div class="banner-content">
        <span class="banner-icon">📖</span>
        <span class="banner-title">心理健康知识库</span>
      </div>
    </div>

    <div class="knowledge-body">
      <div class="knowledge-container">
        <aside class="knowledge-sidebar">
          <div class="sidebar-card">
            <div class="sidebar-title">推荐阅读</div>
            <div class="recommend-list">
              <div
                v-for="item in recommendArticles"
                :key="item.id"
                class="recommend-item"
                @click="goDetail(item.id)"
              >
                <div class="recommend-name">{{ item.title }}</div>
                <div class="recommend-reads">
                  <el-icon :size="12"><View /></el-icon>
                  阅读量：{{ item.readCount || 0 }}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main class="knowledge-main">
          <div v-if="loading" class="loading-state">加载中...</div>
          <template v-else>
            <div
              v-for="article in articles"
              :key="article.id"
              class="article-card"
              @click="goDetail(article.id)"
            >
              <div class="article-cover">
                <img
                  v-if="article.coverUrl"
                  :src="article.coverUrl"
                  :alt="article.title"
                />
                <div v-else class="cover-placeholder"></div>
              </div>
              <div class="article-info">
                <div class="article-header">
                  <span class="article-title">{{ article.title }}</span>
                  <el-tag v-if="article.categoryName" size="small" type="warning" effect="plain">
                    {{ article.categoryName }}
                  </el-tag>
                </div>
                <div class="article-meta">
                  <div class="meta-item">
                    <el-icon :size="14"><User /></el-icon>
                    {{ article.author || '系统管理员' }}
                  </div>
                  <div class="meta-item">
                    <el-icon :size="14"><Calendar /></el-icon>
                    {{ formatDate(article.createTime) }}
                  </div>
                  <div class="meta-item">
                    <el-icon :size="14"><View /></el-icon>
                    观看人数：{{ article.readCount || 0 }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!loading && articles.length === 0" class="empty-state">暂无文章</div>
          </template>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Monitor, User, Calendar, View } from '@element-plus/icons-vue'
import { articlePage } from '@/api/admin'

const router = useRouter()
const articles = ref([])
const recommendArticles = ref([])
const loading = ref(false)

function formatDate(timeStr) {
  if (!timeStr) return ''
  const d = new Date(timeStr)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function fetchArticles() {
  loading.value = true
  articlePage({
    sortField: 'readCount',
    sortDirection: 'desc',
    currentPage: '1',
    size: '10'
  })
    .then(data => {
      const list = data?.records || data?.list || data?.rows || data || []
      articles.value = list
      recommendArticles.value = list.slice(0, 5)
    })
    .catch(() => {
      articles.value = []
      recommendArticles.value = []
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

function goDetail(id) {
  router.push('/knowledge/' + id)
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.knowledge-page {
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

.knowledge-banner {
  background: linear-gradient(135deg, #7b68c8 0%, #a855c0 50%, #c88040 100%);
  padding: 28px 0;
  flex-shrink: 0;
}

.banner-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.banner-icon {
  font-size: 32px;
  line-height: 1;
}

.banner-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
}

.knowledge-body {
  flex: 1;
  padding: 24px;
}

.knowledge-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
}

.knowledge-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.sidebar-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommend-item {
  padding-left: 12px;
  border-left: 3px solid #e8932a;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 4px;
}

.recommend-item:hover {
  background: #f5f7fa;
}

.recommend-name {
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
}

.recommend-reads {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.knowledge-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
  background: #fff;
  border-radius: 12px;
  display: flex;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.article-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.article-cover {
  width: 200px;
  height: 150px;
  flex-shrink: 0;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: #f0e8d8;
}

.article-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.article-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.article-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 0;
  font-size: 14px;
  color: #c0c4cc;
}
</style>
