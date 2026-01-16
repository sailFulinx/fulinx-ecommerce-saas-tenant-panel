<script setup lang="ts">
import { filePaginationApi, removeFileApi } from '@/api/file'
import { formatTime } from '@/utils'

const listResult = ref<TableResponse<FileListData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<FileListParams & Pagination>({
  originalFileName: '',
  pageSize: 24,
  pageNumber: 1,
})
const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.originalFileName === '') {
    listQuery.originalFileName = null
  }
  const { data } = await filePaginationApi(listQuery).catch(err => {
    loading.list = false
    throw err
  })
  listResult.value = data
  loading.list = false
}

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

const _selectedFileItem = (val: (FileListData & CommonField)[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}
const handleDelete = async (row: FileListData & CommonField) => {
  loading.list = true
  await removeFileApi({ ids: [row.id] }).catch(err => {
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
  await removeFileApi({ ids: selectedList.value }).catch(err => {
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

const uploadDialogVisible = ref(false)

const uploadDialogRef = ref()
const handleUpload = () => {
  uploadDialogVisible.value = true
}
init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 items-center">
          <div class="mr-5">
            {{ $t('router.file') }}
          </div>
          <ElInput
            v-model="listQuery.originalFileName"
            clearable
            :placeholder="$t('file.placeholder.originalFileName')"
            style="width: 200px"
            class="mr-3"
            @clear="getList"
          />
          <EBtn size="small" class="filter-item" plain type="primary" @click="getList">
            <Icon icon="ep:search" class="mr-1" />
            {{ $t('common.search') }}
          </EBtn>
        </div>
        <div>
          <EBtn type="danger" @click="handleMultiDelete">
            <Icon icon="ep:delete" class="mr-1" />
            {{ $t('common.remove') }}
          </EBtn>
          <EBtn type="primary" @click="handleUpload">
            <Icon icon="ep:plus" class="mr-1" />
            {{ $t('common.upload') }}
          </EBtn>
        </div>
      </div>
    </div>
    <div class="view-main">
      <div v-if="listResult.total > 0" class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
        <div
          v-for="(item, index) in listResult.list"
          :key="index"
          class="flex-col items-center justify-center border border-gray-100 pa-2"
        >
          <div class="w-full">
            <ElImage
              :src="item.fileUrl"
              :alt="item.originalFileName"
              fit="cover"
              lazy
              placeholder
              @click="handleDelete(item)"
            />
          </div>
          <div class="mt-2">
            {{ item.originalFileName }}
          </div>
          <div class="mt-2 flex items-center justify-between">
            <div>{{ formatTime(item.recordCreateTime as string) }}</div>
            <EBtn type="danger" text size="small" @click="handleDelete(item)">
              <Icon icon="ep:delete" class="mr-1" />
              {{ $t('common.delete') }}
            </EBtn>
          </div>
        </div>
      </div>
      <ElEmpty v-else description="暂无数据" />
      <Pagination
        v-show="listResult.total > 0"
        v-model:page="listQuery.pageNumber"
        v-model:limit="listQuery.pageSize"
        :total="listResult.total"
        @pagination="pagination"
      />
    </div>
    <ElDrawer ref="uploadDialogRef" v-model="uploadDialogVisible" :destroy-on-close="true" :lock-scroll="true" :modal="true" size="40%" class="overflow-hidden">
      <template #header>
        <div class="flex items-center border-b border-gray-200 pb-5 px-0">
          <Icon icon="ep:upload" class="mr-1" />
          {{ $t('file.uploadImage') }}
        </div>
      </template>
      <UploadMultiImageManual class="overflow-hidden" @get-list="getList" />
    </ElDrawer>
  </div>
</template>

<style lang="css" scoped>
:deep(.el-drawer__header){
  margin-bottom: 0 !important;
}
:deep(.el-drawer__body) {
  overflow:hidden !important;
}
</style>
