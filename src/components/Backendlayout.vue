<template>
  <el-container class="backend-layout">
    <el-aside :width="adminStore.isCollapse ? '64px' : '200px'">
      <MenuBack />
    </el-aside>
    <el-container class="main-container">
      <el-header height="60px">
        <NavbarBack />
      </el-header>
      <div class="content-container">
        <router-view />
      </div>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import MenuBack from './MenuBack.vue'
import NavbarBack from './NavbarBack.vue'
import { UseAdminStore } from '@/stores/admin'

const adminStore = UseAdminStore()
</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
}

.el-aside {
  overflow: hidden;
}

.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.el-header) {
  flex-shrink: 0;
}

:deep(.content-container) {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f7fa;
}
</style>
