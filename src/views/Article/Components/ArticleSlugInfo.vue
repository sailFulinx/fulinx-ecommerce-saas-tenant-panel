<script setup lang="ts">
interface Props {
  slug?: string
  slugId?: string
  articleId: string
  languageId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  refreshData: []
}>()

const { t: $t } = useLocale()

const inputArticleSlugVisible = ref<boolean>(false)
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

const handleClickCreateArticleSlug = async () => {
  const slugValue = formatSlug(currentSlug.value)

  await createArticleSlugApi({
    articleId: props.articleId,
    languageId: props.languageId,
    slug: slugValue,
  }).catch(error => {
    throw error
  })
  ElMessage.success($t('success.create'))
  emit('refreshData')
}

const handleClickUpdateArticleSlug = () => {
  currentSlug.value = props.slug || ''
  inputArticleSlugVisible.value = true
}

const handleCancelUpdateArticleSlug = () => {
  inputArticleSlugVisible.value = false
}

const editArticleSlug = async () => {
  if (!currentSlug.value) {
    ElMessage.warning($t('article.error.slug'))
    return
  }

  const slugValue = formatSlug(currentSlug.value)

  await updateArticleSlugApi({
    slugId: props.slugId || '',
    languageId: props.languageId,
    slug: slugValue,
  }).catch(error => {
    throw error
  })
  inputArticleSlugVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <div v-if="!slug || !slugId" class="mb-5">
        <div class="w-full flex items-center mb-5">
          <ElAlert :title="$t('article.warning.noSlugData')" type="warning" show-icon />
        </div>
        <div class="w-full flex items-center mb-5">
          <ElInput v-model="currentSlug" :placeholder="$t('article.placeholder.slug')" />
        </div>
        <EBtn type="primary" class="ml-5" @click="handleClickCreateArticleSlug">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </EBtn>
      </div>
      <div v-else class="mb-5">
        <div class="w-full flex border-b border-gray-200 p-4">
          <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
            {{ $t('article.slug') }}:
          </div>
          <div class="flex-1 w-full flex items-center">
            <div v-if="!inputArticleSlugVisible" class="mr-2">
              {{ slug }}
            </div>
            <div v-else class="flex items-center justify-start">
              <ElInput v-model="currentSlug" :placeholder="$t('article.placeholder.slug')" class="mr-2" />
              <EBtn text @click="handleCancelUpdateArticleSlug">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </EBtn>
              <EBtn type="primary" class="ml-5" @click="editArticleSlug">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
            <EBtn v-if="!inputArticleSlugVisible" type="primary" text @click="handleClickUpdateArticleSlug">
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </EBtn>
          </div>
        </div>
      </div>
    </div>
  </ElCard>
</template>
