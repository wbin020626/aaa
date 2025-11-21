<!-- src/components/CommonAside -->
<!-- 左侧菜单 -->
<template>
  <el-aside :width="isCollapse ? '64px' : '180px'">
    <el-menu
      background-color="#333"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activeMenu"
    >
      <h3 v-show="!isCollapse">通用后台管理系统</h3>
      <h3 v-show="isCollapse">后台</h3>

      <!-- 没有子菜单的项 -->
      <el-menu-item
        v-for="item in noChildren"
        :key="item.path"
        :index="item.path"
        @click="handleMenu(item)"
      >
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>

      <!-- 有子菜单的项 - 修复结构 -->
      <el-sub-menu
        v-for="item in hasChildren"
        :key="item.path"
        :index="item.path"
        @click="handleMenu(item)"
      >
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>

        <!-- 正确的子菜单位置 -->
        <el-menu-item v-for="subItem in item.children" :key="subItem.path" :index="subItem.path">
          <component class="icons" :is="subItem.icon"></component>
          <span>{{ subItem.label }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { useAllDataStore } from '@/stores/index'

const router = useRouter()
const route = useRoute()
const store = useAllDataStore()
const isCollapse = computed(() => store.isCollapse)
// 菜单列表(左侧菜单,写死)
// const list = ref([
//   {
//     path: '/home',
//     name: 'home',
//     label: '首页',
//     icon: 'house',
//     url: 'Home',
//   },
//   {
//     path: '/mall',
//     name: 'mall',
//     label: '商品管理',
//     icon: 'video-play',
//     url: 'Mall',
//   },
//   {
//     path: '/user',
//     name: 'user',
//     label: '用户管理',
//     icon: 'user',
//     url: 'User',
//   },
//   {
//     path: 'other',
//     label: '其他',
//     icon: 'location',
//     children: [
//       {
//         path: '/page1',
//         name: 'page1',
//         label: '页面1',
//         icon: 'setting',
//         url: 'Page1',
//       },
//       {
//         path: '/page2',
//         name: 'page2',
//         label: '页面2',
//         icon: 'setting',
//         url: 'Page2',
//       },
//     ],
//   },
// ])

// 没有子菜单的列表
const noChildren = computed(() => list.value.filter((item) => !item.children))
// 有子菜单的列表
const hasChildren = computed(() => list.value.filter((item) => item.children))

// 获取菜单列表
const list = computed(() => store.state.menuList)

const handleMenu = (item) => {
  router.push(item.path)
  store.selectMenu(item)
}

const activeMenu = computed(() => route.path)
</script>

<style scoped lang="less">
.icons {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
.el-menu {
  border-right: none;
  h3 {
    color: #ffffff;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    margin-top: 15px;
    margin-left: 15px;
    margin-right: 15px;
  }
}
.el-aside {
  height: 100%;
  background-color: #333;
}
</style>
