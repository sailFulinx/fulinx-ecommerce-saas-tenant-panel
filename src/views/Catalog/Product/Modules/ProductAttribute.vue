<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import AttributeFormEdit from './AttributeFormEdit.vue'

const {
  languageId,
  productId,
  attributeListData,
  attributePayload,
  getAttributeDataList,
  warehouseListData,
  stockStatusListData,
  weightUnitListData,
  lengthUnitListData,
  productData,
  productSkuRequestDo,
} = defineProps<{
  languageId: string
  productId: string
  attributeListData: TableResponse<AttributeListData & CommonField>
  attributePayload: Partial<AttributeListParams>
  getAttributeDataList: (
    params?: Partial<AttributeListParams>,
  ) => Promise<TableResponse<AttributeListData & CommonField>>
  warehouseListData: TableResponse<WarehouseData & CommonField>
  stockStatusListData: TableResponse<ProductStockStatusData>
  weightUnitListData: TableResponse<CommonEnumData>
  lengthUnitListData: TableResponse<CommonEnumData>
  productData: ShowProduct & CommonField
  productSkuRequestDo: ProductSkuRequestDo
}>()

const emit = defineEmits(['resetFormData'])

const attributeFormRef = ref()

onMounted(async () => {
  await nextTick(() => {
    if (attributeFormRef.value) {
      const newData = JSON.parse(JSON.stringify(productSkuRequestDo))
      console.log(newData)
      attributeFormRef.value.setData(newData)
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
  const attributeFormData = attributeFormRef.value.getData()
  if (attributeFormData) {
    loading.init = true
    const { data } = await updateProductSkuApi({
      productId,
      languageId,
      productSkuRequestDo: attributeFormData,
    }).catch(error => {
      loading.init = false
      throw error
    })
    loading.init = false
    emit('resetFormData', data)
    ElMessage.success($t('success.edit'))
  }
  deletedProductAttributeRelationIds.value = []
}
</script>

<template>
  <div class="border border-gray-200 rounded-lg h-[67vh] flex flex-col overflow-hidden shadow-sm">
    <div class="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200 py-3">
      <div class="flex items-center justify-between px-4">
        <div class="text-base font-bold">
          {{ $t('product.priceQuantity') }}
        </div>
        <div class="flex items-center justify-end">
          <EBtn type="primary" plain @click="handleSave">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-4 pb-4">
      <AttributeFormEdit
        ref="attributeFormRef"
        :language-id="languageId"
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
  </div>
</template>
