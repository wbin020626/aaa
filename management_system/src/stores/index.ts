// src/stores/index.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

function initState() {
  return {
    isCollapse: false,
    tags: [{ name: 'home', path: '/home', label: '首页', icon: 'home' }],
    currentMenu: null,
    menuList: [],
    token: '',
    routerList: [],
  }
}

export const useAllDataStore = defineStore('allData', () =>{

  // 点击菜单时添加标签的方法
  const state = ref(initState())
  
  // 计算属性：获取可访问的路由名称列表
  const accessibleRouteNames = computed(() => {
    const names = ['home'] // 首页默认可访问
    state.value.menuList.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          names.push(child.name)
        })
      } else {
        names.push(item.name)
      }
    })
    return names
  })
  
  function selectMenu(val) {
    // 如果是首页，不需要额外处理（已默认存在）
    if (val.name === 'home') {
      return // 直接返回，避免重复添加首页标签
    } else {
      // 查找当前标签是否已存在
      const index = state.value.tags.findIndex((item) => item.name === val.name)
      // 如果不存在，则添加新标签
      if (index === -1) {
        state.value.tags.push(val) // 正确添加新标签
      }
    }
  }

  function updateTags(tag) {
    const index = state.value.tags.findIndex((item) => item.name === tag.name)
    state.value.tags.splice(index, 1)
  }

  function updateMenuList(val) {
    state.value.menuList = val
  }

  function toggleCollapse() {
    state.value.isCollapse = !state.value.isCollapse
  }

  //动态路由
  function addMenu(router) {
    const menu = state.value.menuList
    const modules = import.meta.glob('@/views/**/*.vue')
    
    const routeArray = []
    menu.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          const url = `/src/views/${child.url}.vue`
          child.component = modules[url]
          if (!child.component) {
            console.error(`组件未找到: ${url}`)
          }
        })
        routeArray.push(...item.children)
      } else {
        const url = `/src/views/${item.url}.vue`
        item.component = modules[url]
        if (!item.component) {
          console.error(`组件未找到: ${url}`)
        }
        routeArray.push(item)
      }
    })

    routeArray.forEach((item) => {
      if (item.component && !router.hasRoute(item.name)) {
        state.value.routerList.push(item)
        router.addRoute('main', item)
        console.log(`路由已添加: ${item.name}`)
      }
    })
  }
  return { state, accessibleRouteNames, selectMenu, updateTags, updateMenuList, toggleCollapse, addMenu }
})
