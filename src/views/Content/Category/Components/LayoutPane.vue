<script setup lang="ts">
import { categoryKey } from '../type/injectionKeys'

const { currentItem } = defineProps<{
  currentItem: CategoryShowListItem
}>()

const { loading, resetFormData } = inject(categoryKey)!

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
    && currentItem.categoryDetailListResultDo?.layoutType === 3
    && simplifiedComponentLayoutRef.value
  ) {
    rows.value = JSON.parse(currentItem.categoryDetailListResultDo.layoutContent)
    simplifiedComponentLayoutRef.value.setData(rows.value)
  }
}

watch(
  () => currentItem,
  () => {
    if (currentItem.categoryDetailListResultDo?.layoutType) {
      currentLayoutType.value = currentItem.categoryDetailListResultDo.layoutType
    }

    if (currentItem.categoryDetailListResultDo?.devComponentName) {
      devComponentName.value = currentItem.categoryDetailListResultDo.devComponentName
    }

    if (
      currentItem.categoryDetailListResultDo?.layoutType === 3
      && currentItem.categoryDetailListResultDo?.layoutContent
      && simplifiedComponentLayoutRef.value
    ) {
      rows.value = JSON.parse(currentItem.categoryDetailListResultDo?.layoutContent)
      simplifiedComponentLayoutRef.value.setData(rows.value)
    }
  },
  { deep: true, immediate: true },
)

const handleSubmitCategoryLayout = async (val: CategoryShowListItem) => {
  loading.init = true
  if (val.categoryDetailListResultDo === null) {
    return
  }
  if (simplifiedComponentLayoutRef.value && currentLayoutType.value === 3) {
    rows.value = simplifiedComponentLayoutRef.value.getData()
  }
  const payload = {
    categoryDetailId: val.categoryDetailListResultDo.id,
    layoutType: currentLayoutType.value,
    devComponentName: devComponentName.value,
    languageId: val.categoryDetailListResultDo.languageId,
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
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-300">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('common.layoutType') }}:
        </div>
        <div class="col-span-11">
          <div v-if="!isShowLayoutEdit">
            <div class="flex justify-start items-center">
              <span class="mr-2">
                {{ currentItem.categoryDetailListResultDo?.layoutTypeLabel }}
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
