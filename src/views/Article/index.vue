<script setup lang="ts">
import { usePreferenceStore } from '@/stores/preference'
import { convertStatus } from '@/utils/status'

const router = useRouter()

const listResult = ref<TableResponse<ArticleListData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<ArticleListParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  articleName: '',
  articleType: null,
  pageSize: 20,
  pageNumber: 1,
})
const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.articleName === '') {
    listQuery.articleName = null
  }
  const { data } = await articlePaginationApi(listQuery).catch(err => {
    loading.list = false
    throw err
  })
  listResult.value = data
  loading.list = false
}

// watch preference language
watch(
  () => usePreferenceStore().preference?.language,
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

const selectedArticleItem = (val: ArticleListData[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}
const handleDelete = async (row: ArticleListData & CommonField) => {
  loading.list = true
  await removeArticleApi({ ids: [row.id] }).catch(err => {
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
  await removeArticleApi({ ids: selectedList.value }).catch(err => {
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
  router.push({ name: 'CreateArticle' })
}

const handleRedirectEdit = (val: ArticleListData & CommonField) => {
  router.push({ name: 'ShowArticle', params: { id: val.id } })
}

// 处理排序变更
const handleSortChange = async (row: ArticleListData & CommonField, value: number | undefined) => {
  // 如果值为 undefined，不执行更新操作
  if (value === undefined) {
    return
  }

  try {
    await updateArticleSortApi({
      articleId: row.id,
      languageId: listQuery.languageId,
      sort: value,
    })
    ElMessage({
      message: '排序更新成功',
      type: 'success',
      duration: 2000,
    })
    getList()
  } catch (err) {
    ElMessage({
      message: '排序更新失败',
      type: 'error',
      duration: 2000,
    })
    throw err
  }
}

// 处理置顶变更
const handleIsTopChange = async (row: ArticleListData & CommonField, value: boolean) => {
  try {
    await updateArticleIsTopApi({
      articleId: row.id,
      languageId: listQuery.languageId,
      isTop: value,
    })
    ElMessage({
      message: value ? '已置顶' : '已取消置顶',
      type: 'success',
      duration: 2000,
    })
    getList()
  } catch (err) {
    ElMessage({
      message: '置顶操作失败',
      type: 'error',
      duration: 2000,
    })
    throw err
  }
}

init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 items-center">
          <div class="mr-5">
            {{ $t('router.article') }}
          </div>
          <ElInput
            v-model="listQuery.articleName"
            clearable
            :placeholder="$t('article.placeholder.articleName')"
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
        @selection-change="selectedArticleItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn :label="$t('article.articleName')">
          <template #default="scope">
            <span>{{ scope.row.articleName }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="sort" :label="$t('common.sort')" width="150">
          <template #default="scope">
            <ElInputNumber
              v-model="scope.row.sort"
              :min="0"
              controls-position="right"
              size="small"
              @change="handleSortChange(scope.row, $event)"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.isTop')" width="120">
          <template #default="scope">
            <ElSwitch
              v-model="scope.row.isTop"
              inline-prompt
              :active-text="$t('common.yes')"
              :inactive-text="$t('common.no')"
              @change="handleIsTopChange(scope.row, Boolean($event))"
            />
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
