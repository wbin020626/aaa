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
      >
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>

        <!-- 正确的子菜单位置 -->
        <el-menu-item 
          v-for="subItem in item.children" 
          :key="subItem.path" 
          :index="subItem.path"
          @click="handleMenu(subItem)"
        >
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
const isCollapse = computed(() => store.state.isCollapse)

// 获取菜单列表（从store动态获取）
const list = computed(() => store.state.menuList as any[])

// 没有子菜单的列表
const noChildren = computed(() => list.value.filter((item: any) => !item.children))
// 有子菜单的列表
const hasChildren = computed(() => list.value.filter((item: any) => item.children))

const handleMenu = (item: any) => {
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
