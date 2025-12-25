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

const currentLayoutType = ref(1)

const devComponentName = ref('')

const layoutTypeList = ref<LayoutTypeData[]>([])

const getLayoutTypeList = async () => {
  const { data } = await fetchLayoutTypeListApi({ layoutTypeCode: null }).catch(error => {
    throw error
  })
  layoutTypeList.value = data.list
}

getLayoutTypeList()

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

watch(
  () => props.articleDetail,
  () => {
    if (props.articleDetail?.layoutType) {
      currentLayoutType.value = props.articleDetail.layoutType
    }
    if (props.articleDetail?.devComponentName) {
      devComponentName.value = props.articleDetail.devComponentName
    }
    if (props.articleDetail?.layoutType === 3 && props.articleDetail?.layoutContent && simplifiedComponentLayoutRef.value) {
      rows.value = JSON.parse(props.articleDetail?.layoutContent)
      simplifiedComponentLayoutRef.value.setData(rows.value)
    }
  },
  { deep: true, immediate: true },
)

const handleSubmitArticleLayout = async () => {
  if (!props.articleDetail) {
    return
  }
  if (currentLayoutType.value === 3 && simplifiedComponentLayoutRef.value) {
    rows.value = simplifiedComponentLayoutRef.value.getData()
  }
  const payload = {
    articleDetailId: props.articleDetail.id,
    languageId: props.languageId,
    layoutType: currentLayoutType.value,
    devComponentName: devComponentName.value,
    layoutContent: JSON.stringify(rows.value),
  }
  await updateArticleLayoutApi(payload).catch(error => {
    throw error
  })
  isShowLayoutEdit.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-300">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('common.layoutType') }}:
        </div>
        <div class="col-span-11">
          <div v-if="!isShowLayoutEdit">
            <div class="flex justify-start items-center">
              <span class="mr-2">
                {{ articleDetail?.layoutTypeLabel }}
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
              <div class="flex-col items-center">
                <ElSelect
                  v-model="currentLayoutType"
                  filterable
                  clearable
                  :placeholder="$t('common.placeholder.layoutType')"
                  style="width: 200px"
                >
                  <ElOption
                    v-for="item in layoutTypeList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.layoutTypeName"
                  />
                </ElSelect>
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
      <div
        v-if="currentLayoutType === 2 && isShowLayoutEdit"
        class="mt-5 p-4 w-full bg-gray-50 border-gray-300 rounded-md grid grid-cols-12 gap-8"
      >
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('common.devComponentName') }}:
        </div>
        <div class="col-span-11">
          <ElInput v-model="devComponentName" :placeholder="$t('common.placeholder.devComponentName')" />
        </div>
      </div>
      <div v-if="currentLayoutType === 3 && isShowLayoutEdit" class="w-full bg-gray-50 border-gray-300 rounded-md">
        <SimplifiedComponentLayout ref="simplifiedComponentLayoutRef" />
      </div>
    </div>
  </ElCard>
</template>
