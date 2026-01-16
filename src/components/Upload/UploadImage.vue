<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus'
import FloatingUpload from './FloatingUpload.vue' // 导入新组件

const emit = defineEmits(['removeFile', 'fileUploaded'])

// 使用上传图片的 composable
const {
  fileDataList,
  getFileData,
  setFileData, // 保留，因为可能需要在外部使用
} = useUploadFile({ maxCount: 10, uploadPath: `${useTenantStore().defaultStoreId}/images` })

const dragging = ref(false)

const handleRemove = (index: number) => {
  fileDataList.value.splice(index, 1)
  emit('removeFile', index)
}

const handleChangeSort = () => {
  fileDataList.value.forEach((item, index) => {
    item.sort = index + 1
  })
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
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
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
                lazy
                fit="cover"
                class="w-full h-full object-cover"
              >
                <template #placeholder>
                  <div class="flex items-center justify-center h-full">
                    <div class="flex flex-col items-center">
                      <ElIcon class="is-loading text-gray-400">
                        <Refresh />
                      </ElIcon>
                      <span class="mt-2 text-xs text-gray-500">加载中...</span>
                    </div>
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
