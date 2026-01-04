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

// 本地状态
const inputAttributeNameVisible = ref(false)
const currentAttributeName = ref('')

// 更新名称
const _handleClickUpdateAttributeName = (attributeName: string) => {
  currentAttributeName.value = attributeName
  inputAttributeNameVisible.value = true
}

const _handleCancelUpdateAttributeName = () => {
  inputAttributeNameVisible.value = false
}

const _editAttributeName = async (attributeDetailId: string) => {
  if (!currentAttributeName.value) {
    ElMessage.warning($t('attribute.error.attributeName'))
    return
  }
  loading.init = true
  const { data } = await updateAttributeNameApi({
    attributeDetailId,
    attributeName: currentAttributeName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentAttributeName.value = ''
  await resetFormData(data)
  inputAttributeNameVisible.value = false
  ElMessage.success($t('success.edit'))
}
// 创建属性名称
const _createAttributeValueContent = async () => {
  if (!currentAttributeName.value) {
    ElMessage.warning($t('attribute.error.attributeName'))
    return
  }
  loading.init = true
  const { data } = await createAttributeNameApi({
    attributeId,
    languageId,
    attributeName: currentAttributeName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentAttributeName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

const selectedList = ref<string[]>([])

const selectedAttributeValueItem = (val: (AttributeValueResultDo & CommonField)[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}

const handleDelete = async (val: AttributeValueResultDo & CommonField) => {
  loading.init = true
  const { data } = await removeAttributeValueApi({ attributeId, languageId, attributeValueIds: [val.id] }).catch(err => {
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
</script>

<template>
  <div v-if="currentData">
    <div class="w-full flex items-center justify-between mt-0 pt-0">
      <div>属性值列表</div>
      <div class="flex items-center">
        <EBtn type="danger">
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
            <span>{{ scope.row.attributeValueDetailVo?.attributeValueContent || '' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.status')" width="120">
          <template #default="scope">
            <span>{{ convertStatus(scope.row.status) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
          <template #default="scope">
            <span class="mr-5">
              <EBtn size="small">
                <Icon icon="ep:edit" class="mr-1" />
                {{ $t('common.view') }}
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
