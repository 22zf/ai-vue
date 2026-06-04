import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '',
  timeout: 5000
})

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

request.interceptors.response.use(
  response => {
    const { data } = response
    if (data.success === true) {
      return data.data
    }
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
    ElMessage.error(data.msg || data.message || '请求失败')
    return Promise.reject(data.msg || data.message || '请求失败')
  },
  error => {
    return Promise.reject(error)
  }
)

export default request
