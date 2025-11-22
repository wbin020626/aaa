<template>
  <div class="body-login">
    <el-form :model="loginForm" class="login-container">
      <h1>Welcome login</h1>
      <el-form-item>
        <el-input v-model="loginForm.username" type="input" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, getCurrentInstance } from 'vue'
import { useAllDataStore } from '@/stores/index'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()
const store = useAllDataStore()

const { proxy } = getCurrentInstance()
const loginForm = reactive({
  username: '',
  password: '',
})
const handleLogin = async () => {
  try {
    const res = await proxy.$api.getMenu(loginForm)
    console.log(res)

    // 登录成功逻辑
    store.updateMenuList(res.menuList)
    store.state.token = res.token
    store.addMenu(router)

    // 等待路由添加完成后跳转
    setTimeout(() => {
      router.push('/home')
    }, 100)
  } catch (error) {
    // 错误处理逻辑
    console.error('登录失败:', error)
    // Mock返回的错误信息在error.message中（来自request.ts的响应拦截器）
    // 如果有错误消息则显示，否则使用默认提示
    const errorMsg = error?.message || '登录失败，请检查账号密码'
    ElMessage.error(errorMsg)
  }
}
</script>

<style scoped lang="less">
.body-login {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/background.png');
  background-size: 100%;
  overflow: hidden;
}
.login-container {
  width: 350px;
  //height: 300px;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.1);
  margin: 250px auto;
  h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
  :deep(.el-button) {
    width: 100%;
  }
}
</style>
