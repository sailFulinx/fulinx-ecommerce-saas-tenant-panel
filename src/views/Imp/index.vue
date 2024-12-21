<script setup name="Order" lang="ts">
import { fetchImpPaginationApi } from '@/api/imp'
import { useLocale } from '@/hooks/useLocale'
import { formatTime, getCurrentFormattedDate } from '@/utils'
import { convertImpStatus, convertImpTypes } from '@/utils/imp'

const { t: $t } = useLocale()
const loading = reactive({
  imp: false,
})

const tableRef = ref()
// 列表
const listImpData = ref<TableResponse<ImpListResponseDataType>>({
  list: [],
  total: 0,
})
// 列表查询变量
const listImpPayload = reactive<ImpRequestQueryParameterType & Pagination>({
  isDelete: 0,
  pageNumber: 1,
  pageSize: 20,
})

// 获取列表数据
const getImpList = async () => {
  loading.imp = true
  const { data } = await fetchImpPaginationApi(listImpPayload).catch(err => {
    loading.imp = false
    throw err
  })
  listImpData.value = { ...data }
  loading.imp = false
}
getImpList()

/**
 * 查看
 */
const handleView = (val: ImpListResponseDataType & CommonField) => {
  router.push({ name: 'ImpLog', params: { id: val.id } })
}

/**
 * 分页
 * @param val
 */
const paginationList = (val: PaginationComponentDataType) => {
  if (val) {
    listImpPayload.pageSize = val.limit
    listImpPayload.pageNumber = val.page
  }
  getImpList()
}
</script>

<template>
  <div class="view-page">
    <div class="view-header bg-white">
      <ElRow justify="space-between" class="items-center">
        <div class="w-3/4 flex items-center justify-start">
          <h4>{{ $t('router.imp') }}</h4>
        </div>
      </ElRow>
    </div>
    <div class="view-main">
      <ElTable ref="tableRef" v-loading="loading.imp" stripe row-key="id" :data="listImpData.list" style="width: 100%">
        <ElTableColumn prop="id" :label="$t('common.id')" width="120" />
        <ElTableColumn :label="$t('file.name')" width="480">
          <template #default="scope">
            {{ scope.row.fileVo.originalFileName }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="status" :label="$t('common.status')">
          <template #default="scope">
            {{ convertImpStatus(scope.row.importStatus) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="recordCreateTime" :label="$t('common.recordCreateTime')">
          <template #default="scope">
            {{ formatTime(scope.row.recordCreateTime) }}
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.action')" align="right" fixed="right" width="220">
          <template #default="scope">
            <ElButton size="small" type="default" @click="handleView(scope.row)">
              {{ $t('common.view') }}{{ $t('imp.impLog') }}
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <div class="view-footer">
      <Pagination
        v-show="listImpData.total > listImpPayload.pageSize"
        v-model:page="listImpPayload.pageNumber"
        v-model:limit="listImpPayload.pageSize"
        :total="listImpData.total"
        @pagination="paginationList"
      />
    </div>
  </div>
</template>
