<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  showUploadButton?: boolean // 是否显示上传按钮
  maxCount?: number
  maxSize?: number
  multiple?: boolean
  uploadPath?: string
  acceptFileType?: string[] // 允许上传的文件类型，例如 ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']
}

interface Emits {
  (e: 'fileUploaded', fileData: FileData): void
  (e: 'selectionConfirmed', fileDataList: FileData[]): void
}

const props = withDefaults(defineProps<Props>(), {
  showUploadButton: true,
  maxCount: 1,
  maxSize: 5,
  multiple: false,
  uploadPath: 'images',
  acceptFileType: () => ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
})
const emit = defineEmits<Emits>()

// 创建一个计算属性，将MIME类型转换为文件扩展名格式
const acceptFileTypeComputed = computed(() => {
  const mimeToExtMap: Record<string, string> = {
    'image/jpeg': '.jpg,.jpeg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'application/pdf': '.pdf',
    'image/webp': '.webp',
    'image/bmp': '.bmp',
    'image/tiff': '.tiff,.tif',
    'video/mp4': '.mp4',
  }

  return props.acceptFileType.map(mimeType => mimeToExtMap[mimeType] || '').join(',')
})

// 使用上传图片的 composable
const {
  loading,
  beforeUploadFileDataList,
  beforeUpload,
  handleExceed,
  handleUpload,
  handleSuccess,
  handleProgress,
} = useUploadFile({
  maxCount: props.maxCount,
  maxSize: props.maxSize,
  acceptTypes: props.acceptFileType,
  uploadPath: `${useTenantStore().defaultStoreId}/images`,
  onSuccessCallback: (fileData: FileData) => {
    emit('fileUploaded', fileData)
  },
})

// 根据acceptFileType生成上传提示文本
const getUploadHintText = computed(() => {
  const mimeToExtMap: Record<string, string> = {
    'image/jpeg': 'jpg/jpeg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
    'image/webp': 'webp',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff/tif',
    'video/mp4': 'mp4',
  }

  const extensions = props.acceptFileType.map(mimeType => mimeToExtMap[mimeType] || mimeType.split('/')[1] || mimeType)
  const extensionsText = extensions.join(', ')

  return `只允许上传${extensionsText}格式文件，最大不能超过${props.maxSize}M`
})

const fileListRef = ref()
const isHovered = ref(false)
let hoverTimeout: number | null = null
let leaveTimeout: number | null = null

const showHoverUpload = () => {
  if (leaveTimeout) {
    clearTimeout(leaveTimeout)
    leaveTimeout = null
  }
  hoverTimeout = window.setTimeout(() => {
    isHovered.value = true
  }, 300)
}

const handleHoverEnter = () => {
  if (leaveTimeout) {
    clearTimeout(leaveTimeout)
    leaveTimeout = null
  }
}

const handleHoverLeave = () => {
  leaveTimeout = window.setTimeout(() => {
    isHovered.value = false
  }, 200)
}

const clearHoverTimeout = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
}

const hideHoverUpload = () => {
  clearHoverTimeout()
  if (isHovered.value) {
    leaveTimeout = window.setTimeout(() => {
      isHovered.value = false
    }, 100)
  }
}

const handleOpenFileListDialog = () => {
  fileListRef.value?.open()
}

const setSelectionFileData = (fileDataList: FileData[]) => {
  emit('selectionConfirmed', fileDataList)
}
</script>

<template>
  <div class="relative">
    <div v-if="loading" v-loading="loading" class="w-41 h-41 border border-dashed border-gray-200" />
    <div v-else>
      <!-- 上传按钮 -->
      <div
        v-if="showUploadButton"
        class="w-41 h-41 border border-dashed hover:border-[#71A0FF] bg-white flex items-center justify-center group relative mb-4"
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
            <span>{{ getUploadHintText }}</span>
          </div>
        </div>
      </div>

      <!-- 悬浮上传控件 -->
      <div
        v-show="isHovered"
        class="absolute z-50 flex items-center justify-center bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-41 h-16 mx-4"
        :style="{ top: '-70px', left: '-16px' }"
        @mouseenter="handleHoverEnter"
        @mouseleave="handleHoverLeave"
      >
        <div class="flex items-center w-full h-full">
          <ElUpload
            v-loading="loading"
            class="w-16 h-16 flex justify-center"
            :multiple="multiple"
            action=""
            :accept="acceptFileTypeComputed"
            :file-list="beforeUploadFileDataList"
            :http-request="handleUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :on-progress="handleProgress"
            :limit="maxCount"
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
            @mousedown.stop="handleOpenFileListDialog"
          >
            <div
              class="flex flex-col items-center justify-center w-full h-full transition-colors duration-300 hover:text-blue-500 group cursor-pointer"
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

        <FileList ref="fileListRef" @selection-confirmed="setSelectionFileData" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.relative {
  position: relative;
}
</style>
