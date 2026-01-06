<script setup lang="ts">
import WarehouseDialog from './Components/WarehouseDialog.vue'

const { t: $t } = useLocale()

const listResult = ref<TableResponse<WarehouseData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})

const listQuery = reactive<WarehouseListParams & Pagination>({
  warehouseName: '',
  pageSize: 20,
  pageNumber: 1,
})

const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.warehouseName === '') {
    listQuery.warehouseName = null
  }
  const { data } = await warehousePaginationApi(listQuery).catch(err => {
    loading.list = false
    throw err
  })
  listResult.value = data
  loading.list = false
}

getList()

const pagination = (val: PaginationComponentDataType) => {
  if (val) {
    listQuery.pageSize = val.limit
    listQuery.pageNumber = val.page
  }
  getList()
}

const selectedWarehouseItem = (val: (WarehouseData & CommonField)[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}

const handleDelete = async (row: WarehouseData & CommonField) => {
  loading.list = true
  await removeWarehouseApi({ ids: [row.id] }).catch(err => {
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
  await removeWarehouseApi({ ids: selectedList.value }).catch(err => {
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

const warehouseDialogRef = useTemplateRef('warehouseDialogRef')

const handleCreate = () => {
  warehouseDialogRef.value?.openDialog()
}

const handleEdit = (val: WarehouseData & CommonField) => {
  warehouseDialogRef.value?.openDialog(val)
}

const handleUpdateWarehouseStatus = async (row: WarehouseData & CommonField) => {
  loading.list = true
  await updateWarehouseStatusApi({
    warehouseId: row.id,
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
            {{ $t('router.warehouse') }}
          </div>
          <ElInput
            v-model="listQuery.warehouseName"
            clearable
            :placeholder="$t('warehouse.placeholder.warehouseName')"
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
        @selection-change="selectedWarehouseItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn :label="$t('warehouse.warehouseName')">
          <template #default="scope">
            <span>{{ scope.row.warehouseName }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.status')" width="120">
          <template #default="scope">
            <ElSwitch
              v-model="scope.row.status"
              inline-prompt
              :active-text="$t('common.yes')"
              :inactive-text="$t('common.no')"
              @change="handleUpdateWarehouseStatus(scope.row)"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
          <template #default="scope">
            <span class="mr-5">
              <EBtn size="small" @click="handleEdit(scope.row)">
                <Icon icon="ep:edit" class="mr-1" />
                {{ $t('common.edit') }}
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
    <WarehouseDialog ref="warehouseDialogRef" @get-list="getList" />
  </div>
</template>
