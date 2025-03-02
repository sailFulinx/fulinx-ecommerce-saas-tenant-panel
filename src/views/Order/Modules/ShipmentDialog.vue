<script setup lang="ts">
import { createOrderShipmentApi } from '@/api/order'
import { removeShippingCompanyApi, shippingCompanyPaginationApi } from '@/api/shipping'
import { ElDescriptions, ElInputNumber, ElMessage, ElSelect } from 'element-plus'

const emit = defineEmits(['getOrder'])

const loading = reactive({
  list: false,
  del: false,
  init: false,
})

const listShippingCompanyResult = ref<TableResponse<ShippingCompanyListData & CommonField>>({
  list: [],
  total: 0,
})
const listShippingCompanyQuery = reactive<ShippingCompanyListParams & Pagination>({
  shippingCompanyName: '',
  pageSize: 20,
  pageNumber: 1,
})

const getShippingCompanyList = async () => {
  loading.list = true
  if (listShippingCompanyQuery.shippingCompanyName === '') {
    listShippingCompanyQuery.shippingCompanyName = null
  }
  const { data } = await shippingCompanyPaginationApi(listShippingCompanyQuery).catch(err => {
    loading.list = false
    throw err
  })
  listShippingCompanyResult.value = data
  loading.list = false
}

const orderId = ref('')
const formRef = ref()

const rules = reactive({
  shipmentQuantity: [
    {
      required: true,
      message: '请输入发货数量',
      trigger: 'blur',
    },
  ],
  shippingCompanyId: [
    {
      required: true,
      message: '请选择快递公司',
      trigger: 'blur',
    },
  ],
  trackingNumber: [
    {
      required: true,
      message: '请输入快递单号',
      trigger: 'blur',
    },
  ],
})

const form = reactive<OrderShipmentParams>({
  orderId: '',
  orderProductId: '',
  shipmentQuantity: 1,
  shippingCompanyId: '',
  trackingNumber: '',
})

const orderRemainShipmentProducts = ref<OrderRemainShipmentProductListResultDo[]>([])

const currentShipmentProduct = ref<OrderRemainShipmentProductListResultDo>({
  orderId: '',
  orderProductId: '',
  remainShipmentQuantity: 0,
  sku: '',
})

const dialogVisible = ref<boolean>(false)
const open = async (
  orderIdValue: string,
  orderRemainShipmentProductsData: OrderRemainShipmentProductListResultDo[],
  orderProductDataValue: OrderProductListResultDo & CommonField,
) => {
  form.orderId = ''
  form.orderProductId = ''
  form.shipmentQuantity = 1
  form.shippingCompanyId = ''
  form.trackingNumber = ''
  currentShipmentProduct.value = {
    orderId: '',
    orderProductId: '',
    remainShipmentQuantity: 0,
    sku: '',
  }
  dialogVisible.value = true
  orderId.value = orderIdValue
  form.orderId = orderIdValue
  form.orderProductId = orderProductDataValue.id
  orderRemainShipmentProducts.value = orderRemainShipmentProductsData
  orderRemainShipmentProductsData.forEach(item => {
    if (item.orderProductId === orderProductDataValue.id) {
      currentShipmentProduct.value = item
    }
  })
  await getShippingCompanyList()
}

const submit = async () => {
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  loading.init = true
  await createOrderShipmentApi(form).catch(error => {
    loading.init = false
    throw error
  })
  emit('getOrder')
  ElMessage.success('发货成功')
  dialogVisible.value = false
  loading.init = false
}

defineExpose({
  open,
})
</script>

<template>
  <ElDialog v-model="dialogVisible" title="发货" width="80%">
    <ElDescriptions title="当前发运产品" :column="2" border class="mb-4">
      <ElDescriptionsItem label="SKU">
        {{ currentShipmentProduct?.sku }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="剩余应发货数量">
        {{ currentShipmentProduct?.remainShipmentQuantity }}
      </ElDescriptionsItem>
    </ElDescriptions>
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem label="发货数量" prop="shipmentQuantity">
        <ElInputNumber
          v-model="form.shipmentQuantity"
          type="number"
          :min="1"
          :max="currentShipmentProduct?.remainShipmentQuantity"
        />
      </ElFormItem>
      <ElFormItem label="快递公司" prop="shippingCompanyId">
        <ElSelect v-model="form.shippingCompanyId" placeholder="请选择快递公司">
          <ElOption
            v-for="item in listShippingCompanyResult.list"
            :key="item.id"
            :label="item.shippingCompanyName"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="快递单号" prop="trackingNumber">
        <ElInput v-model="form.trackingNumber" placeholder="请输入快递单号" clearable maxlength="160" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">
        取 消
      </ElButton>
      <ElButton v-if="currentShipmentProduct?.remainShipmentQuantity > 0" type="primary" @click="submit">
        确 定
      </ElButton>
    </template>
  </ElDialog>
</template>
