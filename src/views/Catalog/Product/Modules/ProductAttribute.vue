<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import AttributeFormEdit from './AttributeFormEdit.vue'

const { languageId, productId, attributeListData, attributePayload, getAttributeDataList, warehouseListData, stockStatusListData, weightUnitListData, lengthUnitListData, productData }
  = defineProps<{
    languageId: string
    productId: string
    attributeListData: TableResponse<AttributeListData & CommonField>
    attributePayload: Partial<AttributeListParams>
    getAttributeDataList: (params?: Partial<AttributeListParams>) => Promise<TableResponse<AttributeListData & CommonField>>
    warehouseListData: TableResponse<WarehouseData & CommonField>
    stockStatusListData: TableResponse<ProductStockStatusData>
    weightUnitListData: TableResponse<CommonEnumData>
    lengthUnitListData: TableResponse<CommonEnumData>
    productData: ShowProduct & CommonField
  }>()

console.log(languageId)
console.log(productData)

// const emit = defineEmits(['resetFormData'])

// interface ProductDataProvider {
//   productData: ShowProduct & CommonField
// }

// const { productData } = inject('productData') as ProductDataProvider

const productSkuRequestDo = ref<ProductSkuRequestDo>({
  stockStatus: 1,
  spu: '',
  currencyId: '',
  productAttributeRequestDo: {
    attributeSummaryDos: [],
    searchIndex: '',
  },
  productSkuItemRequestDos: [],
})

const attributeFormRef = ref()

onMounted(async () => {
  await nextTick(() => {
    if (attributeFormRef.value) {
      productSkuRequestDo.value.spu = productData.spu
      attributeFormRef.value.setData(productSkuRequestDo.value)
    }
  })
})

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  list: false,
  attributeGroup: false,
  attribute: false,
})

const deletedProductAttributeRelationIds = ref<string[]>([])
// const getDeletedProductAttributeRelationId = (id: string) => {
//   if (id) {
//     if (!deletedProductAttributeRelationIds.value.includes(id)) {
//       deletedProductAttributeRelationIds.value.push(id)
//     }
//   }
// }

const handleSave = async () => {
  loading.init = true
  // const attributeFormData = attributeFormRef.value.getData()
  // const { data } = await updateProductSkuApi({
  //   productId,
  //   languageId,
  //   productSkuRequestDo: null,
  // }).catch(error => {
  //   loading.init = false
  //   throw error
  // })
  loading.init = false
  // emit('resetFormData', data)
  deletedProductAttributeRelationIds.value = []
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="text-base font-bold">
          {{ $t('product.attributeInfo') }}
        </div>
        <div class="flex items-center justify-end">
          <EBtn type="primary" plain @click="handleSave">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </template>
    <div class="w-full mt-5">
      66666
      <AttributeFormEdit
        ref="attributeFormRef"
        :product-data="productData"
        :attribute-payload="attributePayload"
        :attribute-list-data="attributeListData"
        :warehouse-list-data="warehouseListData"
        :stock-status-list-data="stockStatusListData"
        :weight-unit-list-data="weightUnitListData"
        :length-unit-list-data="lengthUnitListData"
        :get-attribute-data-list="getAttributeDataList"
      />
    </div>
  </ElCard>
</template>
