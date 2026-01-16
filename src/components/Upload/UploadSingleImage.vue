<script lang="ts" setup>
// import type { UploadProps } from 'element-plus'

const props = defineProps({
  imageData: {
    type: Object as () => FileData & CommonField,
  },
})
const emit = defineEmits(['getData'])

useUploadFile({
  maxCount: 10,
  uploadPath: `${useTenantStore().defaultStoreId}/images`,
  onSuccessCallback: (fileData: FileData) => {
    console.log(fileData)
    emit('getData', { fileData })
  },
})

// const loading = ref(false)

const imageUrl = ref('')

const fileData = ref<FileData & CommonField>({
  id: '',
  bucketName: '',
  etag: '',
  s3Key: '',
  isPublic: true,
  originalFileName: '',
  fileName: '',
  fileContentType: '',
  fileExtensionName: '',
  path: '',
  fileUrl: '',
  sha256: '',
  isDelete: 0,
  remark: '',
  recordVersion: 0,
  recordCreateName: '',
  recordUpdateName: '',
  recordCreateTime: '',
  recordUpdateTime: '',
})

watch(
  () => props.imageData,
  val => {
    if (val) {
      if (val.fileUrl) {
        const image = val.fileUrl
        imageUrl.value = image
      } else {
        imageUrl.value = ''
      }
      fileData.value = { ...val }
    }
  },
  { immediate: true, deep: true },
)

const handleDelete = () => {
  fileData.value = {
    id: '',
    bucketName: '',
    etag: '',
    s3Key: '',
    isPublic: true,
    originalFileName: '',
    fileName: '',
    fileContentType: '',
    fileExtensionName: '',
    path: '',
    fileUrl: '',
    sha256: '',
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
  }
  imageUrl.value = ''
  emit('getData', { fileData: fileData.value })
}

const setFileData = (data: (FileData & CommonField)[]) => {
  if (data.length > 0) {
    fileData.value = data[0]
    imageUrl.value = data[0].fileUrl
  }
}

const setSelectionFileData = (data: (FileData & CommonField)[]) => {
  if (data.length > 0) {
    fileData.value = data[0]
    imageUrl.value = data[0].fileUrl
    emit('getData', { fileData: fileData.value })
  }
}

const getFileData = () => {
  return {
    fileData: fileData.value,
  }
}

const handleFileUploaded = (data: FileData) => {
  fileData.value = { ...data }
  imageUrl.value = data.fileUrl
  emit('getData', { fileData: fileData.value })
}

defineExpose({
  getFileData,
  setFileData,
})
</script>

<template>
  <FloatingUpload v-if="!imageUrl" :show-upload-button="true" @file-uploaded="handleFileUploaded" @selection-confirmed="setSelectionFileData" />
  <div v-else class="w-41 h-auto border border-dashed border-solid-1 border-gray-300 rounded flex flex-col items-center justify-center relative group">
    <img class="w-full rounded object-cover p-2" :src="imageUrl">
    <div class="absolute inset-0 bg-black bg-opacity-40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <Icon :size="4" icon="ep:delete" class="cursor-pointer" color="white" @click.stop="handleDelete" />
    </div>
  </div>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 1200px;
  height: 100px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
</style>
