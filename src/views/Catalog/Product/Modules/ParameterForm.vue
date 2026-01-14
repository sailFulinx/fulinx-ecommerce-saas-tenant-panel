<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import CreateParameterDialog from '../../Parameter/Components/CreateParameterDialog.vue'
import CreateParameterValueDialog from './CreateParameterValueDialog.vue'

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
  getList,
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

const editingIndex = ref<number | null>(null)

const handleDeleteParameter = (index: number) => {
  productParameterRelationRequestDos.value.splice(index, 1)
}

const handleEditParameter = (index: number) => {
  currentParameter.value = { ...productParameterRelationRequestDos.value[index] }
  editingIndex.value = index
  parameterFormVisible.value = true
}

const dragEnd = () => {
  dragging.value = false
  productParameterRelationRequestDos.value.map((item, index) => (item.sort = index + 1))
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
  editingIndex.value = null
  currentParameter.value = {} as ProductParameterRelationRequestDo
}

const handleAddParameterSave = () => {
  // 检查是否正在编辑现有参数
  if (editingIndex.value !== null && editingIndex.value >= 0) {
    // 更新现有参数
    productParameterRelationRequestDos.value[editingIndex.value] = currentParameter.value
    editingIndex.value = null // 重置编辑索引
  } else {
    // 添加新参数
    productParameterRelationRequestDos.value.push(currentParameter.value)
  }
  parameterFormVisible.value = false
  currentParameter.value = {} as ProductParameterRelationRequestDo
}

const createParameterRef = ref()

const handleCreateParameter = () => {
  createParameterRef.value.openDialog()
}

const createParameterValueRef = ref()

const handleCreateParameterValue = () => {
  createParameterValueRef.value.openDialog(currentParameter.value.parameterId, currentParameter.value.languageId)
}

const getParameterValueList = async () => {
  await getList()
  if (!parameterListData.value.list || parameterListData.value.list.length === 0) {
    return
  }
  currentParameter.value.parameterValueListResultDos = parameterListData.value.list.find(item => item.id === currentParameter.value.parameterId)?.parameterValueListResultDos
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
    <div class="w-full">
      <EBtn plain type="primary" @click="handleAddParameter">
        {{ $t('product.parameterAdd') }}
      </EBtn>
    </div>
    <div
      class="w-full"
      :class="productParameterRelationRequestDos.length > 0 ? 'bg-[#F6F7FD] mt-4 border border-gray-200 pa-4 ' : ''"
    >
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
        <div v-for="(item, index) in productParameterRelationRequestDos" :key="index" class="col-span-1">
          <div class="relative border border-gray-300 p-2">
            <div class="flex items-center">
              <div class="mr-1">
                <Icon icon="ant-design:holder-outlined" />
              </div>
              <div class="param-item truncate">
                {{ item.parameterName }}: {{ item.parameterValueContent }}
              </div>
            </div>
            <div class="flex justify-center my-2">
              <EBtn
                type="primary"
                plain
                class="w-full text-blue-500 hover:text-blue-700"
                @click="handleEditParameter(index)"
              >
                <Icon icon="circum:edit" :size="5" />
              </EBtn>
            </div>
            <div class="absolute -top-4 -right-3">
              <EBtn type="danger" link class="text-red-500 hover:text-red-700" @click="handleDeleteParameter(index)">
                <Icon icon="typcn:delete" :size="6" />
              </EBtn>
            </div>
          </div>
        </div>
      </VueDraggable>
    </div>
    <div v-if="parameterFormVisible" class="mt-4 bg-[#F6F7FD] w-full border border-gray-200">
      <div class="flex justify-between items-center border-b border-gray-200 px-4 py-2">
        <div>选择参数</div>
        <div class="flex justify-between items-center cursor-pointer" @click="handleCreateParameter">
          <Icon name="mynaui:plus" class="mr-1" />
          新增参数
        </div>
      </div>
      <div class="w-full flex justify-between items-center p-4">
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
        <div v-if="currentParameter?.parameterType === 1" class="flex-1 flex items-center">
          <ElSelect
            v-model="currentParameter.parameterValueId"
            placeholder="请选择参数值"
            filterable
            clearable
            class="flex-1 mr-2"
            @change="handleChangeParameterValue"
          >
            <ElOption
              v-for="(item, index) in currentParameter.parameterValueListResultDos"
              :key="index"
              :label="item.parameterValueContent"
              :value="item.id"
            />
          </ElSelect>
          <div class="flex justify-end items-center cursor-pointer fs-[12px]" @click="handleCreateParameterValue">
            <Icon name="mynaui:plus" class="mr-1" />
            新增参数值
          </div>
        </div>
        <div v-if="currentParameter?.parameterType === 2" class="flex-1">
          <ElInput v-model="currentParameter.parameterValueContent" clearable placeholder="请输入参数值" />
        </div>
      </div>
      <div class="w-full p-4">
        <EBtn type="default" @click="handleAddParameterCancel">
          {{ $t('common.cancel') }}
        </EBtn>
        <EBtn type="primary" plain @click="handleAddParameterSave">
          {{ $t('common.save') }}
        </EBtn>
      </div>
    </div>
    <CreateParameterDialog ref="createParameterRef" @get-list="getList" />
    <CreateParameterValueDialog ref="createParameterValueRef" @get-list="getParameterValueList" />
  </div>
</template>
