<script setup name="Category" lang="ts">
import { get } from 'sortablejs'
import CreateCategoryDialog from './Components/CreateCategoryDialog.vue'

const router = useRouter()
const { t: $t } = useLocale()

const loading = reactive({
  init: false,
})

const preferenceStore = usePreferenceStore()
// 修复：确保在 preference 为 null 时也能正确处理
const preference = ref<PreferenceType | null>(null)
const languageId = ref()

const listPayload = reactive<CategoryListParams & Pagination>({
  languageId: undefined,
  categoryName: '',
  id: null,
  pageNumber: 1,
  pageSize: 1000,
})

const listData = ref<CategoryListRes>({
  list: [],
  total: 0,
})

const getList = async () => {
  loading.init = true
  const { data } = await categoryPaginationApi(listPayload).catch(error => {
    loading.init = false
    throw error
  })

  listData.value = { ...data }
  loading.init = false
}

const initPreference = async () => {
  preference.value = await preferenceStore.getPreferences()
  languageId.value = preference.value?.language?.id
  listPayload.languageId = languageId.value || undefined
  getList()
}

initPreference()
const paginationList = (val: PaginationComponentData) => {
  if (val) {
    listPayload.pageSize = val.limit
    listPayload.pageNumber = val.page
  }
  getList()
}

// watch preference language
watch(
  () => preferenceStore.getPreferences()?.language,
  val => {
    if (val) {
      listPayload.languageId = val.id
      getList()
    }
  },
)

const createCategoryRef = useTemplateRef('createCategoryRef')

const handleCreate = () => {
  createCategoryRef.value?.openDialog()
}

const handleCreateChildCategory = (item: CategoryData) => {
  createCategoryRef.value?.openDialog(item)
}

const handleShow = (val: CategoryData & CommonField) => {
  router.push({ name: 'ShowCategory', params: { id: val.id } })
}

let deleteIds: string[] = []
// let selection: (CategoryData & CommonField[]) = []
// 选中
const handleSelectionChange = (selection: CategoryData[]) => {
  deleteIds = []
  if (!selection.length) {
    return
  }
  selection.forEach(item => {
    deleteIds.push(item.id)
  })
}

const handleMultiDelete = async () => {
  if (!deleteIds.length) {
    ElMessage({
      message: $t('warning.emptySelection'),
      type: 'warning',
    })
    return
  }
  loading.init = true
  const payload = {
    ids: deleteIds,
  }
  await categoryRemoveApi(payload).catch(error => {
    loading.init = false
    throw error
  })
  deleteIds = []
  ElMessage.success($t('success.remove'))
  await getList()
  loading.init = false
}

const handleDelete = async (val: CategoryData & CommonField) => {
  deleteIds = [val.id]
  await handleMultiDelete()
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="sticky top-0 z-99 view-header">
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
        :style="{ width: '100%' }"
        tooltip-effect="dark"
        highlight-current-row
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn type="selection" stripe row-key="id" width="60" />
        <ElTableColumn prop="categoryName" :label="`${$t('category.categoryName')}`" />
        <ElTableColumn fixed="right" :label="`${$t('common.action')}`" width="280">
          <template #default="scope">
            <EBtn type="primary" @click="handleCreateChildCategory(scope.row)">
              <Icon icon="ep:plus" class="mr-1" />
              {{ $t('category.createChildCategory') }}
            </EBtn>
            <EBtn type="default" @click="handleShow(scope.row)">
              <Icon icon="ep:edit" class="mr-1" />
              {{ $t('common.view') }}
            </EBtn>
            <EBtn type="danger" @click="handleDelete(scope.row)">
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
