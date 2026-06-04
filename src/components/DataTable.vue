<template>
  <div class="data-table">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      :header-cell-style="{
        backgroundColor: '#f5f7fa',
        color: '#606266',
        fontWeight: 500
      }"
    >
      <!-- 文章标题 -->
      <el-table-column label="文章标题" min-width="200">
        <template #default="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <!-- 分类 -->
      <el-table-column prop="categoryName" label="分类" width="120" />

      <!-- 作者 -->
      <el-table-column prop="authorName" label="作者" width="120" />

      <!-- 阅读量 -->
      <el-table-column prop="readCount" label="阅读量" width="80" />

      <!-- 状态 -->
      <el-table-column prop="statusText" label="状态" width="80" />

      <!-- 发布时间 -->
      <el-table-column prop="publishedAt" label="发布时间" width="160" />

      <!-- 操作列 -->
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <div class="action-btns">
            <el-button type="primary" link @click="emit('edit', row)">编辑</el-button>
            <el-button type="danger" link @click="emit('delete', row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
const emit = defineEmits(['edit', 'delete'])

defineProps({
  tableData: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.data-table {
  width: 100%;
}

.data-table .el-table {
  border-radius: 4px;
}

.action-btns {
  display: flex;
  gap: 8px;
}
</style>
