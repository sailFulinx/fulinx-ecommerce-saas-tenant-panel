<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { parameterListApi, removeParameterApi, updateParameterSortApi } from '@/api/parameter'
import { usePreferenceStore } from '@/stores/preference'

const router = useRouter()

const parameterDragging = ref(false)

const listResult = ref<TableResponse<ParameterListData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<ParameterListParams>({
  languageId: usePreferenceStore().preference?.language.id,
  parameterName: '',
})
const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.parameterName === '') {
    listQuery.parameterName = null
  }
  const { data } = await parameterListApi(listQuery).catch(err => {
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

const selectedParameterItem = (val: ParameterListData[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}
const handleDelete = async (row: ParameterListData & CommonField) => {
  loading.list = true
  await removeParameterApi({ parameterIds: [row.id] }).catch(err => {
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
  await removeParameterApi({ parameterIds: selectedList.value }).catch(err => {
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
  router.push({ name: 'CreateParameter' })
}

const handleRedirectEdit = (val: ParameterListData & CommonField) => {
  router.push({ name: 'ShowParameter', params: { id: val.id } })
}
const handleChangeSort = async () => {
  const payload: ParameterSortParams[] = []
  listResult.value.list.map((item, index) => {
    item.sort = index + 1
    payload.push({
      parameterId: item.id,
      sort: item.sort,
    })
  })
  loading.list = true
  await updateParameterSortApi({ parameters: payload }).catch(err => {
    loading.list = false
    throw err
  })
  loading.list = false
}
// init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 items-center">
          <div class="mr-5">
            {{ $t('router.parameter') }}
          </div>
          <ElInput
            v-model="listQuery.parameterName"
            clearable
            :placeholder="$t('parameter.placeholder.parameterName')"
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
      <VueDraggable
        v-model="listResult.list"
        target="tbody"
        item-key="id"
        @start="parameterDragging = true"
        @end="handleChangeSort"
      >
        <ElTable
          v-loading="loading.list"
          :data="listResult.list"
          row-key="id"
          tooltip-effect="dark"
          default-expand-all
          highlight-current-row
          border
          @selection-change="selectedParameterItem"
        >
          <ElTableColumn type="selection" width="55" />
          <ElTableColumn :label="$t('parameter.parameterName')">
            <template #default="scope">
              <div class="flex items-center justify-start">
                <span class="mr-4"><Icon icon="ant-design:holder-outlined" /></span>
                <span>{{ scope.row.parameterName }}</span>
              </div>
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
      </VueDraggable>
    </div>
  </div>
</template>
