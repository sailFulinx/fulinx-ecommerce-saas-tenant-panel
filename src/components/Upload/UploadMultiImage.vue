<script lang="ts" setup>
import { uploadFileApi } from '@/api/file'
import { ElMessage, ElUpload, type UploadFile, type UploadProps } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const emit = defineEmits(['removeFile'])

const loading = ref(false)
const beforeUploadFileDataList = ref<UploadFile[]>([])
const fileDataList = ref<FileData[]>([])
const uploadProgress = ref<{ [key: string]: number }>({})
const dragging = ref(false)

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

const handleExceed = (_files: File[]) => {
  ElMessage.error('您最多只能上传10张图片!')
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  const isJPGOrPNG = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png'
  const isLt50M = rawFile.size / 1024 / 1024 < 50

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

const handleChangeSort = () => {
  fileDataList.value.map((item, index) => {
    item.sort = index + 1
  })
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
    <VueDraggable
      v-model="fileDataList"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      item-key="id"
      @start="dragging = true"
      @end="handleChangeSort"
    >
      <div v-for="(item, index) in fileDataList" :key="index" class="flex flex-col items-center">
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
          <div v-if="item.fileUrl" class="w-full h-42 flex items-center justify-center p-2">
            <div>
              <img class="w-full max-h-42 rounded object-cover py-2" :src="`${sourceUrl}${item.fileUrl}`">
            </div>
          </div>
        </div>
      </div>

      <!-- 上传按钮 -->
      <ElUpload
        :loading="loading"
        class="w-full border border-gray-300 rounded p-2 flex items-center justify-center bg-white"
        :multiple="true"
        action=""
        accept=".jpg,.jpeg,.png"
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
            <span>只允许上传jpg, png, gif格式图片，最大不能超过50M</span>
          </div>
        </div>
      </ElUpload>
    </VueDraggable>
  </div>
</template>

<style lang="css" scoped>
:deep(.el-upload--picture-card) {
  background-color: #FFF !important;
  border: 0 none !important;
}
</style>
