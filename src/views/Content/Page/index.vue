<script setup lang="ts">
import { convertStatus } from '@/utils/status'

const preferenceStore = usePreferenceStore()

const router = useRouter()

const listResult = ref<TableResponse<PageListData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
// 修复：确保在 preference 为 null 时也能正确处理
const preference = ref<PreferenceType | null>(null)
const languageId = ref()

const listQuery = reactive<PageListParams & Pagination>({
  languageId: languageId.value || undefined,
  pageName: '',
  pageType: null,
  pageSize: 20,
  pageNumber: 1,
})

const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.pageName === '') {
    listQuery.pageName = null
  }
  const { data } = await pagePaginationApi(listQuery).catch(err => {
    loading.list = false
    throw err
  })
  listResult.value = data
  loading.list = false
}

// 修复：确保在 preference 加载完成后再加载依赖它的数据
const initPreferenceAndLoadData = async () => {
  preference.value = await preferenceStore.getPreferences()
  languageId.value = preference.value?.language?.id
  listQuery.languageId = languageId.value || undefined

  // preference加载完成后，再加载依赖它的数据
  if (preference.value?.language?.id) {
    await getList()
  }
}

// 不要在这里使用 await，避免阻塞组件渲染
initPreferenceAndLoadData()

// watch preference language
watch(
  () => preferenceStore.getPreferences()?.language,
  val => {
    if (val) {
      listQuery.languageId = val.id
      getList()
    }
  },
  { immediate: true },
)

const init = async () => {
  loading.list = true
  await getList()
}

const pagination = (val: PaginationComponentDataType) => {
  if (val) {
    listQuery.pageSize = val.limit
    listQuery.pageNumber = val.page
  }
  getList()
}

const selectedPageItem = (val: PageListData[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}
const handleDelete = async (row: PageListData & CommonField) => {
  loading.list = true
  await removePageApi({ ids: [row.id] }).catch(err => {
    loading.list = false
    throw err
  })
  getList()
  ElMessage({
    message: '删除成功',
    type: 'success',
    duration: 2000,
  })
}
const handleMultiDelete = async () => {
  loading.list = true
  if (selectedList.value.length === 0) {
    ElMessage({
      message: '您没有选择哦',
      type: 'error',
      duration: 2000,
    })
    loading.list = false
    return
  }
  await removePageApi({ ids: selectedList.value }).catch(err => {
    loading.list = false
    throw err
  })
  loading.list = false
  getList()
  ElMessage({
    message: '删除成功',
    type: 'success',
    duration: 2000,
  })
}
const handleCreate = () => {
  router.push({ name: 'CreatePage' })
}

const handleRedirectEdit = (val: PageListData & CommonField) => {
  router.push({ name: 'ShowPage', params: { id: val.id } })
}
init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 items-center">
          <div class="mr-5">
            {{ $t('router.page') }}
          </div>
          <ElInput
            v-model="listQuery.pageName"
            clearable
            :placeholder="$t('page.placeholder.pageName')"
            style="width: 200px"
            class="filter-item mr-5"
            @clear="getList"
          />
          <EBtn size="default" class="filter-item" plain type="primary" @click="getList">
            <Icon icon="ep:search" class="mr-1" />
            {{ $t('common.search') }}
          </EBtn>
        </div>
        <div>
          <EBtn type="danger" @click="handleMultiDelete">
            <Icon icon="ep:delete" class="mr-1" />
            {{ $t('common.remove') }}
          </EBtn>
          <EBtn type="primary" @click="handleCreate">
            <Icon icon="ep:plus" class="mr-1" />
            {{ $t('common.add') }}
          </EBtn>
        </div>
      </div>
    </div>
    <div class="view-main">
      <ElTable
        v-loading="loading.list"
        :data="listResult.list"
        row-key="id"
        tooltip-effect="dark"
        default-expand-all
        highlight-current-row
        border
        @selection-change="selectedPageItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn :label="$t('page.pageName')">
          <template #default="scope">
            <span>{{ scope.row.pageName }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.status')" width="120">
          <template #default="scope">
            <span>{{ convertStatus(scope.row.status) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
          <template #default="scope">
            <span class="mr-5">
              <EBtn size="small" @click="handleRedirectEdit(scope.row)">
                <Icon icon="ep:edit" class="mr-1" />
                {{ $t('common.view') }}
              </EBtn>
            </span>
            <span>
              <EBtn size="small" type="danger" :loading="loading.del" @click="handleDelete(scope.row)">
                <Icon icon="ep:delete" class="mr-1" />
                {{ $t('common.remove') }}
              </EBtn>
            </span>
          </template>
        </ElTableColumn>
      </ElTable>
      <Pagination
        v-show="listResult.total > 0"
        v-model:page="listQuery.pageNumber"
        v-model:limit="listQuery.pageSize"
        :total="listResult.total"
        @pagination="pagination"
      />
    </div>
  </div>
</template>
