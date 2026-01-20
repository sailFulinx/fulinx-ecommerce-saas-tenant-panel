<script setup lang="ts">
import type { CascaderNodePathValue, CascaderNodeValue } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useLocale } from '@/hooks/useLocale'

interface Props {
  articleId?: string
  languageId?: string
  categoryNames?: string[]
  categoryIds?: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  removeCategory: [val: CascaderNodeValue | CascaderNodePathValue]
  editCategory: []
  cancelEditCategory: []
  confirmEditCategory: []
  refreshData: []
}>()

const { t: $t } = useLocale()

const loading = ref(false)
const categoryCascaderVisible = ref<boolean>(false)
const selectedCategoryValue = ref<string[] | any>([])
const deletedCategoryValue = ref<string[] | any>([])
const categoryList = ref<any[]>([])

const categoryProps = {
  expandTrigger: 'hover' as const,
  label: 'categoryName',
  value: 'id',
  multiple: true,
}

const handleRemoveCategory = (val: CascaderNodeValue | CascaderNodePathValue) => {
  deletedCategoryValue.value.push(val)
}

const getCategoryList = async () => {
  const payload = {
    languageId: props.languageId,
    categoryType: 2,
  }
  const { data } = await categoryListApi(payload).catch(error => {
    throw error
  })
  selectedCategoryValue.value = props.categoryIds || []
  categoryList.value = data.list
}

const handleEditCategory = async () => {
  categoryCascaderVisible.value = true
  await getCategoryList()
}

const handleCancelEditCategory = () => {
  categoryCascaderVisible.value = false
  selectedCategoryValue.value = []
  deletedCategoryValue.value = []
}

const handleConfirmEditCategory = async () => {
  if (!props.articleId || !props.languageId) {
    return
  }

  loading.value = true
  categoryCascaderVisible.value = false

  // 计算需要删除的分类ID
  const originalIds = [...new Set((props.categoryIds || []).flat() as string[])]
  const currentIds = [...new Set(selectedCategoryValue.value.flat() as string[])]

  // 找出被删除的分类（原本有现在没有的）
  const deletedIds = originalIds.filter(id => !currentIds.includes(id))
  // 合并通过remove-tag删除的分类
  const directlyDeletedIds = [...new Set(deletedCategoryValue.value.flat() as string[])]
  // 合并所有删除的分类
  const deletedCategoryIds = [...new Set([...deletedIds, ...directlyDeletedIds])]
  loading.value = false
  await updateArticleCategoryApi({
    articleId: props.articleId,
    languageId: props.languageId,
    categoryIds: currentIds,
    deletedCategoryIds,
  }).catch((error: any) => {
    loading.value = false
    throw error
  })
  selectedCategoryValue.value = []
  deletedCategoryValue.value = []
  loading.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-20 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('article.category') }}:
        </div>
        <div class="flex-1 w-full">
          <div class="flex flex-wrap gap-2 items-center">
            <EBtn type="primary" text @click="handleEditCategory">
              <Icon icon="ep:edit" :size="5" class="mr-2" />
            </EBtn>
            <ElTag v-for="(categoryName, index) in categoryNames" :key="index" type="info" class="mr-2 mb-1">
              {{ categoryName }}
            </ElTag>
          </div>
        </div>
      </div>

      <div v-if="categoryCascaderVisible" class="w-full flex border-b border-gray-200 p-4">
        <div class="w-20 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('article.selectCategory') }}:
        </div>
        <div class="flex-1 w-full">
          <ElCascader
            v-model="selectedCategoryValue"
            :options="categoryList"
            :props="categoryProps"
            clearable
            filterable
            class="flex-1 w-full mb-2"
            style="width: 100%"
            @remove-tag="handleRemoveCategory"
          />
          <div class="flex justify-start space-x-2">
            <EBtn @click="handleCancelEditCategory">
              {{ $t('common.cancel') }}
            </EBtn>
            <EBtn type="primary" :loading="loading" @click="handleConfirmEditCategory">
              {{ $t('common.save') }}
            </EBtn>
          </div>
        </div>
      </div>
    </div>
  </ElCard>
</template>
