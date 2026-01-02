<script setup lang="ts">
import { brandKey } from '../type/injectionKeys'

const { languageId } = defineProps<{
  languageId: string
}>()

const { loading, id: brandId, form, resetFormData } = inject(brandKey)!

const { t: $t } = useLocale()

// 本地状态
const inputBrandSlugVisible = ref(false)
const currentSlug = ref('')

// 创建Slug
const handleClickCreateBrandSlug = async () => {
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }

  const { data } = await createBrandSlugApi({
    brandId,
    languageId,
    slug: currentSlug.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

// 更新Slug
const handleClickUpdateBrandSlug = () => {
  currentSlug.value = form.slug
  inputBrandSlugVisible.value = true
}

const handleCancelUpdateBrandSlug = () => {
  inputBrandSlugVisible.value = false
}

const editBrandSlug = async () => {
  if (!currentSlug.value) {
    ElMessage.warning($t('brand.error.slug'))
    return
  }
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }
  const { data } = await updateBrandSlugApi({
    slugId: form.slugId,
    languageId,
    slug: currentSlug.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSlug.value = ''
  await resetFormData(data)
  inputBrandSlugVisible.value = false
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <div v-if="!form.slug || !form.slugId" class="mb-5">
        <div class="w-full flex items-center mb-5">
          <ElAlert :title="$t('brand.warning.noSlugData')" type="warning" show-icon />
        </div>
        <div class="w-full flex items-center mb-5">
          <ElInput v-model="currentSlug" :placeholder="$t('brand.placeholder.slug')" />
        </div>
        <ElButton type="primary" class="ml-5" @click="handleClickCreateBrandSlug">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </ElButton>
      </div>
      <div v-else class="mb-5">
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('brand.slug') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <div v-if="!inputBrandSlugVisible" class="mr-2">
              {{ form.slug }}
            </div>
            <div v-else class="flex items-center justify-start">
              <ElInput v-model="currentSlug" :placeholder="$t('brand.placeholder.slug')" class="mr-2" />
              <ElButton text @click="handleCancelUpdateBrandSlug">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
              <ElButton type="primary" class="ml-5" @click="editBrandSlug">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </ElButton>
            </div>
            <ElButton v-if="!inputBrandSlugVisible" type="primary" text @click="handleClickUpdateBrandSlug">
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </ElButton>
          </div>
        </div>
      </div>
    </div>
  </ElCard>
</template>
