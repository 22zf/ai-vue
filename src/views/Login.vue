<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <div class="brand-section">
      <h1 class="brand-title">心理AI助手</h1>
      <p class="brand-desc">
        每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天
      </p>
      <div class="brand-icon">
        <el-icon :size="80" color="#fff"><ChatDotRound /></el-icon>
      </div>
    </div>

    <!-- 右侧登录区 -->
    <div class="login-section">
      <!-- 返回首页 -->
      <div class="back-link" @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回首页</span>
      </div>

      <!-- 登录表单 -->
      <div class="login-box">
        <h2 class="login-title">登录您的账户</h2>
        <p class="login-subtitle">请输入您的登录信息</p>

        <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
          <el-form-item prop="username">
            <div class="form-label">
              <span class="required">*</span>
              <span>用户名或邮箱</span>
            </div>
            <el-input
              v-model="form.username"
              placeholder="请输入用户名或邮箱"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="password">
            <div class="form-label">
              <span class="required">*</span>
              <span>密码</span>
            </div>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="login-btn"
              @click="handleLogin"
            >
              登录账户
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-link">
          还没有账户？ <router-link to="/register">去注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChatDotRound, ArrowLeft } from '@element-plus/icons-vue'
import { login } from '@/api/admin'

const router = useRouter()
const formRef = ref(null)

// 表单数据
const form = reactive({
  username: '',
  password: ''
})

// 校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

// 返回上一页
function handleBack() {
  router.push('/')
}

// 登录处理
function handleLogin() {
  formRef.value.validate((valid) => {
    if (!valid) return

    login({ username: form.username, password: form.password })
      .then(data => {
        if (!data.token) {
          ElMessage.error('登录失败：未返回令牌')
          return
        }
        localStorage.setItem('token', data.token)
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
        if(data.userInfo.userType === 2){
          ElMessage.success('登录成功')
          router.push('/back/dashboard')
        }
        else if(data.userInfo.userType === 1){
          ElMessage.success('登录成功')
          router.push('/')
        }
        else{
          ElMessage.error('登录失败：用户类型错误')
        }
      })
      .catch(err => {
        const msg = typeof err === 'string' ? err : (err?.response?.data?.msg || err?.message)
        ElMessage.error(msg || '登录失败，请检查网络')
      })
  })
}
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  width: 100vw;
}

/* 左侧品牌区 */
.brand-section {
  width: 50%;
  background: linear-gradient(135deg, #4a9e85 0%, #3d8b74 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 40px;
  text-align: center;
}

.brand-title {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 20px;
}

.brand-desc {
  font-size: 14px;
  line-height: 1.8;
  max-width: 320px;
  opacity: 0.9;
  margin-bottom: 40px;
}

.brand-icon {
  width: 120px;
  height: 120px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 右侧登录区 */
.login-section {
  width: 50%;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 40px 80px;
  position: relative;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 60px;
}

.back-link:hover {
  color: #409eff;
}

.login-box {
  max-width: 360px;
  margin: 0 auto;
  width: 100%;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  text-align: center;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 14px;
  color: #909399;
  text-align: center;
  margin-bottom: 40px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 25px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.required {
  color: #f56c6c;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #606266;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
