<script lang="ts" setup>
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { uploadFileApi } from '@/api/file'

const props = defineProps({
  imageData: {
    type: Object as () => FileData,
  },
})
const emit = defineEmits(['getData'])

const loading = ref(false)

const imageUrl = ref('')

const fileData = ref<FileData>({
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
})

watch(
  () => props.imageData,
  val => {
    if (val) {
      if (val.fileUrl) {
        const image = val.fileUrl
        imageUrl.value = image
      } else {
        imageUrl.value = ''
      }
      fileData.value = { ...val }
    }
  },
  { immediate: true, deep: true },
)

const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif' && rawFile.type !== 'image/svg+xml') {
    ElMessage.error('图片必须是PNG或JPG或GIF或SVG格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 50) {
    ElMessage.error('Picture size can not exceed 50MB!')
    return false
  }
  return true
}

const handleUpload = async ({ file }: { file: File }) => {
  loading.value = true
  const formData = new FormData()
  formData.append('file', file)

  // 生成当前日期格式为 YYYYMMDD 的字符串
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const datePath = `${year}${month}${day}`

  // 构造新的上传路径
  formData.append('folder', `images/${datePath}`)
  formData.append('isPublic', 'true')

  const { data } = await uploadFileApi(formData).catch(err => {
    loading.value = false
    throw err
  })
  fileData.value = { ...data }
  emit('getData', { fileData: fileData.value })
  loading.value = false
}

const handleDelete = () => {
  fileData.value = {
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
  }
  imageUrl.value = ''
  emit('getData', { fileData: fileData.value })
}

const setFileData = (data: FileData) => {
  fileData.value = data
  imageUrl.value = data.fileUrl
}

const getFileData = () => {
  return {
    fileData: fileData.value,
  }
}

defineExpose({
  getFileData,
  setFileData,
})
</script>

<template>
  <ElUpload
    v-loading="loading"
    class="avatar-uploader"
    action=""
    accept=".jpg,.jpeg,.png,.gif,.svg"
    :http-request="handleUpload"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
  >
    <div class="w-48 h-48 border border-solid-1 border-gray-300 rounded p-2 flex items-center justify-center">
      <div v-if="imageUrl" class="flex flex-col items-center justify-center relative">
        <img class="w-full max-h-38 rounded object-cover mb-2" :src="imageUrl">
        <EBtn text @click.stop="handleDelete">
          <Icon :size="4" icon="ep:delete" />
        </EBtn>
      </div>
      <div v-else>
        <div class="w-full flex justify-center mb-5">
          <Icon :size="8" icon="ep:upload" color="#999" />
        </div>
        <div class="w-full text-sm text-gray-500 flex justify-center text-center">
          <span>只允许上传jpg, png, gif, svg格式图片，最大不能超过50M</span>
        </div>
      </div>
    </div>
  </ElUpload>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 1200px;
  height: 100px;
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
</style>
