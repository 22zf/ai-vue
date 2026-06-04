<template>
  <div class="dashboard-page">
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-icon icon-users">
          <el-icon :size="28"><User /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-label">总用户数</div>
          <div class="stat-value">{{ sys.totalUsers ?? '--' }}</div>
          <div class="stat-sub">活跃用户: {{ sys.activeUsers ?? '--' }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-diary">
          <el-icon :size="28"><Connection /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-label">情绪日志</div>
          <div class="stat-value">{{ sys.totalDiaries ?? '--' }}</div>
          <div class="stat-sub">今日新增: {{ sys.todayNewDiaries ?? '--' }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-consult">
          <el-icon :size="28"><ChatDotSquare /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-label">咨询会话</div>
          <div class="stat-value">{{ sys.totalSessions ?? '--' }}</div>
          <div class="stat-sub">今日新增: {{ sys.todayNewSessions ?? '--' }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-mood">
          <el-icon :size="28"><Smile /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-label">平均情绪</div>
          <div class="stat-value">{{ sys.avgMoodScore ?? '--' }}/10</div>
          <div class="stat-sub">情绪健康指数</div>
        </div>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-panel">
        <div class="panel-header">情绪趋势分析</div>
        <div ref="emotionChartRef" class="chart-container"></div>
      </div>
      <div class="chart-panel">
        <div class="panel-header">咨询会话统计</div>
        <div class="consult-summary">
          <div class="summary-item">
            <span class="summary-label">总会话数</span>
            <span class="summary-value">{{ stats.totalSessions ?? '--' }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">平均时长</span>
            <span class="summary-value">{{ stats.avgDurationMinutes ?? '--' }}分钟</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">活跃用户</span>
            <span class="summary-value">{{ sys.activeUsers ?? '--' }}</span>
          </div>
        </div>
        <div ref="consultChartRef" class="chart-container"></div>
      </div>
    </div>

    <div class="chart-panel full-width-panel">
      <div class="panel-header">用户活跃度趋势</div>
      <div ref="activityChartRef" class="chart-container chart-container-lg"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import { dataOverview } from '@/api/admin'

const sys = reactive({})
const stats = reactive({})
const emotionDates = ref([])
const emotionScores = ref([])
const emotionCounts = ref([])
const consultDates = ref([])
const consultSessions = ref([])
const consultUsers = ref([])
const actDates = ref([])
const actActive = ref([])
const actNew = ref([])
const actDiary = ref([])
const actConsult = ref([])

const emotionChartRef = ref(null)
const consultChartRef = ref(null)
const activityChartRef = ref(null)

let emotionChart = null
let consultChart = null
let activityChart = null

const COLORS = {
  yellow: '#f0b940',
  red: '#e8605c',
  blue: '#5470c6',
  green: '#67c23a',
  purple: '#7c6cf0',
  pink: '#e8607c'
}

function parseOverviewData(data) {
  if (data.systemOverview) {
    Object.assign(sys, data.systemOverview)
  }

  if (data.consultationStats) {
    stats.totalSessions = data.consultationStats.totalSessions
    stats.avgDurationMinutes = data.consultationStats.avgDurationMinutes
    const trend = data.consultationStats.dailyTrend || []
    consultDates.value = trend.map(i => i.date)
    consultSessions.value = trend.map(i => i.sessionCount)
    consultUsers.value = trend.map(i => i.userCount)
  }

  const emotionTrend = data.emotionTrend || []
  emotionDates.value = emotionTrend.map(i => i.date)
  emotionScores.value = emotionTrend.map(i => i.avgMoodScore)
  emotionCounts.value = emotionTrend.map(i => i.recordCount)

  const userActivity = data.userActivity || []
  actDates.value = userActivity.map(i => i.date)
  actActive.value = userActivity.map(i => i.activeUsers)
  actNew.value = userActivity.map(i => i.newUsers)
  actDiary.value = userActivity.map(i => i.diaryUsers)
  actConsult.value = userActivity.map(i => i.consultationUsers)
}

function initEmotionChart() {
  if (!emotionChartRef.value) return
  emotionChart = echarts.init(emotionChartRef.value)
  emotionChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: {
      data: ['平均情绪评分', '记录数量'],
      top: 10,
      textStyle: { fontSize: 12, color: '#666' }
    },
    grid: { left: 50, right: 50, top: 50, bottom: 40 },
    xAxis: {
      type: 'category',
      data: emotionDates.value,
      axisLabel: { fontSize: 11, color: '#999' },
      axisLine: { lineStyle: { color: '#e0e0e0' } }
    },
    yAxis: [
      {
        type: 'value', name: '情绪评分',
        nameTextStyle: { fontSize: 11, color: '#999' },
        axisLabel: { fontSize: 11, color: '#999' },
        splitLine: { lineStyle: { color: '#f0f0f0' } }
      },
      {
        type: 'value', name: '记录数量',
        nameTextStyle: { fontSize: 11, color: '#999' },
        axisLabel: { fontSize: 11, color: '#999' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '平均情绪评分', type: 'line', data: emotionScores.value,
        smooth: true, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: COLORS.yellow, width: 2 },
        itemStyle: { color: COLORS.yellow },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(240,185,64,0.25)' },
            { offset: 1, color: 'rgba(240,185,64,0.02)' }
          ])
        }
      },
      {
        name: '记录数量', type: 'line', yAxisIndex: 1, data: emotionCounts.value,
        smooth: true, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: COLORS.red, width: 2 },
        itemStyle: { color: COLORS.red }
      }
    ]
  })
}

