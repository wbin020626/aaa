<!-- App.vue -->
<template>
<div>
  <router-view></router-view>

</div>
</template>

<script  lang="ts">

</script>


<style scoped>
/* 确保根元素撑满 */
#app, html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止全局滚动条 */
}
</style>
