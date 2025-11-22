import type { AppRouteRecordRaw } from '@/types/common'
import { Layout } from '@/utils/routerHelper'

const marketing: AppRouteRecordRaw = {
  path: '/marketing',
  component: Layout,
  redirect: '/marketing/coupon/list',
  name: 'Marketing',
  meta: {
    title: '营销管理',
    icon: 'ant-design:rocket-outlined',
    noCache: true,
    hidden: false,
    canTo: false,
  },
  children: [
    {
      path: 'coupon/list',
      component: () => import('@/views/Marketing/Coupon/List.vue'),
      name: 'CouponList',
      meta: {
        title: '优惠券列表',
        icon: 'ant-design:rocket-outlined',
      },
    },
    {
      path: 'coupon/create',
      component: () => import('@/views/Marketing/Coupon/Create.vue'),
      name: 'CreateCoupon',
      meta: {
        title: '优惠券新增',
        noCache: true,
        hidden: true,
        canTo: true,
        activeMenu: '/marketing/coupon/list',
        props: false,
      },
    },
    {
      path: 'coupon/show/:id',
      component: () => import('@/views/Marketing/Coupon/Show.vue'),
      name: 'ShowCoupon',
      meta: {
        title: '优惠券详情',
        noCache: true,
        hidden: true,
        canTo: true,
        activeMenu: '/marketing/coupon/list',
        props: true,
      },
    },
  ],
}

export default marketing
