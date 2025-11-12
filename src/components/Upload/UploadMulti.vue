<script lang="ts" setup>
import type { UploadFile, UploadFiles, UploadProps } from 'element-plus'
import { ElIcon, ElMessage, ElUpload } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'
import { uploadFileApi } from '@/api/file'

const emit = defineEmits(['removeFile'])

const dragging = ref(false)

const loading = ref(false)
const beforeUploadFileDataList = ref<UploadFile[]>([])
const fileDataList = ref<MultiFileItem[]>([])

const TextLinkDialogRef = ref()

const handleExceed = () => {
  ElMessage.error('您最多只能上传10个图片或视频!')
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  const isValid
    = rawFile.type === 'image/jpeg'
      || rawFile.type === 'image/png'
      || rawFile.type === 'image/gif'
      || rawFile.type === 'video/mp4'
  const isLt50M = rawFile.size / 1024 / 1024 < 50

  if (!isValid) {
    ElMessage.error('必须为图片或视频!')
    return false
  }
  if (!isLt50M) {
    ElMessage.error('文件大小不能超过50MB!')
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
    ElMessage.error('文件上传失败!')
    console.error('Error uploading file:', error)
  } finally {
    loading.value = false
  }
}

const handleUpload = async ({ file }: { file: any }) => {
  beforeUploadFileDataList.value.push(file)
  const formData = new FormData()
  formData.append('file', file)

  // 判断文件类型，设置文件夹路径
  const isVideo = file.type === 'video/mp4' // 根据实际支持的视频格式扩展
  const folder = isVideo ? 'videos' : 'images'
  const datePath = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
  formData.append('folder', `${folder}/${datePath}`)

  const res = await processUpload(formData)
  if (res) {
    if (!fileDataList.value) {
      return
    }
    fileDataList.value.push({
      id: fileDataList.value.length + 1,
      file: { ...res },
      fileLink: {
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
  TextLinkDialogRef.value.handleVisible(fileDataList.value[index])
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

const setFileData = (fileList: MultiFileItem[]) => {
  fileDataList.value = []
  if (fileList && fileList.length === 0) {
    return
  }
  fileDataList.value = fileList
}

defineExpose({ getFileData, setFileData })
</script>

<template>
  <div>
    <VueDraggable
      v-model="fileDataList"
      item-key="sort"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      @start="dragging = true"
      @end="handleChangeSort"
    >
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
          <div v-if="item.file.fileUrl" class="w-full h-42 flex items-center justify-center p-2">
            <div v-if="item.file.fileContentType === 'image/jpeg' || item.file.fileContentType === 'image/png' || item.file.fileContentType === 'image/gif'">
              <img class="w-full max-h-42 rounded object-cover py-2" :src="`${item.file.fileUrl}`">
            </div>
            <div v-else>
              <video class="w-full max-h-42 rounded object-cover py-2" :src="`${item.file.fileUrl}`" controls />
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
        v-loading="loading"
        class="w-full border border-gray-300 rounded p-2 flex items-center justify-center bg-white"
        :multiple="true"
        action=""
        accept=".jpg,.jpeg,.png,.mp4"
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
            <span>只允许上传jpg, png, gif格式图片或mp4格式视频，最大不能超过50M</span>
          </div>
        </div>
      </ElUpload>
    </VueDraggable>
    <TextLinkDialog ref="TextLinkDialogRef" @save="handleSaveFileData" />
  </div>
</template>

<style lang="css" scoped>
:deep(.el-upload--picture-card) {
  background-color: #fff !important;
  border: 0 none !important;
}
</style>
