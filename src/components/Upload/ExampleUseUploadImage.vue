<script setup lang="ts">
import { ElMessage, ElUpload } from 'element-plus'
import { useUploadImage } from '@/composables/useUploadImage'
import FloatingUpload from './FloatingUpload.vue'

const {
  fileDataList,
  loading,
  beforeUploadFileDataList,
  beforeUpload,
  handleExceed,
  handleUpload,
  handleSuccess,
  handleProgress,
  removeFile,
  reorderFiles,
  getFileData,
  setFileData,
  clearAllFiles,
  getCurrentFileCount,
  maxCount,
} = useUploadImage({
  maxCount: 5,
  maxSize: 10,
  uploadPath: 'test-images'
})

// 演示如何获取数据
const handleGetData = () => {
  const data = getFileData()
  console.log('上传的文件数据:', data)
  ElMessage.success(`获取到 ${data.fileDataList.length} 个文件`)
}

// 演示如何清空所有文件
const handleClearAll = () => {
  clearAllFiles()
  ElMessage.info('已清空所有文件')
}

// 演示如何设置文件数据
const handleSetData = () => {
  const mockData: FileData[] = [
    {
      id: 'mock-1',
      bucketName: 'test-bucket',
      s3Key: 'test-key-1',
      fileUrl: 'https://via.placeholder.com/150',
      originalFileName: 'example.jpg',
      fileName: 'example.jpg',
      fileContentType: 'image/jpeg',
      fileExtensionName: '.jpg',
      path: '/test/path',
      isPublic: true,
      etag: 'mock-etag',
      sha256: 'mock-sha256',
      sort: 1,
    }
  ]
  setFileData(mockData)
  ElMessage.success('已设置模拟数据')
}

const handleFileUploaded = (fileData: FileData) => {
  ElMessage.success(`文件 ${fileData.originalFileName} 上传成功！`)
  console.log('上传的文件:', fileData)
}
</script>

<template>
  <div class="p-4 relative">
    <h2 class="text-xl font-bold mb-4">useUploadImage 示例</h2>
    
    <FloatingUpload :show-upload-button="true" @file-uploaded="handleFileUploaded" />
    
    <div class="flex space-x-2 mb-4">
      <ElButton @click="handleGetData">获取数据</ElButton>
      <ElButton @click="handleClearAll">清空所有</ElButton>
      <ElButton @click="handleSetData">设置模拟数据</ElButton>
    </div>
    
    <div class="text-sm text-gray-600 mb-4">
      当前文件数: {{ getCurrentFileCount() }} / {{ maxCount }}
    </div>
    
    <div class="grid grid-cols-3 gap-4">
      <div 
        v-for="(file, index) in fileDataList" 
        :key="index" 
        class="border rounded p-2 flex flex-col items-center"
      >
        <div class="w-full">
          <img 
            :src="file.fileUrl" 
            :alt="file.originalFileName"
            class="w-full h-32 object-contain rounded"
          >
        </div>
        <div class="mt-2 text-sm truncate w-full text-center">{{ file.originalFileName }}</div>
        <ElButton 
          size="small" 
          type="danger" 
          @click="removeFile(index)"
          class="mt-2"
        >
          删除
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-demo {
  margin-bottom: 20px;
}
</style>