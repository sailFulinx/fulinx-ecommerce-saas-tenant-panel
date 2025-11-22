import type { RouteRecordRaw } from 'vue-router'
import router from './router'
// import { useUserStore } from './stores/user'

export const initPermission = async () => {
  const permissionStore = usePermissionStore()

  const whiteList = ['/auth/login', '/auth/register', '/auth/forget-password'] // 不重定向白名单
  router.beforeEach(async (to, from, next) => {
    if (localStorage.getItem('token')) {
      if (to.path === '/auth/login') {
        next({ path: '/' })
      } else {
        if (permissionStore.getIsAddRouters) {
          next()
          return
        }
        await useUserStore().getUserInfo()
        await permissionStore.generateRoutes()
        permissionStore.getAddRouters.forEach((route: any) => {
          router.addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
        })
        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        permissionStore.setIsAddRouters(true)
        next(nextData)
      }
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next(`/auth/login?redirect=${to.path}`) // 否则全部重定向到登录页
      }
    }
  })
}
