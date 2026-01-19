<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import { convertCustomTypeValue } from '@/utils/general'

const props = defineProps({
  customList: Array as any,
  articleDetailId: String,
})

const emit = defineEmits<{
  refreshData: []
}>()

const { t: $t } = useLocale()

const customDialogRef = ref()

const customs = ref<CustomDataType[]>([])

const sourceUrl = useFileRootUrl()

/**
 * custom
 */

// Custom component visibility
const customVisible = ref(false)

// Current custom data
const currentCustomData = ref<CustomDataType>({
  id: 0,
  customFieldName: '',
  customType: 'text',
  customTitle: '',
  customContent: '',
})

// Custom component ref
const customRef = ref()

// Initialize custom data
const initCustomData = () => {
  currentCustomData.value = {
    id: 0,
    customFieldName: '',
    customType: 'text',
    customTitle: '',
    customContent: '',
  }
  if (customRef.value && customVisible.value) {
    customRef.value.setFormData(currentCustomData.value)
  }
}

// Add a custom entry
const handleAddCustom = async () => {
  customVisible.value = true
  initCustomData()
}

const updateArticleCustom = async () => {
  if (!props.articleDetailId) {
    return
  }
  const payload = {
    articleDetailId: props.articleDetailId,
    customs: JSON.stringify(customs.value),
  }
  await updateArticleCustomsApi(payload).catch((error: any) => {
    throw error
  })
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 自动修复重复ID的方法
const fixDuplicateIds = () => {
  if (!customs.value || customs.value.length <= 1) {
    return false
  }

  const ids = customs.value.map(item => item.id)
  const uniqueIds = [...new Set(ids)]

  // 如果存在重复ID
  if (uniqueIds.length !== ids.length) {
    // 修复重复ID
    let maxId = Math.max(...ids)
    const usedIds = new Set<number>()

    for (let i = 0; i < customs.value.length; i++) {
      if (usedIds.has(customs.value[i].id)) {
        // 发现重复ID，分配新的唯一ID
        maxId++
        customs.value[i].id = maxId
      } else {
        usedIds.add(customs.value[i].id)
      }
    }
    return true
  }
  return false
}

// Remove a custom entry by index
const handleRemoveCustom = async (index: number) => {
  customs.value.splice(index, 1)
  await updateArticleCustom()
}

// Move custom up
const moveUp = async (index: number) => {
  if (index === 0) {
    return
  }
  const temp = customs.value[index]
  customs.value[index] = customs.value[index - 1]
  customs.value[index - 1] = temp
  await updateArticleCustom()
}

// Move custom down
const moveDown = async (index: number) => {
  if (index === customs.value.length - 1) {
    return
  }
  const temp = customs.value[index]
  customs.value[index] = customs.value[index + 1]
  customs.value[index + 1] = temp
  await updateArticleCustom()
}

// Edit a custom entry by index
const handleEditCustom = async (id: number) => {
  customVisible.value = true
  if (!customs.value) {
    return
  }
  const targetCustom = customs.value.find(item => item.id === id)
  if (!targetCustom) {
    return
  }
  currentCustomData.value = { ...targetCustom } // Use spread to avoid direct reference modification
  await nextTick()
  if (customRef.value && customVisible.value) {
    customRef.value.setFormData(currentCustomData.value)
  }
}

// Cancel editing custom data
const cancelEditCustomData = () => {
  customVisible.value = false
  initCustomData()
}

// Receive child component data and Save or update custom data
const getCustomData = async (val: CustomDataType) => {
  if (!customs.value) {
    return
  }
  const index = customs.value.findIndex(item => item.id === val.id)

  if (index === -1) {
    // Add new custom data
    // 修复id重复问题：使用唯一id生成方式
    const maxId = customs.value.length > 0 ? Math.max(...customs.value.map(item => item.id)) : 0
    val.id = maxId + 1
    customs.value.push({ ...val })
  } else {
    // Update existing custom data
    customs.value[index] = { ...val }
  }
  initCustomData()

  await updateArticleCustom()
  customVisible.value = false
}

// 获取现有的字段名列表（排除当前编辑的字段）
const getExistingFieldNames = () => {
  if (!customs.value) {
    return []
  }
  // 过滤掉当前正在编辑的字段（ID为0表示添加新字段）
  return customs.value
    .filter(item => item.id !== currentCustomData.value.id)
    .map(item => item.customFieldName)
}

watch(
  () => props.customList,
  val => {
    if (val) {
      customs.value = val
      // 检查并自动修复重复ID
      nextTick(async () => {
        if (fixDuplicateIds()) {
          // 如果修复了重复ID，则更新数据
          await updateArticleCustom()
        }
      })
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <div class="w-full">
    <div class="mb-5">
      <EBtn type="primary" plain @click="handleAddCustom">
        {{ $t('common.add') }}{{ $t('common.custom') }}
      </EBtn>
    </div>
    <ElTable :data="customList" class="w-full">
      <ElTableColumn :label="$t('comps.custom.fieldName')" prop="customFieldName" />
      <ElTableColumn :label="$t('common.title')" prop="customTitle" />
      <ElTableColumn :label="$t('common.type')">
        <template #default="scope">
          <span>{{ convertCustomTypeValue(scope.row.customType) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn :label="$t('common.content')" prop="customContent" width="300">
        <template #default="scope">
          <div v-if="scope.row.customType === 'text'">
            {{ scope.row.customContent }}
          </div>
          <div v-if="scope.row.customType === 'editor'">
            <div v-html="scope.row.customContent" />
          </div>
          <div v-if="scope.row.customType === 'image'">
            <div v-for="imageItem in scope.row.customContent" :key="imageItem">
              <div class="flex justify-start mb-5 space-x-0 sm:space-x-2 overflow-x-auto">
                <ElImage class="w-32 sm:w-40" :src="`${sourceUrl}${imageItem.fileUrl}`" fit="contain" />
              </div>
            </div>
          </div>
          <div v-if="scope.row.customType === 'imageAdvanced'">
            <div v-for="imageItem in scope.row.customContent.content.imageTextList" :key="imageItem">
              <div class="flex justify-start mb-5 space-x-0 sm:space-x-2 overflow-x-auto">
                <ElImage class="w-32 sm:w-40" :src="`${sourceUrl}${imageItem.image.fileUrl}`" fit="contain" />
              </div>
            </div>
          </div>
          <div v-if="scope.row.customType === 'video'">
            <div class="flex justify-start mb-5 space-x-0 sm:space-x-2 overflow-x-auto">
              <video class="w-32 sm:w-40" :src="`${sourceUrl}${scope.row.customContent.fileUrl}`" fit="contain" />
            </div>
          </div>
          <div v-if="scope.row.customType === 'pdf'">
            <div v-for="pdfItem in scope.row.customContent" :key="pdfItem">
              <div class="flex justify-start mb-5 space-x-0 sm:space-x-2 overflow-x-auto">
                <a class="w-32 sm:w-40" :href="`${sourceUrl}${pdfItem.fileUrl}`" fit="contain">{{ pdfItem.originalFileName }}</a>
              </div>
            </div>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn :label="$t('common.sort')" width="120">
        <template #default="scope">
          <div class="flex items-center">
            <EBtn
              text
              size="small"
              :disabled="scope.$index === 0"
              @click="moveUp(scope.$index)"
            >
              <Icon icon="ep:arrow-up" />
            </EBtn>
            <EBtn
              text
              size="small"
              :disabled="scope.$index === customs.length - 1"
              @click="moveDown(scope.$index)"
            >
              <Icon icon="ep:arrow-down" />
            </EBtn>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="150">
        <template #default="scope">
          <EBtn @click="handleEditCustom(scope.row.id)">
            {{ $t('common.edit') }}
          </EBtn>
          <EBtn @click="handleRemoveCustom(scope.$index)">
            {{ $t('common.delete') }}
          </EBtn>
        </template>
      </ElTableColumn>
    </ElTable>
    <ElDialog ref="customDialogRef" v-model="customVisible" width="50%">
      <Customs
        ref="customRef"
        :existing-field-names="getExistingFieldNames()"
        :current-id="currentCustomData.id"
        @get-custom-data="getCustomData"
        @cancel-edit-custom-data="cancelEditCustomData"
      />
    </ElDialog>
  </div>
</template>
