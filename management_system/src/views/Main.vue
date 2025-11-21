<!-- src/views/Main.vue -->
<!-- 主页面 -->
<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 左侧菜单 -->
      <common-aside />

      <!-- 右侧内容区 -->
      <el-container direction="vertical"> <!-- 添加垂直方向 -->
        <el-header class="el-header">
          <common-header />
        </el-header>
        <!-- 标签页 -->
        <common-tab />
        <!-- 添加内容区域 -->
        <el-main class="right-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup lang="ts">
import CommonAside from '@/components/CommonAside.vue'
import CommonHeader from '@/components/CommonHeader.vue'
import CommonTab from '@/components/CommonTab.vue'
</script>


<style scoped lang="less">
.common-layout, .lay-container {
  width: 100%;
  height: 100vh; /* 使用视口高度 */
  display: flex; /* 确保弹性布局 */
}

.el-aside {
  height: 100%; /* 继承父容器高度 */
}

.el-header {
  background-color: #333;
  height: 60px; /* 固定高度 */
}

.right-main {
  padding: 20px;
  background-color: #f5f5f5;
  height: calc(100vh - 60px); /* 计算剩余高度 */
}
</style>
