import { useLocale } from '@/hooks/useLocale'
import { Layout } from '@/utils/routerHelper'

const { t: $t } = useLocale()

const appRouter: AppRouteRecordRaw = {
  path: '/app',
  component: Layout,
  redirect: '/app/message/list',
  name: 'App',
  meta: {
    title: $t('router.app'),
    icon: 'ant-design:appstore-outlined',
    noCache: true,
    hidden: false,
    canTo: false,
  },
  children: [
    {
      path: 'message',
      component: Layout,
      redirect: '/app/message/list',
      name: 'Appointment',
      meta: {
        title: $t('router.message'),
        icon: 'ant-design:message-outlined',
        noCache: true,
        hidden: false,
        canTo: false,
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/Message/index.vue'),
          name: 'MessageList',
          meta: {
            title: $t('router.message'),
            icon: 'ant-design:message-outlined',
          },
        },
      ],
    },
  ],
}

export default appRouter
