<script setup lang="ts">
import { ref } from 'vue'

// 当前页
let pageNo = ref<number>(1)
// 每页展示多少条
let limit = ref<number>(3)
</script>

<template>
  <el-pagination
    v-model:current-page="pageNo"
    v-model:page-size="limit"
    :page-sizes="[3, 5, 7, 9]"
    :small="small"
    :background="background"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<style scoped></style>
