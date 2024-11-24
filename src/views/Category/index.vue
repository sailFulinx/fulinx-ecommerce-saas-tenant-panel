<script setup name="Category" lang="ts">
import { paginationCategoryApi, removeCategoryApi } from '@/api/category'
import { getCategoryTypeColor, getCategoryTypeLabel } from '@/data/category'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElMessage } from 'element-plus'
import CreateCategoryDialog from './Components/CreateCategoryDialog.vue'

const { t: $t } = useLocale()
const loading = reactive({
  init: false,
})

const tableRef = ref()

const createCategoryRef = ref()

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const listPayload = reactive<CategoryListParams & Pagination>({
  languageId: selectLanguage.value.id,
  categoryName: '',
  id: null,
  pageNumber: 1,
  pageSize: 20,
})

const listData = ref<ListCategoryRes>({
  list: [],
  total: 0,
})

const getList = async () => {
  loading.init = true
  const { data } = await paginationCategoryApi(listPayload).catch(error => {
    loading.init = true
    throw error
  })
  listData.value = { ...data }
  loading.init = false
}
getList()

const paginationList = (val: PaginationComponentData) => {
  if (val) {
    listPayload.pageSize = val.limit
    listPayload.pageNumber = val.page
  }
  getList()
}

// watch preference language
watch(
  () => usePreferenceStore().preference?.language,
  val => {
    if (val) {
      listPayload.languageId = val.id
      getList()
    }
  },
  { immediate: true },
)

const selection = ref<CategoryData & CommonField[]>()

const deleteIds = ref<string[]>([])

// 选中
const handleSelectionChange = (e: CategoryData & CommonField[]) => {
  deleteIds.value = []
  if (e.length === 0) {
    return
  }
  selection.value = e
  selection.value.forEach(item => {
    deleteIds.value.push(item.id)
  })
}

const handleCreate = () => {
  createCategoryRef.value.openDialog()
}

const handleCreateChildCategory = (item: CategoryData) => {
  createCategoryRef.value.openDialog(item)
}

const handleShow = (val: CategoryData & CommonField) => {
  router.push({ name: 'ShowCategory', params: { id: Number(val.id) } })
}

const handleMultiDelete = async () => {
  if (deleteIds.value.length === 0) {
    ElMessage({
      message: $t('warning.emptySelection'),
      type: 'warning',
    })
    return
  }
  loading.init = true
  const payload = {
    ids: deleteIds.value,
  }
  await removeCategoryApi(payload).catch(error => {
    loading.init = false
    throw error
  })
  await getList()
  ElMessage.success($t('success.remove'))
  loading.init = false
  deleteIds.value = []
}

const handleDelete = async (val: CategoryData & CommonField) => {
  deleteIds.value = [val.id]
  await handleMultiDelete()
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between">
        <div>
          <span>{{ $t('router.category') }}</span>
        </div>
        <div>
          <EBtn @click="handleCreate">
            <Icon icon="ep:plus" class="mr-1" />
            {{ $t('common.create') }}
          </EBtn>
          <EBtn type="danger" @click="handleMultiDelete">
            <Icon icon="ep:delete" class="mr-1" />
            {{ $t('common.remove') }}
          </EBtn>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main">
      <ElTable
        :data="listData.list"
        stripe
        row-key="id"
        style="width: 100%"
        tooltip-effect="dark"
        highlight-current-row
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn ref="tableRef" type="selection" stripe row-key="id" width="55" />
        <ElTableColumn prop="id" :label="`${$t('common.id')}`" width="120" />
        <ElTableColumn prop="categoryName" :label="`${$t('category.categoryName')}`">
          <template #default="scope">
            {{ scope.row.categoryName }} <ElTag :type="getCategoryTypeColor(scope.row.categoryType)">
              {{ getCategoryTypeLabel(scope.row.categoryType) }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn fixed="right" :label="`${$t('common.action')}`" width="280">
          <template #default="scope">
            <EBtn size="small" type="primary" @click="handleCreateChildCategory(scope.row)">
              <Icon icon="ep:plus" class="mr-1" />
              {{ $t('category.createChildCategory') }}
            </EBtn>
            <EBtn size="small" type="default" @click="handleShow(scope.row)">
              <Icon icon="ep:edit" class="mr-1" />
              {{ $t('common.view') }}
            </EBtn>
            <EBtn size="small" type="danger" @click="handleDelete(scope.row)">
              <Icon icon="ep:delete" class="mr-1" />
              {{ $t('common.remove') }}
            </EBtn>
          </template>
        </ElTableColumn>
      </ElTable>

      <Pagination
        v-show="listData.total > listPayload.pageSize"
        v-model:page="listPayload.pageNumber"
        v-model:limit="listPayload.pageSize"
        :total="listData.total"
        @pagination="paginationList"
      />
    </div>

    <CreateCategoryDialog ref="createCategoryRef" @get-list="getList" />
  </div>
</template>
