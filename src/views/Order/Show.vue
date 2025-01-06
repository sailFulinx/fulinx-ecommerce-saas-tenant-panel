<script setup name="OrderDetail" lang="ts">
import { approvalOrderApi, showOrderApi, updateOrderStatusApi } from '@/api/order'
import { getOrderStatusLabel, orderStatuses } from '@/data/order'
import { useLocale } from '@/hooks/useLocale'
import { formatTime } from '@/utils'
import {
  ElAlert,
  ElCard,
  ElDescriptions,
  ElDivider,
  ElEmpty,
  ElForm,
  ElInput,
  ElMessage,
  ElSwitch,
  ElTable,
  ElTabPane,
  ElTabs,
} from 'element-plus'
import ApprovalDialog from './Modules/ApprovalDialog.vue'
import ShipmentDialog from './Modules/ShipmentDialog.vue'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

const loading = reactive({
  init: false,
  categories: false,
})

// 创建order请求参数
const createFormData = (): OrderShowData & CommonField => {
  return {
    id: '',
    siteId: '',
    customerId: '',
    cartIds: '',
    currencyId: '',
    currencyCode: '',
    currencyVo: {
      id: '',
      countryName: '',
      currencyName: '',
      currencyCode: '',
      symbolLeft: '',
      symbolRight: '',
      decimalPlace: 0,
      isHot: true,
      sort: 0,
      recordVersion: 0,
      isDelete: 0,
      remark: '',
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
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
    invoiceStatus: 0,
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
        recordUpdateTime: '',
      },
    ],
    orderProductListResultDos: [
      {
        id: '',
        orderId: '',
        customerId: '',
        orderPrice: 0,
        orderQuantity: 0,
        shippedQuantity: 0,
        remainQuantity: 0,
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
        recordUpdateTime: '',
      },
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
        recordUpdateTime: '',
      },
    ],
    orderAmountListResultDo: {
      id: '',
      orderId: '',
      amountDetail: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    orderShipmentListResultDos: [
      {
        id: '',
        orderId: '',
        orderProductId: '',
        shipmentQuantity: 0,
        shippingCompanyId: '',
        shippingCompanyName: '',
        trackingNumber: '',
        shipmentComment: '',
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: '',
      },
    ],
    orderRemainShipmentProductListResultDos: [
      {
        orderId: '',
        orderProductId: '',
        sku: '',
        remainShipmentQuantity: 0,
      },
    ],
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
    products: [],
  }
}

// form初始化
const form = reactive<OrderShowData & CommonField>(createFormData())

const orderProducts = ref<(OrderProductListResultDo & CommonField)[]>([])

const parseOrderProductData = (item: OrderProductListResultDo & CommonField) => ({
  ...item,
  productCategory: JSON.parse(item.productCategory || '{}'),
  productDetail: JSON.parse(item.productDetail || '{}'),
  productMeasure: JSON.parse(item.productMeasure || '{}'),
  productFile: JSON.parse(item.productFile || '{}'),
  productOther: JSON.parse(item.productOther || '{}'),
  productPrice: JSON.parse(item.productPrice || '{}'),
  productSeo: JSON.parse(item.productSeo || '{}'),
  productParameter: JSON.parse(item.productParameter || '{}'),
  productTag: JSON.parse(item.productTag || '{}'),
})

// 获取文章数据
const getOrderData = async () => {
  loading.init = true
  const { data } = await showOrderApi(id).catch(error => {
    loading.init = false
    throw error
  })
  orderProducts.value = data.orderProductListResultDos.map(parseOrderProductData)
  loading.init = false
  return data
}

const resetFormData = async (val: OrderShowData) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
  })
}

const initFormData = async () => {
  const res = await getOrderData()
  resetFormData(res)
}

initFormData()

const activeName = ref<string>('orderStatusManager')

const handleChangeTab = (_name: string) => {}

// 审核订单
const approvalDialogRef = ref()
const handleApproval = async () => {
  approvalDialogRef.value.open(id)
}

