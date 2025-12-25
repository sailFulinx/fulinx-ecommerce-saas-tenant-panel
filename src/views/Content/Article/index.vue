<script setup lang="ts">
import { categoryListApi } from '@/api/category'
import { convertStatus } from '@/utils/status'

const router = useRouter()

const articleTypePayload = reactive<ArticleTypeListParams>({
  articleTypeCode: null,
})

const articleTypes = ref<ListArticleTypeRes>({
  list: [],
  total: 0,
})

const getArticleTypeList = async () => {
  const { data } = await fetchArticleTypeListApi(articleTypePayload).catch(error => {
    throw error
  })
  articleTypes.value = { ...data }
}

getArticleTypeList()

// 分类相关数据
const categories = ref<any[]>([])
const selectedCategory = ref<string | undefined>(undefined)

const listResult = ref<TableResponse<ArticleListData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})

const preferenceStore = usePreferenceStore()
// 修复：确保在 preference 为 null 时也能正确处理
const preference = ref<PreferenceType | null>(null)
const languageId = ref()

// 初始化 preference 数据
const initPreference = async () => {
  preference.value = await preferenceStore.getPreferences()
  languageId.value = preference.value?.language?.id
}

// 不要在这里使用 await，避免阻塞组件渲染
initPreference()

const listQuery = reactive<ArticleListParams & Pagination>({
  languageId: languageId.value || undefined,
  articleName: '',
  articleType: 2,
  pageSize: 20,
  pageNumber: 1,
})

const getCategories = async () => {
  // 只有当 preference.value 存在并且有 language.id 时才请求分类数据
  if (!preference.value?.language?.id) {
    return
  }

  try {
    const payload = {
      languageId: preference.value?.language?.id,
    }
    const { data } = await categoryListApi(payload)
    categories.value = data.list
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

const getList = async () => {
  // 确保语言 ID 存在再请求文章列表
  if (!listQuery.languageId) {
    return
  }

  loading.list = true
  if (listQuery.articleName === '') {
    listQuery.articleName = null
  }
  // 添加分类筛选条件，只传递数组中的最后一个ID
  listQuery.categoryId = selectedCategory.value ? selectedCategory.value[selectedCategory.value.length - 1] : undefined

  const { data } = await articlePaginationApi(listQuery).catch(err => {
    loading.list = false
    throw err
  })
  listResult.value = data
  loading.list = false
}

// 修复：确保在 preference 为 null 时也能正确处理
const initPreferenceAndLoadData = async () => {
  preference.value = await preferenceStore.getPreferences()
  languageId.value = preference.value?.language?.id

  // preference加载完成后，再加载依赖它的数据
  if (preference.value?.language?.id) {
    listQuery.languageId = preference.value.language.id
    await Promise.all([
      getCategories(),
      getList(),
    ])
  }
}

// 不要在这里使用 await，避免阻塞组件渲染
initPreferenceAndLoadData()

// 为了解决 ElSelect 类型检查问题创建一个单独的引用
const articleTypeModel = computed({
  get: () => listQuery.articleType || undefined,
  set: val => {
    listQuery.articleType = val || undefined
  },
})
const selectedList = ref<string[]>([])

// watch preference language
watch(
  () => preferenceStore.getPreferences()?.language,
  val => {
    if (val) {
      listQuery.languageId = val.id
      // 重新获取分类列表
      getCategories()
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

const handleCopy = async (articleId: string) => {
  const { data } = await CopyArticleApi({ articleId }).catch(err => {
    throw err
  })
  if (data) {
    ElMessage({
      message: '复制成功',
      type: 'success',
      duration: 2000,
    })
    getList()
  }
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
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 items-center">
          <div class="mr-5">
            {{ $t('router.article') }}
          </div>
          <ElSelect
            v-model="articleTypeModel"
            :placeholder="$t('article.placeholder.articleType')"
            clearable
            filterable
            class="mr-5 w-50"
            style="width: 200px"
            @change="getList"
          >
            <ElOption v-for="item in articleTypes.list" :key="item.id" :value="item.id" :label="item.articleTypeName" />
          </ElSelect>
          <ElCascader
            v-model="selectedCategory"
            :options="categories"
            :props="{ checkStrictly: true, label: 'categoryName', value: 'id', expandTrigger: 'hover' }"
            clearable
            filterable
            :placeholder="$t('article.placeholder.category')"
            style="width: 200px"
            class="mr-5"
            @change="getList"
          />
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
        <ElTableColumn :label="$t('article.articleType')" width="120">
          <template #default="scope">
            <span>{{ scope.row.articleTypeLabel }}</span>
          </template>
        </ElTableColumn>
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
        <ElTableColumn label="操作" header-align="center" width="280" align="center" class-name="pl-15 fixed-width">
          <template #default="scope">
            <span class="mr-5">
              <EBtn size="small" @click="handleRedirectEdit(scope.row)">
                <Icon icon="ep:edit" class="mr-1" />
                {{ $t('common.view') }}
              </EBtn>
            </span>
            <span class="mr-5">
              <EBtn size="small" type="danger" :loading="loading.del" @click="handleDelete(scope.row)">
                <Icon icon="ep:delete" class="mr-1" />
                {{ $t('common.remove') }}
              </EBtn>
            </span>
            <span>
              <EBtn type="warning" size="small" @click="handleCopy(scope.row.id)">
                <Icon icon="ep:document" class="mr-1" />
                {{ $t('common.copy') }}
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
