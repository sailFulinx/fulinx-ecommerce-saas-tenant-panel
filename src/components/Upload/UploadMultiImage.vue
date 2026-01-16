<script lang="ts" setup>
import type { UploadFile, UploadProps } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'
import { uploadFileApi } from '@/api/file'

const emit = defineEmits(['removeFile'])

const loading = ref(false)
const beforeUploadFileDataList = ref<UploadFile[]>([])
const fileDataList = ref<FileData[]>([])
const uploadProgress = ref<{ [key: string]: number }>({})
const dragging = ref(false)
const isHovered = ref(false) // 控制是否显示悬浮上传控件
let hoverTimeout: number | null = null // 存储显示延时定时器
let leaveTimeout: number | null = null // 存储隐藏延时定时器
const hoverContainerRef = ref<HTMLElement>()

const showHoverUpload = () => {
  // 清除可能存在的隐藏定时器
  if (leaveTimeout) {
    clearTimeout(leaveTimeout)
    leaveTimeout = null
  }
  // 设置一个延时，避免鼠标快速划过时触发悬浮上传
  hoverTimeout = window.setTimeout(() => {
    isHovered.value = true
  }, 300) // 延迟300毫秒显示悬浮上传控件
}

const handleHoverEnter = () => {
  // 鼠标进入悬浮控件时，清除可能存在的离开定时器
  if (leaveTimeout) {
    clearTimeout(leaveTimeout)
    leaveTimeout = null
  }
}

const handleHoverLeave = () => {
  // 鼠标离开悬浮控件时，设置一个短暂延时后再隐藏，防止意外触发
  leaveTimeout = window.setTimeout(() => {
    isHovered.value = false
    if (leaveTimeout) {
      leaveTimeout = null
    }
  }, 200) // 延迟200毫秒隐藏悬浮上传控件
}

const clearHoverTimeout = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
}

const hideHoverUpload = () => {
  // 清除之前的显示定时器
  clearHoverTimeout()
  // 如果当前已经显示悬浮控件，设置一个延时来隐藏
  if (isHovered.value) {
    leaveTimeout = window.setTimeout(() => {
      isHovered.value = false
      if (leaveTimeout) {
        leaveTimeout = null
      }
    }, 100) // 延迟100毫秒隐藏悬浮上传控件
  }
}

const handleExceed = (_files: File[]) => {
  ElMessage.error('您最多只能上传10张图片!')
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  const isJPGOrPNG
    = rawFile.type === 'image/jpeg'
      || rawFile.type === 'image/png'
      || rawFile.type === 'image/gif'
      || rawFile.type === 'image/svg+xml'
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
  // 生成当前日期格式为 YYYYMMDD 的字符串
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const datePath = `${year}${month}${day}`

  // 构造新的上传路径
  formData.append('folder', `images/${datePath}`)
  formData.append('isPublic', 'true')
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
  fileDataList.value.forEach((item, index) => {
    item.sort = index + 1
  })
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
              <Icon :size="4" icon="ep:delete" />
            </EBtn>
          </div>

          <!-- 中间图片 -->
          <div v-if="item.fileUrl" class="w-full h-42 flex items-center justify-center p-2">
            <div>
              <img class="w-full max-h-42 rounded object-cover py-2" :src="`${item.fileUrl}`">
            </div>
          </div>
        </div>
      </div>
    </VueDraggable>

    <!-- 悬浮上传控件，固定在视窗中 -->
    <div
      v-show="isHovered"
      ref="hoverContainerRef"
      class="absolute z-50 flex items-center justify-center bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-48 h-16 mx-4"
      :style="{ top: '-70px', left: '-16px' }"
      @mouseenter="handleHoverEnter"
      @mouseleave="handleHoverLeave"
    >
      <div class="flex items-center w-full h-full">
        <ElUpload
          v-loading="loading"
          class="w-16 h-16 flex justify-center"
          :multiple="true"
          action=""
          accept=".jpg,.jpeg,.png,.gif,.svg"
          :file-list="beforeUploadFileDataList"
          :http-request="handleUpload"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :on-progress="handleProgress"
          :limit="10"
        >
          <div
            class="flex flex-col items-center justify-center w-full h-full transition-colors duration-300 hover:text-blue-500 group"
          >
            <div class="mb-2 flex items-center justify-center transition-colors duration-300 hover:text-blue-500">
              <Icon :size="4" icon="ep:upload" color="#999" />
            </div>
            <div
              class="fs-12px leading-3 text-gray-500 flex justify-center text-center w-full transition-colors duration-300 group-hover:text-[#71A0FF]"
            >
              <span>本地上传</span>
            </div>
          </div>
        </ElUpload>
        <div
          class="w-16 h-16 ml-4 text-center flex items-center justify-center"
        >
          <div
            class="flex flex-col items-center justify-center w-full h-full transition-colors duration-300 hover:text-blue-500 group"
          >
            <div class="mb-2 flex items-center justify-center transition-colors duration-300 hover:text-blue-500">
              <Icon :size="4" icon="ep:upload" color="#999" />
            </div>
            <div
              class="fs-12px leading-3 text-gray-500 flex justify-center text-center w-full transition-colors duration-300 group-hover:text-[#71A0FF]"
            >
              <span>图库选择</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传按钮 -->
    <div
      class="w-41 h-41 border border-dashed hover:border-[#71A0FF] bg-white flex items-center justify-center group relative"
      @mouseenter="showHoverUpload"
      @mouseleave="hideHoverUpload"
    >
      <div class="flex flex-col items-center justify-center w-full h-full p-2">
        <div class="mb-2 flex items-center justify-center transition-colors duration-300 group-hover:text-[#71A0FF]">
          <Icon :size="8" icon="ep:upload" color="#999" />
        </div>
        <div
          class="text-sm text-gray-500 flex justify-center text-center w-full transition-colors duration-300 group-hover:text-[#71A0FF]"
        >
          <span>只允许上传jpg, png, gif格式图片，最大不能超过50M</span>
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

/* 添加自定义样式来处理图标颜色 */
.group:hover :deep(i),
.group:hover :deep(svg) {
  color: #409eff !important;
}

:deep(i),
:deep(svg) {
  transition: color 0.3s ease;
}
</style>
