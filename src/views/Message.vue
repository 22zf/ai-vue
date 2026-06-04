<template>
  <div class="consult-page">
    <PageHead title="咨询记录" />

    <div class="table-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{
          backgroundColor: '#f5f7fa',
          color: '#606266',
          fontWeight: 500
        }"
      >
        <!-- 用户 -->
        <el-table-column label="用户" width="120">
          <template #default="{ row }">
            <div class="user-cell">
              <div class="avatar">{{ (row.userNickname || '?').charAt(0).toUpperCase() }}</div>
              <span class="username">{{ row.userNickname || '匿名用户' }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 会话预览 -->
        <el-table-column label="会话预览" min-width="400">
          <template #default="{ row }">
            <div class="preview-cell">
              <div class="preview-header">
                <span class="bot-name">{{ row.sessionTitle }}</span>
                <span class="preview-time"> · {{ row.lastMessageTime }}</span>
              </div>
              <div class="preview-content">{{ row.lastMessageContent }}</div>
            </div>
          </template>
        </el-table-column>

        <!-- 消息数 -->
        <el-table-column prop="messageCount" label="消息数" width="80" align="center" />

        <!-- 开始时间 -->
        <el-table-column prop="startedAt" label="开始时间" width="160" />

        <!-- 操作 -->
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-area">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[8, 10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="咨询会话详情" width="720px" @close="detailData = null">
      <div v-if="detailData" class="detail-dialog">
        <!-- 会话基本信息 -->
        <div class="detail-info">
          <div class="info-row">
            <span class="info-label">用户：</span>
            <span class="info-value">{{ detailData.userNickname || '匿名用户' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">开始时间：</span>
            <span class="info-value">{{ detailData.startedAt }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">消息数：</span>
            <span class="info-value">{{ detailData.messageCount }}条</span>
          </div>
        </div>

        <!-- 对话记录标题 -->
        <div class="chat-title">对话记录</div>

        <!-- 对话记录列表 -->
        <div class="chat-list" v-if="messages.length > 0">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="chat-item"
            :class="msg.senderType === 1 ? 'chat-user' : 'chat-ai'"
          >
            <div class="chat-header">
              <span class="chat-role">{{ msg.senderTypeDesc || (msg.senderType === 1 ? '用户' : 'AI助手') }}</span>
              <span class="chat-time">{{ msg.createdAt }}</span>
            </div>
            <div class="chat-content">{{ msg.content }}</div>
          </div>
        </div>
        <div v-else class="empty-chat">暂无对话记录</div>
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageHead from '@/components/PageHead.vue'
import { consultPage, consultDetail, consultMessages } from '@/api/admin'

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(8)
const total = ref(0)

const detailVisible = ref(false)
const detailData = ref(null)
const messages = ref([])

onMounted(() => {
  loadData()
})

function loadData() {
  const params = {
    currentPage: currentPage.value,
    size: pageSize.value
  }
  consultPage(params)
    .then(res => {
      tableData.value = res.records || []
      total.value = res.total || 0
    })
    .catch(() => {
      ElMessage.error('获取咨询记录失败')
    })
}

function handleSizeChange(val) {
  pageSize.value = val
  currentPage.value = 1
  loadData()
}

function handleCurrentChange(val) {
  currentPage.value = val
  loadData()
}

function handleDetail(row) {
  detailVisible.value = true
  detailData.value = null
  messages.value = []

  Promise.all([
    consultDetail(row.id),
    consultMessages(row.id)
  ])
    .then(([detail, msgs]) => {
      detailData.value = detail
      messages.value = msgs || []
    })
    .catch(() => {
      ElMessage.error('获取咨询详情失败')
    })
}
</script>

<style scoped>
.consult-page {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.table-container {
  background: #fff;
  border-radius: 4px;
  padding: 0;
}

.pagination-area {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #c0c4cc;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.username {
  color: #606266;
  font-size: 13px;
}

.preview-cell {
  line-height: 1.6;
}

.preview-header {
  margin-bottom: 4px;
}

.bot-name {
  color: #303133;
  font-weight: 500;
  font-size: 13px;
}

.preview-time {
  color: #909399;
  font-size: 12px;
}

.preview-content {
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 500px;
}

.detail-item {
  margin-bottom: 12px;
  font-size: 14px;
}

.detail-label {
  color: #909399;
  font-weight: 500;
}

.detail-content {
  margin-top: 16px;
}

.content-box {
  margin-top: 8px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.8;
  color: #303133;
  white-space: pre-wrap;
}

.detail-dialog {
  max-height: 65vh;
  display: flex;
  flex-direction: column;
}

.detail-info {
  background: #f5f7fa;
  padding: 16px 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #909399;
  width: 80px;
  flex-shrink: 0;
}

.info-value {
  color: #303133;
}

.chat-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
}

.chat-list {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow-y: auto;
  max-height: 400px;
}

.empty-chat {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}

.chat-item {
  padding: 14px 20px;
  border-bottom: 1px solid #ebeef5;
}

.chat-item:last-child {
  border-bottom: none;
}

.chat-user {
  background: #f5f7fa;
}

.chat-ai {
  background: #f0faf4;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.chat-role {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.chat-user .chat-role {
  color: #606266;
}

.chat-ai .chat-role {
  color: #303133;
}

.chat-time {
  font-size: 12px;
  color: #909399;
}

.chat-content {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
