<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { useLocale } from '@/hooks/useLocale'

const { productId, languageId, productData } = defineProps<{
  productId: string
  languageId: string
  productData: ShowProduct & CommonField
}>()

const emit = defineEmits(['resetFormData'])

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  list: false,
})

const dragging = ref(false)

const productPayload = reactive<ProductListParams & Pagination>({
  pageSize: 10,
  languageId,
  pageNumber: 1,
  abandonProductId: productId,
})

const {
  loading: productLoading,
  listData: productListData,
  promise: productPromise,
  getList: getProductList,
} = useProductPagination(productPayload)

const selectedProducts = ref<(ProductListData & CommonField)[]>([])

const dialogVisible = ref(false)

// 存储新增的关联产品数据
const addedRelatedProducts = ref<ProductRelatedRequestDo[]>([])

// 计算属性，合并已有的关联产品和新增的关联产品
const productRelatedRequestDos = computed(() => {
  const existingRelatedProducts = productData.productRelatedListResultDos || []

  return [...existingRelatedProducts, ...addedRelatedProducts.value]
})

const handleOpenDialog = async () => {
  await productPromise
  selectedProducts.value = []
  dialogVisible.value = true
}

const handleRemoteSearch = async (query: string) => {
  if (query !== '' && query.length >= 3) {
    // 更新搜索关键词到查询参数中
    productPayload.productName = query

    // 调用 getProductList 进行搜索
    await getProductList()
  } else {
    // 如果查询词为空，重置为初始状态
    delete productPayload.productName
    await getProductList()
  }
}

const handleAddProduct = async () => {
  if (!selectedProducts.value || selectedProducts.value.length === 0) {
    ElMessage.warning($t('product.related.selectProduct'))
    return
  }
  selectedProducts.value.forEach(item => {
    if (item.productFileRelationListResultDos && item.productFileRelationListResultDos.length > 0) {
      const firstFile = item.productFileRelationListResultDos.find(item => item.productFileType === 1)
      const pushData: ProductRelatedRequestDo = {
        id: productId,
        productId,
        relatedProductId: item.id,
        spu: item.spu,
        productName: item.productName,
        relatedProductImageFileVo: firstFile?.fileVo || undefined,
        sort: productRelatedRequestDos.value.length + 1,
      }
      addedRelatedProducts.value.push(pushData)
    }
  })
  dialogVisible.value = false
}

const dragEnd = () => {
  dragging.value = false
  productRelatedRequestDos.value.map((item, index) => (item.sort = index + 1))
}

const handleSave = async () => {
  loading.list = true
  const { data } = await updateProductRelatedApi({
    productId,
    languageId,
    productRelatedRequestDos: productRelatedRequestDos.value,
    deletedProductRelatedIds: [],
  })
  emit('resetFormData', data)
  // 保存成功后清空临时添加的产品
  addedRelatedProducts.value = []
  loading.list = false
}
</script>

<template>
  <div class="border border-gray-200 rounded-lg h-[67vh] flex flex-col overflow-hidden shadow-sm">
    <div class="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200 py-3">
      <div class="flex items-center justify-between px-4">
        <div class="text-base font-bold">
          {{ $t('product.related') }}
        </div>
        <div class="flex items-center justify-end">
          <EBtn type="default" plain @click="handleOpenDialog">
            <Icon icon="ant-design:plus-outlined" class="mr-1" />
            {{ $t('common.add') }}
          </EBtn>
          <EBtn type="primary" plain @click="handleSave">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </div>
    <div v-if="productRelatedRequestDos" class="flex-1 overflow-y-auto pb-4">
      <div class="w-full mt-0 pt-0">
        <div class="w-full">
          <VueDraggable
            v-model="productRelatedRequestDos"
            item-key="parameterId"
            :animation="200"
            :fallback-on-body="true"
            :swap-threshold="0.65"
            ghost-class="opacity-50"
            class="w-full grid grid-cols-12 gap-4 p-4"
            @start="dragging = true"
            @end="dragEnd"
          >
            <div
              v-for="item in productRelatedRequestDos"
              :key="item.id"
              class="col-span-3 font-semibold text-gray-700 border border-gray-200"
            >
              <div class="bg-gray-100 h-6">
                <div class="p-1">
                  <Icon icon="ant-design:holder-outlined" />
                </div>
              </div>
              <div class="p-2">
                <SImg
                  :src="item.relatedProductImageFileVo?.fileUrl"
                  :alt="item.productName"
                  fit="cover"
                  lazy
                  placeholder
                />
              </div>

              <div class="p-2">
                <ElTag>{{ item.spu }}</ElTag>
              </div>
              <div class="text-gray-500 p-2">
                {{ item.productName }}
              </div>
            </div>
          </VueDraggable>
        </div>
      </div>
    </div>
    <ElDialog v-model="dialogVisible" title="添加关联产品" width="60%">
      <div class="w-full flex">
        <ElSelect
          v-model="selectedProducts"
          :loading="productLoading"
          value-key="id"
          size="large"
          multiple
          filterable
          remote
          :remote-method="handleRemoteSearch"
          clearable
          placeholder="请选择产品"
        >
          <ElOption v-for="item in productListData.list" :key="item.id" :label="item.productName" :value="item">
            <div class="w-full flex items-center justify-start">
              <div>{{ item.productName }}</div>
            </div>
          </ElOption>
        </ElSelect>
      </div>
      <template #footer>
        <div class="w-full flex justify-end">
          <EBtn type="default" @click="dialogVisible = false">
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn type="primary" @click="handleAddProduct">
            {{ $t('common.confirm') }}
          </EBtn>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
