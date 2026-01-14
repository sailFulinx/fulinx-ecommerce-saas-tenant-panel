<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import CreateAttributeDialog from '../../Attribute/Components/CreateAttributeDialog.vue'
import CreateAttributeValueDialog from './CreateAttributeValueDialog.vue'

interface ProductCreateProvider {
  productForm: CreateProductParams
}

const { productForm } = inject('ProductCreate') as ProductCreateProvider

console.log(productForm)

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

const {
  loading: attributeLoading,
  listData: attributeListData,
  promise: attributePromise,
  getList,
} = useAttributeList(attributePayload)

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

const formRef = ref()

const productSkuRequestDo = ref<ProductSkuRequestDo>({
  stockStatus: 1,
  spu: '',
  productAttributeRequestDo: {
    attributeSummaryDos: [],
    searchIndex: '',
  },
  productSkuItemRequestDos: [],
})

const rules = reactive({
  stockStatus: [{ required: true, message: $t('product.placeholder.stockStatus'), trigger: 'change' }],
  productAttributeRequestDo: [
    { required: false, message: $t('product.placeholder.attributeSummaryDos'), trigger: 'change' },
  ],
  spu: [{ required: true, message: $t('product.placeholder.spu'), trigger: 'blur' }],
})

const dragEnd = () => {
  dragging.value = false
  productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.map((item, index) => (item.sort = index + 1))
}

const currentAttribute = ref<AttributeSummaryDo>({
  languageId: usePreferenceStore().preference.language.id,
  attributeId: '',
  attributeName: '',
  sort: productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.length + 1,
  attributeValueDos: [],
  attributeValueListResultDos: [],
})

const attributeFormVisible = ref(false)

const handleChangeAttribute = async (id: string) => {
  attributeListData.value.list.find(item => {
    if (item.id === id) {
      currentAttribute.value.attributeValueListResultDos = item.attributeValueListResultDos
      currentAttribute.value.attributeName = item.attributeName
    }
  })
}

const handleDeleteAttribute = (index: number) => {
  productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.splice(index, 1)
}

const handelAddAttribute = () => {
  if (!productSkuRequestDo.value.spu) {
    ElMessage.error($t('product.placeholder.spu'))
    return
  }
  attributeFormVisible.value = true
}

const handleEditAttribute = (index: number) => {
  currentAttribute.value = productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos[index]
  attributeFormVisible.value = true
}

const handleAddAttributeCancel = () => {
  attributeFormVisible.value = false
}

const handleAddAttributeSave = () => {
  // 如果当前属性已存在，则修改，否则新增
  if (!currentAttribute.value.attributeId) {
    return
  }
  const index = productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.findIndex(
    item => item.attributeId === currentAttribute.value.attributeId,
  )
  if (index !== -1) {
    productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos[index] = currentAttribute.value
  } else {
    productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.push(currentAttribute.value)
  }
  currentAttribute.value = {
    languageId: usePreferenceStore().preference.language.id,
    attributeId: '',
    attributeName: '',
    sort: productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.length + 1,
    attributeValueDos: [],
    attributeValueListResultDos: [],
  }
  attributeFormVisible.value = false
}

const createAttributeRef = ref()

const createAttributeValueRef = ref()

const handleCreateAttribute = () => {
  createAttributeRef.value.openDialog()
}

const handleCreateAttributeValue = () => {
  createAttributeValueRef.value.openDialog(currentAttribute.value.attributeId, currentAttribute.value.languageId)
}

