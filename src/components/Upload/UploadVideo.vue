<script lang="ts" setup>
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { uploadFileApi } from '@/api/file'

const props = defineProps({
  videoData: {
    type: Object as () => FileData,
  },
})

const emit = defineEmits(['getData'])

const loading = ref(false)

const videoUrl = ref('')

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
  isDelete: 0,
  remark: '',
  recordVersion: 0,
  recordCreateName: '',
  recordUpdateName: '',
  recordCreateTime: '',
  recordUpdateTime: '',
})

watch(
  () => props.videoData,
  val => {
    if (val) {
      if (val.fileUrl) {
        videoUrl.value = val.fileUrl
      } else {
        videoUrl.value = ''
      }
      fileData.value = { ...val }
    }
  },
  { immediate: true, deep: true },
)

const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  videoUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'video/mp4') {
    ElMessage.error('视频必须是MP4格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1000) {
    ElMessage.error('视频大小不能超过1000MB!')
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
  formData.append('folder', `videos/${datePath}`)
  formData.append('isPublic', 'true')
  const { data } = await uploadFileApi(formData).catch(err => {
    loading.value = false
    throw err
  })
  fileData.value = { ...data }
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
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
  }
  videoUrl.value = ''
  emit('getData', { fileData: fileData.value })
}

const setFileData = (data: FileData) => {
  fileData.value = data
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
    action=""
    accept=".mp4"
    :http-request="handleUpload"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    class="flex items-center justify-center bg-white"
  >
    <div class="w-42 h-42 border border-solid-1 border-gray-300 rounded p-2 flex items-center justify-center">
      <div v-if="videoUrl" class="flex flex-col items-center justify-center relative">
        <video class="w-full max-h-41 rounded object-cover mb-2" :src="videoUrl" controls />
        <EBtn text @click.stop="handleDelete">
          <Icon :size="4" icon="ep:delete" />
        </EBtn>
      </div>
      <div v-else>
        <div class="w-full flex justify-center mb-5">
          <Icon :size="8" icon="ep:upload" color="#999" />
        </div>
        <div class="w-full text-sm text-gray-500 flex justify-center text-center">
          <span>只允许上传mp4格式视频，最大不能超过1000M</span>
        </div>
      </div>
    </div>
  </ElUpload>
</template>
