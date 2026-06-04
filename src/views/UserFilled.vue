<template>
  <div class="emotion-page">
    <PageHead title="情绪日志" />

    <div class="search-bar">
      <div class="search-item">
        <span class="search-label">用户ID</span>
        <el-input v-model="searchUserId" placeholder="请输入用户ID" clearable style="width: 180px" />
      </div>
      <div class="search-item">
        <span class="search-label">情绪评分</span>
        <el-select v-model="searchMoodRange" placeholder="选择评分范围" clearable style="width: 200px">
          <el-option label="1-2分（低落）" value="1-2" />
          <el-option label="3-4分（一般）" value="3-4" />
          <el-option label="5-6分（中等）" value="5-6" />
          <el-option label="7-8分（良好）" value="7-8" />
          <el-option label="9-10分（优秀）" value="9-10" />
        </el-select>
      </div>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

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
        <!-- ID -->
        <el-table-column prop="id" label="ID" width="60" />

        <!-- 会话ID / 用户头像 -->
        <el-table-column label="会话ID" width="100">
          <template #default="{ row }">
            <div class="user-cell">
              <div class="avatar">{{ (row.userNickname || '?').charAt(0).toUpperCase() }}</div>
              <span class="username">{{ row.userNickname || '匿名' }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 记录日期 -->
        <el-table-column prop="recordDate" label="记录日期" width="120" />

        <!-- 情绪评分（星星） -->
        <el-table-column label="情绪评分" width="180">
          <template #default="{ row }">
            <div class="star-rating">
              <span
                v-for="i in 10"
                :key="i"
                class="star"
                :class="{ 'star-filled': i <= row.moodScore }"
              >★</span>
            </div>
          </template>
        </el-table-column>

        <!-- 生活指标 -->
        <el-table-column label="生活指标" width="140">
          <template #default="{ row }">
            <div class="life-indicator">
              <div>睡眠:{{ row.sleepScore }}/5</div>
              <div>压力:{{ row.stressScore }}/5</div>
            </div>
          </template>
        </el-table-column>

        <!-- 情绪触发因素 -->
        <el-table-column prop="triggerFactor" label="情绪触发因素" min-width="140" />

        <!-- 日记内容 -->
        <el-table-column prop="diaryContent" label="日记内容" min-width="120" />

        <!-- 操作 -->
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
              <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

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
    <el-dialog v-model="detailVisible" title="情绪日记详情" width="780px" @close="detailData = null">
      <div v-if="detailData" class="detail-dialog">

        <!-- 用户信息 -->
        <div class="section-title">用户信息</div>
        <div class="info-table">
          <div class="info-table-row">
            <div class="info-table-cell label">用户名</div>
            <div class="info-table-cell value">{{ detailData.username }}</div>
            <div class="info-table-cell label">昵称</div>
            <div class="info-table-cell value">{{ detailData.userNickname }}</div>
          </div>
          <div class="info-table-row">
            <div class="info-table-cell label">用户ID</div>
            <div class="info-table-cell value">{{ detailData.userId }}</div>
            <div class="info-table-cell label">记录日期</div>
            <div class="info-table-cell value">{{ detailData.recordDate }}</div>
          </div>
        </div>

        <!-- 情绪状态 -->
        <div class="section-title">情绪状态</div>
        <div class="info-table">
          <div class="info-table-row">
            <div class="info-table-cell label">情绪评分</div>
            <div class="info-table-cell value">
              <div class="star-rating" style="margin-right: 8px;">
                <span v-for="i in 10" :key="i" class="star" :class="{ 'star-filled': i <= detailData.moodScore }">★</span>
              </div>
              <span>{{ detailData.moodScore }}</span>
            </div>
            <div class="info-table-cell label">主要情绪</div>
            <div class="info-table-cell value">
              <el-tag size="small">{{ detailData.dominantEmotion }}</el-tag>
            </div>
          </div>
          <div class="info-table-row">
            <div class="info-table-cell label">睡眠质量</div>
            <div class="info-table-cell value">{{ detailData.sleepScore }}/5</div>
            <div class="info-table-cell label">压力水平</div>
            <div class="info-table-cell value">{{ detailData.stressScore }}/5</div>
          </div>
        </div>

        <!-- 日记内容 -->
        <div class="section-title">日记内容</div>
        <div class="info-table">
          <div class="info-table-row">
            <div class="info-table-cell label">情绪触发因素</div>
            <div class="info-table-cell value">{{ detailData.triggerFactor }}</div>
          </div>
          <div class="info-table-row">
            <div class="info-table-cell label">日记内容</div>
            <div class="info-table-cell value">{{ detailData.diaryContent }}</div>
          </div>
        </div>

        <!-- AI情绪分析结果 -->
        <div class="section-title">AI情绪分析结果</div>
        <div class="info-table">
          <div class="info-table-row">
            <div class="info-table-cell label">主要情绪</div>
            <div class="info-table-cell value">
              <el-tag size="small" type="info">{{ detailData.analysisEmotion || '中性' }}</el-tag>
            </div>
            <div class="info-table-cell label">情绪强度</div>
            <div class="info-table-cell value">
              <div class="intensity-bar">
                <div class="intensity-fill" :style="{ width: (detailData.intensity || 50) + '%' }"></div>
              </div>
              <span class="intensity-text">{{ detailData.intensity || 50 }}%</span>
            </div>
          </div>
          <div class="info-table-row">
            <div class="info-table-cell label">风险等级</div>
            <div class="info-table-cell value">
              <el-tag size="small" type="success">{{ detailData.riskLevel || '正常' }}</el-tag>
            </div>
            <div class="info-table-cell label">情绪性质</div>
            <div class="info-table-cell value">
              <el-tag size="small" type="success">{{ detailData.emotionNature || '正面情绪' }}</el-tag>
            </div>
          </div>
        </div>

        <div class="ai-card">
          <div class="ai-card-title">专业建议</div>
          <div class="ai-card-content">{{ detailData.professionalAdvice || '暂无' }}</div>
        </div>

        <div class="ai-card">
          <div class="ai-card-title">风险描述</div>
          <div class="ai-card-content">{{ detailData.riskDescription || '暂无' }}</div>
        </div>

        <div class="ai-card">
          <div class="ai-card-title">改善建议</div>
          <div class="ai-card-content">
            <div v-for="(item, idx) in improvementSuggestions" :key="idx">{{ item }}</div>
          </div>
        </div>

        <div class="analysis-time" v-if="detailData.analysisTime">
          分析时间: {{ detailData.analysisTime }}
        </div>

        <!-- 时间信息 -->
        <div class="section-title">时间信息</div>
        <div class="info-table">
          <div class="info-table-row">
            <div class="info-table-cell label">创建时间</div>
            <div class="info-table-cell value">{{ detailData.createdAt }}</div>
            <div class="info-table-cell label">更新时间</div>
            <div class="info-table-cell value">{{ detailData.updatedAt }}</div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHead from '@/components/PageHead.vue'
import { emotionDiaryPage, emotionDiaryDetail, emotionDiaryDelete } from '@/api/admin'

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(8)
const total = ref(0)

const searchUserId = ref('')
const searchMoodRange = ref('')

const detailVisible = ref(false)
const detailData = ref(null)

const improvementSuggestions = computed(() => {
  if (!detailData.value || !detailData.value.improvementSuggestions) return []
  if (Array.isArray(detailData.value.improvementSuggestions)) {
    return detailData.value.improvementSuggestions
  }
  return detailData.value.improvementSuggestions.split(/\n|；|;|，/).filter(Boolean)
})

onMounted(() => {
  loadData()
})

function loadData() {
  const params = {
    current: currentPage.value,
    size: pageSize.value
  }
  if (searchUserId.value) {
    params.userId = searchUserId.value
  }
  if (searchMoodRange.value) {
    const [min, max] = searchMoodRange.value.split('-')
    params.minMoodScore = min
    params.maxMoodScore = max
  }
  emotionDiaryPage(params)
    .then(res => {
      tableData.value = res.records || []
      total.value = res.total || 0
    })
    .catch(() => {
      ElMessage.error('获取情绪日志失败')
    })
}

function handleSearch() {
  currentPage.value = 1
  loadData()
}

function handleReset() {
  searchUserId.value = ''
  searchMoodRange.value = ''
  currentPage.value = 1
  loadData()
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
  emotionDiaryDetail(row.id)
    .then(res => {
      detailData.value = res
      detailVisible.value = true
    })
    .catch(() => {
      ElMessage.error('获取详情失败')
    })
}

function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该日志吗？', '提示', { type: 'warning' })
    .then(() => {
      emotionDiaryDelete(row.id)
        .then(() => {
          ElMessage.success('删除成功')
          loadData()
        })
        .catch(() => {
          ElMessage.error('删除失败')
        })
    })
    .catch(() => {})
}
</script>

