<script setup lang="ts">
import { customerInvoicePaginationApi } from '@/api/customer'
import { getCustomerInvoiceTypeLabel } from '@/data/customerInvoice'

const listResult = ref<TableResponse<CustomerInvoiceListData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<CustomerInvoiceListParams & Pagination>({
  pageSize: 20,
  pageNumber: 1,
  email: '',
})
const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.email === '') {
    listQuery.email = null
  }
  const { data } = await customerInvoicePaginationApi(listQuery).catch(err => {
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

const selectedCustomerInvoiceItem = (val: (CustomerInvoiceListData & CommonField)[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}

const handleRedirectEdit = (val: CustomerInvoiceListData & CommonField) => {
  router.push({ name: 'ShowCustomerInvoice', params: { id: val.id } })
}
init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 items-center">
          <div class="mr-5">
            {{ $t('router.invoice') }}
          </div>
          <ElInput
            v-model="listQuery.email"
            clearable
            :placeholder="$t('invoice.placeholder.email')"
            style="width: 200px"
            class="filter-item mr-5"
            @clear="getList"
          />
          <EBtn size="default" class="filter-item" plain type="primary" @click="getList">
            <Icon icon="ep:search" class="mr-1" />
            {{ $t('common.search') }}
          </EBtn>
        </div>
        <div />
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
        @selection-change="selectedCustomerInvoiceItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn :label="$t('invoice.email')">
          <template #default="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('invoice.invoiceType')">
          <template #default="scope">
            <span>{{ getCustomerInvoiceTypeLabel(scope.row.invoiceType) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('invoice.invoiceAmount')">
          <template #default="scope">
            <span>{{ scope.row.invoiceAmount.toFixed(2) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.status')" width="120">
          <template #default="scope">
            <span>{{ scope.row.statusText }}</span>
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
