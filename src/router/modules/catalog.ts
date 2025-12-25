import { Layout } from '@/utils/routerHelper'

const { t: $t } = useLocale()

const catalogRouter: AppRouteRecordRaw = {
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
      component: () => import('@/views/Catalog/Product/index.vue'),
      name: 'ProductList',
      meta: {
        title: $t('router.product'),
        icon: 'ant-design:barcode-outlined',
      },
    },
    {
      path: 'product/create',
      component: () => import('@/views/Catalog/Product/Create.vue'),
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
      component: () => import('@/views/Catalog/Product/Show.vue'),
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
      component: () => import('@/views/Catalog/Parameter/index.vue'),
      name: 'ParameterList',
      meta: {
        title: $t('router.parameter'),
        icon: 'ant-design:funnel-plot-outlined',
      },
    },
    {
      path: 'parameter/create',
      component: () => import('@/views/Catalog/Parameter/Create.vue'),
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
      component: () => import('@/views/Catalog/Parameter/Show.vue'),
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
      path: 'supplier',
      component: () => import('@/views/Catalog/Supplier/index.vue'),
      name: 'SupplierList',
      meta: {
        title: $t('router.supplier'),
        icon: 'ant-design:insert-row-below-outlined',
      },
    },
    {
      path: 'supplier/create',
      component: () => import('@/views/Catalog/Supplier/Create.vue'),
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
      component: () => import('@/views/Catalog/Supplier/Show.vue'),
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
      component: () => import('@/views/Catalog/File/index.vue'),
      name: 'FileList',
      meta: {
        title: $t('router.file'),
        icon: 'ant-design:file-image-outlined',
      },
    },
    {
      path: 'category',
      component: () => import('@/views/Catalog/Category/index.vue'),
      name: 'ProductCategoryList',
      meta: {
        title: $t('router.catalogCategory'),
        icon: 'ep:document',
        noCache: true,
      },
    },
    {
      path: 'category/show/:id(\\d+)',
      component: () => import('@/views/Catalog/Category/Show.vue'),
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
}

export default catalogRouter