<style scoped>
.emotion-page {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-label {
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}

.table-container {
  background: #fff;
  border-radius: 4px;
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #c0c4cc;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;
}

.username {
  color: #606266;
  font-size: 13px;
}

.star-rating {
  display: flex;
  gap: 1px;
}

.star {
  color: #dcdfe6;
  font-size: 16px;
  line-height: 1;
}

.star-filled {
  color: #f7ba2a;
}

.life-indicator {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

.action-btns {
  display: flex;
  gap: 8px;
}

.detail-dialog {
  max-height: 70vh;
  overflow-y: auto;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
  margin-top: 20px;
}

.section-title:first-child {
  margin-top: 0;
}

.info-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.info-table-row {
  display: flex;
}

.info-table-row:not(:last-child) {
  border-bottom: 1px solid #ebeef5;
}

.info-table-cell {
  flex: 1;
  padding: 10px 14px;
  font-size: 13px;
  display: flex;
  align-items: center;
}

.info-table-cell.label {
  background: #f5f7fa;
  color: #909399;
  font-weight: 500;
  flex: 0 0 100px;
}

.info-table-cell.value {
  color: #303133;
  background: #fff;
}

.info-table-cell.value:nth-child(4) {
  flex: 1;
}

.intensity-bar {
  width: 120px;
  height: 10px;
  background: #e4e7ed;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 8px;
}

.intensity-fill {
  height: 100%;
  background: #909399;
  border-radius: 5px;
  transition: width 0.3s;
}

.intensity-text {
  color: #606266;
  font-size: 13px;
  white-space: nowrap;
}

.ai-card {
  background: #f5f7fa;
  border-radius: 4px;
  padding: 14px 16px;
  margin-top: 12px;
}

.ai-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.ai-card-content {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

.analysis-time {
  margin-top: 16px;
  font-size: 12px;
  color: #909399;
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
  margin-bottom: 10px;
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

.detail-section-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 10px;
}

.detail-content-box {
  padding: 14px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.8;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
