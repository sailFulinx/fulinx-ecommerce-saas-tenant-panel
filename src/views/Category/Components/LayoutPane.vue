<script setup lang="ts">
import { categoryKey } from '../type/injectionKeys'

const { currentItem } = defineProps<{
  currentItem: CategoryShowListItem
}>()

const { loading, resetFormData } = inject(categoryKey)!

const { t: $t } = useLocale()

// 本地状态
const isShowLayoutEdit = ref(false)

const simplifiedComponentLayoutRef = ref()

// rows
const rows = ref<ComponentRowData[]>([])

const handleEditCategoryLayout = async () => {
  isShowLayoutEdit.value = true
  await nextTick()
  if (
    currentItem
    && currentItem.categoryDetailListResultDo?.layoutContent
    && simplifiedComponentLayoutRef.value
  ) {
    rows.value = JSON.parse(currentItem.categoryDetailListResultDo.layoutContent)
    simplifiedComponentLayoutRef.value.setData(rows.value)
  }
}

const handleSubmitCategoryLayout = async (val: CategoryShowListItem) => {
  loading.init = true
  if (val.categoryDetailListResultDo === null) {
    return
  }
  if (!val.categoryDetailListResultDo.isCustomLayout) {
    val.categoryDetailListResultDo.layoutContent = null
  }
  if (simplifiedComponentLayoutRef.value) {
    rows.value = simplifiedComponentLayoutRef.value.getData()
  }
  const payload = {
    categoryDetailId: val.categoryDetailListResultDo.id,
    languageId: val.categoryDetailListResultDo.languageId,
    isCustomLayout: val.categoryDetailListResultDo.isCustomLayout,
    layoutContent: JSON.stringify(rows.value),
  }
  const { data } = await categoryLayoutEditApi(payload).catch(error => {
    throw error
  })
  await resetFormData(JSON.parse(JSON.stringify(data)))
  loading.init = false
  isShowLayoutEdit.value = false
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('article.layout') }}:
        </div>
        <div class="col-span-11">
          <div v-if="!isShowLayoutEdit">
            <div class="flex justify-start items-center">
              <span class="mr-2">
                {{
                  currentItem.categoryDetailListResultDo?.isCustomLayout
                    ? $t('common.yes')
                    : $t('common.no')
                }}
              </span>
              <span>
                <ElButton type="primary" text @click="handleEditCategoryLayout">
                  <Icon icon="ep:edit" :size="5" />
                </ElButton>
              </span>
            </div>
          </div>
          <div v-else>
            <div class="w-full flex items-center justify-between mb-5">
              <div>
                <span class="mr-2">{{ $t('article.isCustomLayout') }}</span>
                <ElSwitch
                  v-if="currentItem.categoryDetailListResultDo"
                  :model-value="currentItem.categoryDetailListResultDo.isCustomLayout"
                  @update:model-value="(val) => { currentItem.categoryDetailListResultDo!.isCustomLayout = Boolean(val) }"
                />
              </div>

              <div>
                <div class="w-full flex">
                  <ElButton type="primary" @click="isShowLayoutEdit = false">
                    <Icon icon="ep:close" :size="3" class="mr-1" />
                    {{ $t('common.cancel') }}
                  </ElButton>
                  <ElButton type="danger" @click="handleSubmitCategoryLayout(currentItem)">
                    <Icon icon="ep:check" :size="3" class="mr-1" />
                    {{ $t('common.submit') }}
                  </ElButton>
                </div>
              </div>
            </div>
            <div
              v-if="currentItem.categoryDetailListResultDo?.isCustomLayout"
              class="w-full flex items-center mb-5"
            />
          </div>
        </div>
      </div>
      <div
        v-if="isShowLayoutEdit && currentItem.categoryDetailListResultDo?.isCustomLayout"
        class="w-full bg-gray-50 border-gray-300 rounded-md"
      >
        <SimplifiedComponentLayout ref="simplifiedComponentLayoutRef" />
      </div>
    </div>
  </ElCard>
</template>
