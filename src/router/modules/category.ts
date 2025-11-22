import type { AppRouteRecordRaw } from '@/types/common'
import { Layout } from '@/utils/routerHelper'

const { t: $t } = useLocale()

const category: AppRouteRecordRaw = {
  path: '/category',
  component: Layout,
  redirect: '/category/list',
  name: 'Category',
  meta: {
    title: $t('router.category'),
    icon: 'ant-design:appstore-outlined',
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/Category/index.vue'),
      name: 'CategoryList',
      meta: {
        title: $t('router.category'),
        icon: 'ant-design:appstore-outlined',
        noCache: true,
      },
    },
    {
      path: '/category/show/:id',
      component: () => import('@/views/Category/Show.vue'),
      name: 'ShowCategory',
      meta: {
        title: `${$t('category.show')}`,
        noCache: true,
        hidden: true,
        canTo: true,
        activeMenu: '/category',
        props: true,
      },
    },
  ],
}

export default category
