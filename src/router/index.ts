import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { useLocale } from '@/hooks/useLocale'

import { Layout } from '@/utils/routerHelper'

// 导入模块路由
import appRouter from './modules/app'
import catalogRouter from './modules/catalog'
import contentRouter from './modules/content'
import customerRouter from './modules/customer'
import dashboardRouter from './modules/dashboard'
import orderRouter from './modules/order'
import siteRouter from './modules/site'

const { t: $t } = useLocale()

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
    name: 'RedirectWrap',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {},
      },
    ],
    meta: {
      hidden: true,
      noTagsView: true,
    },
  },
  {
    path: '/login',
    component: () => import('@/views/Auth/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: $t('router.login'),
      noTagsView: true,
    },
  },
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
  dashboardRouter,
  catalogRouter,
  customerRouter,
  orderRouter,
  contentRouter,
  appRouter,
  siteRouter,
]

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
