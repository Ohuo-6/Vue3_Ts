<script setup lang="ts">
// import  Pagination  from '@/components/Pagination/index.vue';

import { onMounted, ref, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/types'
import { ElMessage } from 'element-plus'
import { UploadProps } from 'element-plus/es/components/index.js'

//当前页码
let pageNo = ref<number>(1)
//每一页展示多少条数据
let limit = ref<number>(3)
//存储已有品牌数据总数
let total = ref<number>(0)
// 存储已有品牌数据
let trademarkArr = ref<Records>([])
// 收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
//获取el-form组件实例
let formRef = ref()

// 获取数据  页数改变时会传递参数不使用默认值pager=1，切换时没有参数则使用pager=1
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
onMounted(() => getHasTrademark())
const sizeChange = () => {
  getHasTrademark()
}

// 控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
// 添加品牌回调
const addTrademark = () => {
  // 清空上次收集的数据
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  // 对话框显示
  dialogFormVisible.value = true
  //第一种写法:ts的问号语法
  // formRef.value?.clearValidate('tmName');
  // formRef.value?.clearValidate('logoUrl');
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
// 修改已有品牌
const updateTrademark = (row: TradeMark) => {
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  // 对话框显示
  dialogFormVisible.value = true
  // 展示已有品牌的数据
  Object.assign(trademarkParams, row)
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
}
const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
}
// 确定按钮则发请求
const confirm = async () => {
  //在你发请求之前,要对于整个表单进行校验
  //调用这个方法进行全部表单相校验,如果校验全部通过，在执行后面的语法
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    // 关闭对话框
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 再次发请求
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    // 关闭对话框
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
  }
}

//上传图片组件 --> 上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
  //要求:上传文件格式png|jpg|gif 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF',
    })
    return false
  }
}

//图片上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  //response:即为当前这次上传图片post请求服务器返回的数据
  //收集上传图片的地址,添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}

//品牌自定义校验规则方法
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  //是当表单元素触发blur时候,会触发此方法
  //自定义校验规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    //校验未通过返回的错误的提示信息
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}
//品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  //如果图片上传
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }
}

//表单校验规则对象
const rules = {
  tmName: [
    //required:这个字段务必校验,表单项前面出来五角星
    //trigger:代表触发校验规则时机[blur、change]
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}
</script>
<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" icon="Plus" @click="addTrademark">
        添加品牌
      </el-button>
      <!-- 用于展示已有的平台数据 -->
      <el-table style="margin: 20px 0px" :data="trademarkArr" border>
        <el-table-column
          label="序号"
          width="80px"
          type="index"
          align="center"
        ></el-table-column>
        <!-- 默认展示数据的是div -->
        <el-table-column
          label="品牌名称"
          prop="tmName"
          align="center"
        ></el-table-column>
        <!-- 图片，操作用作用域插槽 -->
        <el-table-column label="品牌LOGO" prop="logoUrl" align="center">
          <template #="{ row, $index }">
            <img
              :src="row.logoUrl"
              alt="图片不存在"
              style="width: 80px; height: 80px"
            />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-button type="danger" size="small" icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <Pagination></Pagination> -->
      <!-- 分页器组件
                                              pagination
                                                 v-model:current-page:设置分页器当前页码
                                                 v-model:page-size:设置每一个展示数据条数
                                                 page-sizes:用于设置下拉菜单数据
                                                 background:设置分页器按钮的背景颜色
                                                 layout:可以设置分页器六个子组件布局调整
                                          -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="getHasTrademark"
        :pager-count="9"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
      />
    </el-card>

    <!-- 对话框组件： 添加品牌，修改品牌的业务时候使用结构 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <el-form
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
        style="width: 80%"
      >
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input
            v-model="trademarkParams.tmName"
            placeholder="请输入品牌名称"
          />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="80px" prop="logoUrl">
          <el-upload
            v-model="trademarkParams.logoUrl"
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
