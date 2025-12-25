import { useLocale } from '@/hooks/useLocale'
import { Layout } from '@/utils/routerHelper'

const { t: $t } = useLocale()

const contentRouter: AppRouteRecordRaw = {
  path: '/content',
  component: Layout,
  redirect: '/content/article/list',
  name: 'Content',
  meta: {
    title: $t('router.content'),
    icon: 'mdi:content-copy',
  },
  children: [
    {
      path: 'category',
      redirect: '/content/category/list',
      name: 'Category',
      meta: {
        title: $t('router.category'),
        icon: 'mdi:file-document-outline',
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/Content/Category/index.vue'),
          name: 'CategoryList',
          meta: {
            title: $t('router.category'),
            icon: 'ep:document',
            noCache: true,
          },
        },
        {
          path: 'show/:id(\\d+)',
          component: () => import('@/views/Content/Category/Show.vue'),
          name: 'ShowCategory',
          meta: {
            title: `${$t('category.show')}`,
            noCache: true,
            hidden: true,
            canTo: true,
            activeMenu: '/category',
          },
          props: true,
        },
      ],
    },
    {
      path: 'article',
      redirect: '/content/article/list',
      name: 'Article',
      meta: {
        title: $t('router.article'),
        icon: 'mdi:file-document-outline',
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/Content/Article/index.vue'),
          name: 'ArticleList',
          meta: {
            title: $t('router.article'),
            noCache: true,
          },
        },
        {
          path: 'create',
          component: () => import('@/views/Content/Article/Create.vue'),
          name: 'CreateArticle',
          meta: {
            keepAlive: true,
            title: $t('article.add'),
            // noCache: true,
            hidden: true,
            canTo: true,
            activeMenu: '/content/article/list',
            props: false,
          },
        },
        {
          path: 'show/:id(\\d+)',
          component: () => import('@/views/Content/Article/Show.vue'),
          name: 'ShowArticle',
          meta: {
            title: `${$t('article.show')}`,
            noCache: true,
            hidden: true,
            canTo: true,
            activeMenu: '/content/article/list',
          },
          props: true,
        },
      ],
    },
    {
      path: 'page',
      redirect: '/content/page/list',
      name: 'Page',
      meta: {
        title: $t('router.page'),
        icon: 'mdi:file-outline',
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/Content/Page/index.vue'),
          name: 'PageList',
          meta: {
            title: $t('router.page'),
            noCache: true,
          },
        },
        {
          path: 'create',
          component: () => import('@/views/Content/Page/Create.vue'),
          name: 'CreatePage',
          meta: {
            title: $t('page.add'),
            noCache: true,
            hidden: true,
            canTo: true,
            activeMenu: '/content/page/list',
            props: false,
          },
        },
        {
          path: 'show/:id(\\d+)',
          component: () => import('@/views/Content/Page/Show.vue'),
          name: 'ShowPage',
          meta: {
            title: `${$t('page.show')}`,
            noCache: true,
            hidden: true,
            canTo: true,
            activeMenu: '/content/page/list',
          },
          props: true,
        },
      ],
    },
  ],
}

export default contentRouter
