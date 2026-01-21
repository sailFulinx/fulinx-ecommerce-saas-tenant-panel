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
  <ElCard shadow="never" class="mb-5">
    <template #header>
      <div class="flex items-center justify-between">
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
    </template>
    <div class="w-full mt-5">
      <ParameterForm
        ref="parameterFormRef"
        :parameter-list-data="parameterListData"
        :parameter-payload="parameterPayload"
        :get-parameter-list="getParameterList"
        @get-deleted-product-parameter-relation-id="getDeletedProductParameterRelationId"
      />
    </div>
  </ElCard>
</template>
