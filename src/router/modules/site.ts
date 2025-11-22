import type { AppRouteRecordRaw } from '@/types/common'
import { Layout } from '@/utils/routerHelper'

const { t: $t } = useLocale()
const site: AppRouteRecordRaw = {
  path: '/site',
  component: Layout,
  redirect: '/site/list',
  name: 'Site',
  meta: {
    title: '网站管理',
    icon: 'ant-design:cloud-server-outlined',
    noCache: true,
    hidden: false,
    canTo: false,
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/Site/index.vue'),
      name: 'SiteList',
      meta: {
        title: '网站列表',
        icon: 'ant-design:cloud-server-outlined',
      },
    },
    {
      path: 'create',
      component: () => import('@/views/Site/Create.vue'),
      name: 'CreateSite',
      meta: {
        title: '网站新增',
        noCache: true,
        hidden: true,
        canTo: true,
        activeMenu: '/site',
        props: false,
      },
    },
    {
      path: 'edit/:id',
      component: () => import('@/views/Site/Edit.vue'),
      name: 'EditSite',
      meta: {
        title: '网站修改',
        noCache: true,
        hidden: true,
        canTo: true,
        activeMenu: '/site',
        props: true,
      },
    },
    {
      path: 'layout/list',
      component: () => import('@/views/Layout/index.vue'),
      name: 'LayoutList',
      meta: {
        title: $t('router.layout'),
        icon: 'ant-design:layout-outlined',
      },
    },
    {
      path: 'layout/component/list',
      component: () => import('@/views/Component/index.vue'),
      name: 'ComponentList',
      meta: {
        title: $t('router.component'),
        icon: 'ant-design:block-outlined',
      },
    },
    {
      path: 'theme/list',
      component: () => import('@/views/Theme/index.vue'),
      name: 'ThemeList',
      meta: {
        title: '主题列表',
        icon: 'ant-design:gold-outlined',
      },
    },
    {
      path: 'theme/create',
      component: () => import('@/views/Theme/Create.vue'),
      name: 'CreateTheme',
      meta: {
        title: '主题新增',
        noCache: true,
        hidden: true,
        canTo: true,
        activeMenu: '/Theme',
        props: false,
      },
    },
    {
      path: 'theme/edit/:id',
      component: () => import('@/views/Theme/Edit.vue'),
      name: 'EditTheme',
      meta: {
        title: '主题修改',
        noCache: true,
        hidden: true,
        canTo: true,
        activeMenu: '/Theme',
        props: true,
      },
    },
    {
      path: 'theme/setting/:id',
      component: () => import('@/views/Theme/Components/ComponentSetting.vue'),
      name: 'EditThemeComponent',
      meta: {
        title: '主题组件设置',
        noCache: true,
        hidden: true,
        canTo: true,
        activeMenu: '/Theme',
        props: true,
      },
    },
  ],
}

export default site
