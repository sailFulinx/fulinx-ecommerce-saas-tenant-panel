import { Layout } from '@/utils/routerHelper'

const { t: $t } = useLocale()

const customerRouter: AppRouteRecordRaw = {
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
}

export default customerRouter
