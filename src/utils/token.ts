// 封装本地存储 存储数据与读取数据方法
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}

export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
}

//本地删除存储方法
export const REMOVE_TOKEN = () => {
  return localStorage.removeItem('TOKEN')
}
