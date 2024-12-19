<script lang="ts" setup>
import { uploadFileApi } from '@/api/file'
import { createImportApi } from '@/api/imp'
import { useLocale } from '@/hooks/useLocale'
import { ElMessage, type UploadProps } from 'element-plus'

const props = defineProps({
  importTypeValue: {
    type: Number,
    default: 0,
  },
})

const { t: $t } = useLocale()
const loading = ref(false)

const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // console.log(uploadFile)
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    ElMessage.error($t('import.rules.errorType'))
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error($t('import.rules.errorSize'))
    return false
  }
  return true
}

const fileData = ref<any>({})

const handleUpload = async ({ file }) => {
  loading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('uploadPath', 'import')
  const { data } = await uploadFileApi(formData).catch(err => {
    loading.value = false
    throw err
  })
  fileData.value = { ...data }
  // 插入到import数据库
  const payload = {
    fileId: data.id,
    importType: props.importTypeValue,
  }
  await createImportApi(payload).catch(err => {
    loading.value = false
    throw err
  })
  ElMessage.success($t('import.uploadSuccess'))
  loading.value = false
}
</script>

<template>
  <ElUpload
    :loading="loading"
    action
    accept=".xls,.xlsx"
    :http-request="handleUpload"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    style="width: 100%"
  >
    <ElButton type="primary" style="width: 100%">
      {{ $t('common.import') }}
    </ElButton>
  </ElUpload>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
}
</style>
