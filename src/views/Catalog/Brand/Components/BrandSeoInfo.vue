<script setup lang="ts">
import { brandKey } from '../type/injectionKeys'

const { currentItem, languageId } = defineProps<{
  currentItem: BrandAdminLocalizedViewDo
  brandAdminLocalizedViewDos: BrandAdminLocalizedViewDo[]
  languageId: string
}>()

const { loading, id: brandId, resetFormData } = inject(brandKey)!

const { t: $t } = useLocale()

// 本地状态
const inputBrandMetaTitleVisible = ref(false)
const currentBrandMetaTitle = ref('')

// 更新元标题
const handleClickUpdateBrandMetaTitle = (brandMetaTitle: string) => {
  currentBrandMetaTitle.value = brandMetaTitle
  inputBrandMetaTitleVisible.value = true
}

const handleCancelUpdateBrandMetaTitle = () => {
  inputBrandMetaTitleVisible.value = false
}

const editBrandMetaTitle = async (brandSeoId: string) => {
  if (!currentBrandMetaTitle.value) {
    ElMessage.warning($t('brand.error.brandMetaTitle'))
    return
  }
  loading.init = true
  const { data } = await updateBrandSeoApi({
    brandSeoId,
    metaTitle: currentBrandMetaTitle.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentBrandMetaTitle.value = ''
  await resetFormData(data)
  inputBrandMetaTitleVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新元描述
const inputBrandMetaDescriptionVisible = ref(false)
const currentBrandMetaDescription = ref('')

const handleClickUpdateBrandMetaDescription = (brandMetaDescription: string) => {
  currentBrandMetaDescription.value = brandMetaDescription
  inputBrandMetaDescriptionVisible.value = true
}

const handleCancelUpdateBrandMetaDescription = () => {
  inputBrandMetaDescriptionVisible.value = false
}

const editBrandMetaDescription = async (brandSeoId: string) => {
  if (!currentBrandMetaDescription.value) {
    ElMessage.warning($t('brand.error.brandMetaDescription'))
    return
  }
  loading.init = true
  const { data } = await updateBrandSeoApi({
    brandSeoId,
    metaTitle: currentBrandMetaTitle.value,
    metaDescription: currentBrandMetaDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentBrandMetaDescription.value = ''
  await resetFormData(data)
  inputBrandMetaDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 创建品牌SEO
const createBrandSeo = async () => {
  if (!currentBrandMetaTitle.value) {
    ElMessage.warning($t('brand.error.brandMetaTitle'))
    return
  }
  loading.init = true
  const { data } = await createBrandSeoApi({
    brandId,
    languageId,
    metaTitle: currentBrandMetaTitle.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentBrandMetaTitle.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <ElCard v-if="currentItem.brandSeoListResultDo" shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <!-- 品牌元标题 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('brand.metaTitle') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputBrandMetaTitleVisible" class="mr-2">
            {{ currentItem.brandSeoListResultDo.metaTitle }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentBrandMetaTitle"
              style="width: 300px"
              class="mr-2"
              @blur="editBrandMetaTitle(currentItem.brandSeoListResultDo.id)"
            />
            <ElButton text @click="handleCancelUpdateBrandMetaTitle">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </ElButton>
          </span>
          <ElButton
            v-if="!inputBrandMetaTitleVisible"
            type="primary"
            text
            @click="handleClickUpdateBrandMetaTitle(currentItem.brandSeoListResultDo.metaTitle)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </ElButton>
        </div>
      </div>
      <!-- 品牌元描述 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('brand.metaDescription') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputBrandMetaDescriptionVisible" class="mr-2">
            {{ currentItem.brandSeoListResultDo.metaDescription }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentBrandMetaDescription"
              style="width: 300px"
              class="mr-2"
              @blur="editBrandMetaDescription(currentItem.brandSeoListResultDo.id)"
            />
            <ElButton text @click="handleCancelUpdateBrandMetaDescription">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </ElButton>
          </span>
          <ElButton
            v-if="!inputBrandMetaDescriptionVisible"
            type="primary"
            text
            @click="handleClickUpdateBrandMetaDescription(currentItem.brandSeoListResultDo.metaDescription)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </ElButton>
        </div>
      </div>
    </div>
  </ElCard>
  <ElCard v-else shadow="never" class="mb-5">
    <div class="flex justify-center items-center mb-5">
      <ElAlert :title="$t('brand.warning.noSeoData')" type="warning" show-icon />
    </div>
    <div class="flex justify-center items-center mb-5">
      <ElInput v-model="currentBrandMetaTitle" :placeholder="$t('brand.placeholder.metaTItle')" />
      <ElButton type="primary" class="ml-5" @click="createBrandSeo">
        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
        {{ $t('common.save') }}
      </ElButton>
    </div>
  </ElCard>
</template>
