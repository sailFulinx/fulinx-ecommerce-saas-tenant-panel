<script setup lang="ts">
import { orderPaginationApi } from '@/api/order'
import { formatTime } from '@/utils'

const listResult = ref<TableResponse<OrderData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<OrderListParams & Pagination>({
  orderId: null,
  pageSize: 20,
  pageNumber: 1,
})
const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.orderId === '') {
    listQuery.orderId = null
  }
  const { data } = await orderPaginationApi(listQuery).catch(err => {
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

const selectedOrderItem = (val: (OrderData & CommonField)[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}

const handleRedirectEdit = (val: OrderData & CommonField) => {
  router.push({ name: 'ShowOrder', params: { id: val.id } })
}
init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 items-center">
          <div class="mr-5">
            {{ $t('router.order') }}
          </div>
          <ElInput
            v-model="listQuery.orderId"
            clearable
            :placeholder="$t('order.placeholder.orderId')"
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
        @selection-change="selectedOrderItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn :label="$t('order.orderId')">
          <template #default="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('order.email')">
          <template #default="scope">
            <span>{{ scope.row.customerEmail }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('order.orderTotalAmount')">
          <template #default="scope">
            <span>{{ scope.row.orderTotalAmount.toFixed(2) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('order.status')">
          <template #default="scope">
            <span>{{ scope.row.orderStatusText }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('order.approvalStatus')">
          <template #default="scope">
            <span>{{ scope.row.approvalStatusText }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.recordCreateTime')" >
          <template #default="scope">
            <span>{{ formatTime(scope.row.recordCreateTime) }}</span>
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
