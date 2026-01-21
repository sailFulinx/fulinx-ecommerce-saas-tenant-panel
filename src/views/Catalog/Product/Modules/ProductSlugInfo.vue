<script setup lang="ts">
interface Props {
  slug?: string
  slugId?: string
  productId: string
  languageId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  refreshData: []
}>()

const { t: $t } = useLocale()

const inputProductSlugVisible = ref<boolean>(false)
const currentSlug = ref<string>('')

const formatSlug = (slug: string): string => {
  if (!slug.startsWith('/')) {
    slug = `/${slug}`
  }

  if (slug.endsWith('/')) {
    slug = slug.slice(0, -1)
  }

  return slug
}

const handleClickCreateProductSlug = async () => {
  const slugValue = formatSlug(currentSlug.value)

  await createProductSlugApi({
    productId: props.productId,
    languageId: props.languageId,
    slug: slugValue,
  }).catch(error => {
    throw error
  })
  ElMessage.success($t('success.create'))
  emit('refreshData')
}

const handleClickUpdateProductSlug = () => {
  currentSlug.value = props.slug || ''
  inputProductSlugVisible.value = true
}

const handleCancelUpdateProductSlug = () => {
  inputProductSlugVisible.value = false
}

const editProductSlug = async () => {
  if (!currentSlug.value) {
    ElMessage.warning($t('product.error.slug'))
    return
  }

  const slugValue = formatSlug(currentSlug.value)

  await updateProductSlugApi({
    slugId: props.slugId || '',
    languageId: props.languageId,
    slug: slugValue,
  }).catch(error => {
    throw error
  })
  inputProductSlugVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <div v-if="!slug || !slugId" class="mb-5">
        <div class="w-full flex items-center mb-5">
          <ElAlert :title="$t('product.warning.noSlugData')" type="warning" show-icon />
        </div>
        <div class="w-full flex items-center mb-5">
          <ElInput v-model="currentSlug" :placeholder="$t('product.placeholder.slug')" />
        </div>
        <EBtn type="primary" class="ml-5" @click="handleClickCreateProductSlug">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </EBtn>
      </div>
      <div v-else class="mb-5">
        <div class="w-full flex border-b border-gray-200 p-4">
          <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
            {{ $t('product.slug') }}:
          </div>
          <div class="flex-1 w-full flex items-center">
            <div v-if="!inputProductSlugVisible" class="mr-2">
              {{ slug }}
            </div>
            <div v-else class="flex items-center justify-start">
              <ElInput v-model="currentSlug" :placeholder="$t('product.placeholder.slug')" class="mr-2" />
              <EBtn text @click="handleCancelUpdateProductSlug">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </EBtn>
              <EBtn type="primary" class="ml-5" @click="editProductSlug">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
            <EBtn v-if="!inputProductSlugVisible" type="primary" text @click="handleClickUpdateProductSlug">
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </EBtn>
          </div>
        </div>
      </div>
    </div>
  </ElCard>
</template>
