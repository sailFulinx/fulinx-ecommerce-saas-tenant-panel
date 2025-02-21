<script setup lang="ts">
import { formatTime } from '@/utils'
import html2pdf from 'html2pdf.js'

const dialogVisible = ref<boolean>(false)

const orderData = ref<OrderShowData & CommonField>({
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
})

const orderProducts = ref<(OrderProductListResultDo & CommonField)[]>([])

const orderAmountList = ref<OrderAmountItem[]>([])
const open = (
  orderDataValue: OrderShowData & CommonField,
  orderProductsValue: (OrderProductListResultDo & CommonField)[],
) => {
  dialogVisible.value = true
  orderData.value = orderDataValue
  orderProducts.value = orderProductsValue
  orderAmountList.value = JSON.parse(orderDataValue.orderAmountListResultDo?.amountDetail)
}

const submit = async () => {
  const element = document.getElementById('pdf-container')
  html2pdf().set({ filename: `${orderData.value.id}.pdf` }).from(element).save()
}

defineExpose({
  open,
})
</script>

<template>
  <ElDialog v-model="dialogVisible" title="订单导出" width="60%" class="min-h-screen">
    <div id="pdf-container" class="p-6 bg-white">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-4">
          <div>网址：www.tanpoqiuer.com</div>
          <div>
            <img src="@/assets/imgs/logo_t.png" class="w-40 mb-3">
          </div>
        </div>
        <ElDivider />
        <div class="text-center mb-4">
          <h1 class="text-2xl font-bold">
            上海坦泼秋尔电器科技有限公司订货单
          </h1>
        </div>

        <div class="grid grid-cols-2 gap-4 border-b pb-4">
          <div>
            <p class="font-semibold mb-4">
              订单编号: {{ orderData.id }}
              <span class="font-normal" />
            </p>
            <p class="font-semibold">
              单据日期:
              <span class="font-normal">{{ orderData.recordCreateTime ? formatTime(orderData.recordCreateTime) : '' }}</span>
            </p>
          </div>
          <div />
        </div>

        <!-- <h3 class="text-lg font-bold mb-2">
          联系人信息
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-semibold">
              联系人:
              <span class="font-normal">沈菲</span>
            </p>
            <p class="font-semibold">
              电话:
              <span class="font-normal">021-62041956</span>
            </p>
          </div>
          <div>
            <p class="font-semibold">
              传真:
              <span class="font-normal">021-62042259</span>
            </p>
          </div>
        </div> -->

        <!-- <ElDivider /> -->

        <h3 class="text-lg font-bold my-4">
          一、产品型号、规格、数量及金额
        </h3>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left">
                订货内容
              </th>
              <th class="border border-gray-300 px-4 py-2 text-left w-32">
                SKU
              </th>
              <th class="border border-gray-300 px-4 py-2 text-right w-24">
                单价
              </th>
              <th class="border border-gray-300 px-4 py-2 text-center w-24">
                数量
              </th>
              <th class="border border-gray-300 px-4 py-2 text-right w-56">
                小计（含13%增值税）
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in orderProducts" :key="index" class="odd:bg-white even:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2">
                {{ product.productDetail.productName }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-gray-600">
                {{ product.sku }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-right">
                {{ product.orderPrice.toFixed(2) }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                {{ product.orderQuantity }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-right">
                {{ product.subtotalAmount.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4">
          <p v-for="(item, index) in orderAmountList" :key="index" class="flex justify-end font-semibold mb-4">
            {{ item.orderAmountItemDescription }}：
            <span class="font-normal">
              {{ item.orderAmountItemAmount.toFixed(2) }}
            </span>
          </p>
          <p class="flex justify-end font-semibold mb-4">
            合计：
            <span class="font-normal">
              {{ orderData.orderTotalAmount.toFixed(2) }}
            </span>
          </p>
        </div>

        <ElDivider />

        <h3 class="text-lg font-bold my-4">
          二、收货时间：按合同交货期执行；
        </h3>
        <h3 class="text-lg font-bold my-4">
          三、运费承担：货运，运费由供方承担；
        </h3>
        <h3 class="text-lg font-bold mb-2">
          四、交货地址及接收人：
        </h3>
        <p class="font-semibold">
          地址：
          <span class="font-normal">
            {{ orderData.orderAddressListResultDos[0]?.administrativeProvinceShortName
            }}{{ orderData.orderAddressListResultDos[0]?.administrativeCityShortName
            }}{{ orderData.orderAddressListResultDos[0]?.address1
            }}{{ orderData.orderAddressListResultDos[0]?.address2 }}
          </span>
        </p>
        <p class="font-semibold">
          收货人:
          <span class="font-normal">{{ orderData.orderAddressListResultDos[0]?.fullName }}</span>
        </p>
        <p class="font-semibold">
          电话:
          <span class="font-normal">{{ orderData.orderAddressListResultDos[0]?.telephone }}</span>
        </p>

        <ElDivider />

        <div class="text-right mt-6">
          <p class="text-sm mr-20 mb-5">
            订购方盖章:
          </p>
          <p class="text-sm mr-10">
            (请签章确认后回传)
          </p>
        </div>
      </div>
    </div>
    <template #footer>
      <ElButton @click="dialogVisible = false">
        取 消
      </ElButton>
      <ElButton type="primary" @click="submit">
        确 定
      </ElButton>
    </template>
  </ElDialog>
</template>
