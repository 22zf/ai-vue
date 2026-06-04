<template>
<div class="navbar-container">
  <div class="navbar-left">
    <el-icon class="nav-icon" @click="toggleCollapse">
      <component :is="currentMenuItem.icon" />
    </el-icon>
    <span class="title">{{ currentMenuItem.title }}</span>
  </div>
  <div class="navbar-right">
    <el-dropdown trigger="hover" @command="handleCommand">
      <div class="user-trigger">
        <el-icon class="user-icon"><Avatar /></el-icon>
        <span class="user-name">admin</span>
        <el-icon class="arrow-icon"><ArrowDown /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Avatar,
  ArrowDown,
  SwitchButton,
} from '@element-plus/icons-vue'
import { UseAdminStore } from '@/stores/admin'
import { logout } from '@/api/admin'
import { getBackMenus } from '@/utils/menu'

const adminStore = UseAdminStore()
const router = useRouter()

const toggleCollapse = () => {
  adminStore.toggleCollapse()
}

const route = useRoute()

const currentMenuItem = computed(() => {
  return getBackMenus().find(m => m.path === route.path) || { title: '', icon: null }
})

function handleCommand(command: string) {
  if (command === 'logout') {
    logout().finally(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    })
  }
}
</script>

<style scoped>
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.nav-icon {
  font-size: 30px;
  color: #409EFF;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-trigger:hover {
  background-color: #f5f7fa;
}

.user-icon {
  font-size: 20px;
  color: #909399;
}

.user-name {
  font-size: 14px;
  color: #333;
}

.arrow-icon {
  font-size: 12px;
  color: #909399;
}
</style>
