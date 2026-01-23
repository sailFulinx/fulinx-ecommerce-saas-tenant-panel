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
  </div>
</template>
