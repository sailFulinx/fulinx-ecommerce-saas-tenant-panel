<script setup name="Order" lang="ts">
import { fetchImpDetailApi } from '@/api/imp'
import { useLocale } from '@/hooks/useLocale'
import { formatTime, getCurrentFormattedDate } from '@/utils'
import { convertImpLogStatus } from '@/utils/imp'
import { debounce } from 'lodash'

const { t: $t } = useLocale()
const loading = reactive({
  imp: false,
})

const id = useRoute().params.id as string

const tableRef = ref()

const impData = ref<ImpLogResponseDataType>({
  fileId: '',
  fileVo: null,
  id: '',
  importLogList: [],
  importStatus: 0,
  importType: 0,
  recordCreateName: '',
  recordCreateTime: '',
  recordUpdateName: '',
  recordUpdateTime: '',
  isDelete: 0,
})

// 获取列表数据
const getImp = debounce(async () => {
  loading.imp = true
  const { data } = await fetchImpDetailApi(id).catch(err => {
    loading.imp = false
    throw err
  })
  impData.value = { ...data }
  loading.imp = false
}, 100)
getImp()
</script>

<template>
  <div class="view-page">
    <div class="view-header bg-white">
      <ElRow justify="space-between" class="items-center">
        <div class="w-3/4 flex items-center justify-start">
          <h4>{{ $t('router.impLog') }}</h4>
        </div>
      </ElRow>
    </div>
    <div class="view-main">
      <ElTable ref="tableRef" v-loading="loading.imp" stripe :data="impData.importLogList" style="width: 100%">
        <ElTableColumn prop="id" :label="$t('common.id')" width="120" />
        <ElTableColumn prop="status" :label="$t('imp.impContent')">
          <template #default="scope">
            {{ scope.row.impContent }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="status" :label="$t('common.status')">
          <template #default="scope">
            {{ convertImpLogStatus(scope.row.impLogStatus) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="impFailedReason" :label="$t('imp.impFailedReason')" />
        <ElTableColumn prop="recordCreateTime" :label="$t('common.recordCreateTime')">
          <template #default="scope">
            {{ formatTime(scope.row.recordCreateTime) }}
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </div>
</template>
