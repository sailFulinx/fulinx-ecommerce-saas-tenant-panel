<script setup lang="ts">
import { computed } from 'vue'
import { convertStatus } from '@/utils/status'
import { parameterKey } from '../type/injectionKeys'
import CreateParameterValueDialog from './CreateParameterValueDialog.vue'

const { currentItem, languageId } = defineProps<{
  currentItem: ParameterAdminLocalizedViewDo
  parameterAdminLocalizedViewDos: ParameterAdminLocalizedViewDo[]
  languageId: string
}>()

const { loading, id: parameterId, resetFormData, form } = inject(parameterKey)!

const { t: $t } = useLocale()

// 使用计算参数来响应父组件数据的变化
const currentData = computed(() => {
  return form.parameterAdminLocalizedViewDos.find(item => item.languageId === currentItem.languageId) || currentItem
})

// 本地状态 - 使用对象来跟踪每行的编辑状态
const editingStates = ref<Record<string, boolean>>({})
const editingContent = ref<Record<string, string>>({})

// 更新名称
const handleClickUpdateParameterValueContent = (val: ParameterValueResultDo & CommonField) => {
  editingContent.value[val.id] = val.parameterValueDetailVo.parameterValueContent
  editingStates.value[val.id] = true
}

const _handleCancelUpdateParameterValueContent = (val: ParameterValueResultDo & CommonField) => {
  editingStates.value[val.id] = false
}

const editParameterValueContent = async (val: ParameterValueResultDo & CommonField) => {
  const content = editingContent.value[val.id]
  if (!content) {
    ElMessage.warning($t('parameter.error.parameterValueContents'))
    return
  }
  loading.init = true
  if (val.parameterValueDetailVo.id) {
    const { data } = await updateParameterValueContentApi({
      parameterValueDetailId: val.parameterValueDetailVo.id,
      parameterValueContent: content,
    }).catch(error => {
      loading.init = false
      throw error
    })
    await resetFormData(data)
  } else {
    const { data } = await createParameterValueContentApi({
      parameterValueId: val.parameterValueDetailVo.parameterValueId,
      languageId,
      parameterValueContent: content,
    }).catch(error => {
      loading.init = false
      throw error
    })
    await resetFormData(data)
  }

  loading.init = false
  editingStates.value[val.id] = false
  delete editingContent.value[val.id]
  ElMessage.success($t('success.edit'))
}
// 创建参数名称
// const _createParameterValueContent = async () => {
//   if (!currentParameterValueContent.value) {
//     ElMessage.warning($t('parameter.error.parameterValueContents'))
//     return
//   }
//   loading.init = true
//   const { data } = await createParameterValueContentsApi({
//     parameterId,
//     languageId,
//     parameterValueContents: currentParameterValueContents.value,
//   }).catch(error => {
//     loading.init = false
//     throw error
//   })
//   loading.init = false
//   currentParameterValueContents.value = ''
//   await resetFormData(data)
//   ElMessage.success($t('success.create'))
// }

const selectedList = ref<string[]>([])

