<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'

const { productId, languageId, productDetail } = defineProps<{
  languageId: string
  productId: string
  productDetail: ProductAdminLocalizedViewDo
}>()

const emit = defineEmits(['resetFormData'])

// 创建本地响应式数据用于SEO信息编辑
const localProductSeo = ref({
  metaTitle: productDetail.productSeoListResultDo?.metaTitle || '',
  metaDescription: productDetail.productSeoListResultDo?.metaDescription || '',
})

watch(
  () => productDetail,
  val => {
    if (val && val.productSeoListResultDo) {
      localProductSeo.value = {
        metaTitle: val.productSeoListResultDo.metaTitle || '',
        metaDescription: val.productSeoListResultDo.metaDescription || '',
      }
    }
  },
  { deep: true, immediate: true },
)

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  list: false,
})

const inputProductMetaTitleVisible = ref(false)

const editProductMetaTitle = async () => {
  const { data } = await updateProductMetaTitleApi({
    productSeoId: productDetail.productSeoListResultDo.id,
    metaTitle: localProductSeo.value.metaTitle,
  }).catch(error => {
    inputProductMetaTitleVisible.value = false
    loading.init = false
    throw error
  })
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
  inputProductMetaTitleVisible.value = false
}

const handleCancelUpdateProductMetaTitle = () => {
  inputProductMetaTitleVisible.value = false
}

const handleClickUpdateProductMetaTitle = () => {
  inputProductMetaTitleVisible.value = true
}

const inputProductMetaDescriptionVisible = ref(false)

const editProductMetaDescription = async () => {
  const { data } = await updateProductMetaDescriptionApi({
    productSeoId: productDetail.productSeoListResultDo.id,
    metaDescription: localProductSeo.value.metaDescription,
  }).catch(error => {
    inputProductMetaDescriptionVisible.value = false
    loading.init = false
    throw error
  })
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
  inputProductMetaDescriptionVisible.value = false
}

const handleCancelUpdateProductMetaDescription = () => {
  inputProductMetaDescriptionVisible.value = false
}

const handleClickUpdateProductMetaDescription = () => {
  inputProductMetaDescriptionVisible.value = true
}

// 新增

const createProductMetaTitle = async () => {
  loading.init = true
  const { data } = await createProductSeoApi({
    productId,
    languageId,
    metaTitle: localProductSeo.value.metaTitle,
  }).catch(error => {
    loading.init = false
    throw error
  })
  ElMessage.success($t('success.create'))
  emit('resetFormData', data)
  loading.init = false
}
</script>

<template>
  <div v-if="productDetail.productSeoListResultDo" shadow="never" class="border border-gray-200 rounded-lg mb-5">
    <div class="w-full mt-0 pt-0">
      <!-- 文章元标题 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('product.metaTitle') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputProductMetaTitleVisible" class="mr-2">
            {{ localProductSeo.metaTitle }}
          </span>
          <span v-else>
            <ElInput
              v-model="localProductSeo.metaTitle"
              style="width: 300px"
              class="mr-2"
              @blur="editProductMetaTitle"
            />
            <EBtn text @click="handleCancelUpdateProductMetaTitle">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn v-if="!inputProductMetaTitleVisible" type="primary" text @click="handleClickUpdateProductMetaTitle">
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 文章元描述 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('product.metaDescription') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputProductMetaDescriptionVisible" class="mr-2">
            {{ localProductSeo.metaDescription }}
          </span>
          <span v-else>
            <ElInput
              v-model="localProductSeo.metaDescription"
              style="width: 300px"
              class="mr-2"
              @blur="editProductMetaDescription"
            />
            <EBtn text @click="handleCancelUpdateProductMetaDescription">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputProductMetaDescriptionVisible"
            type="primary"
            text
            @click="handleClickUpdateProductMetaDescription"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="border border-gray-200 rounded-lg mb-5">
    <div class="flex justify-center items-center mb-5">
      <ElAlert :title="$t('product.warning.noSeoData')" type="warning" show-icon />
    </div>
    <div class="flex justify-center items-center mb-5">
      <ElInput v-model="localProductSeo.metaTitle" :placeholder="$t('product.placeholder.metaTitle')" />
      <EBtn type="primary" class="ml-5" @click="createProductMetaTitle">
        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
        {{ $t('common.save') }}
      </EBtn>
    </div>
  </div>
</template>
