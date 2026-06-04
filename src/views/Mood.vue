<template>
  <div class="mood-page">
    <header class="mood-header">
      <div class="header-content">
        <div class="header-left" @click="router.push('/')">
          <el-icon :size="28" color="#4a9e85"><Monitor /></el-icon>
          <span class="logo-text">心理健康AI助手</span>
        </div>
        <nav class="header-nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/chat" class="nav-link">AI咨询</router-link>
          <router-link to="/mood" class="nav-link active">情绪日记</router-link>
          <router-link to="/knowledge" class="nav-link">知识库</router-link>
          <span class="nav-link logout-link" @click="handleLogout">退出登录</span>
        </nav>
      </div>
    </header>

    <div class="mood-banner">
      <div class="banner-content">
        <span class="banner-icon">💗</span>
        <span class="banner-title">情绪日记</span>
      </div>
    </div>

    <div class="mood-body">
      <div class="mood-container">
        <div class="mood-card">
          <div class="card-title">今日情绪评分</div>
          <div class="card-subtitle">您今天的整体情绪状态如何？(1-10分)</div>
          <div class="star-rating">
            <span
              v-for="i in 10"
              :key="i"
              class="star"
              :class="{ active: i <= form.rating }"
              @click="form.rating = i"
            >★</span>
            <span class="rating-label" v-if="form.rating">{{ ratingText }}</span>
          </div>
        </div>

        <div class="mood-card">
          <div class="card-title">主要情绪</div>
          <div class="emotion-grid">
            <div
              v-for="emotion in emotions"
              :key="emotion.value"
              class="emotion-item"
              :class="{ active: form.emotion === emotion.value }"
              @click="form.emotion = emotion.value"
            >
              <div class="emotion-icon" :style="{ color: emotion.color }">{{ emotion.icon }}</div>
              <div class="emotion-label">{{ emotion.label }}</div>
            </div>
          </div>
        </div>

        <div class="mood-card">
          <div class="card-title">详细记录</div>

          <div class="field-group">
            <div class="field-label">情绪触发因素</div>
            <div class="textarea-wrapper">
              <textarea
                v-model="form.trigger"
                class="mood-textarea"
                placeholder="今天什么事情影响了您的情绪?"
                maxlength="1000"
                rows="2"
              />
              <div class="char-count">{{ form.trigger.length }} / 1000</div>
            </div>
          </div>

          <div class="field-group">
            <div class="field-label">今日感想</div>
            <div class="textarea-wrapper">
              <textarea
                v-model="form.thoughts"
                class="mood-textarea"
                placeholder="写下您今天的想法、感受或发生的有趣事情..."
                maxlength="2000"
                rows="3"
              />
              <div class="char-count">{{ form.thoughts.length }} / 2000</div>
            </div>
          </div>

          <div class="select-row">
            <div class="select-group">
              <div class="field-label">睡眠质量</div>
              <el-select v-model="form.sleepQuality" placeholder="请选择" class="mood-select">
                <el-option label="很好" value="很好" />
                <el-option label="较好" value="较好" />
                <el-option label="一般" value="一般" />
                <el-option label="较差" value="较差" />
                <el-option label="很差" value="很差" />
              </el-select>
            </div>
            <div class="select-group">
              <div class="field-label">压力水平</div>
              <el-select v-model="form.stressLevel" placeholder="请选择" class="mood-select">
                <el-option label="很低" value="很低" />
                <el-option label="较低" value="较低" />
                <el-option label="中等" value="中等" />
                <el-option label="较高" value="较高" />
                <el-option label="很高" value="很高" />
              </el-select>
            </div>
          </div>

          <div class="form-actions">
            <el-button class="btn-reset" @click="handleReset">重置</el-button>
            <el-button type="primary" class="btn-submit" @click="handleSubmit">提交记录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Monitor } from '@element-plus/icons-vue'
import { emotionDiaryCreate } from '@/api/admin'

const router = useRouter()

