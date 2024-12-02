<script setup name="Role" lang="ts">
import type { TreeNodeData } from 'element-plus/es/components/tree-v2/src/types'
import { fetchRolePaginationApi, removeRoleApi } from '@/api/role'
import { useLocale } from '@/hooks/useLocale'

import { ElMessage, ElTreeV2 } from 'element-plus'

import { debounce } from 'lodash'
import Detail from './components/Detail.vue'

const { t: $t } = useLocale()
const loading = ref(false)
const selection = ref<string[]>([])

// 列表
const listData = ref<TableResponse<RoleDataType & CommonField>>({
  list: [],
  total: 0,
})
// 列表查询变量
const listPayload = reactive<RoleRequestQueryParameterType & Pagination>({
  isDelete: 0,
  pageNumber: 1,
  pageSize: 30,
  roleName: null,
})
// 获取列表数据
const getList = debounce(async () => {
  if (listPayload.roleName === '') {
    listPayload.roleName = null
  }
  loading.value = true
  const { data } = await fetchRolePaginationApi(listPayload).catch(err => {
    loading.value = false
    throw err
  })
  listData.value = { ...data }
  loading.value = false
}, 100)
getList()

const paginationList = (val: PaginationComponentData) => {
  if (val) {
    listPayload.pageSize = val.limit
    listPayload.pageNumber = val.page
  }
  getList()
}

// 操作的状态，actionType

const actionType = ref<'none' | 'add' | 'edit'>('none')

const visible = ref<boolean>(false)

const detailRef = ref()

// 被修改的ID
const id = ref<string>('')

// 新增
const handleAdd = () => {
  id.value = ''
  actionType.value = 'add'
  visible.value = true
  detailRef.value.handleChangeActiveTab('base')
}

const detail = reactive<RoleDataType>({
  id: '',
  roleType: 0,
  roleName: '',
})

// 修改
const handleEdit = (data: TreeNodeData) => {
  Object.assign(detail, data)
  id.value = data.id
  actionType.value = 'edit'
  visible.value = true
}
// 删除
const handleDelete = async () => {
  if (selection.value.length === 0) {
    ElMessage({
      message: $t('warning.emptySelection'),
      type: 'warning',
    })
    return
  }
  const deletePayload = {
    ids: selection.value,
  }
  await removeRoleApi(deletePayload).catch(err => {
    throw err
  })
  ElMessage({
    message: $t('success.remove'),
    type: 'success',
  })
  getList()
  actionType.value = 'none'
  id.value = null
}
// 批量删除
const handleMultiDelete = () => {
  handleDelete()
}

const treeRef = ref<InstanceType<typeof ElTreeV2>>()
// 选中
const handleSelectionChange = () => {
  selection.value = []
  const checkedNodes = treeRef.value?.getCheckedNodes()
  checkedNodes?.map(item => {
    selection.value.push(item.id)
  })
}

const statusInit = () => {
  visible.value = false
  actionType.value = 'none'
  id.value = ''
}

const handleChangeVisible = () => {
  statusInit()
}

const screenHeight = window.innerHeight - 330
</script>

<template>
  <div class="view-page">
    <div class="view-header bg-white">
      <ElRow justify="space-between">
        <div>
          <h4>{{ $t('router.role') }}</h4>
        </div>
        <div>
          <EBtn type="primary" @click="handleAdd">
            {{ $t('common.create') }}
          </EBtn>
          <EBtn type="danger" @click="handleMultiDelete">
            {{ $t('common.remove') }}
          </EBtn>
        </div>
      </ElRow>
    </div>
    <div class="view-main flex justify-space-between">
      <div v-loading="loading" class="view-left">
        <div class="view-left-header">
          <ElInput
            v-model="listPayload.roleName"
            clearable
            :placeholder="$t('role.listSearchPlaceholder')"
            @input="getList"
          />
        </div>
        <div class="view-left-main pa-0 mt-5">
          <ElTreeV2
            ref="treeRef"
            :highlight-current="true"
            show-checkbox
            :data="listData.list"
            :item-size="48"
            :height="screenHeight"
            @check="handleSelectionChange"
            @node-click="handleEdit"
          >
            <template #default="{ node }">
              <span>{{ node.data.roleName }}</span>
              <span class="treeIcon">
                <Icon icon="ep:arrow-right" />
              </span>
            </template>
          </ElTreeV2>
        </div>
        <div class="view-left-footer-fixed">
          <PaginationSimple
            v-show="listData.total > listPayload.pageSize"
            v-model:page="listPayload.pageNumber"
            v-model:limit="listPayload.pageSize"
            :total="listData.total"
            @pagination="paginationList"
          />
        </div>
      </div>
      <div class="view-right bg-gray-50">
        <div v-show="actionType === 'none'">
          <div class="flex justify-center mt-50 h-screen">
            <div>
              <ElInput
                v-model="listPayload.roleName"
                :placeholder="$t('role.listSearchPlaceholder')"
                clearable
                style="width: 300px"
                class="filter-item mr-15"
                @keyup.enter="getList()"
                @clear="getList()"
              >
                <template #append>
                  <EBtn @click="getList()">
                    <Icon icon="ep:search" />
                  </EBtn>
                </template>
              </ElInput>
              <ElResult icon="info" :title="$t('common.tip')">
                <template #sub-title>
                  <p>{{ $t('common.leftListTip') }}</p>
                </template>
              </ElResult>
            </div>
          </div>
        </div>
        <div v-show="visible">
          <Detail
            :id="id"
            ref="detailRef"
            :detail="detail"
            :action-type="actionType"
            @get-list="paginationList"
            @handle-change-visible="handleChangeVisible"
          />
        </div>
      </div>
    </div>
  </div>
</template>
