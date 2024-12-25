import type { RouteRecordRaw } from 'vue-router'

import { useLocale } from '@/hooks/useLocale'
import { Layout } from '@/utils/routerHelper'

import { createRouter, createWebHashHistory } from 'vue-router'

const { t: $t } = useLocale()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true,
    },
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'RedirectPath',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {},
      },
    ],
    meta: {
      hidden: true,
      noTagsView: true,
    },
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: $t('router.login'),
      noTagsView: true,
    },
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true,
    },
  },
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
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
  },
  {
    path: '/catalog',
    component: Layout,
    redirect: '/catalog/product/list',
    name: 'Catalog',
    meta: {
      title: $t('router.product'),
      icon: 'ant-design:barcode-outlined',
      noCache: true,
      hidden: false,
      canTo: false,
    },
    children: [
      {
        path: 'product/list',
        component: () => import('@/views/Product/index.vue'),
        name: 'ProductList',
        meta: {
          title: $t('router.product'),
          icon: 'ant-design:barcode-outlined',
        },
      },
      {
        path: 'product/create',
        component: () => import('@/views/Product/Create.vue'),
        name: 'CreateProduct',
        meta: {
          title: $t('product.add'),
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/product/product',
          props: false,
        },
      },
      {
        path: 'product/show/:id',
        component: () => import('@/views/Product/Show.vue'),
        name: 'ShowProduct',
        meta: {
          title: $t('product.show'),
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/product/product',
          props: true,
        },
      },
      {
        path: 'parameter',
        component: () => import('@/views/Parameter/index.vue'),
        name: 'ParameterList',
        meta: {
          title: $t('router.parameter'),
          icon: 'ant-design:funnel-plot-outlined',
        },
      },
      {
        path: 'parameter/create',
        component: () => import('@/views/Parameter/Create.vue'),
        name: 'CreateParameter',
        meta: {
          title: $t('parameter.add'),
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/product/parameter',
          props: false,
        },
      },
      {
        path: 'parameter/show/:id',
        component: () => import('@/views/Parameter/Show.vue'),
        name: 'ShowParameter',
        meta: {
          title: $t('parameter.show'),
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/product/parameter',
          props: true,
        },
      },
      {
        path: 'parameterGroup',
        component: () => import('@/views/ParameterGroup/index.vue'),
        name: 'ParameterGroupList',
        meta: {
          title: $t('router.parameterGroup'),
          icon: 'ant-design:gateway-outlined',
        },
      },
      {
        path: 'parameterGroup/create',
        component: () => import('@/views/ParameterGroup/Create.vue'),
        name: 'CreateParameterGroup',
        meta: {
          title: $t('parameterGroup.add'),
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/product/parameterGroup',
          props: false,
        },
      },
      {
        path: 'parameterGroup/show/:id',
        component: () => import('@/views/ParameterGroup/Show.vue'),
        name: 'ShowParameterGroup',
        meta: {
          title: $t('parameterGroup.show'),
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/product/parameterGroup',
          props: true,
        },
      },
      // {
      //   path: 'brand',
      //   component: () => import('@/views/Brand/index.vue'),
      //   name: 'BrandList',
      //   meta: {
      //     title: $t('router.brand'),
      //     icon: 'ant-design:gold-outlined',
      //   },
      // },
      // {
      //   path: 'brand/create',
      //   component: () => import('@/views/Brand/Create.vue'),
      //   name: 'CreateBrand',
      //   meta: {
      //     title: $t('brand.add'),
      //     noCache: true,
      //     hidden: true,
      //     canTo: true,
      //     activeMenu: '/product/brand',
      //     props: false,
      //   },
      // },
      // {
      //   path: 'brand/show/:id',
      //   component: () => import('@/views/Brand/Show.vue'),
      //   name: 'ShowBrand',
      //   meta: {
      //     title: $t('brand.show'),
      //     noCache: true,
      //     hidden: true,
      //     canTo: true,
      //     activeMenu: '/product/brand',
      //     props: true,
      //   },
      // },
      {
        path: 'supplier',
        component: () => import('@/views/Supplier/index.vue'),
        name: 'SupplierList',
        meta: {
          title: $t('router.supplier'),
          icon: 'ant-design:insert-row-below-outlined',
        },
      },
      {
        path: 'supplier/create',
        component: () => import('@/views/Supplier/Create.vue'),
        name: 'CreateSupplier',
        meta: {
          title: $t('supplier.add'),
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/product/supplier',
          props: false,
        },
      },
      {
        path: 'supplier/show/:id',
        component: () => import('@/views/Supplier/Show.vue'),
        name: 'ShowSupplier',
        meta: {
          title: $t('supplier.show'),
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/product/supplier',
          props: true,
        },
      },
      {
        path: 'file',
        component: () => import('@/views/File/index.vue'),
        name: 'FileList',
        meta: {
          title: $t('router.file'),
          icon: 'ant-design:file-image-outlined',
        },
      },
    ],
  },
  {
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
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/list',
    name: 'Customer',
    meta: {
      title: $t('router.customer'),
      icon: 'ant-design:user-switch-outlined',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/Customer/index.vue'),
        name: 'CustomerList',
        meta: {
          title: $t('router.customer'),
          icon: 'ant-design:appstore-outlined',
          noCache: true,
        },
      },
      {
        path: '/customer/show/:id',
        component: () => import('@/views/Customer/Show.vue'),
        name: 'ShowCustomer',
        meta: {
          title: `${$t('customer.show')}`,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/category',
          props: true,
        },
      },
      {
        path: 'invoice/list',
        component: () => import('@/views/Customer/Invoice/index.vue'),
        name: 'CustomerInvoiceList',
        meta: {
          title: $t('router.invoice'),
          icon: 'ant-design:appstore-outlined',
          noCache: true,
        },
      },
      {
        path: 'invoice/show/:id',
        component: () => import('@/views/Customer/Invoice/Show.vue'),
        name: 'ShowCustomerInvoice',
        meta: {
          title: `${$t('invoice.show')}`,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/customer/invoice/list',
          props: true,
        },
      },
    ],
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  // {
  //   path: '/test',
  //   component: Layout,
  //   redirect: '/test/list',
  //   name: 'Test',
  //   meta: {
  //     title: 'test',
  //     icon: 'ant-design:message-outlined',
  //     noCache: true,
  //     hidden: false,
  //     canTo: false,
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/Test/index.vue'),
  //       name: 'TestList',
  //       meta: {
  //         title: 'test',
  //         icon: 'ant-design:message-outlined',
  //       },
  //     },
  //   ],
  // },
  {
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
        path: '/user/list',
        component: () => import('@/views/User/index.vue'),
        name: 'SystemUser',
        meta: {
          title: $t('router.user'),
          icon: 'ant-design:user-outlined',
        },
      },
      {
        path: '/role/list',
        component: () => import('@/views/Role/index.vue'),
        redirect: '/role/list',
        name: 'Role',
        meta: {
          title: $t('router.role'),
          icon: 'ant-design:safety-certificate-outlined',
        },
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
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
