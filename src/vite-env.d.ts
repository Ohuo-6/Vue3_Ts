/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 使 { ElMessage }导入模块找到
declare module 'element-plus'

// nprogress进度条
declare module 'nprogress'
