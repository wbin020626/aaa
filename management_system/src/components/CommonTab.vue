<template>
  <div class="tabs">
    <!-- 循环渲染标签，增加存在性判断避免报错 -->
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closable="tag.name !== 'home'"
      :effect="tag.path === $route.path ? 'dark' : 'plain'"
      @click="handleMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores/index'
import { storeToRefs } from 'pinia' // 必须引入这个工具函数

// 1. 获取 Pinia 实例
const store = useAllDataStore()

// 2. 关键：使用 storeToRefs 解构状态（保持响应式）
// 此时 state 是一个包含 value 属性的 ref 对象
const { state } = storeToRefs(store)

// 3. 正确读取 tags：通过 state.value.tags 访问
// 增加 ?. 容错符，避免 state.value 未初始化时报错
const tags = computed(() => state.value?.tags || [])

const route = useRoute()
const router = useRouter()

// 4. 页面加载时初始化标签
onMounted(() => {
  addCurrentTag()
})

// 5. 监听路由变化，自动添加对应标签
watch(route, (newRoute) => {
  addCurrentTag()
}, { immediate: true })

// 封装添加当前路由标签的逻辑
function addCurrentTag() {
  const currentRoute = route
  // 路由必须有 name 才添加标签（避免无效路由）
  if (!currentRoute.name) return

  // 从路由元信息获取标签信息（与 router/index.ts 中定义的 meta 对应）
  const tagInfo = {
    name: currentRoute.name as string,
    path: currentRoute.path,
    label: currentRoute.meta.label || currentRoute.name,
    icon: currentRoute.meta.icon || ''
  }

  // 调用 Pinia 方法添加标签
  store.selectMenu(tagInfo)
}

// 点击标签切换路由
const handleMenu = (tag) => {
  router.push(tag.path)
}

// 关闭标签时的处理
const handleClose = (tag, index) => {
  store.updateTags(tag)

  // 如果关闭的是当前激活的标签，需要跳转
  if (tag.path === route.path) {
    const currentTags = tags.value
    // 跳转规则：如果还有其他标签，跳转到前一个；否则跳首页
    if (currentTags.length > 0) {
      const targetIndex = Math.max(0, index - 1)
      router.push(currentTags[targetIndex].path)
    } else {
      router.push('/home')
    }
  }
}
</script>

<style lang="less" scoped>
.tabs {
  margin: 20px 0 0 20px;

  :deep(.el-tag) {
    margin-right: 10px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style>
