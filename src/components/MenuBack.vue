<template>
  <el-aside width="200px" class="main-container">
  <el-menu
    active-text-color="#409EFF"
    background-color="#ffffff"
    class="el-menu-vertical-demo"
    :default-active="currentPath"
    text-color="#333333"
    :collapse="adminStore.isCollapse"
    router
  >
    <div class="brand">
      <el-image :src="iconurl" alt="logo" class="brand-image"/>
      <div class="info-card">
        <span class="brand-title">心理健康AI助手</span>
        <span class="brand-subtitle">管理后台</span>
      </div>
    </div>
    <el-menu-item
      v-for="item in menuItems"
      :key="item.path"
      :index="item.path"
    >
      <el-icon>
        <component :is="item.icon" />
      </el-icon>
      <span>{{ item.title }}</span>
    </el-menu-item>
  </el-menu>
  </el-aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { UseAdminStore } from '@/stores/admin'
import { getBackMenus } from '@/utils/menu'

const adminStore = UseAdminStore()

const route = useRoute()
const iconurl = new URL('/src/assets/vue.svg', import.meta.url).href

const menuItems = getBackMenus()

const currentPath = computed(() => {
  return route.path
})
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 100vh;
  border-right: 1px solid #e5e7eb;
  overflow: hidden;
}

.main-container {
  overflow: hidden;
}

:deep(.el-scrollbar__bar) {
  display: none !important;
}

.brand {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #ffffff;
}

.brand-image {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.info-card {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  line-height: 1.4;
}

.brand-subtitle {
  font-size: 10px;
  color: #666666;
  line-height: 1.4;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}

:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
  border-right: 3px solid #409EFF;
}

:deep(.el-menu-item:hover) {
  background-color: #f5f7fa;
}

:deep(.el-icon) {
  font-size: 18px;
  margin-right: 8px;
}
</style>
