<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { reqUserInfo, reqAddOrUpdateUser } from '@/api/acl/user/index.ts'
import type { UserResponseData, Records, User } from '@/api/acl/user/type'
import ElMessage from 'element-plus/lib/components/message/index.js'

// 默认页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(5)
//用户总个数
let total = ref<number>(0)
//存储全部用户的数组
let userArr = ref<Records>([])
// 获取formRef实例
let formRef = ref<any>()

// 获取全部用户信息
const getHasUser = async (pager = 1) => {
  // 收集当前页码
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
onMounted(() => {
  getHasUser()
})
// 下拉菜单自定义事件回调
const handler = () => {
  getHasUser()
}
// 定义响应式数据控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
//添加用户
const addUser = () => {
  drawer.value = true
  Object.assign(userParams, {
    username: '',
    name: '',
    password: '',
  })
  // 清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
// 更新已有用户
const updateUser = (row: User) => {
  drawer.value = true
  //存储收集已有的账号信息
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

// 收集用户信息
let userParams = reactive<User>({
  id: 0,
  username: '',
  name: '',
  password: '',
})
// 保存按钮
const save = async () => {
  // 点击保存时，必须保证全部符合条件再发请求
  await formRef.value.validate()

  // 保存：添加新用户或更新账号信息
  let result: any = await reqAddOrUpdateUser(userParams)
  //添加或者更新成功
  if (result.code == 200) {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    //获取最新的全部账号的信息
    // getHasUser(userParams.id ? pageNo.value : 1);
    //浏览器自动刷新一次自动回第一页
    window.location.reload()
  } else {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}

//取消按钮
const cancel = () => {
  drawer.value = false
}
// 校验姓名回调
const validatorUsername = (_rule: any, value: any, callBack: any) => {
  // 用户名字字|昵称，至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}

// 校验用户昵称
const validatorName = (_rule: any, value: any, callBack: any) => {
  // 用户昵称，至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
const validatorPassword = (_rule: any, value: any, callBack: any) => {
  // 用户密码，至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户密码至少五位'))
  }
}
// 表单价校验规则
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
</script>
<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary">搜索</el-button>
          <el-button type="">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" @click="addUser">
        添加用户
      </el-button>
      <el-button type="danger" size="default">批量删除</el-button>
      <!-- 表格展示用户信息 -->
      <el-table :data="userArr" border style="margin: 10px 0px">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="id" prop="id" align="center"></el-table-column>
        <el-table-column
          label="用户名字"
          prop="username"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="用户名称"
          prop="name"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="用户角色"
          prop="roleName"
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
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="User">
              分配角色
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateUser(row)"
            >
              编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete">删除</el-button>
          </template>
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

    <!-- 抽屉结构，添加用户 -->
    <el-drawer v-model="drawer">
      <template #header>
        <!-- 动态头部标题 -->
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <!-- 身体部分 -->
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input
              v-model="userParams.username"
              placeholder="请输入用户姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              v-model="userParams.name"
              placeholder="请输入用户昵称"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input
              v-model="userParams.password"
              placeholder="请输入用户密码"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <!-- 底部 -->
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
}
</style>
