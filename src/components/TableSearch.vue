<template>
  <el-form :inline="true" class="search-form">
    <!-- 文章标题输入框 -->
    <el-form-item label="文章标题">
      <el-input v-model="form.title" placeholder="请输入文章标题" clearable />
    </el-form-item>

    <!-- 按钮区域 -->
    <el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  title: ''
})

const emit = defineEmits(['search'])

function handleSearch() {
  emit('search', { ...form })
}

function handleReset() {
  form.title = ''
  emit('search', { ...form })
}
</script>

<style scoped>
.search-form {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
}

.search-form .el-form-item {
  margin-bottom: 0;
  margin-right: 20px;
}

.search-form .el-input,
.search-form .el-select {
  width: 200px;
}
</style>
