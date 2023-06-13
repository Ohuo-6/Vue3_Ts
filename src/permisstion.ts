// 路由鉴权---项目中的路由什么条件能访问或者不能访问

import router from '@/router'
import setting from './setting'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
// 导入仓库数据
// 组件外部需要引入大仓库
import pinia from './store'
import useUserStore from './store/modules/user'

const userStore = useUserStore(pinia)
// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  // to: 去哪
  // from: 从哪来
  // next: 放行
  document.title = `${setting.title}-${to.meta.title}`
  nprogress.start()
  // 获取token
  const token = userStore.token
  //获取用户的名字
  const username = userStore.username
  if (token) {
    // 登录成功不能访问login

    if (to.path == '/login') {
      next('/')
    } else {
      //防止token过期拿不到数据
      //有用户信息
      if (username) {
        next()
      } else {
        //没有用户信息就发请求
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          // token过期
          await userStore.userLogout()
          next('/login')
        }
      }
    }
  } else {
    //未登录
    if (to.path == '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})
