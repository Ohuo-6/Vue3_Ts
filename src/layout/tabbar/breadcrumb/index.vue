<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'
// 获取routes文件中的路由参数进行动态面包屑显示
const $route = useRoute()
// console.log($route.matched);

const LayOutSettingStore = useLayOutSettingStore()
const changeIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>
<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包动态展示路由名字与标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 图标 -->
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span style="margin: 0 5px; vertical-align: top">
        {{ item.meta.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>
<style lang="scss" scoped></style>
