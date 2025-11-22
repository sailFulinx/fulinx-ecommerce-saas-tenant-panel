import type { AppRouteRecordRaw } from '@/types/common'
import { Layout } from '@/utils/routerHelper'

const { t: $t } = useLocale()

const system: AppRouteRecordRaw = {
  path: '/system',
  component: Layout,
  redirect: '/system/user/list',
  name: 'System',
  meta: {
    title: '系统设置',
    icon: 'ant-design:setting-outlined',
    noCache: true,
    hidden: false,
    canTo: false,
  },
  children: [
    {
      path: 'user/list',
      component: () => import('@/views/User/index.vue'),
      name: 'SystemUser',
      meta: {
        title: $t('router.user'),
        icon: 'ant-design:user-outlined',
      },
    },
    {
      path: 'role/list',
      component: () => import('@/views/Role/index.vue'),
      name: 'Role',
      meta: {
        title: $t('router.role'),
        icon: 'ant-design:safety-certificate-outlined',
      },
    },
    {
      path: 'shipping/company',
      component: () => import('@/views/Shipping/index.vue'),
      name: 'ShippingCompanyList',
      meta: {
        title: $t('router.shippingCompany'),
        icon: 'ant-design:truck-outlined',
      },
      children: [
        {
          path: 'create',
          component: () => import('@/views/Shipping/Create.vue'),
          name: 'CreateShippingCompany',
          meta: {
            title: $t('router.createShippingCompany'),
            noCache: true,
            hidden: true,
            canTo: true,
            activeMenu: '/shipping/company',
            props: true,
          },
        },
        {
          path: 'show/:id',
          component: () => import('@/views/Shipping/Show.vue'),
          name: 'ShowShippingCompany',
          meta: {
            title: $t('shipping.show'),
            noCache: true,
            hidden: true,
            canTo: true,
            activeMenu: '/shipping/company',
            props: true,
          },
        },
      ],
    },
    {
      path: 'imp',
      component: () => import('@/views/Imp/index.vue'),
      name: 'Imp',
      meta: {
        title: $t('router.imp'),
        icon: 'ant-design:upload-outlined',
      },
      children: [
        {
          path: 'log/:id',
          component: () => import('@/views/Imp/Detail.vue'),
          name: 'ImpLog',
          meta: {
            title: $t('router.impLog'),
            noCache: true,
            hidden: true,
            canTo: true,
            activeMenu: '/system/imp',
            props: true,
          },
        },
      ],
    },
  ],
}

export default system
