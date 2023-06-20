<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user/index.ts'
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type'
import ElMessage from 'element-plus/lib/components/message/index.js'
import useLayOutSettingStore from '@/store/modules/setting'
const settingStore = useLayOutSettingStore()
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

//获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  //收集当前页码
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
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
    //浏览器自动刷新一次自动回第一页,刷新右上角用户
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

// 控制分配角色抽屉显示与隐藏
let drawer1 = ref<boolean>(false)
// 存储全部职位的数据
let allRole = ref<AllRole>([])
// 当前用户已有的职位
let userRole = ref<AllRole>([])
// 点击分配角色按钮
const setRole = async (row: User) => {
  // 抽屉显示出来
  drawer1.value = true
  Object.assign(userParams, row)
  // 发请求获取全部的职位数据与当前用户已有的职位数据
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    // 存储全部的职位
    allRole.value = result.data.allRolesList
    // 存储当前用户已有的职位
    userRole.value = result.data.assignRoles
    // 抽屉显示出来
    drawer1.value = true
  }
}
// 测试复选框代码
// 全选复选框收集数据:是否全选
let checkAll = ref<boolean>(false)
// 设置不确定状态，仅负责样式样式控制
let isIndeterminate = ref<boolean>(true)
// 全选复选框的变化
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
// 顶部的复选框change事件
const handleCheckedUserRoleChange = (value: string[]) => {
  // isIndeterminate.value = allRole.value.length===userRole.value.length
  // 已经勾选数据的长度
  const checkedCount = value.length
  // 勾选等于所有则全选勾上
  checkAll.value = checkedCount === allRole.value.length
  // 不确定则改变为 勾上 ，true为不确定
  isIndeterminate.value = !(checkedCount === allRole.value.length)
}
// 确定按钮
const confirmClick = async () => {
  //收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  //分配用户的职位
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' })
    //关闭抽屉
    drawer1.value = false
    //获取更新完毕用户的信息,更新完毕留在当前页
    getHasUser(pageNo.value)
  }
}

// 删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
// 准备一个数组存储批量删除的用户的ID
let selectIdArr = ref<User[]>([])
//table复选框勾选的时候会触发的事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}
// 批量删除
const deleteSelectUser = async () => {
  //整理批量删除的参数
  let idsList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  //批量删除的请求
  let result: any = await reqSelectUser(idsList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

// 定义响应式数据
let keyword = ref<string>('')
//搜索按钮的回调
const search = () => {
  //根据关键字获取相应的用户数据
  getHasUser()
  //清空关键字
  keyword.value = ''
}
//重置按钮
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>
<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名">
          <el-input v-model="keyword" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :disabled="!keyword" @click="search">
            搜索
          </el-button>
          <el-button type="" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" @click="addUser">
        添加用户
      </el-button>
      <el-button
        type="danger"
        size="default"
        :disabled="selectIdArr.length ? false : true"
        @click="deleteSelectUser"
      >
        批量删除
      </el-button>
      <!-- 表格展示用户信息 -->
      <el-table
        @selection-change="selectChange"
        :data="userArr"
        border
        style="margin: 10px 0px"
      >
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
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="setRole(row)"
            >
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
            <el-popconfirm
              :title="`你确定要删除${row.username}?`"
              width="260px"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
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

    <!-- 抽屉结构，分配角色 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色用户</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <!-- 显示职位的复选框 -->
            <el-checkbox-group
              v-model="userRole"
              @change="handleCheckedUserRoleChange"
            >
              <el-checkbox v-for="role in allRole" :key="role.id" :label="role">
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
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