function initConsultChart() {
  if (!consultChartRef.value) return
  consultChart = echarts.init(consultChartRef.value)
  consultChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: ['会话数量', '参与用户数'],
      top: 10,
      textStyle: { fontSize: 12, color: '#666' }
    },
    grid: { left: 40, right: 20, top: 50, bottom: 40 },
    xAxis: {
      type: 'category',
      data: consultDates.value,
      axisLabel: { fontSize: 11, color: '#999' },
      axisLine: { lineStyle: { color: '#e0e0e0' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 11, color: '#999' },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: '会话数量', type: 'bar', barWidth: '35%',
        data: consultSessions.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#5470c6' },
            { offset: 1, color: '#7b9cf6' }
          ]),
          borderRadius: [3, 3, 0, 0]
        }
      },
      {
        name: '参与用户数', type: 'bar', barWidth: '35%',
        data: consultUsers.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#f0b940' },
            { offset: 1, color: '#f5d080' }
          ]),
          borderRadius: [3, 3, 0, 0]
        }
      }
    ]
  })
}

function initActivityChart() {
  if (!activityChartRef.value) return
  activityChart = echarts.init(activityChartRef.value)
  activityChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
      top: 10,
      textStyle: { fontSize: 12, color: '#666' }
    },
    grid: { left: 50, right: 30, top: 50, bottom: 40 },
    xAxis: {
      type: 'category',
      data: actDates.value,
      axisLabel: { fontSize: 11, color: '#999' },
      axisLine: { lineStyle: { color: '#e0e0e0' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 11, color: '#999' },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: '活跃用户', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
        data: actActive.value,
        lineStyle: { color: COLORS.purple, width: 2 },
        itemStyle: { color: COLORS.purple },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(124,108,240,0.25)' },
            { offset: 1, color: 'rgba(124,108,240,0.02)' }
          ])
        }
      },
      {
        name: '新增用户', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
        data: actNew.value,
        lineStyle: { color: COLORS.yellow, width: 2 },
        itemStyle: { color: COLORS.yellow },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(240,185,64,0.2)' },
            { offset: 1, color: 'rgba(240,185,64,0.02)' }
          ])
        }
      },
      {
        name: '日记用户', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
        data: actDiary.value,
        lineStyle: { color: COLORS.green, width: 2 },
        itemStyle: { color: COLORS.green },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103,194,58,0.2)' },
            { offset: 1, color: 'rgba(103,194,58,0.02)' }
          ])
        }
      },
      {
        name: '咨询用户', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
        data: actConsult.value,
        lineStyle: { color: COLORS.pink, width: 2 },
        itemStyle: { color: COLORS.pink },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(232,96,124,0.2)' },
            { offset: 1, color: 'rgba(232,96,124,0.02)' }
          ])
        }
      }
    ]
  })
}

function handleResize() {
  emotionChart?.resize()
  consultChart?.resize()
  activityChart?.resize()
}

onMounted(async () => {
  try {
    const data = await dataOverview()
    parseOverviewData(data || {})
  } catch {
    // 接口失败时使用空数据渲染
  }
  await nextTick()
  initEmotionChart()
  initConsultChart()
  initActivityChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  emotionChart?.dispose()
  consultChart?.dispose()
  activityChart?.dispose()
})
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-users {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.icon-diary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.icon-consult {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.icon-mood {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-sub {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-panel {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.panel-header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.chart-container {
  width: 100%;
  height: 320px;
}

.chart-container-lg {
  height: 380px;
}

.full-width-panel {
  width: 100%;
}

.consult-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.summary-label {
  font-size: 12px;
  color: #909399;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

@media (max-width: 1200px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .chart-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stat-cards {
    grid-template-columns: 1fr;
  }
}
</style>
