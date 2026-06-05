import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000
})
// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
request.interceptors.response.use(
  response => {
    const { data } = response
    // 后端返回 { success: true, data: { token, userInfo } }
    if (data.success === true) {
      return data.data
    }
    // token 过期或未登录
    if (data.code === '-1' || data.code === -1) {
      const msg = data.msg || data.message || ''
      if (msg.includes('登录') || msg.includes('token') || msg.includes('未登录')) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/login')
      }
      ElMessage.error(data.msg || data.message || '请求失败')
      return Promise.reject(data.msg || data.message || '请求失败')
    }
    // 其他业务错误
    ElMessage.error(data.msg || data.message || '请求失败')
    return Promise.reject(data.msg || data.message || '请求失败')
  },
  error => {
    return Promise.reject(error)
  }
)

export default request
