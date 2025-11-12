<script setup name="Category" lang="ts">
import CreateCategoryDialog from './Components/CreateCategoryDialog.vue'

const router = useRouter()
const { t: $t } = useLocale()

const loading = reactive({
  init: false,
})

const { preference } = useInStore(usePreferenceStore)

const listPayload = reactive<CategoryListParams & Pagination>({
  languageId: preference.value.language.id,
  categoryName: '',
  id: null,
  pageNumber: 1,
  pageSize: 20,
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
  () => preference.value?.language,
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
  router.push({ name: 'ShowCategoryNormal', params: { id: val.id } })
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
          <ElButton @click="handleCreate">
            <Icon icon="ep:plus" class="mr-1" />
            {{ $t('common.create') }}
          </ElButton>
          <ElButton type="danger" @click="handleMultiDelete">
            <Icon icon="ep:delete" class="mr-1" />
            {{ $t('common.remove') }}
          </ElButton>
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
        <ElTableColumn type="selection" stripe row-key="id" width="60" />
        <ElTableColumn prop="categoryName" :label="`${$t('category.categoryName')}`" />
        <ElTableColumn fixed="right" :label="`${$t('common.action')}`" width="280">
          <template #default="scope">
            <ElButton size="small" type="primary" @click="handleCreateChildCategory(scope.row)">
              <Icon icon="ep:plus" class="mr-1" />
              {{ $t('category.createChildCategory') }}
            </ElButton>
            <ElButton size="small" type="default" @click="handleShow(scope.row)">
              <Icon icon="ep:edit" class="mr-1" />
              {{ $t('common.view') }}
            </ElButton>
            <ElButton size="small" type="danger" @click="handleDelete(scope.row)">
              <Icon icon="ep:delete" class="mr-1" />
              {{ $t('common.remove') }}
            </ElButton>
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
