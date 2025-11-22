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
  const { state, accessibleRouteNames } = storeToRefs(store)
  const token = state.value.token
  const menuList = state.value.menuList
  const accessibleRoutes = accessibleRouteNames.value

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

    // 如果菜单列表为空，说明动态路由还未加载，直接放行
    // 这种情况通常发生在页面刷新时，menuList会在Login组件中重新加载
    if (menuList.length === 0) {
      // 如果是从登录页来的，说明刚登录，菜单正在加载中
      if (from.name === 'login') {
        next()
        return
      }
      // 否则说明token可能已过期或数据丢失，需要重新登录
      ElMessage.warning('登录信息已失效，请重新登录')
      next('/login')
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
