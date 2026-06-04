<template>
  <div class="home-page">
    <header class="home-header">
      <div class="header-content">
        <div class="header-left" @click="router.push('/')">
          <el-icon :size="28" color="#4a9e85"><Monitor /></el-icon>
          <span class="logo-text">心理健康AI助手</span>
        </div>
        <nav class="header-nav">
          <router-link to="/" class="nav-link active">首页</router-link>
          <router-link to="/chat" class="nav-link">AI咨询</router-link>
          <router-link to="/mood" class="nav-link">情绪日记</router-link>
          <router-link to="/knowledge" class="nav-link">知识库</router-link>
          <template v-if="isLoggedIn">
            <span class="nav-link logout-link" @click="handleLogout">退出登录</span>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">登录</router-link>
            <router-link to="/register" class="register-btn">注册</router-link>
          </template>
        </nav>
      </div>
    </header>

    <main class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">一次温暖的对话</h1>
          <h1 class="hero-title-highlight">化孤独为慰藉</h1>
          <p class="hero-desc">
            每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天
          </p>
          <div class="hero-buttons">
            <el-button size="large" class="btn-primary" @click="goChat">
              开始倾诉，获得陪伴
            </el-button>
            <el-button size="large" class="btn-outline" @click="goMood">
              记录心情，释放情感
            </el-button>
          </div>
        </div>
        <div class="hero-icon">
          <div class="icon-circle">
            <el-icon :size="100" color="#fff"><ChatDotRound /></el-icon>
          </div>
        </div>
      </div>
    </main>

    <footer class="home-footer">
      <p>© 2026 心理健康AI助手. 保留所有权利.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Monitor, ChatDotRound } from '@element-plus/icons-vue'

const router = useRouter()
const isLoggedIn = ref(!!localStorage.getItem('token'))

function checkLogin() {
  isLoggedIn.value = !!localStorage.getItem('token')
}

onMounted(() => {
  window.addEventListener('storage', checkLogin)
})

onUnmounted(() => {
  window.removeEventListener('storage', checkLogin)
})

function goChat() {
  if (isLoggedIn.value) {
    router.push('/chat')
  } else {
    router.push('/login')
  }
}

function goMood() {
  if (isLoggedIn.value) {
    router.push('/mood')
  } else {
    router.push('/login')
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  isLoggedIn.value = false
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.home-header {
  background: #fff;
  padding: 0 40px;
  height: 60px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
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

.register-btn {
  background: linear-gradient(135deg, #4a9e85 0%, #3d8b74 100%);
  color: #fff;
  border: none;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.3s;
}

.register-btn:hover {
  opacity: 0.9;
  color: #fff;
}

.hero-section {
  background: linear-gradient(135deg, #4a9e85 0%, #3d8b74 100%);
  flex: 1;
  display: flex;
  align-items: center;
  padding: 120px 80px 80px;
  margin-top: 60px;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 40px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
  line-height: 1.3;
}

.hero-title-highlight {
  font-size: 40px;
  font-weight: 600;
  color: #f0c040;
  margin: 0 0 24px;
  line-height: 1.3;
}

.hero-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  max-width: 460px;
  margin: 0 0 36px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
}

.btn-primary {
  background: #fff;
  color: #303133;
  border: none;
  border-radius: 6px;
  padding: 12px 28px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #f0f0f0;
}

.btn-outline {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  padding: 12px 28px;
  font-size: 15px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.btn-outline:hover {
  border-color: #fff;
}

.hero-icon {
  flex-shrink: 0;
  margin-left: 60px;
}

.icon-circle {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-footer {
  background: #f5f5f5;
  padding: 24px 0;
  text-align: center;
}

.home-footer p {
  margin: 0;
  font-size: 13px;
  color: #999;
}
</style>
