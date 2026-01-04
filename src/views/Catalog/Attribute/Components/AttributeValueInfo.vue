<script setup lang="ts">
import { computed } from 'vue'
import { convertStatus } from '@/utils/status'
import { attributeKey } from '../type/injectionKeys'
import CreateAttributeValueDialog from './CreateAttributeValueDialog.vue'

const { currentItem, languageId } = defineProps<{
  currentItem: AttributeAdminLocalizedViewDo
  attributeAdminLocalizedViewDos: AttributeAdminLocalizedViewDo[]
  languageId: string
}>()

const { loading, id: attributeId, resetFormData, form } = inject(attributeKey)!

const { t: $t } = useLocale()

// 使用计算属性来响应父组件数据的变化
const currentData = computed(() => {
  return form.attributeAdminLocalizedViewDos.find(item => item.languageId === currentItem.languageId) || currentItem
})

// 本地状态 - 使用对象来跟踪每行的编辑状态
const editingStates = ref<Record<string, boolean>>({})
const editingContent = ref<Record<string, string>>({})

// 更新名称
const handleClickUpdateAttributeValueContent = (val: AttributeValueResultDo & CommonField) => {
  editingContent.value[val.id] = val.attributeValueDetailVo.attributeValueContent
  editingStates.value[val.id] = true
}

const _handleCancelUpdateAttributeValueContent = (val: AttributeValueResultDo & CommonField) => {
  editingStates.value[val.id] = false
}

const editAttributeValueContent = async (val: AttributeValueResultDo & CommonField) => {
  const content = editingContent.value[val.id]
  if (!content) {
    ElMessage.warning($t('attribute.error.attributeValueContents'))
    return
  }
  loading.init = true
  if (val.attributeValueDetailVo.id) {
    const { data } = await updateAttributeValueContentApi({
      attributeValueDetailId: val.attributeValueDetailVo.id,
      attributeValueContent: content,
    }).catch(error => {
      loading.init = false
      throw error
    })
    await resetFormData(data)
  } else {
    const { data } = await createAttributeValueContentApi({
      attributeValueId: val.attributeValueDetailVo.attributeValueId,
      languageId,
      attributeValueContent: content,
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
// 创建属性名称
// const _createAttributeValueContent = async () => {
//   if (!currentAttributeValueContent.value) {
//     ElMessage.warning($t('attribute.error.attributeValueContents'))
//     return
//   }
//   loading.init = true
//   const { data } = await createAttributeValueContentsApi({
//     attributeId,
//     languageId,
//     attributeValueContents: currentAttributeValueContents.value,
//   }).catch(error => {
//     loading.init = false
//     throw error
//   })
//   loading.init = false
//   currentAttributeValueContents.value = ''
//   await resetFormData(data)
//   ElMessage.success($t('success.create'))
// }

const selectedList = ref<string[]>([])

const selectedAttributeValueItem = (val: (AttributeValueResultDo & CommonField)[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}

const handleDelete = async (val: AttributeValueResultDo & CommonField) => {
  loading.init = true
  const { data } = await removeAttributeValueApi({ attributeId, languageId, attributeValueIds: [val.id] }).catch(
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
  const { data } = await removeAttributeValueApi({
    attributeId,
    languageId,
    attributeValueIds: selectedList.value,
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

const createAttributeValueRef = useTemplateRef('createAttributeValueRef')

const handleAddAttributeValue = async () => {
  createAttributeValueRef.value?.openDialog(attributeId, languageId)
}

// 处理排序变更
const handleSortChange = async (row: AttributeValueResultDo & CommonField, value: number | undefined) => {
  // 如果值为 undefined，不执行更新操作
  if (value === undefined) {
    return
  }

  try {
    const { data } = await updateAttributeValueSortApi({
      attributeValueId: row.id,
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

const handleUpdateAttributeValueStatus = async (row: AttributeValueResultDo & CommonField, value: boolean) => {
  loading.init = true
  const { data } = await updateAttributeValueStatusApi({
    attributeValueId: row.id,
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
      <div>属性值列表</div>
      <div class="flex items-center">
        <EBtn type="danger" :loading="loading.init" @click="handleMultiDelete">
          {{ $t('common.delete') }}
        </EBtn>
        <EBtn type="primary" @click="handleAddAttributeValue">
          {{ $t('common.add') }}
        </EBtn>
      </div>
    </div>
    <div v-if="currentData.attributeValueResultDos" class="w-full mt-3 pt-0">
      <ElTable
        :loading="loading.init"
        :data="currentData.attributeValueResultDos"
        row-key="id"
        tooltip-effect="dark"
        default-expand-all
        highlight-current-row
        border
        @selection-change="selectedAttributeValueItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn :label="$t('attribute.defaultAttributeValue')">
          <template #default="scope">
            <span>{{ scope.row.attributeValueDetailVo?.defaultAttributeValueContent || '' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('attribute.attributeValue')">
          <template #default="scope">
            <div v-if="!editingStates[scope.row.id]">
              {{ scope.row.attributeValueDetailVo?.attributeValueContent || '' }}
            </div>
            <div v-else>
              <ElInput
                v-model="editingContent[scope.row.id]"
                :placeholder="$t('attribute.placeholder.attributeValue')"
                clearable
                @blur="editAttributeValueContent(scope.row)"
                @keyup.enter="editAttributeValueContent(scope.row)"
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
              @change="handleUpdateAttributeValueStatus(scope.row, Boolean($event))"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
          <template #default="scope">
            <span class="mr-5">
              <EBtn size="small" @click="handleClickUpdateAttributeValueContent(scope.row)">
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
    <CreateAttributeValueDialog ref="createAttributeValueRef" />
  </div>
</template>

```
