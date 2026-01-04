<script setup lang="ts">
import CreateAttributeDialog from './Components/CreateAttributeDialog.vue'

const { t: $t } = useLocale()

const preferenceStore = usePreferenceStore()

const router = useRouter()

const listResult = ref<TableResponse<AttributeListData & CommonField>>({
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
let isInitialLoad = true // 添加标志以避免初始化时重复请求

const listQuery = reactive<AttributeListParams & Pagination>({
  languageId: languageId.value || undefined,
  attributeName: '',
  pageSize: 20,
  pageNumber: 1,
})

const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.attributeName === '') {
    listQuery.attributeName = null
  }
  const { data } = await attributePaginationApi(listQuery).catch(err => {
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
    isInitialLoad = false // 设置标志，表示已完成初始加载
    await getList()
  }
}

// 不要在这里使用 await，避免阻塞组件渲染
initPreferenceAndLoadData()

// watch preference language
watch(
  () => preferenceStore.getPreferences()?.language,
  val => {
    if (val && val.id !== languageId.value && !isInitialLoad) { // 避免首次加载时重复请求
      languageId.value = val.id
      listQuery.languageId = val.id
      getList()
    }
  },
  { immediate: true },
)

const pagination = (val: PaginationComponentDataType) => {
  if (val) {
    listQuery.pageSize = val.limit
    listQuery.pageNumber = val.page
  }
  getList()
}

const selectedAttributeItem = (val: (AttributeListData & CommonField)[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}

const handleDelete = async (row: AttributeListData & CommonField) => {
  loading.list = true
  await removeAttributeApi({ attributeIds: [row.id] }).catch(err => {
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
  await removeAttributeApi({ attributeIds: selectedList.value }).catch(err => {
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

const createAttributeRef = useTemplateRef('createAttributeRef')

const handleCreate = () => {
  createAttributeRef.value?.openDialog()
}

const handleRedirectEdit = (val: AttributeListData & CommonField) => {
  router.push({ name: 'ShowAttribute', params: { id: val.id } })
}

// 处理排序变更
const handleSortChange = async (row: AttributeListData & CommonField, value: number | undefined) => {
  // 如果值为 undefined，不执行更新操作
  if (value === undefined) {
    return
  }

  try {
    await updateAttributeSortApi({
      attributeId: row.id,
      languageId: languageId.value,
      sort: value,
    })
    ElMessage({
      message: '排序更新成功',
      type: 'success',
      duration: 2000,
    })
    await getList()
  } catch (err) {
    ElMessage({
      message: '排序更新失败',
      type: 'error',
      duration: 2000,
    })
    throw err
  }
}

const handleUpdateAttributeStatus = async (row: AttributeListData & CommonField, value: boolean) => {
  loading.list = true
  await updateAttributeStatusApi({
    attributeId: row.id,
    languageId: languageId.value,
    status: value,
  })
  await getList()
  loading.list = false
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 items-center">
          <div class="mr-5">
            {{ $t('router.attribute') }}
          </div>
          <ElInput
            v-model="listQuery.attributeName"
            clearable
            :placeholder="$t('attribute.placeholder.attributeName')"
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
        @selection-change="selectedAttributeItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn :label="$t('attribute.attributeName')">
          <template #default="scope">
            <span>{{ scope.row.attributeName }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.sort')" width="200">
          <template #default="scope">
            <ElInputNumber
              v-model="scope.row.sort"
              :min="0"
              controls-position="right"
              size="small"
              @change="handleSortChange(scope.row, $event)"
              @keyup.enter="handleSortChange(scope.row, $event)"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.status')" width="120">
          <template #default="scope">
            <ElSwitch
              v-model="scope.row.status"
              inline-prompt
              :active-text="$t('common.yes')"
              :inactive-text="$t('common.no')"
              @change="handleUpdateAttributeStatus(scope.row, Boolean($event))"
            />
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
    <CreateAttributeDialog ref="createAttributeRef" @get-list="getList" />
  </div>
</template>
