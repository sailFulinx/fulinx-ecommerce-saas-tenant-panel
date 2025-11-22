import type { AppRouteRecordRaw } from '@/types/common'
import { Layout } from '@/utils/routerHelper'

const { t: $t } = useLocale()

const article: AppRouteRecordRaw = {
  path: '/article',
  component: Layout,
  redirect: '/article/list',
  name: 'Article',
  meta: {
    title: $t('router.article'),
    icon: 'ant-design:unordered-list-outlined',
    noCache: true,
    hidden: false,
    canTo: false,
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/Article/index.vue'),
      name: 'ArticleList',
      meta: {
        title: $t('router.article'),
        icon: 'ant-design:unordered-list-outlined',
      },
    },
    {
      path: 'create',
      component: () => import('@/views/Article/Create.vue'),
      name: 'CreateArticle',
      meta: {
        title: $t('article.add'),
        noCache: true,
        hidden: true,
        canTo: true,
        activeMenu: '/article',
        props: false,
      },
    },
    {
      path: 'show/:id',
      component: () => import('@/views/Article/Show.vue'),
      name: 'ShowArticle',
      meta: {
        title: $t('article.show'),
        noCache: true,
        hidden: true,
        canTo: true,
        activeMenu: '/article',
        props: true,
      },
    },
  ],
}

export default article
