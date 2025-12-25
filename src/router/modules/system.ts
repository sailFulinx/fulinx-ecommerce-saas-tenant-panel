import { useLocale } from '@/hooks/useLocale'
import { Layout } from '@/utils/routerHelper'

const { t: $t } = useLocale()

const systemRouter: AppRouteRecordRaw = {
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  name: 'System',
  meta: {
    title: $t('router.system'),
    icon: 'ant-design:setting-outlined',
    noCache: true,
    hidden: false,
    canTo: false,
  },
  children: [
    {
      path: 'user',
      component: Layout,
      redirect: '/system/user/list',
      name: 'User',
      meta: {
        title: $t('router.user'),
        icon: 'ant-design:user-outlined',
        noCache: true,
        hidden: false,
        canTo: false,
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/User/index.vue'),
          name: 'UserList',
          meta: {
            title: $t('router.user'),
            icon: 'ant-design:user-outlined',
          },
        },
      ],
    },
    {
      path: 'role',
      component: Layout,
      redirect: '/system/role/list',
      name: 'Role',
      meta: {
        title: $t('router.role'),
        icon: 'ant-design:safety-certificate-outlined',
        noCache: true,
        hidden: false,
        canTo: false,
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/Role/index.vue'),
          name: 'RoleList',
          meta: {
            title: $t('router.role'),
            icon: 'ant-design:safety-certificate-outlined',
          },
        },
      ],
    },
  ],
}

export default systemRouter
