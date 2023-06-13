<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
// 获取用户相关的仓库
import useUserStore from '@/store/modules/user'
import { useRouter } from 'vue-router'
let $router = useRouter()
// let $route = useRoute()
let layOutSettingStore = useLayOutSettingStore()

// 刷新  即 v-if 组件重新挂载
const updateRefsh = () => {
  layOutSettingStore.refsh = !layOutSettingStore.refsh
}
// 全屏
const fullScreen = () => {
  // console.log(document.fullscreenElement)
  const full = document.fullscreenElement
  if (!full) {
    document.documentElement?.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
let userStore = useUserStore()

// 退出登录
const logout = async () => {
  // 向服务器发请求（当前token失效）
  // 仓库中数据清空
  await userStore.userLogout()
  // 跳转到 login
  // $router.push({name:'login',query:{redirect:$route.path}})
  $router.push({ path: '/login' })
}
</script>
<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefsh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts">
export default {
  name: 'Setting',
}
</script>
<style lang="scss" scoped></style>
