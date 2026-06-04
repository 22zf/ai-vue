<template>
  <div class="register-page">
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

    <!-- 右侧注册区 -->
    <div class="register-section">
      <!-- 返回首页 -->
      <div class="back-link" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回首页</span>
      </div>

      <!-- 注册表单 -->
      <div class="register-box">
        <h2 class="register-title">创建您的账户</h2>
        <p class="register-subtitle">请填写注册信息</p>

        <el-form :model="form" :rules="rules" ref="formRef" class="register-form">
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

          <el-form-item prop="email">
            <div class="form-label">
              <span class="required">*</span>
              <span>邮箱</span>
            </div>
            <el-input
              v-model="form.email"
              placeholder="请输入邮箱"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="gender" class="gender-form-item">
            <div class="form-label">
              <span class="required">*</span>
              <span>性别</span>
            </div>
            <el-radio-group v-model="form.gender" class="gender-radio-group">
              <el-radio :value="1" size="large">男</el-radio>
              <el-radio :value="2" size="large">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="nickname">
            <div class="form-label">
              <span>昵称</span>
            </div>
            <el-input
              v-model="form.nickname"
              placeholder="请输入昵称（可选）"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="phone">
            <div class="form-label">
              <span>手机号</span>
            </div>
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号（可选）"
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

          <el-form-item prop="confirmPassword">
            <div class="form-label">
              <span class="required">*</span>
              <span>确认密码</span>
            </div>
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              size="large"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="register-btn"
              @click="handleRegister"
            >
              创建用户
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-link">
          已有账户？ <router-link to="/login">立即登录</router-link>
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
import { userRegister } from '@/api/admin'

const router = useRouter()
const formRef = ref(null)

// 表单数据
const form = reactive({
  username: '',
  email: '',
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: null,
  userType: 1
})

// 自定义校验：两次密码是否一致
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 返回上一页
function goBack() {
  router.push('/')
}

// 注册处理
function handleRegister() {
  formRef.value.validate((valid) => {
    if (!valid) return

    const params = {
      username: form.username,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      gender: form.gender,
      userType: 1
    }
    if (form.nickname) params.nickname = form.nickname
    if (form.phone) params.phone = form.phone

    userRegister(params)
      .then(() => {
        ElMessage.success('注册成功，请登录')
        router.push('/login')
      })
      .catch(() => {
        ElMessage.error('注册失败')
      })
  })
}
</script>

<style scoped>
.register-page {
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

/* 右侧注册区 */
.register-section {
  width: 50%;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 40px 80px;
  position: relative;
  overflow-y: auto;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 40px;
}

.back-link:hover {
  color: #409eff;
}

.register-box {
  max-width: 360px;
  margin: 0 auto;
  width: 100%;
}

.register-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  text-align: center;
  margin-bottom: 10px;
}

.register-subtitle {
  font-size: 14px;
  color: #909399;
  text-align: center;
  margin-bottom: 30px;
}

.register-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.gender-form-item :deep(.el-form-item__content) {
  flex-direction: column;
  align-items: flex-start;
}

.gender-radio-group {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 40px;
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

.register-btn {
  width: 100%;
  margin-top: 10px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #606266;
}

.login-link a {
  color: #409eff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
