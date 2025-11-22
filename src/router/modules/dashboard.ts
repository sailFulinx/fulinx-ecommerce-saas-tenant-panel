import type { AppRouteRecordRaw } from '@/types/common'

import { Layout } from '@/utils/routerHelper'

const { t: $t } = useLocale()

const dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  component: Layout,
  redirect: '/dashboard/analysis',
  name: 'Dashboard',
  meta: {
    title: $t('router.dashboard'),
    icon: 'ant-design:dashboard-outlined',
    noCache: true,
    hidden: false,
    canTo: false,
  },
  children: [
    {
      path: 'analysis',
      component: () => import('@/views/Dashboard/Analysis.vue'),
      name: 'Analysis',
      meta: {
        title: $t('router.analysis'),
        icon: 'ant-design:dashboard-outlined',
      },
    },
  ],
}

export default dashboard
