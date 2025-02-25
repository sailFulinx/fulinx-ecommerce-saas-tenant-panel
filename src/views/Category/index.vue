<script setup name="Category" lang="ts">
import { editCategorySortApi, paginationCategoryApi, removeCategoryApi } from '@/api/category'
import { getCategoryTypeColor, getCategoryTypeLabel } from '@/data/category'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElMessage, ElSelect } from 'element-plus'
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
  categoryName: null,
  categoryType: 1,
  id: null,
  pageNumber: 1,
  pageSize: 1000,
})

const listData = ref<ListCategoryRes>({
  list: [],
  total: 0,
})

const getList = async () => {
  loading.init = true
  const { data } = await paginationCategoryApi(listPayload).catch(error => {
    loading.init = false
    throw error
  })
  listData.value = { ...data }
  loading.init = false
}

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
  router.push({ name: 'ShowCategory', params: { id: val.id } })
}

const editSortVisible = ref(false)
const categorySort = ref(1)
const activeCategoryId = ref('')
const handleSaveCategorySort = async (id: string) => {
  loading.init = true
  await editCategorySortApi({
    categoryId: id,
    sort: categorySort.value,
  }).catch(error => {
    loading.init = false
    editSortVisible.value = false
    throw error
  })
  categorySort.value = 1
  editSortVisible.value = false
  loading.init = false
  await getList()
}

const handleEditCategorySort = (id: string, sort: number) => {
  categorySort.value = sort
  editSortVisible.value = true
  activeCategoryId.value = id
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
        <div class="flex items-center">
          <span class="mr-5">{{ $t('router.category') }}</span>
          <div>
            <ElSelect v-model="listPayload.categoryType" placeholder="请选择" @change="getList" style="width: 200px">
              <ElOption :value="1" label="产品分类">
                产品分类
              </ElOption>
              <ElOption :value="2" label="文章分类">
                文章分类
              </ElOption>
            </ElSelect>
          </div>
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
        <ElTableColumn prop="categoryName" :label="`${$t('category.categoryName')}`">
          <template #default="scope">
            {{ scope.row.categoryName }}
            <ElTag :type="getCategoryTypeColor(scope.row.categoryType)">
              {{ getCategoryTypeLabel(scope.row.categoryType) }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="sort" label="排序">
          <template #default="scope">
            <div v-if="editSortVisible && activeCategoryId === scope.row.id">
              <div class="flex items-center">
                <ElInput v-model="categorySort" style="width: 100px" class="mr-2" />
                <EBtn type="default" @click="editSortVisible = false">
                  <Icon icon="ep:close" />
                </EBtn>
                <EBtn type="success" @click="handleSaveCategorySort(scope.row.id)">
                  <Icon icon="ep:check" />
                </EBtn>
              </div>
            </div>
            <div v-else>
              <div class="flex items-center">
                {{ scope.row.sort }}
                <EBtn text @click="handleEditCategorySort(scope.row.id, scope.row.sort)">
                  <Icon icon="ep:edit" />
                </EBtn>
              </div>
            </div>
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
