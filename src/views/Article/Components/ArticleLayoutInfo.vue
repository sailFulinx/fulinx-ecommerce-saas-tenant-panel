<script setup lang="ts">
interface Props {
  articleDetail?: ArticleDetailListResultDo & CommonField
  articleId: string
  languageId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  editArticleLayout: []
  refreshData: []
}>()

const { t: $t } = useLocale()

const simplifiedComponentLayoutRef = ref()

// rows
const rows = ref<ComponentRowData[]>([])

const isShowLayoutEdit = ref<boolean>(false)

const handleEditArticleLayout = async () => {
  isShowLayoutEdit.value = true
  await nextTick()
  if (props && props.articleDetail?.layoutContent && simplifiedComponentLayoutRef.value) {
    rows.value = JSON.parse(props.articleDetail.layoutContent)
    simplifiedComponentLayoutRef.value.setData(rows.value)
  }

  emit('editArticleLayout')
}

const handleSubmitArticleLayout = async () => {
  if (!props.articleDetail) {
    return
  }
  if (simplifiedComponentLayoutRef.value) {
    rows.value = simplifiedComponentLayoutRef.value.getData()
    const payload = {
      articleId: props.articleId,
      languageId: props.languageId,
      isCustomLayout: props.articleDetail.isCustomLayout,
      layoutContent: JSON.stringify(rows.value),
    }
    await updateArticleIsCustomLayoutApi(payload).catch(error => {
      throw error
    })
    isShowLayoutEdit.value = false
    ElMessage.success($t('success.edit'))
    emit('refreshData')
  }
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold text-gray-700">{{ $t('article.layout') }}:</div>
        <div class="col-span-11">
          <div v-if="!isShowLayoutEdit">
            <div class="flex justify-start items-center">
              <span class="mr-2">
                {{ articleDetail?.isCustomLayout ? $t('common.yes') : $t('common.no') }}
              </span>
              <span>
                <EBtn type="primary" text @click="handleEditArticleLayout">
                  <Icon icon="ep:edit" :size="5" />
                </EBtn>
              </span>
            </div>
          </div>
          <div v-else>
            <div class="w-full flex items-center justify-between mb-5">
              <div class="mr-2">
                <span class="mr-2">{{ $t('article.isCustomLayout') }}</span>
                <ElSwitch v-model="articleDetail!.isCustomLayout" />
              </div>
              <div>
                <div class="w-full flex">
                  <EBtn type="primary" @click="isShowLayoutEdit = false">
                    <Icon icon="ep:close" :size="3" class="mr-1" />
                    {{ $t('common.cancel') }}
                  </EBtn>
                  <EBtn type="danger" @click="handleSubmitArticleLayout">
                    <Icon icon="ep:check" :size="3" class="mr-1" />
                    {{ $t('common.submit') }}
                  </EBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isShowLayoutEdit && articleDetail!.isCustomLayout" class="w-full bg-gray-50 border-gray-300 rounded-md">
        <SimplifiedComponentLayout ref="simplifiedComponentLayoutRef" />
      </div>
    </div>
  </ElCard>
</template>
