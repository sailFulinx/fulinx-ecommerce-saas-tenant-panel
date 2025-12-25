<script setup lang="ts">
interface Props {
  slug?: string
  slugId?: string
  pageId: string
  languageId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  refreshData: []
}>()

const { t: $t } = useLocale()

const inputPageSlugVisible = ref<boolean>(false)
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

const handleClickCreatePageSlug = async () => {
  const slugValue = formatSlug(currentSlug.value)

  await createPageSlugApi({
    pageId: props.pageId,
    languageId: props.languageId,
    slug: slugValue,
  }).catch(error => {
    throw error
  })
  ElMessage.success($t('success.create'))
  emit('refreshData')
}

const handleClickUpdatePageSlug = () => {
  currentSlug.value = props.slug || ''
  inputPageSlugVisible.value = true
}

const handleCancelUpdatePageSlug = () => {
  inputPageSlugVisible.value = false
}

const editPageSlug = async () => {
  if (!currentSlug.value) {
    ElMessage.warning($t('page.error.slug'))
    return
  }

  const slugValue = formatSlug(currentSlug.value)

  await updatePageSlugApi({
    slugId: props.slugId || '',
    languageId: props.languageId,
    slug: slugValue,
  }).catch(error => {
    throw error
  })
  inputPageSlugVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <div v-if="!slug || !slugId" class="mb-5">
        <div class="w-full flex items-center mb-5">
          <ElAlert :title="$t('page.warning.noSlugData')" type="warning" show-icon />
        </div>
        <div class="w-full flex items-center mb-5">
          <ElInput v-model="currentSlug" :placeholder="$t('page.placeholder.slug')" />
        </div>
        <EBtn type="primary" class="ml-5" @click="handleClickCreatePageSlug">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </EBtn>
      </div>
      <div v-else class="mb-5">
        <div class="w-full flex border-b border-gray-200 p-4">
          <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
            {{ $t('page.slug') }}:
          </div>
          <div class="flex-1 w-full flex items-center">
            <div v-if="!inputPageSlugVisible" class="mr-2">
              {{ slug }}
            </div>
            <div v-else class="flex items-center justify-start">
              <ElInput v-model="currentSlug" :placeholder="$t('page.placeholder.slug')" class="mr-2" />
              <EBtn text @click="handleCancelUpdatePageSlug">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </EBtn>
              <EBtn type="primary" class="ml-5" @click="editPageSlug">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
            <EBtn v-if="!inputPageSlugVisible" type="primary" text @click="handleClickUpdatePageSlug">
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </EBtn>
          </div>
        </div>
      </div>
    </div>
  </ElCard>
</template>