// 更改订单状态
const updateOrderStatusFormRef = ref()
const updateOrderStatusForm = reactive({
  orderStatus: null,
  orderComment: '',
})
const updateOrderStatusRules = reactive({
  orderStatus: [
    {
      required: true,
      message: '请选择订单状态',
      trigger: 'change',
    },
  ],
})
const handleUpdateOrderStatus = async () => {
  const valid = await updateOrderStatusFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  loading.init = true
  await updateOrderStatusApi({
    orderId: id,
    orderStatus: updateOrderStatusForm.orderStatus,
    orderComment: updateOrderStatusForm.orderComment,
  }).catch(error => {
    loading.init = false
    throw error
  })
  ElMessage.success({
    message: '修改状态成功',
    type: 'success',
  })
  initFormData()
  loading.init = false
}

const shipmentDialogRef = ref()

const handleShipment = async (orderProduct: OrderProductListResultDo & CommonField) => {
  shipmentDialogRef.value.open(id, form.orderRemainShipmentProductListResultDos, orderProduct)
}
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
            <!-- <div class="mr-2">
              <EBtn text type="primary">
                {{ $t('order.editOrder') }}
              </EBtn>
            </div>
            <div class="mr-2">
              <EBtn text type="primary">
                {{ $t('order.printOrder') }}
              </EBtn>
            </div> -->
            <!-- <div class="mr-2">
              <EBtn plain type="primary" @click="handleShipment">
                <Icon name="ant-design:truck-outlined" :size="6" class="mr-1" />
                {{ $t('order.shippingOrder') }}
              </EBtn>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card bg-gray-50">
      <div class="w-full grid grid-cols-2 gap-5 mb-5">
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
              {{ form.currencyVo.symbolLeft }}{{ form.orderTotalAmount.toFixed(2) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('order.status')">
              {{ form.orderStatusText }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('order.approvalStatus')">
              <div class="flex items-center">
                <div class="mr-2">
                  {{ form.approvalStatusText }}
                </div>
                <div>
                  <EBtn size="small" type="danger" @click="handleApproval">
                    审核
                  </EBtn>
                </div>
              </div>
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
          <ElDescriptions :column="1" border>
            <ElDescriptionsItem :label="$t('order.email')">
              {{ form.customerEmail }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('order.shippingFullName')">
              {{ form.orderAddressListResultDos[0]?.fullName }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('order.shippingTelephone')">
              {{ form.orderAddressListResultDos[0]?.telephone }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('order.shippingAddress')">
              {{ form.orderAddressListResultDos[0]?.administrativeProvinceShortName
              }}{{ form.orderAddressListResultDos[0]?.administrativeCityShortName
              }}{{ form.orderAddressListResultDos[0]?.address1 }}{{ form.orderAddressListResultDos[0]?.address2
              }}{{ form.orderAddressListResultDos[0]?.postcode }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>
      </div>
      <div class="w-full grid grid-cols-1 gap-5 mb-5">
        <ElCard shadow="never">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="text-sm font-bold">
                {{ $t('order.products') }}
              </div>
            </div>
          </template>
          <ElTable :border="true" :data="orderProducts" style="width: 100%">
            <ElTableColumn prop="productFile" label="图像" width="180">
              <template #default="scope">
                <a
                  class="cursor-pointer"
                  @click="
                    () => {
                      $router.push(`/catalog/product/show/${scope.row.productId}`)
                    }
                  "
                >
                  <img
                    :src="`${sourceUrl}${scope.row.productFile[0]?.fileVo?.fileUrl}`"
                    :alt="scope.row.productName?.productName"
                  >
                </a>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="sku" label="sku">
              <template #default="scope">
                <a
                  class="cursor-pointer"
                  @click="
                    () => {
                      $router.push(`/catalog/product/show/${scope.row.productId}`)
                    }
                  "
                >
                  <span class="text-blue-600 underline">{{ scope.row.sku }}</span>
                </a>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="mpn" label="制造商编号">
              <template #default="scope">
                <span class="text-gray-600">{{ scope.row.mpn }}</span>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="price" label="单价（含13%增值税）">
              <template #default="scope">
                {{ scope.row.orderPrice.toFixed(2) }}
              </template>
            </ElTableColumn>
            <ElTableColumn label="订购数量" width="280" align="center">
              <template #default="scope">
                {{ scope.row.orderQuantity }}
              </template>
            </ElTableColumn>
            <ElTableColumn label="已发运数量" width="280" align="center">
              <template #default="scope">
                {{ scope.row.shippedQuantity || 0 }}
              </template>
            </ElTableColumn>
            <ElTableColumn label="剩余发运数量" width="280" align="center">
              <template #default="scope">
                {{ scope.row.remainQuantity || scope.row.orderQuantity }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="total" label="小计（含13%增值税）">
              <template #default="scope">
                <div>{{ scope.row.subtotalAmount.toFixed(2) }}</div>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="total" label="操作">
              <template #default="scope">
                <EBtn plain type="primary" @click="handleShipment(scope.row)">
                  <Icon name="ant-design:truck-outlined" :size="6" class="mr-1" />
                  {{ $t('order.shippingOrder') }}
                </EBtn>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElCard>
      </div>
      <div class="w-full grid grid-cols-1 gap-5">
        <ElCard shadow="never">
          <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
            <ElTabPane :label="$t('order.orderStatusManager')" name="orderStatusManager">
              <ElTable :border="true" :data="form.orderHistoryListResultDos" style="width: 100%" class="mb-5">
                <ElTableColumn prop="orderStatus" label="订单状态">
                  <template #default="scope">
                    {{ getOrderStatusLabel(scope.row.orderStatus) }}
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="orderComment" label="留言">
                  <template #default="scope">
                    <div v-html="scope.row.orderComment" />
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="orderComment" label="记录创建时间">
                  <template #default="scope">
                    {{ formatTime(scope.row.recordCreateTime) }}
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="orderComment" label="创建者">
                  <template #default="scope">
                    {{ scope.row.recordCreateName }}
                  </template>
                </ElTableColumn>
              </ElTable>
              <div>
                <ElForm
                  ref="updateOrderStatusFormRef"
                  :model="updateOrderStatusForm"
                  :rules="updateOrderStatusRules"
                  label-width="100px"
                >
                  <ElFormItem label="订单状态" prop="orderStatus" required>
                    <ElSelect v-model="updateOrderStatusForm.orderStatus" placeholder="请选择订单状态">
                      <ElOption v-for="item in orderStatuses" :key="item.id" :label="item.label" :value="item.id" />
                    </ElSelect>
                  </ElFormItem>
                  <ElFormItem label="留言" prop="orderComment">
                    <ElInput v-model="updateOrderStatusForm.orderComment" type="textarea" />
                  </ElFormItem>
                </ElForm>
                <div class="flex justify-end">
                  <ElButton type="primary" @click="handleUpdateOrderStatus">
                    更新订单状态
                  </ElButton>
                </div>
              </div>
            </ElTabPane>
            <ElTabPane :label="$t('order.orderShippingHistory')" name="orderShippingHistory">
              <ElTable
                v-if="form.orderShipmentListResultDos && form.orderShipmentListResultDos.length > 0"
                :border="true"
                :data="form.orderShipmentListResultDos"
                style="width: 100%"
              >
                <ElTableColumn prop="sku" label="sku" width="180">
                  <template #default="scope">
                    <a
                      class="cursor-pointer"
                      @click="
                        () => {
                          $router.push(`/catalog/product/show/${scope.row.productId}`)
                        }
                      "
                    >
                      <span class="text-blue-600 underline">{{ scope.row.sku }}</span>
                    </a>
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="shipmentQuantity" label="发运数量" width="180">
                  <template #default="scope">
                    <span>{{ scope.row.shipmentQuantity }}</span>
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="shippingCompanyName" label="快递公司" width="180">
                  <template #default="scope">
                    <span>{{ scope.row.shippingCompanyName }}</span>
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="trackingNumber" label="快递单号" width="180">
                  <template #default="scope">
                    <span>{{ scope.row.trackingNumber }}</span>
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="recordCreateTime" label="发运时间" width="180">
                  <template #default="scope">
                    <span>{{ formatTime(scope.row.recordCreateTime) }}</span>
                  </template>
                </ElTableColumn>
              </ElTable>
              <ElEmpty v-else description="暂无发运记录" />
            </ElTabPane>
          </ElTabs>
        </ElCard>
      </div>
    </div>
    <!-- 审核订单dialog -->
    <ApprovalDialog ref="approvalDialogRef" @get-order="initFormData" />
    <!-- 发货dialog -->
    <ShipmentDialog ref="shipmentDialogRef" @get-order="initFormData" />
  </div>
</template>
