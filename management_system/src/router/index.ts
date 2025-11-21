import { createRouter, createWebHashHistory } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router' // 修正类型导入方式
import { useAllDataStore } from '@/stores/index'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/Main.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/Home.vue'),
          meta: {
            label: '首页',
            icon: 'house',
            requiresAuth: true
          }
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/User.vue'),
          meta: {
            label: '用户管理',
            icon: 'user',
            requiresAuth: true
          }
        },
        {
          path: 'mall',
          name: 'mall',
          component: () => import('@/views/Mall.vue'),
          meta: {
            label: '商品管理',
            icon: 'video-play',
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/404.vue'),
      meta: { requiresAuth: false }
    }
  ],
})

// 全局前置守卫
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const store = useAllDataStore()
  const { state } = storeToRefs(store)
  const token = state.value.token
  const accessibleRoutes = state.value.accessibleRouteNames

  // 1. 未登录状态：跳转到登录页
  if (!token) {
    if (to.name === 'login') {
      next()
    } else {
      ElMessage.warning('请先登录')
      next('/login')
    }
    return
  }

  // 2. 已登录状态：验证权限
  if (to.meta.requiresAuth) {
    // 首页默认允许访问
    if (to.name === 'home') {
      next()
      return
    }

    // 检查是否有权限访问目标路由
    const hasPermission = accessibleRoutes.includes(to.name as string)
    if (hasPermission) {
      next()
    } else {
      ElMessage.error('没有权限访问此页面')
      // 跳转到首页或上一个有权限的页面
      next(from.path || '/home')
    }
    return
  }

  // 3. 其他情况直接放行
  next()
})

export default router;
