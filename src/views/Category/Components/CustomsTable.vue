<script setup lang="ts">
import { convertCustomTypeValue } from '@/utils/general'

const props = defineProps<{
  customList: any[]
  categoryDetailId: string
}>()

const { t: $t } = useLocale()

const customDialogRef = ref()

const customs = ref<CustomDataType[]>([])

watch(
  () => props.customList,
  val => {
    if (val) {
      customs.value = val
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

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

// Remove a custom entry by index
const handleRemoveCustom = (index: number) => {
  customs.value.splice(index, 1)
  $catch(async () => {
    const payload = {
      categoryDetailId: props.categoryDetailId,
      customs: JSON.stringify(customs.value),
    }
    await categoryCustomEditApi(payload).catch((error: any) => {
      throw error
    })

    ElMessage.success($t('success.edit'))
  })
}

// Edit a custom entry by index
const handleEditCustom = async (index: number) => {
  customVisible.value = true
  if (!customs.value || !customs.value[index]) {
    return
  }
  currentCustomData.value = { ...customs.value[index] } // Use spread to avoid direct reference modification
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
  // log(val)
  if (!customs.value) {
    return
  }
  const index = customs.value.findIndex(item => item.id === val.id)

  if (index === -1) {
    // Add new custom data
    val.id = customs.value.length + 1
    customs.value.push({ ...val })
  } else {
    // Update existing custom data
    customs.value[index] = { ...val }
  }
  // initCustomData()

  if (!props.categoryDetailId) {
    return
  }
  const payload = {
    categoryDetailId: props.categoryDetailId,
    customs: JSON.stringify(customs.value),
  }
  await categoryCustomEditApi(payload).catch((error: any) => {
    throw error
  })
  customVisible.value = false
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <div>
    <div class="mb-5">
      <EBtn type="primary" plain @click="handleAddCustom">
        {{ $t('common.add') }}{{ $t('common.custom') }}
      </EBtn>
    </div>
    <ElTable :data="customList">
      <ElTableColumn :label="$t('comps.custom.fieldName')" prop="customFieldName" />
      <ElTableColumn :label="$t('common.title')" prop="customTitle" />
      <ElTableColumn :label="$t('common.type')">
        <template #default="scope">
          <span>{{ convertCustomTypeValue(scope.row.customType) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn :label="$t('common.content')" prop="customContent">
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
                <ElImage class="w-32 sm:w-40" :src="`${imageItem.fileUrl}`" fit="contain" />
              </div>
            </div>
          </div>
          <div v-if="scope.row.customType === 'video'">
            <div class="flex justify-start mb-5 space-x-0 sm:space-x-2 overflow-x-auto">
              <video class="w-32 sm:w-40" :src="`${scope.row.customContent.fileUrl}`" fit="contain" />
            </div>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作">
        <template #default="scope">
          <EBtn @click="handleEditCustom(scope.$index)">
            {{ $t('common.edit') }}
          </EBtn>
          <EBtn @click="handleRemoveCustom(scope.$index)">
            {{ $t('common.delete') }}
          </EBtn>
        </template>
      </ElTableColumn>
    </ElTable>
    <ElDialog ref="customDialogRef" v-model="customVisible">
      <Customs ref="customRef" @get-custom-data="getCustomData" @cancel-edit-custom-data="cancelEditCustomData" />
    </ElDialog>
  </div>
</template>
