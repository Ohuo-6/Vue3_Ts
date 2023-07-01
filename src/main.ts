import { createApp } from 'vue'
import App from './App.vue'

//引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'

// 忽略当前文件ts类型的检测否则有红色提示(打包会失败)
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// SVG插件配置
import 'virtual:svg-icons-register'

//引入自定义插件对象:注册整个项目全局组件
import gloalComponent from '@/components'

import '@/styles/index.scss'

// 引入路由
import router from './router'

// 引入仓库
import pinia from './store'

// 引入自定义指令
import { isHasButton } from '@/directive/has'

const app = createApp(App)

isHasButton(app)

// 引入路由鉴权
import './permisstion'

app.use(ElementPlus, {
  locale: zhCn,
})

// 全局组件注册
//安装自定义插件
app.use(gloalComponent)
// 注册模板路由
app.use(router)
// 安装仓库
app.use(pinia)
app.mount('#app')
