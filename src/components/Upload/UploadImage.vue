<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus'
import FloatingUpload from './FloatingUpload.vue' // 导入新组件

const emit = defineEmits(['removeFile', 'fileUploaded'])

// 使用上传图片的 composable
const {
  fileDataList,
  getFileData,
  setFileData, // 保留，因为可能需要在外部使用
} = useUploadFile()

const dragging = ref(false)

// 存储每张图片的预加载状态
const imageLoadingStatus = ref<Record<string, boolean>>({})

const handleRemove = (index: number) => {
  fileDataList.value.splice(index, 1)
  emit('removeFile', index)
}

const handleChangeSort = () => {
  fileDataList.value.forEach((item, index) => {
    item.sort = index + 1
  })
}

// 预加载图片函数
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // 标记该图片已完成预加载
      imageLoadingStatus.value[src] = false
      resolve()
    }
    img.onerror = () => {
      imageLoadingStatus.value[src] = false
      reject()
    }
    // 开始预加载
    imageLoadingStatus.value[src] = true
    img.src = src
  })
}

const handleChangePreview = async (fileUrl: string) => {
  // 预加载图片
  await preloadImage(fileUrl)
}

const handleFileUploaded = (fileData: FileData) => {
  fileDataList.value.push(fileData)
}

defineExpose({ getFileData, setFileData })
</script>

<template>
  <div>
    <FloatingUpload :show-upload-button="true" :multiple="true" :max-count="10" :max-size="5" upload-path="images" :accept-file-type="['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']" @file-uploaded="handleFileUploaded" @selection-confirmed="setFileData" />

    <VueDraggable
      v-if="fileDataList && fileDataList.length > 0"
      v-model="fileDataList"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8  gap-4"
      item-key="id"
      @start="dragging = true"
      @end="handleChangeSort"
    >
      <div v-for="(item, index) in fileDataList" :key="index" class="flex flex-col items-center">
        <!-- 图片卡片 -->
        <div class="w-full border border-gray-200 rounded flex flex-col h-60 items-center justify-between mb-2">
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
          <div v-if="item.fileUrl" class="w-41 p-2 my-auto">
            <div class="flex items-center justify-center">
              <ElImage
                v-if="item.fileUrl"
                :src="item.fileUrl"
                :preview-src-list="[item.fileUrl]"
                :initial-index="index"
                fit="cover"
                class="w-full h-full object-cover"
                @preview="handleChangePreview(item.fileUrl)"
              >
                <template #placeholder>
                  <div class="flex items-center justify-center h-full">
                    <div class="flex flex-col items-center">
                      <Icon icon="ep:loading" class="animate-spin" />
                      <span class="mt-2 text-xs text-gray-500">加载中...</span>
                    </div>
                  </div>
                </template>
                <template #error>
                  <div class="flex items-center justify-center h-full">
                    <Icon icon="ep:picture" class="text-3xl text-gray-400" />
                  </div>
                </template>
              </ElImage>
            </div>
          </div>
        </div>
      </div>
    </VueDraggable>
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
