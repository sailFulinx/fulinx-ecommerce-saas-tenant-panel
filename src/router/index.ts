import type { RouteRecordRaw } from 'vue-router'

import type { AppRouteRecordRaw } from '@/types/common'

import { createRouter, createWebHistory } from 'vue-router'

import { Layout } from '@/utils/routerHelper'

import article from './modules/article'
import auth from './modules/auth'
import catalog from './modules/catalog'
import category from './modules/category'
import customer from './modules/customer'
// 导入模块化路由
import dashboard from './modules/dashboard'
import marketing from './modules/marketing'
import order from './modules/order'
import site from './modules/site'
import system from './modules/system'

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true,
    },
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'RedirectPath',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {},
      },
    ],
    meta: {
      hidden: true,
      noTagsView: true,
    },
  },
  auth,
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true,
    },
  },
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  dashboard,
  catalog,
  order,
  customer,
  category,
  article,
  marketing,
  site,
  system,
]

const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root', 'Register', 'ForgetPassword']
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
