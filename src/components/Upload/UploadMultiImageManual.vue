<script lang="ts" setup>
import { uploadFileApi } from '@/api/file'
import { ElMessage, ElUpload, type UploadFile, type UploadProps } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const emit = defineEmits(['removeFile'])

const limit = 500
const limitSize = 50

const loading = ref(false)
const beforeUploadFileDataList = ref<UploadFile[]>([])
const fileDataList = ref<FileData[]>([])
const uploadProgress = ref<{ [key: string]: number }>({})

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

const handleExceed = (_files: File[]) => {
  ElMessage.error(`您最多只能上传${limit}张图片!`)
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  const isJPGOrPNG = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png'
  const isLt50M = rawFile.size / 1024 / 1024 < limitSize

  if (!isJPGOrPNG) {
    ElMessage.error('Picture must be JPG or PNG format!')
    return false
  }

  if (!isLt50M) {
    ElMessage.error('Picture size cannot exceed 50MB!')
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
  console.log('beforeUploadFileDataList', beforeUploadFileDataList.value)
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

const handleChange = (uploadFile: UploadFile, uploadFiles: UploadFile[]) => {
  if (uploadFiles.length === 0) {
    ElMessage.error('请选择图片!')
    return
  }
  uploadFiles.map(item => {
    // 创建本地图片URL
    const URL = window.URL || window.webkitURL
    item.url = URL.createObjectURL(item.raw)
    console.log(item.url)
    handleUpload({ file: item.raw })
  })
}

const handleSuccess = (response: any, uploadFile: UploadFile) => {
  beforeUploadFileDataList.value = beforeUploadFileDataList.value.filter(item => item.uid !== uploadFile.uid)
  delete uploadProgress.value[uploadFile.uid]
}

const handleProgress = (event: { percent: number }, uploadFile: UploadFile) => {
  uploadProgress.value[uploadFile.uid] = event.percent
}

const getFileData = () => {
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
    <ElUpload
      :loading="loading"
      class="w-full flex items-center justify-center bg-white"
      :multiple="true"
      :drag="true"
      action=""
      accept=".jpg,.jpeg,.png"
      :file-list="beforeUploadFileDataList"
      :http-request="handleUpload"
      :auto-upload="false"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-progress="handleProgress"
      :limit="limit"
    >
      <template #default>
        <div class="w-full">
          <div class="w-full flex justify-center mb-5">
            <Icon :size="12" icon="ep:upload-filled" color="#999" />
          </div>
          <div class="w-full text-sm text-gray-500 flex justify-center text-center">
            <span>
              拖动或选择文件，只允许上传jpg, png, gif格式图片，最大不能超过{{ limitSize }}M, 最多不允许超过{{ limit }}张
            </span>
          </div>
        </div>
      </template>
    </ElUpload>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" item-key="id">
      <div v-for="(item, index) in beforeUploadFileDataList" :key="index" class="flex flex-col items-center">
        <!-- 图片卡片 -->
        <div class="w-full border border-gray-300 rounded flex flex-col items-center justify-between mb-2">
          <!-- 顶部按钮 -->
          <div class="w-full h-6 flex justify-between border-b border-gray-300 bg-gray-50">
            <EBtn text @click.stop="handleRemove(index)">
              <Icon icon="ant-design:holder-outlined" />
            </EBtn>
            <EBtn text type="danger" @click.stop="handleRemove(index)">
              <Icon icon="ep:delete" />
            </EBtn>
          </div>

          <!-- 中间图片 -->
          <div v-if="item.url" class="w-full h-42 flex items-center justify-center p-2">
            <div>
              <img class="w-full max-h-42 rounded object-cover py-2" :src="`${sourceUrl}${item.url}`">
            </div>
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
