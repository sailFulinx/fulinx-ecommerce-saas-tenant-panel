import type { AppRouteRecordRaw } from '@/types/common'

import { Layout } from '@/utils/routerHelper'

const { t: $t } = useLocale()

const order: AppRouteRecordRaw = {
  path: '/order',
  component: Layout,
  redirect: '/order/list',
  name: 'Order',
  meta: {
    title: $t('router.order'),
    icon: 'ant-design:account-book-outlined',
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/Order/index.vue'),
      name: 'OrderList',
      meta: {
        title: $t('router.category'),
        icon: 'ant-design:appstore-outlined',
        noCache: true,
      },
    },
    {
      path: '/order/show/:id',
      component: () => import('@/views/Order/Show.vue'),
      name: 'ShowOrder',
      meta: {
        title: `${$t('order.show')}`,
        noCache: true,
        hidden: true,
        canTo: true,
        activeMenu: '/order',
        props: true,
      },
    },
  ],
}

export default order