const getAttributeList = async () => {
  await getList()
  if (!attributeListData.value.list || attributeListData.value.list.length === 0) {
    return
  }
  currentAttribute.value.attributeValueListResultDos = attributeListData.value.list.find(
    item => item.id === currentAttribute.value.attributeId,
  )?.attributeValueListResultDos
}

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
    <ElForm ref="formRef" :model="productSkuRequestDo" :rules="rules" class="w-full" label-width="100px">
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
      <ElFormItem :label="$t('product.spu')" prop="spu">
        <ElInput
          v-model="productSkuRequestDo.spu"
          clearable
          minlength="1"
          maxlength="120"
          :placeholder="$t('product.placeholder.spu')"
        />
      </ElFormItem>
      <ElFormItem label="商品规格" prop="productAttributeRequestDo">
        <div class="w-full flex justify-between items-center">
          <div class="flex-1 text-gray-400 text-sm">
            发布规格图，优化商品展示效率
          </div>
          <div>
            <EBtn type="primary" plain @click="handelAddAttribute">
              <Icon name="mynaui:plus" class="mr-1" />
              添加商品规格
            </EBtn>
          </div>
        </div>
        <div
          v-if="productSkuRequestDo.productAttributeRequestDo.attributeSummaryDos.length > 0"
          class="w-full flex-col items-center mt-4"
        >
          <VueDraggable
            v-model="productSkuRequestDo.productAttributeRequestDo.attributeSummaryDos"
            item-key="parameterId"
            :animation="200"
            :fallback-on-body="true"
            :swap-threshold="0.65"
            ghost-class="opacity-50"
            class="w-full"
            @start="dragging = true"
            @end="dragEnd"
          >
            <div
              v-for="(item, index) in productSkuRequestDo.productAttributeRequestDo.attributeSummaryDos"
              :key="index"
              class="w-full bg-[#F6F7Fd] border border-gray-200 p-2 mb-4"
            >
              <div class="w-full flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                <div class="flex items-center">
                  <div class="mr-1">
                    <Icon icon="ant-design:holder-outlined" />
                  </div>
                  <div class="param-item truncate">
                    {{ item.attributeName }}
                  </div>
                </div>
                <div class="flex items-center">
                  <EBtn type="primary" plain text @click="handleEditAttribute(index)">
                    <Icon name="mynaui:edit" :size="4" />
                  </EBtn>
                  <EBtn type="danger" plain text @click="handleDeleteAttribute(index)">
                    <Icon name="ep:delete" :size="4" />
                  </EBtn>
                </div>
              </div>
              <div class="w-full flex items-center">
                <div v-for="(avItem, avItemIndex) in item.attributeValueDos" :key="avItemIndex">
                  <div class="h-12 bg-white border border-gray-200 p-1 mr-2 flex items-center">
                    <Icon
                      v-if="!avItem.attributeImageFileVo || !avItem.attributeImageFileVo.fileUrl"
                      name="ri:image-line"
                      :size="6"
                      class="mr-1"
                      color="gray"
                    />
                    <img
                      v-if="avItem.attributeImageFileVo && avItem.attributeImageFileVo.fileUrl"
                      :src="avItem.attributeImageFileVo.fileUrl"
                      class="w-6 h-6 mr-1"
                    >
                    <span class="fs-12px">{{ avItem.attributeValueContent }}</span>
                  </div>
                </div>
              </div>
            </div>
          </VueDraggable>
        </div>
        <div v-if="attributeFormVisible" class="w-full bg-[#F6F7FD] mt-4 border border-gray-200">
          <div class="w-full flex justify-between items-center border-b border-gray-200 p-2">
            <div>选择属性</div>
            <div class="flex items-center cursor-pointer" @click="handleCreateAttribute">
              <Icon name="mynaui:plus" class="mr-1" />
              添加属性
            </div>
          </div>
          <div v-loading="attributeLoading" class="w-full flex justify-between items-center p-4">
            <div class="flex-1 flex items-center justify-between mr-2">
              <div class="w-1/4 mr-2">
                <ElSelect
                  v-model="currentAttribute.attributeId"
                  placeholder="请选择商品规格"
                  filterable
                  clearable
                  class="mr-2"
                  @change="handleChangeAttribute"
                >
                  <ElOption
                    v-for="item in attributeListData.list"
                    :key="item.id"
                    :label="item.attributeName"
                    :value="item.id"
                  >
                    {{ item.attributeName }}
                  </ElOption>
                </ElSelect>
              </div>
              <div class="flex-1">
                <ElSelect
                  v-model="currentAttribute.attributeValueDos"
                  multiple
                  value-key="id"
                  filterable
                  clearable
                  placeholder="请选择属性值"
                >
                  <ElOption
                    v-for="item in currentAttribute.attributeValueListResultDos"
                    :key="item.id"
                    :label="item.attributeValueContent"
                    :value="item"
                  >
                    {{ item.attributeValueContent }}
                  </ElOption>
                </ElSelect>
              </div>
            </div>
            <div class="flex items-center justify-end cursor-pointer" @click="handleCreateAttributeValue">
              <Icon name="mynaui:plus" class="mr-1" />
              添加属性值
            </div>
          </div>
          <div class="w-full p-4">
            <EBtn type="default" @click="handleAddAttributeCancel">
              {{ $t('common.cancel') }}
            </EBtn>
            <EBtn type="primary" plain @click="handleAddAttributeSave">
              {{ $t('common.save') }}
            </EBtn>
          </div>
        </div>
      </ElFormItem>
    </ElForm>
    <CreateAttributeDialog ref="createAttributeRef" @get-list="getList" />
    <CreateAttributeValueDialog ref="createAttributeValueRef" @get-list="getAttributeList" />
  </div>
</template>
