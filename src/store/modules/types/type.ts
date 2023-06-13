// 定义小仓库state类型

import { RouteRecordRaw } from 'vue-router'

export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}
