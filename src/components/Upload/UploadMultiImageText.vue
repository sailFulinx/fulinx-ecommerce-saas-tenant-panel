<script lang="ts" setup>
import { uploadFileApi } from '@/api/file'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElIcon, ElImage, ElMessage, ElUpload, type UploadFile, type UploadFiles, type UploadProps } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const emit = defineEmits(['removeFile'])

const dragging = ref(false)

const loading = ref(false)
const beforeUploadFileDataList = ref<UploadFile[]>([])
const fileDataList = ref<MultiImageTextItem[]>([])

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

const imageTextDialogRef = ref()

const handleExceed = () => {
  ElMessage.error('您最多只能上传10张图片!')
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  const isJPGOrPNG = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png' || rawFile.type === 'image/gif'
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
  // console.log(index)
  // fileDataList.value.splice(index, 1)
  // console.log(fileDataList.value)
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
    if (!fileDataList.value) {
      return
    }
    fileDataList.value.push({
      id: fileDataList.value.length + 1,
      image: { ...res },
      imageLink: {
        linkUrl: '',
        linkValue: '',
        linkLabel: '',
        linkType: '',
        children: [],
      },
      alt: res.originalFileName.substring(0, res.originalFileName.lastIndexOf('.')),
      title: res.originalFileName.substring(0, res.originalFileName.lastIndexOf('.')),
      subTitle: '',
      textList: [],
      buttonText: '',
      buttonLink: {
        linkUrl: '',
        linkValue: '',
        linkLabel: '',
        linkType: '',
        children: [],
      },
      sort: fileDataList.value.length + 1,
    })
  }
}

const handleSuccess = (response: any, uploadFile: UploadFile, _uploadFiles: UploadFiles) => {
  beforeUploadFileDataList.value = beforeUploadFileDataList.value.filter(item => item.uid !== uploadFile.uid)
}

const handleEdit = async (index: number) => {
  imageTextDialogRef.value.handleVisible(fileDataList.value[index])
}

const handleSaveFileData = (val: MultiImageTextItem) => {
  fileDataList.value.map(item => {
    if (item.id === val.id) {
      Object.assign(item, val)
      return item
    }
  })
}

const handleChangeSort = () => {
  fileDataList.value.forEach((item, index) => {
    item.sort = index + 1
  })
}

const getFileData = () => {
  return { fileDataList: JSON.parse(JSON.stringify(fileDataList.value)) }
}

const setFileData = (fileList: MultiImageTextItem[]) => {
  if (fileList && fileList.length === 0) {
    return
  }
  fileDataList.value = fileList
}

defineExpose({ getFileData, setFileData })
</script>

<template>
  <div>
    <VueDraggable v-model="fileDataList" item-key="sort" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" @start="dragging = true" @end="handleChangeSort">
      <div v-for="(item, index) in fileDataList" :key="index" class="flex flex-col items-center">
        <!-- 图片卡片 -->
        <div class="w-full border border-gray-300 rounded flex flex-col items-center justify-between mb-2">
          <!-- 顶部按钮 -->
          <div class="w-full h-12 flex justify-between items-center py-4 border-b border-gray-300 bg-gray-50">
            <EBtn text @click.stop="handleRemove(index)">
              <Icon name="ant-design:holder-outlined" :size="5" />
            </EBtn>
            <div class="flex justify-end">
              <ElIcon class="mr-2 cursor-pointer" color="#f56c6c" @click="handleRemove(index)">
                <Icon name="ep:delete" :size="5" />
              </ElIcon>
            </div>
          </div>
          <!-- 中间图片 -->
          <div v-if="item.image.fileUrl" class="w-full h-42 flex items-center justify-center p-2">
            <div>
              <img class="w-full max-h-42 rounded object-cover py-2" :src="`${sourceUrl}${item.image.fileUrl}`">
            </div>
          </div>
          <div class="w-full px-2 mb-2">
            <div class="mb-3">
              {{ item.title }}
            </div>
            <EBtn plain type="primary" class="w-full" @click="handleEdit(index)">
              <Icon name="ep:edit-pen" :size="3" />
            </EBtn>
          </div>
        </div>
      </div>
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
    <ImageTextDialog ref="imageTextDialogRef" @save="handleSaveFileData" />
  </div>
</template>

<style lang="css" scoped>
:deep(.el-upload--picture-card) {
  background-color: #FFF !important;
  border: 0 none !important;
}
</style>
