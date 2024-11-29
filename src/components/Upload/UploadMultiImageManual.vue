<script lang="ts" setup>
import { uploadFileApi } from '@/api/file'
import { ElEmpty, ElMessage, ElScrollbar, ElUpload, type UploadFile, type UploadProps } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const emit = defineEmits(['getList'])

const activeTab = ref('upload')

const limit = 500
const limitSize = 50

const loading = ref(false)
const beforeUploadFileDataList = ref<UploadFile[]>([])
const uploadProgress = ref<{ [key: string]: number }>({})

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
  beforeUploadFileDataList.value.splice(index, 1)
}

const processUpload = async (formData: FormData, fileData: UploadFile) => {
  try {
    const { data } = await uploadFileApi(formData)
    // 文件上传成功后，从 beforeUploadFileDataList 中移除该文件
    beforeUploadFileDataList.value = beforeUploadFileDataList.value.filter(item => item.raw !== fileData.raw)
    return data
  } catch (error) {
    ElMessage.error('Error uploading file!')
    console.error('Error uploading file:', error)
  }
}

const handleUpload = async () => {
  if (beforeUploadFileDataList.value.length === 0) {
    ElMessage.error('请选择图片!')
    return
  }
  beforeUploadFileDataList.value.forEach(async item => {
    const file = item.raw as File
    const formData = new FormData()
    formData.append('file', file)
    await processUpload(formData, item)
  })
  emit('getList')
}

const handleChange = (uploadFile: UploadFile, uploadFiles: UploadFile[]) => {
  if (uploadFiles.length === 0) {
    ElMessage.error('请选择图片!')
    return
  }
  uploadFiles.map(item => {
    // 查找当前项在 beforeUploadFileDataList 中的索引，如果存在，则不继续更新blobURL
    const index = beforeUploadFileDataList.value.findIndex(file => file.uid === item.uid)
    if (index !== -1) {
      return
    }
    try {
      // 创建本地图片 URL
      const URL = window.URL || window.webkitURL
      const file = item.raw as File // 确保 `item.raw` 是 File 类型

      // 检查文件类型是否为图片
      if (!file || !file.type.startsWith('image/')) {
        ElMessage.error('上传的文件不是图片类型!')
        throw new Error('Invalid file type')
      }

      // 创建 Blob URL
      const blobURL = URL.createObjectURL(file)
      item.url = blobURL
      beforeUploadFileDataList.value.push(item)
    } catch (error) {
      console.error('Error processing file:', error)
    }
  })
}

const handleSuccess = (response: any, uploadFile: UploadFile) => {
  beforeUploadFileDataList.value = beforeUploadFileDataList.value.filter(item => item.uid !== uploadFile.uid)
  delete uploadProgress.value[uploadFile.uid]
}

const handleProgress = (event: { percent: number }, uploadFile: UploadFile) => {
  uploadProgress.value[uploadFile.uid] = event.percent
}
</script>

<template>
  <div class="relative w-full h-full overflow-hidden">
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
      style="width:100%"
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
    <ElTabs v-model="activeTab" v-loading.fullscreen.lock="loading" class="mt-5">
      <div v-if="beforeUploadFileDataList.length > 0" class="mb-5">
        还有 {{ beforeUploadFileDataList.length }} 张待上传文件
      </div>
      <ElTabPane label="待上传列表" name="upload">
        <ElScrollbar v-if="beforeUploadFileDataList.length > 0" height="calc(100vh - 450px)" class="px-3">
          <div class="w-full mt-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4">
            <div v-for="(item, index) in beforeUploadFileDataList" :key="index" class="flex flex-col items-center">
              <div class="w-full border border-gray-300 rounded flex flex-col items-center justify-between mb-1">
                <div class="w-full h-6 flex justify-between border-b border-gray-300 bg-gray-50">
                  <div class="overflow-hidden px-3">
                    {{ item.name }}
                  </div>
                  <EBtn text type="danger" @click.stop="handleRemove(index)">
                    <Icon icon="ep:delete" />
                  </EBtn>
                </div>
                <div v-if="item.url" class="w-full flex items-center justify-center p-2">
                  <div>
                    <SImg :src="`${item.url}`" width="auto" height="100%" lazy />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ElScrollbar>
        <ElEmpty v-else description="No Upload Files" />
      </ElTabPane>
    </ElTabs>

    <!-- 固定底部按钮 -->
    <div v-if="beforeUploadFileDataList.length > 0" class="absolute bottom-0 left-0 w-full bg-white shadow-lg px-4 py-3">
      <EBtn type="danger" size="default" class="w-full" @click="handleUpload">
        <Icon icon="ep:upload-filled" class="mr-1 text-red-500" />
        确定上传
      </EBtn>
    </div>
  </div>
</template>
