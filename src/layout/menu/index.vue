<script setup lang="ts">
import { useRouter } from 'vue-router'
// 获取父组件传递过来的全部路由
defineProps(['menuList'])
let $router = useRouter()
// 点击菜单实例
const goRouter = (vc: any) => {
  // console.log(vc.index);//index为路由路径
  $router.push(vc.index)
}
</script>
<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item
        v-if="!item.meta.hidden"
        :index="item.path"
        @click="goRouter"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 只有一个子路由 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        v-if="!item.meta.hidden"
        :index="item.children[0].path"
        @click="goRouter"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有多个子路由 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>
<script lang="ts">
export default {
  name: 'Menu',
}
</script>
<style lang="scss" scoped></style>
