<script setup lang="ts">
import { messagePaginationApi, removeMessageApi } from '@/api/message'
import { usePreferenceStore } from '@/stores/preference'
import { formatTime, getCurrentFormattedDate } from '@/utils'
import { ElDialog, ElMessage } from 'element-plus'

const listResult = ref<TableResponse<MessageData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<MessageListParams & Pagination>({
  pageSize: 20,
  pageNumber: 1,
  recordCreateTimeRange: [getCurrentFormattedDate(), getCurrentFormattedDate()],
})
const selectedList = ref<number[]>([])

const size = ref<'default' | 'large' | 'small'>('small')

const getList = async () => {
  loading.list = true
  if (listQuery.recordCreateTimeRange) {
    listQuery.recordCreateTimeStart = listQuery.recordCreateTimeRange[0]
    listQuery.recordCreateTimeEnd = listQuery.recordCreateTimeRange[1]
  }
  const { data } = await messagePaginationApi(listQuery).catch(err => {
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

const selectedMessageItem = (val: MessageData[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}
const handleDelete = async (row: MessageData & CommonField) => {
  loading.list = true
  await removeMessageApi({ ids: [row.id] }).catch(err => {
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
  await removeMessageApi({ ids: selectedList.value }).catch(err => {
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
  router.push({ name: 'CreateMessage' })
}

const dialogVisible = ref(false)

const dialogData = ref<MessageData & CommonField>({
  id: 0,
  fullName: '',
  email: '',
  telephone: '',
  messageContent: '',
  isDelete: 0,
  remark: '',
  recordVersion: 0,
  recordCreateName: '',
  recordUpdateName: '',
  recordCreateTime: '',
  recordUpdateTime: '',
})
const handleOpenDialog = (row: MessageData & CommonField) => {
  dialogVisible.value = true
  dialogData.value = row
}
init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 items-center">
          <div class="flex items-center justify-start">
            <div class="mr-5">
              {{ $t('router.message') }}
            </div>
            <ElDatePicker
              v-model="listQuery.recordCreateTimeRange"
              type="daterange"
              :placeholder="$t('message.placeholder.recordCreateTimeRange')"
              value-format="YYYY-MM-DD"
              range-separator="至"
              :start-placeholder="$t('message.placeholder.recordCreateTimeStart')"
              :end-placeholder="$t('message.placeholder.recordCreateTimeEnd')"
              :size="size"
              class="mr-5"
              @change="getList"
            />
            <EBtn size="small" plain type="primary" @click="getList">
              <Icon icon="ep:search" class="mr-1" />
              {{ $t('common.search') }}
            </EBtn>
          </div>
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
        @selection-change="selectedMessageItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn :label="$t('message.fullName')" width="120">
          <template #default="scope">
            <span>{{ scope.row.fullName }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('message.telephone')">
          <template #default="scope">
            <span>{{ scope.row.telephone }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('message.email')">
          <template #default="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('message.messageContent')">
          <template #default="scope">
            <span v-if="scope.row.messageContent">{{ scope.row.messageContent.slice(0, 20) }}...</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.recordCreateTime')">
          <template #default="scope">
            <span>{{ formatTime(scope.row.recordCreateTime) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
          <template #default="scope">
            <span class="mr-5">
              <EBtn size="small" @click="handleOpenDialog(scope.row)">
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
    <ElDialog v-model="dialogVisible" :title="$t('message.view')">
      <ElDescriptions
        class="margin-top"
        :column="4"
        :size="size"
        border
      >
        <ElDescriptionsItem>
          <template #label>
            <div class="cell-item">
              {{ $t('message.fullName') }}
            </div>
          </template>
          {{ dialogData.fullName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem>
          <template #label>
            <div class="cell-item">
              {{ $t('message.telephone') }}
            </div>
          </template>
          {{ dialogData.telephone }}
        </ElDescriptionsItem>
        <ElDescriptionsItem>
          <template #label>
            <div class="cell-item">
              {{ $t('message.email') }}
            </div>
          </template>
          {{ dialogData.email }}
        </ElDescriptionsItem>
        <ElDescriptionsItem>
          <template #label>
            <div class="cell-item">
              {{ $t('common.recordCreateTime') }}
            </div>
          </template>
          {{ formatTime(dialogData.recordCreateTime) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem>
          <template #label>
            <div class="cell-item">
              {{ $t('message.messageContent') }}
            </div>
          </template>

          {{ dialogData.messageContent }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
  </div>
</template>
