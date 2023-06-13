<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_from"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              show-password
              :prefix-icon="Lock"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              @click="login"
              type="primary"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const $router = useRouter()
// const $route = useRoute()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: 'atguigu123',
})
// 表单验证
const loginForms = ref()

const login = async () => {
  try {
    // 验证通过才能发请求
    // console.log(loginForms.value);
    await loginForms.value.validate()

    // 开始加载
    loading.value = true
    await userStore.userLogin(loginForm)
    // 判断路由是否有query参数有的话就跳到到对应路由
    // let { redirect }:any = $route.query
    // $router.push({ path:redirect || '/'})
    $router.push('/')
    ElNotification({
      type: 'success',
      message: '登录成功',
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

//自定义校验规则函数
const validatorUserName = (_rule: any, value: any, callback: any) => {
  //rule:即为校验规则对象
  //value:即为表单元素文本内容
  //函数:如果符合条件callBack放行通过即为
  //如果不符合条件callBack方法,注入错误提示信息
  if (value.length >= 5 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('账号长度5-10位'))
  }
}

const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value.length >= 5 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('密码长度6-10位'))
  }
}

//定义表单校验需要配置对象
const rules = {
  //规则对象属性:
  //required,代表这个字段务必要校验的
  //min:文本长度至少多少位
  //max:文本长度最多多少位
  //message:错误的提示信息
  //trigger:触发校验表单的时机 change->文本发生变化触发校验,blur:失去焦点的时候触发校验规则
  username: [
    // { required: true, min: 6, max: 10, message: '账号长度至少六位', trigger: 'change' }
    { trigger: 'change', validator: validatorUserName },
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度至少6位', trigger: 'change' }
    { trigger: 'change', validator: validatorPassword },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_from {
    position: relative;
    width: 70%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      color: white;
      font-size: 40px;
      padding: 10px 0px;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