const selectedParameterValueItem = (val: (ParameterValueResultDo & CommonField)[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}

const handleDelete = async (val: ParameterValueResultDo & CommonField) => {
  loading.init = true
  const { data } = await removeParameterValueApi({ parameterId, languageId, parameterValueIds: [val.id] }).catch(
    err => {
      loading.init = false
      throw err
    },
  )
  loading.init = false
  await resetFormData(data)
  ElMessage({
    message: '删除成功',
    type: 'success',
    duration: 2000,
  })
}

const handleMultiDelete = async () => {
  loading.init = true
  if (selectedList.value.length === 0) {
    ElMessage({
      message: '您没有选择哦',
      type: 'error',
      duration: 2000,
    })
    loading.init = false
    return
  }
  const { data } = await removeParameterValueApi({
    parameterId,
    languageId,
    parameterValueIds: selectedList.value,
  }).catch(err => {
    loading.init = false
    throw err
  })
  loading.init = false
  await resetFormData(data)
  ElMessage({
    message: '删除成功',
    type: 'success',
    duration: 2000,
  })
}

const createParameterValueRef = useTemplateRef('createParameterValueRef')

const handleAddParameterValue = async () => {
  createParameterValueRef.value?.openDialog(parameterId, languageId)
}

// 处理排序变更
const handleSortChange = async (row: ParameterValueResultDo & CommonField, value: number | undefined) => {
  // 如果值为 undefined，不执行更新操作
  if (value === undefined) {
    return
  }

  try {
    const { data } = await updateParameterValueSortApi({
      parameterValueId: row.id,
      languageId,
      sort: value,
    })
    ElMessage({
      message: '排序更新成功',
      type: 'success',
      duration: 2000,
    })
    await resetFormData(data)
  } catch (err) {
    ElMessage({
      message: '排序更新失败',
      type: 'error',
      duration: 2000,
    })
    throw err
  }
}

const handleUpdateParameterValueStatus = async (row: ParameterValueResultDo & CommonField, value: boolean) => {
  loading.init = true
  const { data } = await updateParameterValueStatusApi({
    parameterValueId: row.id,
    languageId,
    status: value,
  })
  await resetFormData(data)
  loading.init = false
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <div v-if="currentData">
    <div class="w-full flex items-center justify-between mt-0 pt-0">
      <div>参数值列表</div>
      <div class="flex items-center">
        <EBtn type="danger" :loading="loading.init" @click="handleMultiDelete">
          {{ $t('common.delete') }}
        </EBtn>
        <EBtn type="primary" @click="handleAddParameterValue">
          {{ $t('common.add') }}
        </EBtn>
      </div>
    </div>
    <div v-if="currentData.parameterValueResultDos" class="w-full mt-3 pt-0">
      <ElTable
        :loading="loading.init"
        :data="currentData.parameterValueResultDos"
        row-key="id"
        tooltip-effect="dark"
        default-expand-all
        highlight-current-row
        border
        @selection-change="selectedParameterValueItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn :label="$t('parameter.defaultParameterValue')">
          <template #default="scope">
            <span>{{ scope.row.parameterValueDetailVo?.defaultParameterValueContent || '' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('parameter.parameterValue')">
          <template #default="scope">
            <div v-if="!editingStates[scope.row.id]">
              {{ scope.row.parameterValueDetailVo?.parameterValueContent || '' }}
            </div>
            <div v-else>
              <ElInput
                v-model="editingContent[scope.row.id]"
                :placeholder="$t('parameter.placeholder.parameterValue')"
                clearable
                @blur="editParameterValueContent(scope.row)"
                @keyup.enter="editParameterValueContent(scope.row)"
              />
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.sort')" width="200">
          <template #default="scope">
            <ElInputNumber
              v-model="scope.row.sort"
              :min="0"
              controls-position="right"
              size="small"
              @change="handleSortChange(scope.row, $event)"
              @keyup.enter="handleSortChange(scope.row, $event)"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.status')" width="120">
          <template #default="scope">
            <ElSwitch
              v-model="scope.row.status"
              inline-prompt
              :active-text="$t('common.yes')"
              :inactive-text="$t('common.no')"
              @change="handleUpdateParameterValueStatus(scope.row, Boolean($event))"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
          <template #default="scope">
            <span class="mr-5">
              <EBtn size="small" @click="handleClickUpdateParameterValueContent(scope.row)">
                <Icon icon="ep:edit" class="mr-1" />
                {{ $t('common.edit') }}
              </EBtn>
            </span>
            <span>
              <EBtn size="small" type="danger" :loading="loading.init" @click="handleDelete(scope.row)">
                <Icon icon="ep:delete" class="mr-1" />
                {{ $t('common.remove') }}
              </EBtn>
            </span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <CreateParameterValueDialog ref="createParameterValueRef" />
  </div>
</template>

```