const emotions = [
  { value: 'happy', label: '开心', icon: '😊', color: '#f5a623' },
  { value: 'calm', label: '平静', icon: '😐', color: '#4a90d9' },
  { value: 'anxious', label: '焦虑', icon: '😟', color: '#e85d3a' },
  { value: 'sad', label: '悲伤', icon: '😢', color: '#8c8c8c' },
  { value: 'excited', label: '兴奋', icon: '😃', color: '#52c41a' },
  { value: 'tired', label: '疲惫', icon: '😵', color: '#7b68ee' },
  { value: 'surprised', label: '惊讶', icon: '😮', color: '#e8932a' },
  { value: 'confused', label: '困惑', icon: '😕', color: '#8c8c8c' }
]

const ratingLabels = [
  '', '非常低落', '很低落', '比较低落', '略有不适',
  '一般', '还不错', '欣欣向荣', '很开心', '非常开心', '极度愉悦'
]

const form = reactive({
  rating: 7,
  emotion: '',
  trigger: '',
  thoughts: '',
  sleepQuality: '',
  stressLevel: ''
})

const ratingText = computed(() => form.rating ? ratingLabels[form.rating] : '')

function handleReset() {
  form.rating = 0
  form.emotion = ''
  form.trigger = ''
  form.thoughts = ''
  form.sleepQuality = ''
  form.stressLevel = ''
}

// 情绪值→中文标签映射
const emotionLabelMap = {
  happy: '开心', calm: '平静', anxious: '焦虑',
  sad: '悲伤', excited: '兴奋', tired: '疲惫',
  surprised: '惊讶', confused: '困惑'
}

// 文本等级→数字映射
const levelToScore = { '很低': 1, '较低': 2, '中等': 3, '较高': 4, '很高': 5 }
const sleepToScore = { '很差': 1, '较差': 2, '一般': 3, '较好': 4, '很好': 5 }

function handleSubmit() {
  if (!form.rating) {
    ElMessage.warning('请进行情绪评分')
    return
  }
  if (!form.emotion) {
    ElMessage.warning('请选择主要情绪')
    return
  }

  const today = new Date()
  const dateStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0')

  const params = {
    diaryDate: dateStr,
    moodScore: form.rating,
    dominantEmotion: emotionLabelMap[form.emotion] || form.emotion,
    emotionTriggers: form.trigger,
    diaryContent: form.thoughts,
    sleepQuality: sleepToScore[form.sleepQuality] || 3,
    stressLevel: levelToScore[form.stressLevel] || 3
  }

  emotionDiaryCreate(params)
    .then(() => {
      ElMessage.success('情绪日记已提交')
      handleReset()
    })
    .catch(() => {
      ElMessage.error('提交失败，请稍后重试')
    })
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.mood-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f2f5;
  overflow-y: auto;
}

.mood-header {
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

.mood-banner {
  background: linear-gradient(135deg, #7ab648 0%, #c0a030 100%);
  padding: 24px 0;
  flex-shrink: 0;
}

.banner-content {
  max-width: 900px;
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

.mood-body {
  flex: 1;
  padding: 24px;
}

.mood-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mood-card {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.card-subtitle {
  font-size: 14px;
  color: #909399;
  margin-bottom: 16px;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  font-size: 22px;
  color: #dcdfe6;
  cursor: pointer;
  transition: color 0.15s;
}

.star.active {
  color: #f5a623;
}

.star:hover {
  color: #f5b731;
}

.rating-label {
  font-size: 14px;
  color: #606266;
  margin-left: 8px;
}

.emotion-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.emotion-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.emotion-item:hover {
  border-color: #c0c4cc;
  background: #fafafa;
}

.emotion-item.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.emotion-icon {
  font-size: 36px;
  line-height: 1;
}

.emotion-label {
  font-size: 14px;
  color: #606266;
}

.field-group {
  margin-bottom: 20px;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.textarea-wrapper {
  position: relative;
}

.mood-textarea {
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #303133;
  background: #e0e0e0;
  resize: none;
  outline: none;
  line-height: 1.6;
  font-family: inherit;
  transition: background 0.3s;
  box-sizing: border-box;
}

.mood-textarea::placeholder {
  color: #888;
}

.mood-textarea:focus {
  background: #d5d5d5;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 6px;
}

.select-row {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.select-group {
  flex: 1;
}

.mood-select {
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.btn-reset {
  border-color: #dcdfe6;
  color: #606266;
}

.btn-submit {
  background: #409eff;
  border-color: #409eff;
}
</style>
