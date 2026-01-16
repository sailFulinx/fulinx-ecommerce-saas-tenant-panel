<script setup lang="ts">
import { customTypes } from '@/data/general'
import { useLocale } from '@/hooks/useLocale'

const emit = defineEmits(['getCustomData', 'cancelEditCustomData'])

const { t: $t } = useLocale()

const customEditorRef = ref()

const uploadRef = ref()

const formRef = ref()

const form = reactive<CustomDataType>({
  id: 0,
  customFieldName: '',
  customType: 'text',
  customTitle: '',
  customContent: '',
})

const rules = reactive({
  customFieldName: [{ required: true, message: $t('comps.custom.placeholder.fieldName'), trigger: 'blur' }],
  customTitle: [{ required: true, message: $t('placeholder.inputTitle'), trigger: 'blur' }],
})

const getRemovedFiles = (val: number) => {
  const file = form.customContent.fileList?.[val]
  if (file && file.id) {
    form.customContent.deletedFileIds?.push(file.id)
    form.customContent.fileList?.splice(val, 1)
  }
}

const setFormData = async (data: CustomDataType) => {
  form.id = data.id
  form.customFieldName = data.customFieldName ? data.customFieldName : ''
  form.customTitle = data.customTitle
  form.customContent = data.customContent
  form.customType = data.customType
  if (form.customType === 'editor') {
    await nextTick()
    customEditorRef.value.setEditorContent(data.customContent)
  }

  if (form.customType === 'image') {
    await nextTick()
    uploadRef.value.setFileData(data.customContent)
  }

  if (form.customType === 'video') {
    await nextTick()
    uploadRef.value.setFileData(data.customContent)
  }
}

const getFormData = () => {
  return form
}

const saveFormData = async () => {
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  try {
    if (form.customType === 'editor') {
      await nextTick()
      form.customContent = customEditorRef?.value?.getEditorContent()
    }
    if (form.customType === 'image') {
      await nextTick()
      const fileRes = uploadRef.value.getFileData()
      if (!fileRes || !fileRes.fileDataList || fileRes.fileDataList.length === 0) {
        ElMessage.error($t('placeholder.selectImage'))
        return false
      }
      form.customContent = fileRes.fileDataList
    }
    if (form.customType === 'video') {
      await nextTick()
      const fileRes = uploadRef.value.getFileData()
      if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
        ElMessage.error($t('placeholder.selectVideo'))
        return false
      }
      form.customContent = fileRes.fileData
    }
    const data = { ...form }
    emit('getCustomData', data)
  } catch (error) {
    console.log(error)
  }
}

const cancelEdit = () => {
  emit('cancelEditCustomData')
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="140px" class="w-full mb-5">
      <ElFormItem :label="$t('comps.custom.fieldName')" prop="customFieldName" style="margin-bottom:20px;">
        <ElInput v-model="form.customFieldName" />
      </ElFormItem>
      <ElFormItem :label="$t('comps.custom.title')" prop="customTitle" style="margin-bottom:20px;">
        <ElInput v-model="form.customTitle" />
      </ElFormItem>
      <ElFormItem :label="$t('comps.custom.customType')" style="margin-bottom:20px;">
        <ElSelect v-model="form.customType" :placeholder="$t('comps.custom.placeholder.customType')">
          <ElOption v-for="item in customTypes" :key="item.id" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem v-if="form.customType === 'text'" :label="$t('comps.custom.textContent')" class="mb-5" style="margin-bottom:20px;">
        <ElInput v-model="form.customContent" :rows="4" type="textarea" />
      </ElFormItem>
      <ElFormItem v-if="form.customType === 'editor'" :label="$t('comps.custom.richTextContent')" class="mb-5" style="margin-bottom:20px;">
        <Editor ref="customEditorRef" v-model="form.customContent" />
      </ElFormItem>
      <ElFormItem v-if="form.customType === 'image'" :label="$t('comps.custom.imageContent')" class="mb-5" style="margin-bottom:20px;">
        <UploadImage ref="uploadRef" @remove-file="getRemovedFiles" />
      </ElFormItem>
      <ElFormItem v-if="form.customType === 'video'" :label="$t('comps.custom.videoContent')" class="mb-5" style="margin-bottom:20px;">
        <UploadVideo ref="uploadRef" :video-data="form.customContent" />
      </ElFormItem>
    </ElForm>
    <div class="flex justify-end">
      <EBtn @click="cancelEdit">
        <Icon name="ep:close" class="mr-1" />
        {{ $t('common.cancel') }}
      </EBtn>
      <EBtn type="primary" @click="saveFormData">
        <Icon name="ant-design:save-outlined" class="mr-1" />
        {{ $t('common.save') }}
      </EBtn>
    </div>
  </div>
</template>
