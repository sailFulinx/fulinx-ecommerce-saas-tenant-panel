<script setup lang="ts">
import { filePaginationApi, removeFileApi } from '@/api/file'
import { ElEmpty, ElMessage } from 'element-plus'

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

const listResult = ref<TableResponse<FileData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<FileListParams & Pagination>({
  fileOriginalName: '',
  pageSize: 20,
  pageNumber: 1,
})
const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.fileOriginalName === '') {
    listQuery.fileOriginalName = null
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

const selectedFileItem = (val: (FileData & CommonField)[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}
const handleDelete = async (row: FileData & CommonField) => {
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
            v-model="listQuery.fileOriginalName"
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
      <ElCard v-if="listResult.total > 0" shadow="hover" class="mb-5">
        <div class="grid grid-cols-4 gap-4">
          <SImg v-for="(item, index) in listResult.list" :key="index" :src="sourceUrl + item.fileUrl" :alt="item.originalFileName" fit="cover" lazy width="120px" placeholder />
        </div>
      </ElCard>
      <ElEmpty v-else description="暂无数据" />
      <Pagination
        v-show="listResult.total > 0"
        v-model:page="listQuery.pageNumber"
        v-model:limit="listQuery.pageSize"
        :total="listResult.total"
        @pagination="pagination"
      />
    </div>
    <ElDrawer ref="uploadDialogRef" v-model="uploadDialogVisible">
      <template #header>
        <div class="flex items-center border-b border-gray-200 pb-5 px-0">
          <Icon icon="ep:upload" class="mr-1" />
          {{ $t('file.uploadImage') }}
        </div>
      </template>
      <UploadMultiImageManual />
    </ElDrawer>
  </div>
</template>
