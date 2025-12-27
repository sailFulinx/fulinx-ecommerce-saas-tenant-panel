<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { removeSupplierApi, supplierPaginationApi } from '@/api/supplier'
import avatar from '@/assets/imgs/avatar.jpg'
import { usePreferenceStore } from '@/stores/preference'

const router = useRouter()

const sourceUrl = useFileRootUrl()

const listResult = ref<TableResponse<SupplierListData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<SupplierListParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  supplierName: '',
  pageSize: 20,
  pageNumber: 1,
})
const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.supplierName === '') {
    listQuery.supplierName = null
  }
  const { data } = await supplierPaginationApi(listQuery).catch(err => {
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

// const init = async () => {
//   loading.list = true
//   await getList()
// }

const pagination = (val: PaginationComponentDataType) => {
  if (val) {
    listQuery.pageSize = val.limit
    listQuery.pageNumber = val.page
  }
  getList()
}

const selectedSupplierItem = (val: SupplierListData[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}
const handleDelete = async (row: SupplierListData & CommonField) => {
  loading.list = true
  await removeSupplierApi({ supplierIds: [row.id] }).catch(err => {
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
  await removeSupplierApi({ supplierIds: selectedList.value }).catch(err => {
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
  router.push({ name: 'CreateSupplier' })
}

const handleRedirectEdit = (val: SupplierListData & CommonField) => {
  router.push({ name: 'ShowSupplier', params: { id: val.id } })
}
// init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 items-center">
          <div class="mr-5">
            {{ $t('router.supplier') }}
          </div>
          <ElInput
            v-model="listQuery.supplierName"
            clearable
            :placeholder="$t('supplier.placeholder.supplierName')"
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
        @selection-change="selectedSupplierItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn :label="$t('supplier.supplierLogo')">
          <template #default="scope">
            <SImg v-if="scope.row.supplierFileVo?.fileUrl" :src="sourceUrl + scope.row.supplierFileVo?.fileUrl" :alt="scope.row.supplierName" fit="cover" lazy width="120px" placeholder />
            <div v-else>
              <div class="flex flex-col items-left">
                <div class="flex items-center">
                  <Icon icon="ant-design:picture-outlined" :size="24" color="#c0c4cc" /><span class="text-center">No Logo</span>
                </div>
              </div>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('supplier.supplierName')">
          <template #default="scope">
            <span>{{ scope.row.supplierName }}</span>
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
