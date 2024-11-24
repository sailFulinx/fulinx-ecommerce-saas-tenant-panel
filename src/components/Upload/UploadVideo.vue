<script lang="ts" setup>
import { uploadFileApi } from '@/api/file'
import { ElMessage, type UploadProps } from 'element-plus'

const props = defineProps({
  videoData: {
    type: Object as () => FileData,
  },
})

const emit = defineEmits(['getData'])

const loading = ref(false)

const videoUrl = ref('')

const fileData = ref<FileData>({
  id: 0,
  originalFileName: '',
  fileName: '',
  fileContentType: '',
  fileExtensionName: '',
  path: '',
  fileUrl: '',
  sha256: '',
})

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

watch(
  () => props.videoData,
  val => {
    if (val) {
      if (val.fileUrl) {
        videoUrl.value = sourceUrl + val.fileUrl
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
  formData.append('uploadPath', 'uploads/videos')
  const { data } = await uploadFileApi(formData).catch(err => {
    loading.value = false
    throw err
  })
  fileData.value = { ...data }
  loading.value = false
}

const handleDelete = () => {
  fileData.value = {
    id: 0,
    originalFileName: '',
    fileName: '',
    fileContentType: '',
    fileExtensionName: '',
    path: '',
    fileUrl: '',
    sha256: '',
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
    :loading="loading"
    class="video-uploader"
    action=""
    accept=".mp4"
    :http-request="handleUpload"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
  >
    <div class="w-48 h-48 border border-solid-1 border-gray-300 rounded p-2 flex items-center justify-center">
      <div v-if="videoUrl" class="flex flex-col items-center justify-center relative">
        <video class="w-full max-h-48 rounded object-cover mb-2" :src="videoUrl" controls />
        <EBtn @click.stop="handleDelete">
          <Icon icon="ep:delete" />
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
