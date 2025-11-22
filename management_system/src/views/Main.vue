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
  overflow: hidden; /* 防止整体滚动 */
}

.el-aside {
  height: 100%; /* 继承父容器高度 */
}

.el-header {
  background-color: #333;
  height: 60px; /* 固定高度 */
  flex-shrink: 0; /* 防止被压缩 */
}

// CommonTab区域的高度约为60px（包含margin）
.right-main {
  padding: 20px;
  background-color: #f5f5f5;
  // 不再使用固定高度计算，让flex自动填充剩余空间
  flex: 1;
  overflow-y: auto; /* 内容区域可滚动 */
  overflow-x: hidden; /* 防止横向滚动 */
}
</style>
