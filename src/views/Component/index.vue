<script setup name="User" lang="ts">
import type { ElTree } from 'element-plus'
import { debounce } from 'lodash-es'
import { componentPaginationApi, copyCompApi, removeCompApi } from '@/api/comp'
import { useLocale } from '@/hooks/useLocale'
import Detail from './components/Detail.vue'

const { t: $t } = useLocale()
const loading = ref(false)
const selection = ref<string[]>([])

const routeQuery = useRoute().query

const routerComponentName = ref<string>('')

if (typeof routeQuery.componentName === 'string') {
  routerComponentName.value = routeQuery.componentName
}

// 操作的状态，actionType

const actionType = ref<'none' | 'add' | 'edit'>('none')

const visible = ref<boolean>(false)

const detailRef = ref()

// 被修改的ID
const id = ref<number | null>(null)

// 新增
const handleAdd = () => {
  id.value = null
  actionType.value = 'add'
  visible.value = true
  detailRef.value.init(actionType.value)
}

const detail = ref<CompData>({
  id: '',
  componentName: '',
  componentContent: '',
  isUsed: false,
})

// 修改
const handleEdit = async (data: CompData | any) => {
  actionType.value = 'edit'
  await nextTick()
  detailRef.value.init(actionType.value, data)
  visible.value = true
  detail.value = data
}

const listPayload = reactive<CompListParams & Pagination>({
  pageNumber: 1,
  pageSize: 20,
  componentName: routerComponentName.value || null,
})

const listData = ref<TableResponse<CompData & CommonField>>({
  list: [],
  total: 0,
})

const getList = debounce(async () => {
  loading.value = true
  if (listPayload.componentName === '') {
    listPayload.componentName = null
  }
  if (listPayload.componentName && listPayload.componentName?.length <= 1) {
    loading.value = false
    return
  }
  const { data } = await componentPaginationApi(listPayload).catch(error => {
    loading.value = false
    throw error
  })
  listData.value = data
  if (listData.value.list.length === 1) {
    await handleEdit(listData.value.list[0])
  }
  loading.value = false
}, 300)

getList()

const paginationList = (val: PaginationComponentData) => {
  listPayload.pageNumber = val.page
  listPayload.pageSize = val.limit
  getList()
}

const handleCopy = async (id: string) => {
  loading.value = true
  await copyCompApi({ componentId: id }).catch(error => {
    loading.value = false
    throw error
  })
  loading.value = false
  getList()
  ElMessage({
    message: $t('success.copy'),
    type: 'success',
  })
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
  loading.value = true
  await removeCompApi({ ids: selection.value }).catch(error => {
    loading.value = false
    throw error
  })
  getList()
  actionType.value = 'none'
  id.value = null
  loading.value = false
}

const treeRef = ref<InstanceType<typeof ElTree>>()

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
  id.value = 0
}

const handleChangeVisible = () => {
  statusInit()
}

const leftScreenHeight = window.innerHeight - 340

const screenHeight = window.innerHeight - 44
</script>

<template>
  <div class="view-page">
    <div v-loading="loading" class="w-full overflow-hidden" :style="{ height: `${screenHeight}px` }">
      <div class="grid grid-cols-12 gap-5">
        <div
          class="col-span-3 lg:col-span-4 xl:col-span-3 2xl:col-span-3 bg-white pa-5 border-r border-gray-200"
          :style="{ height: `${screenHeight}px` }"
        >
          <div class="w-full flex items-center justify-between mb-5 fix">
            <div>
              <h4>{{ $t('router.component') }}</h4>
            </div>
            <div>
              <EBtn plain type="primary" @click="handleAdd">
                <Icon icon="ep:plus" class="mr-1" />
                {{ $t('common.create') }}
              </EBtn>
              <ElPopconfirm :title="`${$t('common.removeConfirm')}`" @confirm="handleDelete">
                <template #reference>
                  <EBtn plain type="danger">
                    <Icon icon="ep:delete" class="mr-1" />
                    {{ $t('common.remove') }}
                  </EBtn>
                </template>
              </ElPopconfirm>
            </div>
          </div>
          <div class="w-full">
            <ElInput v-model="listPayload.componentName" clearable placeholder="请输入关键字搜索" @input="getList" />
          </div>
          <div class="pa-0 mt-5">
            <ElTreeV2
              ref="treeRef"
              :highlight-current="true"
              show-checkbox
              :data="listData.list"
              :item-size="48"
              :height="leftScreenHeight"
              class="bg-gray-50"
              @check="handleSelectionChange"
              @node-click="handleEdit"
            >
              <template #default="{ node }">
                <span class="block w-80 truncate" :title="node.data.componentName">
                  {{ node.data.componentName }}
                </span>
                <span class="treeIcon flex items-center justify-end">
                  <Icon
                    name="ant-design:copy-outlined"
                    class="mr-2 cursor-pointer"
                    :color="node.data.isUsed ? '#f56c6c' : '#67c23a'"
                    @click.prevent="handleCopy(node.data.id)"
                  />
                  <Icon name="ep:arrow-right" />
                </span>
              </template>
            </ElTreeV2>
          </div>
          <div class="mt-5">
            <PaginationSimple
              v-show="listData.total > listPayload.pageSize"
              v-model:page="listPayload.pageNumber"
              v-model:limit="listPayload.pageSize"
              :total="listData.total"
              @pagination="paginationList"
            />
          </div>
        </div>
        <div
          class="col-span-9 lg:col-span-8 xl:col-span-9 2xl:col-span-9 theme-card border border-gray-200 overflow-y-auto"
          :style="{ height: `${screenHeight}px` }"
        >
          <div v-show="actionType === 'none'" class="flex justify-center items-center h-full min-h-screen">
            <div class="w-full">
              <div class="flex justify-center">
                <div class="flex justify-center w-full">
                  <ElInput :placeholder="$t('comps.listSearchPlaceholder')" clearable style="width: 300px">
                    <template #append>
                      <EBtn>
                        <Icon icon="ep:search" />
                      </EBtn>
                    </template>
                  </ElInput>
                </div>
              </div>
              <div class="w-full">
                <div class="flex justify-center">
                  <ElResult icon="info" :title="$t('common.tip')">
                    <template #sub-title>
                      <p>{{ $t('common.leftListTip') }}</p>
                    </template>
                  </ElResult>
                </div>
              </div>
            </div>
          </div>
          <div v-show="visible">
            <Detail
              :id="id"
              ref="detailRef"
              :detail="detail"
              :action-type="actionType"
              @handle-change-visible="handleChangeVisible"
              @get-list="getList"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
:deep(.el-tree) {
  background-color: transparent !important;
}
</style>
