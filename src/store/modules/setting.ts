// 小仓库：layout组件相关配置
import { defineStore } from 'pinia'

let useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //切换左侧隐藏
      refsh: false, //刷新效果
    }
  },
})

export default useLayOutSettingStore
