<script setup lang="ts">
import { ElBadge } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const { t: $t } = useLocale()
const loading = reactive({
  init: false,
  button: false,
  parameter: false,
})

const dragging = ref(false)

const parameterPayload = reactive<ParameterListParams>({
  languageId: usePreferenceStore().preference.language.id,
  status: true,
})

const {
  loading: _parameterLoading,
  listData: parameterListData,
  promise: parameterPromise,
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

const currentParameter = ref<ProductParameterRelationRequestDo>({} as ProductParameterRelationRequestDo)

const parameterFormVisible = ref(false)

const handleDeleteParameter = (index: number) => {
  productParameterRelationRequestDos.value.splice(index, 1)
}

const dragEnd = () => {
  dragging.value = false
  productParameterRelationRequestDos.value.map((item, index) => item.sort = index + 1)
}

const handleChangeParameter = (val: string) => {
  const selectedParameter = parameterListData.value.list.find(item => item.id === val)
  currentParameter.value = {
    ...selectedParameter,
    parameterId: val,
    languageId: selectedParameter?.languageId || usePreferenceStore().preference.language.id,
    sort: productParameterRelationRequestDos.value.length + 1,
  }
}

const handleChangeParameterValue = (val: string) => {
  if (!currentParameter.value || !currentParameter.value.parameterValueListResultDos) {
    return
  }
  const selectedParameterValue = currentParameter.value.parameterValueListResultDos.find(item => item.id === val)
  currentParameter.value = {
    ...currentParameter.value,
    parameterValueId: val,
    parameterValueContent: selectedParameterValue?.parameterValueContent || '',
  }
}

const handleAddParameter = () => {
  parameterFormVisible.value = true
}

const handleAddParameterCancel = () => {
  parameterFormVisible.value = false
}

const handleAddParameterSave = () => {
  productParameterRelationRequestDos.value.push(currentParameter.value)
  parameterFormVisible.value = false
  currentParameter.value = {} as ProductParameterRelationRequestDo
}

const setData = (data: ProductParameterRelationRequestDo[]) => {
  productParameterRelationRequestDos.value = data
}

const getData = () => {
  return productParameterRelationRequestDos.value
}

defineExpose({
  setData,
  getData,
})
</script>

<template>
  <div class="w-full">
    <div class="w-full mb-4">
      <EBtn plain type="primary" @click="handleAddParameter">
        {{ $t('product.parameterAdd') }}
      </EBtn>
    </div>
    <div class="w-full" :class="productParameterRelationRequestDos.length > 0 ? 'mb-4' : ''">
      <VueDraggable
        v-model="productParameterRelationRequestDos"
        item-key="parameterId"
        :animation="200"
        :fallback-on-body="true"
        :swap-threshold="0.65"
        ghost-class="opacity-50"
        class="grid grid-cols-4 gap-4"
        @start="dragging = true"
        @end="dragEnd"
      >
        <div
          v-for="(item, index) in productParameterRelationRequestDos"
          :key="index"
          class="col-span-1 border border-gray-200 p-2"
        >
          <ElBadge>
            <div class="flex items-center">
              <div class="mr-1">
                <Icon icon="ant-design:holder-outlined" />
              </div>
              <div>{{ item.parameterName }}: {{ item.parameterValueContent }}</div>
            </div>
            <template #content="{ value }">
              <div>
                <Icon icon="ant-design:delete-outlined" :size="4" />
              </div>
            </template>
          </ElBadge>

          <!-- <div class="flex justify-center">
            <EBtn type="danger" link @click="handleDeleteParameter(index)">
              <Icon icon="ant-design:delete-outlined" :size="4" />
            </EBtn>
          </div> -->
        </div>
      </VueDraggable>
    </div>
    <div v-if="parameterFormVisible" class="w-full border border-gray-200 p-4">
      <div class="w-full flex justify-between items-center mb-4">
        <div class="w-[200px] mr-2">
          <ElSelect
            v-model="currentParameter.parameterId"
            placeholder="请选择参数"
            filterable
            clearable
            @change="handleChangeParameter"
          >
            <ElOption
              v-for="(item, index) in parameterListData.list"
              :key="index"
              :label="item.parameterName"
              :value="item.id"
            />
          </ElSelect>
        </div>
        <div v-if="currentParameter?.parameterType === 1" class="flex-1">
          <ElSelect
            v-model="currentParameter.parameterValueId"
            placeholder="请选择参数值"
            filterable
            clearable
            @change="handleChangeParameterValue"
          >
            <ElOption
              v-for="(item, index) in currentParameter.parameterValueListResultDos"
              :key="index"
              :label="item.parameterValueContent"
              :value="item.id"
            />
          </ElSelect>
        </div>
        <div v-if="currentParameter?.parameterType === 2" class="flex-1">
          <ElInput v-model="currentParameter.parameterValueContent" clearable placeholder="请输入参数值" />
        </div>
      </div>
      <div class="w-full">
        <EBtn type="default" @click="handleAddParameterCancel">
          {{ $t('common.cancel') }}
        </EBtn>
        <EBtn type="primary" plain @click="handleAddParameterSave">
          {{ $t('common.save') }}
        </EBtn>
      </div>
    </div>
  </div>
</template>
