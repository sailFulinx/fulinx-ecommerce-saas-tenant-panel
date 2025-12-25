<script setup lang="ts">
import { categoryKey } from '../type/injectionKeys'

const { currentItem } = defineProps<{
  currentItem: CategoryShowListItem
}>()

const { form, loading, selectLanguage, resetFormData } = inject(categoryKey)!

const { t: $t } = useLocale()

// 本地状态
const inputCategoryMetaTitleVisible = ref(false)
const currentCategoryMetaTitle = ref('')

// 更新元标题
const handleClickUpdateCategoryMetaTitle = (categoryMetaTitle: string) => {
  currentCategoryMetaTitle.value = categoryMetaTitle
  inputCategoryMetaTitleVisible.value = true
}

const handleCancelUpdateCategoryMetaTitle = () => {
  inputCategoryMetaTitleVisible.value = false
}

const editCategoryMetaTitle = async (categorySeoId: string) => {
  if (!currentCategoryMetaTitle.value) {
    ElMessage.warning($t('category.error.categoryMetaTitle'))
    return
  }
  loading.init = true
  const { data } = await categorySeoEditApi({
    categorySeoId,
    metaTitle: currentCategoryMetaTitle.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryMetaTitle.value = ''
  await resetFormData(data)
  inputCategoryMetaTitleVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新元描述
const inputCategoryMetaDescriptionVisible = ref(false)
const currentCategoryMetaDescription = ref('')

const handleClickUpdateCategoryMetaDescription = (categoryMetaDescription: string) => {
  currentCategoryMetaDescription.value = categoryMetaDescription
  inputCategoryMetaDescriptionVisible.value = true
}

const handleCancelUpdateCategoryMetaDescription = () => {
  inputCategoryMetaDescriptionVisible.value = false
}

const editCategoryMetaDescription = async (categorySeoId: string) => {
  if (!currentCategoryMetaDescription.value) {
    ElMessage.warning($t('category.error.categoryMetaDescription'))
    return
  }
  loading.init = true
  const { data } = await categorySeoEditApi({
    categorySeoId,
    metaDescription: currentCategoryMetaDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryMetaDescription.value = ''
  await resetFormData(data)
  inputCategoryMetaDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 创建分类SEO
const createCategorySeo = async () => {
  if (!currentCategoryMetaTitle.value) {
    ElMessage.warning($t('category.error.categoryMetaTitle'))
    return
  }
  loading.init = true
  const { data } = await categorySeoCreateApi({
    categoryId: form.id,
    languageId: selectLanguage.value.id,
    metaTitle: currentCategoryMetaTitle.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryMetaTitle.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <ElCard v-if="currentItem.categorySeoListResultDo" shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <!-- 分类元标题 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('category.metaTitle') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputCategoryMetaTitleVisible" class="mr-2">
            {{ currentItem.categorySeoListResultDo.metaTitle }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentCategoryMetaTitle"
              style="width: 300px"
              class="mr-2"
              @blur="editCategoryMetaTitle(currentItem.categorySeoListResultDo.id)"
            />
            <ElButton text @click="handleCancelUpdateCategoryMetaTitle">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </ElButton>
          </span>
          <ElButton
            v-if="!inputCategoryMetaTitleVisible"
            type="primary"
            text
            @click="handleClickUpdateCategoryMetaTitle(currentItem.categorySeoListResultDo.metaTitle)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </ElButton>
        </div>
      </div>
      <!-- 分类元描述 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('category.metaDescription') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputCategoryMetaDescriptionVisible" class="mr-2">
            {{ currentItem.categorySeoListResultDo.metaDescription }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentCategoryMetaDescription"
              style="width: 300px"
              class="mr-2"
              @blur="editCategoryMetaDescription(currentItem.categorySeoListResultDo.id)"
            />
            <ElButton text @click="handleCancelUpdateCategoryMetaDescription">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </ElButton>
          </span>
          <ElButton
            v-if="!inputCategoryMetaDescriptionVisible"
            type="primary"
            text
            @click="
              handleClickUpdateCategoryMetaDescription(currentItem.categorySeoListResultDo.metaDescription)
            "
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </ElButton>
        </div>
      </div>
    </div>
  </ElCard>
  <ElCard v-else shadow="never" class="mb-5">
    <div class="flex justify-center items-center mb-5">
      <ElAlert :title="$t('category.warning.noSeoData')" type="warning" show-icon />
    </div>
    <div class="flex justify-center items-center mb-5">
      <ElInput v-model="currentCategoryMetaTitle" :placeholder="$t('category.placeholder.metaTItle')" />
      <ElButton type="primary" class="ml-5" @click="createCategorySeo">
        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
        {{ $t('common.save') }}
      </ElButton>
    </div>
  </ElCard>
</template>
