<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import ParameterForm from './ParameterForm.vue'

const { productDetail, languageId, productId, parameterListData, parameterPayload, getParameterList }
  = defineProps<{
    productDetail: ProductAdminLocalizedViewDo
    languageId: string
    productId: string
    parameterListData: TableResponse<ParameterListData & CommonField>
    parameterPayload: Partial<ParameterListParams>
    getParameterList: (params?: Partial<ParameterListParams>) => Promise<TableResponse<ParameterListData & CommonField>>
  }>()

const emit = defineEmits(['resetFormData'])

const parameterFormRef = ref()

onMounted(async () => {
  await nextTick(() => {
    if (parameterFormRef.value) {
      parameterFormRef.value.setData(productDetail.productParameterRelationListResultDos)
    }
  })
})

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  list: false,
  parameterGroup: false,
  parameter: false,
})

const deletedProductParameterRelationIds = ref<string[]>([])
const getDeletedProductParameterRelationId = (id: string) => {
  if (id) {
    if (!deletedProductParameterRelationIds.value.includes(id)) {
      deletedProductParameterRelationIds.value.push(id)
    }
  }
}

const handleSave = async () => {
  loading.init = true
  const parameterFormData = parameterFormRef.value.getData()
  const { data } = await updateProductParameterApi({
    productId,
    languageId,
    productParameterRelationRequestDos: parameterFormData,
    deletedProductParameterRelationIds: deletedProductParameterRelationIds.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  emit('resetFormData', data)
  deletedProductParameterRelationIds.value = []
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <div class="border border-gray-200 rounded-lg h-[67vh] flex flex-col overflow-hidden shadow-sm">
    <div class="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200 py-3">
      <div class="flex items-center justify-between px-4">
        <div class="text-base font-bold">
          {{ $t('product.parameterInfo') }}
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
      <ParameterForm
        ref="parameterFormRef"
        :parameter-list-data="parameterListData"
        :parameter-payload="parameterPayload"
        :get-parameter-list="getParameterList"
        @get-deleted-product-parameter-relation-id="getDeletedProductParameterRelationId"
      />
    </div>
  </div>
</template>
