<script setup lang="ts">
import { useRoute } from 'vue-router'
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Tabbar from './tabbar/index.vue'
// 获取仓库
import useuserRouter from '@/store/modules/user'
import useLayOutSettingStore from '@/store/modules/setting'
//右侧内容展示区域
import Main from './main/index.vue'

const LayOutSettingStore = useLayOutSettingStore()
let userStore = useuserRouter()
let $route = useRoute()
</script>
<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_silder" :class="{ fold: LayOutSettingStore.fold }">
      <Logo></Logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :default-active="$route.path"
          background-color="#001529"
          text-color="white"
          active-text-color="green"
          :collapse="LayOutSettingStore.fold"
        >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold }">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{ fold: LayOutSettingStore.fold }">
      <Main></Main>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'Layout',
}
</script>
<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_silder {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    color: white;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
    }

    &.fold {
      width: $base-menu-min-width;
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0px;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
