<template>
  <div class="chat-page">
    <header class="home-header">
      <div class="header-content">
        <div class="header-left" @click="router.push('/')">
          <el-icon :size="28" color="#4a9e85"><Monitor /></el-icon>
          <span class="logo-text">心理健康AI助手</span>
        </div>
        <nav class="header-nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/chat" class="nav-link active">AI咨询</router-link>
          <router-link to="/mood" class="nav-link">情绪日记</router-link>
          <router-link to="/knowledge" class="nav-link">知识库</router-link>
          <span class="nav-link logout-link" @click="handleLogout">退出登录</span>
        </nav>
      </div>
    </header>

    <div class="chat-body">
      <aside class="chat-sidebar">
        <div class="assistant-card">
          <div class="assistant-icon">
            <el-icon :size="28" color="#fff"><ChatDotRound /></el-icon>
          </div>
          <div class="assistant-name">宁渡AI助手</div>
          <div class="assistant-status">
            <span class="status-dot"></span>
            在线服务中
          </div>
        </div>

        <div class="emotion-card">
          <div class="emotion-title">情绪花园</div>
          <template v-if="emotionData">
            <div class="emotion-gauge">
              <div class="gauge-circle">
                <div class="gauge-label">
                  <span class="gauge-level">{{ emotionData.label || '中性' }}</span>
                  <span class="gauge-score">{{ emotionData.emotionScore || 0 }}分</span>
                </div>
              </div>
            </div>
            <div class="emotion-feeling">
              {{ emotionData.icon || '' }} 情绪 <strong>{{ emotionData.primaryEmotion || '--' }}</strong>
            </div>
            <div class="emotion-tip">
              <div class="tip-header">💗 当前状态</div>
              <div class="tip-content">{{ emotionData.riskDescription || '情绪稳定' }}</div>
            </div>
          </template>
          <template v-else>
            <div class="emotion-empty">暂无数据</div>
          </template>
        </div>

        <div class="history-card">
          <div class="history-title">会话历史</div>
          <div v-if="sessionLoading" class="history-empty">加载中...</div>
          <div v-else-if="sessions.length === 0" class="history-empty">暂无会话记录</div>
          <div v-else class="history-list">
            <div
              v-for="session in sessions"
              :key="session.id"
              class="history-item"
              :class="{ active: currentSessionId === session.id }"
              @click="loadSession(session.id)"
            >
              <div class="history-item-title">{{ session.sessionTitle || '会话' + session.id }}</div>
              <div class="history-item-time">{{ formatTime(session.startedAt) }}</div>
            </div>
          </div>
        </div>
      </aside>

      <main class="chat-main">
        <div class="chat-header-bar">
          <div class="chat-header-left">
            <div class="chat-header-icon">💗</div>
            <div>
              <div class="chat-header-name">宁渡AI助手</div>
              <div class="chat-header-desc">您的贴心AI心理健康助手</div>
            </div>
          </div>
          <el-icon class="chat-new-btn" :size="22" color="#fff" @click="handleNewSession"><Plus /></el-icon>
        </div>

        <div class="chat-messages" ref="messagesRef">
          <div class="message-item" v-for="(msg, index) in messages" :key="index">
            <div class="message-avatar">
              <el-icon :size="18" color="#fff"><ChatDotRound /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-bubble">{{ msg.content }}</div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <div class="input-wrapper">
            <textarea
              v-model="inputText"
              class="chat-input"
              :placeholder="streaming ? 'AI 正在回复中...' : '请输入您想要分享的内容...'"
              :readonly="streaming"
              maxlength="500"
              rows="1"
              @keydown="handleKeydown"
              @input="autoResize"
              ref="inputRef"
            />
            <el-icon class="send-btn" :class="{ disabled: streaming }" :size="20" color="#fff" @click="sendMessage"><Promotion /></el-icon>
          </div>
          <div class="input-footer">
            <span class="input-hint">按Enter发送，Shift+Enter换行</span>
            <span class="input-count">{{ inputText.length }}/500</span>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Monitor, ChatDotRound, Plus, Promotion } from '@element-plus/icons-vue'
import { consultPage, consultMessages, createSession, streamChat, getSessionEmotion } from '@/api/admin'

const router = useRouter()
const inputText = ref('')
const messagesRef = ref(null)
const inputRef = ref(null)
const streaming = ref(false)

const sessions = ref([])
const sessionLoading = ref(false)
const currentSessionId = ref(null)

const GREETING = '您好！我是小暖，您的AI心理健康助手。很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？'

const messages = ref([
  { content: GREETING, time: '刚刚' }
])

const emotionData = ref(null)

function formatTime(timeStr) {
  if (!timeStr) return ''
  const d = new Date(timeStr)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return d.getMonth() + 1 + '/' + d.getDate() + ' ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0')
}

function fetchSessions() {
  sessionLoading.value = true
  consultPage({ currentPage: 1, size: 20 })
    .then(data => {
      sessions.value = data?.records || []
    })
    .catch(() => {
      sessions.value = []
    })
    .finally(() => {
      sessionLoading.value = false
    })
}

