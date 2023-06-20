<script setup lang="ts">
import { ref } from 'vue'

// 默认页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(5)
</script>
<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请输入职位关键字"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary">搜索</el-button>
        <el-button type="">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default">添加职位</el-button>
    <!-- 表格展示职位信息 -->
    <el-table border style="margin: 10px 0px">
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="id" prop="id" align="center"></el-table-column>
      <el-table-column
        label="职位名称"
        prop="name"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        prop="updateTime"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="300px"
        show-overflow-tooltip
        align="center"
      >
        <!-- <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="User">
              分配角色
            </el-button>
            <el-button type="primary" size="small" icon="Edit">
              编辑
            </el-button>
            <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template> -->
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout=" prev, pager, next, jumper, ->, sizes,total"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    />
  </el-card>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
}
</style>
