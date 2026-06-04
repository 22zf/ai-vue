import { createRouter, createWebHistory } from 'vue-router'
import Backendlayout from '@/components/Backendlayout.vue'
import { Clock, ChatDotSquare, Message, User } from '@element-plus/icons-vue'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/chat',
    component: () => import('@/views/Chat.vue')
  },
  {
    path: '/mood',
    component: () => import('@/views/Mood.vue')
  },
  {
    path: '/knowledge',
    component: () => import('@/views/Knowledge.vue')
  },
  {
    path: '/knowledge/:id',
    component: () => import('@/views/ArticleDetail.vue')
  },
  {
    path: '/back',
    component: Backendlayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: Clock
        }
      },
      {
        path: 'comment',
        component: () => import('@/views/Comment.vue'),
        meta: {
          title: '知识文章',
          icon: ChatDotSquare
        }
      },
      {
        path: 'message',
        component: () => import('@/views/Message.vue'),
        meta: {
          title: '咨询记录',
          icon: Message
        }
      },
      {
        path: 'userFilled',
        component: () => import('@/views/UserFilled.vue'),
        meta: {
          title: '情绪日志',
          icon: User
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router