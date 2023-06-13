// 创建用户相关的小仓库

import { defineStore } from 'pinia'
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user'

import type { UserState } from '@/store/modules/types/type'

// 引入本地仓库存储得操作
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入常量路由
import { constantRoute } from '@/router/routes'
import {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from '@/api/user/types'

let useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
    }
  },
  actions: {
    // 用户登录
    async userLogin(data: loginFormData) {
      // 登录请求
      const result: loginResponseData = await reqLogin(data)
      // console.log(result);
      if (result.code == 200) {
        this.token = result.data as string
        SET_TOKEN(result.data as string)
        // 保证返回成功
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息
    async userInfo() {
      const result: userInfoReponseData = await reqUserInfo()
      // console.log(result);
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      let result: any = await reqLogout()
      // console.log(result);
      if ((result.code = 200)) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

export default useUserStore