function loadSession(id) {
  // 转为 session_ 前缀格式
  const sessionId = String(id).startsWith('session_') ? id : 'session_' + id
  currentSessionId.value = id

  consultMessages(id)
    .then(data => {
      const list = data?.records || data?.list || data || []
      messages.value = list.map(msg => ({
        content: msg.content || msg.message || '',
        time: formatTime(msg.createdAt || msg.timestamp)
      }))
      if (messages.value.length === 0) {
        messages.value = [{ content: GREETING, time: '刚刚' }]
      }
      scrollToBottom()
    })
    .catch(() => {
      ElMessage.error('加载会话消息失败')
    })

  // 获取情绪分析
  getSessionEmotion(sessionId)
    .then(emotion => {
      emotionData.value = emotion
    })
    .catch(() => {
      emotionData.value = null
    })
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  ElMessage.success('已退出登录')
  router.push('/')
}

function handleNewSession() {
  currentSessionId.value = null
  messages.value = [{ content: GREETING, time: '刚刚' }]
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text || streaming.value) return

  messages.value.push({ content: text, time: '刚刚' })
  inputText.value = ''
  scrollToBottom()

  const aiMsg = { content: '', time: '刚刚' }
  messages.value.push(aiMsg)
  streaming.value = true

  function doStream(sessionId) {
    // 流式接口要求 session_ 前缀格式
    const streamId = String(sessionId).startsWith('session_') ? sessionId : 'session_' + sessionId
    streamChat(
      streamId,
      text,
      (chunk) => {
        const text = chunk?.data?.content || chunk?.content || chunk?.text || chunk?.delta?.content || ''
        aiMsg.content += text
        scrollToBottom()
      },
      () => {
        streaming.value = false
        if (!aiMsg.content) {
          aiMsg.content = '感谢您的分享。'
        }
        fetchSessions()
      }
    ).catch(() => {
      streaming.value = false
      if (!aiMsg.content) {
        aiMsg.content = '网络异常，请稍后重试。'
      }
    })
  }

  if (currentSessionId.value) {
    doStream(currentSessionId.value)
    return
  }

  const title = text.length > 20 ? text.substring(0, 20) + '...' : text
  createSession({ sessionTitle: title, initialMessage: text })
    .then(data => {
      const sessionId = data?.sessionId || data?.id
      if (sessionId) {
        currentSessionId.value = sessionId
      }
      doStream(currentSessionId.value || '')
    })
    .catch(() => {
      streaming.value = false
      aiMsg.content = '创建会话失败，请稍后重试。'
    })
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

function autoResize() {
  const el = inputRef.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }
}

onMounted(() => {
  fetchSessions()
})
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f6fa;
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

.chat-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 20px;
  gap: 20px;
}

.chat-sidebar {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assistant-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.assistant-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5a623, #e8932a);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.assistant-name {
  font-size: 16px;
  font-weight: 600;
  color: #e8932a;
  margin-bottom: 6px;
}

.assistant-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #999;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #52c41a;
}

.emotion-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.emotion-title {
  font-size: 16px;
  font-weight: 600;
  color: #e8932a;
  margin-bottom: 16px;
}

.emotion-gauge {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.gauge-circle {
  width: 100px;
  height: 100px;
  position: relative;
}

.gauge-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.gauge-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 1.3;
}

.gauge-level {
  display: block;
  font-size: 13px;
  color: #606266;
}

.gauge-score {
  display: block;
  font-size: 11px;
  color: #909399;
}

.emotion-feeling {
  text-align: center;
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.emotion-feeling strong {
  color: #303133;
  font-size: 15px;
}

.emotion-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 16px;
  font-size: 13px;
}

.heart {
  opacity: 0.3;
}

.heart.active {
  opacity: 1;
}

.heart-label {
  color: #909399;
  margin-left: 4px;
}

.emotion-empty {
  text-align: center;
  color: #c0c4cc;
  font-size: 13px;
  padding: 10px 0;
}

.emotion-tip {
  background: #fdf6ec;
  border-radius: 8px;
  padding: 12px;
}

.tip-header {
  font-size: 13px;
  color: #e8932a;
  margin-bottom: 4px;
}

.tip-content {
  font-size: 13px;
  color: #606266;
}

.history-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.history-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.history-empty {
  text-align: center;
  font-size: 13px;
  color: #c0c4cc;
  padding: 10px 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: #f5f7fa;
}

.history-item.active {
  background: #fdf6ec;
}

.history-item-title {
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item-time {
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 4px;
}

.chat-main {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header-bar {
  background: linear-gradient(135deg, #f5a623, #e8932a);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-header-icon {
  font-size: 24px;
  line-height: 1;
}

.chat-header-name {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.chat-header-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 2px;
}

.chat-new-btn {
  cursor: pointer;
  opacity: 0.9;
}

.chat-new-btn:hover {
  opacity: 1;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5a623, #e8932a);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
}

.message-bubble {
  font-size: 14px;
  color: #303133;
  line-height: 1.7;
}

.message-time {
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 6px;
}

.chat-input-area {
  border-top: 1px solid #eee;
  padding: 16px 24px;
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.chat-input {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #303133;
  background: #e0e0e0;
  resize: none;
  outline: none;
  line-height: 1.5;
  min-height: 44px;
  max-height: 120px;
  font-family: inherit;
  transition: background 0.3s;
}

.chat-input::placeholder {
  color: #888;
}

.chat-input:focus {
  background: #d5d5d5;
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f5a623, #e8932a);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.3s;
}

.send-btn:hover {
  opacity: 0.9;
}

.send-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.input-hint {
  font-size: 12px;
  color: #c0c4cc;
}

.input-count {
  font-size: 12px;
  color: #c0c4cc;
}
</style>
