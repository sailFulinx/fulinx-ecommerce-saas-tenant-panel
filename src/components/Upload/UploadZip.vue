<script lang="ts" setup>
import { uploadFileZipApi } from '@/api/file'
import { useLocale } from '@/hooks/useLocale'
import { ElMessage, type UploadProps } from 'element-plus'

const emit = defineEmits('getFilePath')

const { t: $t } = useLocale()
const loading = ref(false)

const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // console.log(uploadFile)
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  // 判断是否为zip文件
  if (!rawFile.name.endsWith('.zip') || rawFile.type !== 'application/zip') {
    ElMessage.error('上传的不是zip文件!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5000) {
    ElMessage.error('文件大小不能超过5000MB!')
    return false
  }
  return true
}

const handleUpload = async ({ file }) => {
  loading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('uploadPath', 'import')
  const { data } = await uploadFileZipApi(formData).catch(err => {
    loading.value = false
    throw err
  })
  ElMessage.success($t('imp.uploadSuccess'))
  loading.value = false
  emit('getFilePath', data)
  return data
}
</script>

<template>
  <ElUpload
    :loading="loading"
    action
    accept=".zip"
    :http-request="handleUpload"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    style="width: 100%"
  >
    <ElButton type="default" style="width: 100%">
      上传图片压缩文件
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
