// src/stores/index.js
import { ref } from 'vue'
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

  //动态路由
  function addMenu(router) {
    const menu = state.value.menuList
    const module = import.meta.glob(`@/views/**/*.vue`)
    const routeArray = []
    menu.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          const url = '../views/' + child.url + '.vue'
          child.component = module[url]
          routeArray.push(...item.children)
        })
      } else {
        const url = '../views/' + item.url + '.vue'
        item.component = module[url]
        routeArray.push(item)
      }
    })

    routeArray.forEach((item) => {
      if (!router.hasRoute(item.name)) {
        state.value.routerList.push(item)
        router.addRoute('main', item)
      }
    })
  }
  return { state, selectMenu, updateTags, updateMenuList, addMenu }
})
