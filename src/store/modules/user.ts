// 创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user'

import type { UserState } from '@/store/modules/types/type'

// 引入本地仓库存储得操作
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入常量路由
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from '@/api/user/types'
import router from '@/router'
//引入深拷贝方法
//@ts-expect-error
import cloneDeep from 'lodash/cloneDeep'

//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

let useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //仓库存储生成菜单需要数组(路由)
      username: '',
      avatar: '',
      //存储当前用户是否包含某一个按钮
      buttons: [],
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
      console.log(result.data)
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons

        //计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )
        //菜单需要的数据整理完毕
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
        ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })
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
