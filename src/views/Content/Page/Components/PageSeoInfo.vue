<script setup lang="ts">
interface Props {
  pageSeo?: PageSeoListResultDo & CommonField
  pageId: string
  languageId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  refreshData: []
}>()

const { t: $t } = useLocale()

// 文章元标题相关
const inputPageMetaTitleVisible = ref<boolean>(false)
const currentPageMetaTitle = ref<string>('')

const handleClickUpdatePageMetaTitle = (pageMetaTitle: string) => {
  currentPageMetaTitle.value = pageMetaTitle
  inputPageMetaTitleVisible.value = true
}

const handleCancelUpdatePageMetaTitle = () => {
  inputPageMetaTitleVisible.value = false
}

const editPageMetaTitle = async (pageSeoId: string) => {
  if (!currentPageMetaTitle.value) {
    ElMessage.warning($t('page.error.pageMetaTitle'))
    return
  }
  await updatePageSeoApi({
    pageSeoId,
    metaTitle: currentPageMetaTitle.value,
    metaDescription: props.pageSeo?.metaDescription || '',
  }).catch(error => {
    throw error
  })
  currentPageMetaTitle.value = ''
  inputPageMetaTitleVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

const createPageMetaTitle = async () => {
  if (!currentPageMetaTitle.value) {
    ElMessage.warning($t('page.error.metaTitle'))
    return
  }
  await createPageSeoApi({
    pageId: props.pageId,
    languageId: props.languageId,
    metaTitle: currentPageMetaTitle.value,
  }).catch(error => {
    throw error
  })
  currentPageMetaTitle.value = ''
  ElMessage.success($t('success.create'))
  emit('refreshData')
}

// 文章元描述相关
const inputPageMetaDescriptionVisible = ref<boolean>(false)
const currentPageMetaDescription = ref<string>('')

const handleClickUpdatePageMetaDescription = (pageMetaDescription: string) => {
  currentPageMetaDescription.value = pageMetaDescription
  inputPageMetaDescriptionVisible.value = true
}

const handleCancelUpdatePageMetaDescription = () => {
  inputPageMetaDescriptionVisible.value = false
}

const editPageMetaDescription = async (pageSeoId: string) => {
  if (!currentPageMetaDescription.value) {
    ElMessage.warning($t('page.error.pageMetaDescription'))
    return
  }
  await updatePageSeoApi({
    pageSeoId,
    metaTitle: props.pageSeo?.metaTitle || '',
    metaDescription: currentPageMetaDescription.value,
  }).catch(error => {
    throw error
  })
  currentPageMetaDescription.value = ''
  inputPageMetaDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}
</script>

<template>
  <ElCard v-if="pageSeo" shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <!-- 文章元标题 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('page.metaTitle') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputPageMetaTitleVisible" class="mr-2">
            {{ pageSeo.metaTitle }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentPageMetaTitle"
              style="width: 300px"
              class="mr-2"
              @blur="editPageMetaTitle(pageSeo.id)"
            />
            <EBtn text @click="handleCancelUpdatePageMetaTitle">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputPageMetaTitleVisible"
            type="primary"
            text
            @click="handleClickUpdatePageMetaTitle(pageSeo.metaTitle)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 文章元描述 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('page.metaDescription') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputPageMetaDescriptionVisible" class="mr-2">
            {{ pageSeo.metaDescription }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentPageMetaDescription"
              style="width: 300px"
              class="mr-2"
              @blur="editPageMetaDescription(pageSeo.id)"
            />
            <EBtn text @click="handleCancelUpdatePageMetaDescription">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputPageMetaDescriptionVisible"
            type="primary"
            text
            @click="handleClickUpdatePageMetaDescription(pageSeo.metaDescription)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
    </div>
  </ElCard>
  <ElCard v-else>
    <div class="flex justify-center items-center mb-5">
      <ElAlert :title="$t('page.warning.noSeoData')" type="warning" show-icon />
    </div>
    <div class="flex justify-center items-center mb-5">
      <ElInput v-model="currentPageMetaTitle" :placeholder="$t('page.placeholder.metaTitle')" />
      <EBtn type="primary" class="ml-5" @click="createPageMetaTitle">
        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
        {{ $t('common.save') }}
      </EBtn>
    </div>
  </ElCard>
</template>
