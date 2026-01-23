<script setup lang="ts">
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

const productPayload = reactive<ProductListParams & Pagination>({
  pageSize: 10,
  languageId,
  pageNumber: 1,
})

const {
  loading: productLoading,
  listData: productListData,
  promise: productPromise,
  getList: getProductList,
} = useProductPagination(productPayload)

const selectedProducts = ref<(ProductListData & CommonField)[]>([])

const dialogVisible = ref(false)

const handleOpenDialog = async () => {
  await productPromise
  dialogVisible.value = true
}

const handleAddProduct = async () => {
  selectedProducts.value = []
  dialogVisible.value = false
}

const handleSave = async () => {
  loading.list = true
  const { data } = await updateProductRelatedApi({
    productId,
    languageId,
    productRelatedRequestDos: [],
    deletedProductRelatedIds: [],
  })
  emit('resetFormData', data)
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
    <div v-if="productData.productRelatedListResultDos" class="flex-1 overflow-y-auto px-4 pb-4">
      <div class="w-full mt-0 pt-0">
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div
            v-for="item in productData.productRelatedListResultDos"
            :key="item.id"
            class="col-span-2 font-semibold text-gray-700"
          >
            <SImg :src="item.relatedProductImageFileVo?.fileUrl" :alt="item.productName" fit="cover" lazy placeholder />
            <div>{{ item.spu }}</div>
            <div>{{ item.productName }}</div>
          </div>
        </div>
      </div>
    </div>
    <ElDialog v-model="dialogVisible" title="添加关联产品" width="60%">
      <div class="w-full flex">
        <ElSelect v-model="selectedProducts" value-key="id" multiple filterable clearable placeholder="请选择产品">
          <ElOption v-for="item in productListData.list" :key="item.id" :value="item">
            <div class="w-full flex items-center justify-start">
              <div
                v-if="item.productMainImageUrl"
                class="mr-2"
              >
                <ElImage
                  :src="item.productMainImageUrl"
                  lazy
                  fit="cover"
                  class="max-h-10 rounded object-cover p-1"
                >
                  <template #placeholder>
                    <div class="flex items-center justify-center h-full min-h-10">
                      <div class="flex flex-col items-center">
                        <Icon icon="ep:loading" class="animate-spin" />
                        <span class="mt-2 text-xs text-gray-500">加载中...</span>
                      </div>
                    </div>
                  </template>
                </ElImage>
              </div>
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
