<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import AttributeForm from './AttributeForm.vue'

const { productDetail, languageId, productId, attributeListData, attributePayload, getAttributeList }
  = defineProps<{
    productDetail: ProductAdminLocalizedViewDo
    languageId: string
    productId: string
    attributeListData: TableResponse<AttributeListData & CommonField>
    attributePayload: Partial<AttributeListParams>
    getAttributeList: (params?: Partial<AttributeListParams>) => Promise<TableResponse<AttributeListData & CommonField>>
  }>()

const emit = defineEmits(['resetFormData'])

const attributeFormRef = ref()

onMounted(async () => {
  await nextTick(() => {
    if (attributeFormRef.value) {
      attributeFormRef.value.setData(productDetail.productAttributeRelationListResultDos)
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
const getDeletedProductAttributeRelationId = (id: string) => {
  if (id) {
    if (!deletedProductAttributeRelationIds.value.includes(id)) {
      deletedProductAttributeRelationIds.value.push(id)
    }
  }
}

const handleSave = async () => {
  loading.init = true
  const attributeFormData = attributeFormRef.value.getData()
  const { data } = await updateProductAttributeApi({
    productId,
    languageId,
    productAttributeRelationRequestDos: attributeFormData,
    deletedProductAttributeRelationIds: deletedProductAttributeRelationIds.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  emit('resetFormData', data)
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
      <AttributeForm
        ref="attributeFormRef"
        :attribute-list-data="attributeListData"
        :attribute-payload="attributePayload"
        :get-attribute-list="getAttributeList"
        @get-deleted-product-attribute-relation-id="getDeletedProductAttributeRelationId"
      />
    </div>
  </ElCard>
</template>
