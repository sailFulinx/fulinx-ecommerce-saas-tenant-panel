<script setup name="OrderDetail" lang="ts">
import { showOrderApi } from '@/api/order'
import { useLocale } from '@/hooks/useLocale'
import { formatTime } from '@/utils'
import {
  ElAlert,
  ElCard,
  ElDescriptions,
  ElDivider,
  ElInput,
  ElMessage,
  ElSwitch,
  ElTable,
  ElTabPane
} from 'element-plus'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const loading = reactive({
  init: false,
  categories: false
})

// 创建order请求参数
const createFormData = (): OrderData & CommonField => {
  return {
    id: '',
    siteId: '',
    customerId: '',
    cartIds: '',
    currencyId: '',
    currencyCode: '',
    customerEmail: '',
    shippingMethodCode: '',
    paymentMethodCode: '',
    orderTotalQuantity: 0,
    orderTotalAmount: 0,
    orderStatus: 0,
    orderStatusText: '',
    ipAddress: '',
    userAgent: '',
    approvalStatus: 0,
    approvalStatusText: '',
    rejectReason: '',
    orderHistoryListResultDos: [
      {
        id: '',
        orderId: '',
        orderStatus: 0,
        orderComment: '',
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: ''
      }
    ],
    orderProductListResultDos: [
      {
        id: '',
        orderId: '',
        customerId: '',
        orderPrice: 0,
        orderQuantity: 0,
        subtotalAmount: 0,
        productId: '',
        sku: '',
        mpn: '',
        productType: 0,
        isRequiredShipping: true,
        isSettingOnlineTime: true,
        onlineTime: '',
        isSettingOfflineTime: true,
        offlineTime: '',
        inStockQuantity: 0,
        processingQuantity: 0,
        processingDays: 0,
        productionCycle: 0,
        brandId: '',
        brandName: '',
        supplierId: '',
        supplierName: '',
        parameterGroupId: '',
        isCustomLayout: true,
        layoutId: '',
        sort: 0,
        status: true,
        productCategory: '',
        productDetail: '',
        productMeasure: '',
        productFile: '',
        productOther: '',
        productPrice: '',
        productSeo: '',
        productParameter: '',
        productTag: '',
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: ''
      }
    ],
    orderAddressListResultDos: [
      {
        id: '',
        orderId: '',
        customerId: '',
        customerAddressId: '',
        fullName: '',
        telephone: '',
        administrativeProvinceId: '',
        administrativeProvinceShortName: '',
        administrativeProvinceFullName: '',
        administrativeCityId: '',
        administrativeCityShortName: '',
        administrativeCityFullName: '',
        administrativeDistrictId: '',
        administrativeDistrictShortName: '',
        administrativeDistrictFullName: '',
        address1: '',
        address2: '',
        postcode: '',
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: ''
      }
    ],
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
    products: []
  }
}

// form初始化
const form = reactive<OrderData & CommonField>(createFormData())

// 获取文章数据
const getOrderData = async () => {
  loading.init = true
  const { data } = await showOrderApi(id).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: OrderData) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
  })
}

const initFormData = async () => {
  const res = await getOrderData()
  resetFormData(res)
}

initFormData()
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header border-b border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('order.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2">
              <EBtn text type="primary">
                {{ $t('order.editOrder') }}
              </EBtn>
            </div>
            <div class="mr-2">
              <EBtn text type="primary">
                {{ $t('order.printOrder') }}
              </EBtn>
            </div>
            <div class="mr-2">
              <EBtn text type="primary">
                {{ $t('order.shippingOrder') }}
              </EBtn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card bg-gray-50">
      <div class="w-full grid grid-cols-2 gap-5">
        <ElCard shadow="never">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="text-sm font-bold">
                {{ $t('order.base') }}
              </div>
            </div>
          </template>
          <ElDescriptions :column="1" border>
            <ElDescriptionsItem :label="$t('order.orderId')">
              {{ form.id }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('order.orderTotalAmount')">
              {{ form.orderTotalAmount.toFixed(2) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('order.status')">
              {{ form.orderStatusText }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('order.approvalStatus')">
              {{ form.approvalStatusText }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('order.paymentMethod')">
              {{ form.paymentMethodCode }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('order.shippingMethod')">
              {{ form.shippingMethodCode }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('common.recordCreateTime')">
              {{ form.recordCreateTime ? formatTime(form.recordCreateTime) : '' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('common.recordUpdateTime')">
              {{ form.recordUpdateTime ? formatTime(form.recordUpdateTime) : '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('order.recordUpdateName')">
              {{ form.recordUpdateName ? form.recordUpdateName : '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>
        <ElCard shadow="never">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="text-sm font-bold">
                {{ $t('order.other') }}
              </div>
            </div>
          </template>
        </ElCard>
      </div>
    </div>
  </div>
</template>
