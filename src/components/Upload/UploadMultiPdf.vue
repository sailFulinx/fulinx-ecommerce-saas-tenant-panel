<script lang="ts" setup>
import { uploadFileApi } from '@/api/file'
import { ElMessage, ElUpload, type UploadFile, type UploadProps } from 'element-plus'

const emit = defineEmits(['removeFile'])

const loading = ref(false)
const beforeUploadFileDataList = ref<UploadFile[]>([])
const fileDataList = ref<FileData[]>([])
const uploadProgress = ref<{ [key: string]: number }>({})

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

const handleExceed = (_files: File[]) => {
  ElMessage.error('您最多只能上传10个PDF文件!')
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  const isPdf = rawFile.type === 'application/pdf'
  const isLt50M = rawFile.size / 1024 / 1024 < 50

  if (!isPdf) {
    ElMessage.error('File must be PDF format!')
    return false
  }
  if (!isLt50M) {
    ElMessage.error('File size cannot exceed 50MB!')
    return false
  }
  return true
}

const handleRemove = (index: number) => {
  fileDataList.value.splice(index, 1)
  emit('removeFile', index)
}

const processUpload = async (formData: FormData) => {
  loading.value = true
  try {
    const { data } = await uploadFileApi(formData)
    return data
  } catch (error) {
    ElMessage.error('Error uploading file!')
    console.error('Error uploading file:', error)
  } finally {
    loading.value = false
  }
}

const handleUpload = async ({ file }: { file: any }) => {
  beforeUploadFileDataList.value.push(file)
  const formData = new FormData()
  formData.append('file', file)
  const res = await processUpload(formData)
  if (res) {
    if (!res.sort) {
      res.sort = fileDataList.value.length + 1
    }
    fileDataList.value.push(res)
  }
}

const handleSuccess = (response: any, uploadFile: UploadFile) => {
  beforeUploadFileDataList.value = beforeUploadFileDataList.value.filter(item => item.uid !== uploadFile.uid)
  delete uploadProgress.value[uploadFile.uid]
}

const handleProgress = (event: { percent: number }, uploadFile: UploadFile) => {
  uploadProgress.value[uploadFile.uid] = event.percent
}

const getFileData = () => {
  fileDataList.value = fileDataList.value.map((item, index) => {
    return {
      ...item,
      isDefault: index === 0,
      fileId: item.id,
      sort: index + 1,
    }
  })
  return { fileDataList: JSON.parse(JSON.stringify(fileDataList.value)) }
}

const setFileData = (fileList: FileData[]) => {
  if (fileList && fileList.length === 0) {
    fileDataList.value = []
    return
  }
  Object.assign(fileDataList.value, fileList)
}

defineExpose({ getFileData, setFileData })
</script>

<template>
  <div>
    <!-- 上传按钮 -->
    <ElUpload
      :loading="loading"
      class="w-full border border-gray-300 rounded flex items-center justify-center bg-white mb-5 border-b border-gray-300 pb-5"
      :multiple="true"
      action=""
      accept=".pdf"
      :file-list="beforeUploadFileDataList"
      list-type="picture-card"
      :http-request="handleUpload"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-progress="handleProgress"
      :limit="10"
    >
      <div>
        <div class="w-full flex justify-center mb-5">
          <Icon :size="8" icon="ep:upload" color="#999" />
        </div>
        <div class="w-full text-sm text-gray-500 flex justify-center text-center">
          <span>只允许上传pdf格式文件，最大不能超过50M</span>
        </div>
      </div>
    </ElUpload>
    <div v-for="(item, index) in fileDataList" :key="index" class="flex flex-col items-center">
      <!-- 图片卡片 -->
      <div class="w-full border border-gray-300 rounded flex flex-col items-center justify-between mb-2">
        <!-- 顶部按钮 -->
        <!-- 中间图片 -->
        <div v-if="item.fileUrl" class="w-full flex flex-col p-2">
          <div class="flex justify-between items-center">
            <a class="w-full max-h-42 rounded object-cover py-2 text-blue-500 underline" :href="`${sourceUrl}${item.fileUrl}`" target="_blank">
              {{ item.originalFileName }}
            </a>
            <EBtn text type="danger" @click.stop="handleRemove(index)">
              <Icon icon="ep:delete" />
            </EBtn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
:deep(.el-upload--picture-card) {
  background-color: #fff !important;
  border: 0 none !important;
}
</style>
