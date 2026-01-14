<script setup lang="ts">
const { t: $t } = useLocale()
const loading = reactive({
  init: false,
  button: false,
  parameter: false
})

const parameterPayload = reactive<ParameterListParams>({
  languageId: usePreferenceStore().preference.language.id,
  status: true
})

const {
  loading: _parameterLoading,
  listData: parameterListData,
  promise: parameterPromise
} = useParameterList(parameterPayload)
onMounted(async () => {
  // 设置初始化加载状态
  loading.init = true
  try {
    // 并行等待所有数据加载完成
    await Promise.all([parameterPromise])
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.init = false
  }
})

const productParameterRelationRequestDos = ref<ProductParameterRelationRequestDo[]>([])

const currentParameter = ref<ProductParameterRelationRequestDo>()

const parameterFormVisible = ref(false)

const handleChangeParameter = (val: string) => {
  const selectedParameter = parameterListData.value.list.find(item => item.id === val)
  currentParameter.value = { ...selectedParameter }
}

const handleAddParameter = () => {
  parameterFormVisible.value = true
}

const setData = (data: ProductParameterRelationRequestDo[]) => {
  productParameterRelationRequestDos.value = data
}

const getData = () => {
  return productParameterRelationRequestDos.value
}

defineExpose({
  setData,
  getData
})
</script>

<template>
  <div class="w-full">
    <div class="w-full">
      <EBtn plain type="primary" @click="handleAddParameter">
        {{ $t('product.parameterAdd') }}
      </EBtn>
    </div>
    <div class="w-full grid grid-cols-3 gap-4 mb-4">
      <div v-for="(item, index) in productParameterRelationRequestDos" :key="index" class="col-span-1">
        {{ item.parameterName }}: {{ item.parameterValueContent }}
      </div>
    </div>
    <div v-if="parameterFormVisible" class="w-full">
      <div class="w-full flex justify-between items-center">
        <div class="w-[200px] mr-2">
          <ElSelect
            v-model="currentParameter.parameterId"
            placeholder="请选择参数"
            filterable
            clearable
            @change="handleChangeParameter"
          >
            <ElOption v-for="(item, index) in parameterListData.list" :key="index" :value="item.id">
              {{ item.parameterName }}
            </ElOption>
          </ElSelect>
        </div>
        <div v-if="currentParameter?.parameterType === 1" class="flex-1">
          <ElSelect
            v-model="currentParameter.parameterValueContent"
            placeholder="请选择参数值"
            value-key="id"
            filterable
            clearable
          >
            <ElOption v-for="(item, index) in currentParameter.parameterValueListResultDos" :key="index" :value="item">
              {{ item.parameterValueContent }}
            </ElOption>
          </ElSelect>
        </div>
      </div>
    </div>
  </div>
</template>
