<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import ParameterForm from './ParameterForm.vue'

const { productData, productDetail, languageId, productId } = defineProps<{
  productData: ShowProduct & CommonField
  productDetail: ProductAdminLocalizedViewDo
  languageId: string
  productId: string
}>()

const parameterFormRef = ref()

onMounted(async () => {
  await nextTick(() => {
    parameterFormRef.value.setData(productDetail.productParameterRelationListResultDos)
  })
})

// const emit = defineEmits(['resetFormData'])

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  list: false,
  parameterGroup: false,
  parameter: false,
})

// watch(
//   () => productDetail,
//   async val => {
//     if (val) {
//       await getParameterList()
//       formData.value = JSON.parse(JSON.stringify(productData))
//       productParameterData.value.productParameterRelationRequestDos = []
//       if (
//         formData.value.productParameterRelationListResultDos
//         && formData.value.productParameterRelationListResultDos.length > 0
//       ) {
//         formData.value.productParameterRelationListResultDos.map(async (item, index) => {
//           const parameterItemData: ProductParameterRequestDo = {
//             productParameterRelationId: item.id,
//             parameterId: item.parameterId,
//             parameterName: item.parameterName,
//             parameterType: item.parameterType,
//             parameterValueId: item.parameterValueId,
//             parameterValueContent: item.parameterValueContent,
//             parameterValues: [],
//             sort: index + 1,
//           }
//           if (item.parameterType === 1) {
//             // 查找参数值列表
//             listParameterResult.value.list.map(vItem => {
//               if (vItem.id === item.parameterId) {
//                 parameterItemData.parameterValues = vItem.parameterValueListResultDos
//               }
//             })
//           }
//           productParameterData.value.productParameterRelationRequestDos.push(parameterItemData)
//         })
//       }
//     }
//   },
//   { deep: true, immediate: true },
// )

const handleSave = async () => {
  loading.init = true
  // const { data } = await updateProductParameterApi(productParameterData.value).catch(error => {
  //   loading.init = false
  //   throw error
  // })
  loading.init = false
  // emit('resetFormData', data)
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
      </div>
    </template>
    <div class="w-full mt-5">
      <ParameterForm ref="parameterFormRef" />
    </div>
  </ElCard>
</template>
