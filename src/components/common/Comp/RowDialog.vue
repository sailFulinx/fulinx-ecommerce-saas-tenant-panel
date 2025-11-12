<script setup lang="ts">
import { ElFormItem } from 'element-plus'
import { useLocale } from '@/hooks/useLocale'

const emit = defineEmits(['getRow'])
const { t: $t } = useLocale()
const rowDialogVisible = ref(false)
const uploadSingleRef = ref()

const rowFormRef = ref()

const rowFormRules = reactive({
  rowName: [{ required: true, message: $t('comps.placeholder.rowName'), trigger: 'blur' }],
  isFullScreen: [{ required: true, type: 'boolean' as const, message: $t('comps.placeholder.isFullScreen'), trigger: 'change' }],
  marginTop: [{ required: true, message: $t('comps.placeholder.marginTop'), trigger: 'change' }],
  marginBottom: [{ required: true, message: $t('comps.placeholder.marginBottom'), trigger: 'change' }],
  marginLeft: [{ required: true, message: $t('comps.placeholder.marginLeft'), trigger: 'change' }],
  marginRight: [{ required: true, message: $t('comps.placeholder.marginRight'), trigger: 'change' }],
  paddingTop: [{ required: true, message: $t('comps.placeholder.paddingTop'), trigger: 'change' }],
  paddingBottom: [{ required: true, message: $t('comps.placeholder.paddingBottom'), trigger: 'change' }],
  paddingLeft: [{ required: true, message: $t('comps.placeholder.paddingLeft'), trigger: 'change' }],
  paddingRight: [{ required: true, message: $t('comps.placeholder.paddingRight'), trigger: 'change' }],
})

const rowForm = ref<ComponentRowData>({
  id: 0,
  rowName: '',
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  isFullScreen: false,
  backgroundColor: '#FFFFFF',
  backgroundImage: {
    id: '',
    bucketName: '',
    etag: '',
    s3Key: '',
    isPublic: true,
    originalFileName: '',
    fileName: '',
    fileContentType: '',
    fileExtensionName: '',
    path: '',
    fileUrl: '',
    sha256: '',
  },
  isContentFullScreen: false,
  contents: [],
  sort: 1,
})

// 已有的行数
const rowCount = ref<number>(0)

const isEdit = ref<boolean>(false)

const openDialog = async (isEditData: boolean, rowCountData: number, rowData?: ComponentRowData) => {
  rowDialogVisible.value = true
  await nextTick()
  // 当修改列数的时候，会遇到id重复的BUG
  rowForm.value = {
    id: 0,
    rowName: '',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    isFullScreen: false,
    backgroundColor: '#FFFFFF',
    backgroundImage: {
      id: '',
      bucketName: '',
      etag: '',
      s3Key: '',
      isPublic: true,
      originalFileName: '',
      fileName: '',
      fileContentType: '',
      fileExtensionName: '',
      path: '',
      fileUrl: '',
      sha256: '',
    },
    isContentFullScreen: false,
    contents: [],
    sort: 1,
  }
  await uploadSingleRef.value.setFileData(rowForm.value.backgroundImage)
  isEdit.value = isEditData
  rowCount.value = rowCountData
  if (rowData) {
    rowForm.value = rowData
  }
}

// 会遇到复制一个组件后，再次编辑组件，尤其是在新增了行内的列后，出现问题
const handleSubmit = async () => {
  const valid = await rowFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  const fileRes = uploadSingleRef.value.getFileData()
  rowForm.value.backgroundImage = fileRes.fileData

  // 只有在添加新行时才设置新的ID，编辑时保留原ID
  if (!isEdit.value) {
    rowForm.value.id = rowCount.value + 1
    rowForm.value.sort = rowCount.value + 1
  }
  emit('getRow', rowForm.value)
  rowDialogVisible.value = false
}

defineExpose({ openDialog })
</script>

<template>
  <ElDialog v-model="rowDialogVisible">
    <template #header>
      <div class="text-sm font-bold">
        {{ $t('common.add') }}{{ $t('comps.row') }}
      </div>
    </template>
    <div class="p-5">
      <ElForm ref="rowFormRef" :model="rowForm" :rules="rowFormRules">
        <ElFormItem :label="$t('comps.rowName')" prop="rowName">
          <ElInput v-model="rowForm.rowName" :placeholder="$t('comps.placeholder.rowName')" />
        </ElFormItem>
        <ElFormItem :label="$t('comps.marginTop')" prop="marginTop">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowForm.marginTop"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.marginTop')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              {{ $t('comps.minMaxTip', [0, 40]) }}
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.marginBottom')" prop="marginBottom">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowForm.marginBottom"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.marginBottom')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              {{ $t('comps.minMaxTip', [0, 40]) }}
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.marginLeft')" prop="marginLeft">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowForm.marginLeft"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.marginLeft')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              {{ $t('comps.minMaxTip', [0, 40]) }}
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.marginRight')" prop="marginRight">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowForm.marginRight"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.marginRight')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              {{ $t('comps.minMaxTip', [0, 40]) }}
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.paddingTop')" prop="paddingTop">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowForm.paddingTop"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.paddingTop')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              {{ $t('comps.minMaxTip', [0, 40]) }}
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.paddingBottom')" prop="paddingBottom">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowForm.paddingBottom"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.paddingBottom')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              {{ $t('comps.minMaxTip', [0, 40]) }}
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.paddingLeft')" prop="paddingLeft">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowForm.paddingLeft"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.paddingLeft')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              {{ $t('comps.minMaxTip', [0, 40]) }}
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.paddingRight')" prop="paddingRight">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowForm.paddingRight"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.paddingRight')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              {{ $t('comps.minMaxTip', [0, 40]) }}
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.isFullScreen')" prop="isFullScreen">
          <ElSwitch v-model="rowForm.isFullScreen" />
        </ElFormItem>
        <ElFormItem label="背景色">
          <ElColorPicker v-model="rowForm.backgroundColor" />
        </ElFormItem>
        <ElFormItem label="背景图">
          <UploadSingleImage ref="uploadSingleRef" :image-data="rowForm.backgroundImage" />
        </ElFormItem>
        <ElFormItem :label="$t('comps.isContentFullScreen')" prop="isContentFullScreen">
          <ElSwitch v-model="rowForm.isContentFullScreen" />
        </ElFormItem>
      </ElForm>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <EBtn @click="rowDialogVisible = false">
          {{ $t('common.cancel') }}
        </EBtn>
        <EBtn type="primary" @click="handleSubmit">
          {{ $t('common.submit') }}
        </EBtn>
      </div>
    </template>
  </ElDialog>
</template>
