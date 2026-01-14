<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'

const { t: $t } = useLocale()
const loading = reactive({
  init: false,
  button: false,
  attribute: false,
})

const dragging = ref(false)

const attributePayload = reactive<AttributeListParams>({
  languageId: usePreferenceStore().preference.language.id,
  status: true,
})

const { loading: attributeLoading, listData: attributeListData, promise: attributePromise } = useAttributeList(attributePayload)

onMounted(async () => {
  // 设置初始化加载状态
  loading.init = true
  try {
    // 并行等待所有数据加载完成
    await Promise.all([attributePromise])
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.init = false
  }
})

const productSkuRequestDo = ref<ProductSkuRequestDo>({
  stockStatus: 1,
  productAttributeRequestDo: {
    attributeSummaryDos: [],
    searchIndex: '',
  },
  productSkuItemRequestDos: [],
})

const rules = reactive({
  stockStatus: [{ required: true, message: $t('product.placeholder.stockStatus'), trigger: 'change' }],
})

const setData = (data: ProductSkuRequestDo) => {
  productSkuRequestDo.value = data
}

const getData = () => {
  return productSkuRequestDo.value
}

defineExpose({
  setData,
  getData,
})
</script>

<template>
  <div class="w-full">
    <ElForm ref="productSkuRequestDo" :model="productSkuRequestDo" :rules="rules" class="w-full" label-width="100px">
      <ElFormItem label="库存状态" prop="stockStatus">
        <ElRadioGroup v-model="productSkuRequestDo.stockStatus">
          <ElRadio :value="1">
            现货
          </ElRadio>
          <ElRadio :value="2">
            预售
          </ElRadio>
        </ElRadioGroup>
      </ElFormItem>
    </ElForm>
  </div>
</template>
