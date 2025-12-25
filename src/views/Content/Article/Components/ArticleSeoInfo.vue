<script setup lang="ts">
interface Props {
  articleSeo?: ArticleSeoListResultDo & CommonField
  articleId: string
  languageId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  refreshData: []
}>()

const { t: $t } = useLocale()

// 文章元标题相关
const inputArticleMetaTitleVisible = ref<boolean>(false)
const currentArticleMetaTitle = ref<string>('')

const handleClickUpdateArticleMetaTitle = (articleMetaTitle: string) => {
  currentArticleMetaTitle.value = articleMetaTitle
  inputArticleMetaTitleVisible.value = true
}

const handleCancelUpdateArticleMetaTitle = () => {
  inputArticleMetaTitleVisible.value = false
}

const editArticleMetaTitle = async (articleSeoId: string) => {
  if (!currentArticleMetaTitle.value) {
    ElMessage.warning($t('article.error.articleMetaTitle'))
    return
  }
  await updateArticleSeoApi({
    articleSeoId,
    metaTitle: currentArticleMetaTitle.value,
    metaDescription: props.articleSeo?.metaDescription || '',
  }).catch(error => {
    throw error
  })
  currentArticleMetaTitle.value = ''
  inputArticleMetaTitleVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

const createArticleMetaTitle = async () => {
  if (!currentArticleMetaTitle.value) {
    ElMessage.warning($t('article.error.metaTitle'))
    return
  }
  await createArticleSeoApi({
    articleId: props.articleId,
    languageId: props.languageId,
    metaTitle: currentArticleMetaTitle.value,
  }).catch(error => {
    throw error
  })
  currentArticleMetaTitle.value = ''
  ElMessage.success($t('success.create'))
  emit('refreshData')
}

// 文章元描述相关
const inputArticleMetaDescriptionVisible = ref<boolean>(false)
const currentArticleMetaDescription = ref<string>('')

const handleClickUpdateArticleMetaDescription = (articleMetaDescription: string) => {
  currentArticleMetaDescription.value = articleMetaDescription
  inputArticleMetaDescriptionVisible.value = true
}

const handleCancelUpdateArticleMetaDescription = () => {
  inputArticleMetaDescriptionVisible.value = false
}

const editArticleMetaDescription = async (articleSeoId: string) => {
  if (!currentArticleMetaDescription.value) {
    ElMessage.warning($t('article.error.articleMetaDescription'))
    return
  }
  await updateArticleSeoApi({
    articleSeoId,
    metaTitle: props.articleSeo?.metaTitle || '',
    metaDescription: currentArticleMetaDescription.value,
  }).catch(error => {
    throw error
  })
  currentArticleMetaDescription.value = ''
  inputArticleMetaDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}
</script>

<template>
  <ElCard v-if="articleSeo" shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <!-- 文章元标题 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('article.metaTitle') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputArticleMetaTitleVisible" class="mr-2">
            {{ articleSeo.metaTitle }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentArticleMetaTitle"
              style="width: 300px"
              class="mr-2"
              @blur="editArticleMetaTitle(articleSeo.id)"
            />
            <EBtn text @click="handleCancelUpdateArticleMetaTitle">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputArticleMetaTitleVisible"
            type="primary"
            text
            @click="handleClickUpdateArticleMetaTitle(articleSeo.metaTitle)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 文章元描述 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('article.metaDescription') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputArticleMetaDescriptionVisible" class="mr-2">
            {{ articleSeo.metaDescription }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentArticleMetaDescription"
              style="width: 300px"
              class="mr-2"
              @blur="editArticleMetaDescription(articleSeo.id)"
            />
            <EBtn text @click="handleCancelUpdateArticleMetaDescription">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputArticleMetaDescriptionVisible"
            type="primary"
            text
            @click="handleClickUpdateArticleMetaDescription(articleSeo.metaDescription)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
    </div>
  </ElCard>
  <ElCard v-else>
    <div class="flex justify-center items-center mb-5">
      <ElAlert :title="$t('article.warning.noSeoData')" type="warning" show-icon />
    </div>
    <div class="flex justify-center items-center mb-5">
      <ElInput v-model="currentArticleMetaTitle" :placeholder="$t('article.placeholder.metaTitle')" />
      <EBtn type="primary" class="ml-5" @click="createArticleMetaTitle">
        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
        {{ $t('common.save') }}
      </EBtn>
    </div>
  </ElCard>
</template>
