<script setup lang="ts">
import setting from '@/setting'
</script>
<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <p>{{ setting.title }}</p>
  </div>
</template>
<script lang="ts">
export default {
  name: 'Logo',
}
</script>
<style lang="scss" scoped>
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    font-size: $base-menu-logo-fontSize;
    margin-left: 20px;
    color: white;
    white-space: nowrap;
  }
}
</style>
