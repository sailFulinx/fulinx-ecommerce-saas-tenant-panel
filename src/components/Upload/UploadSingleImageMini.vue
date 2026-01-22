<script lang="ts" setup>
// import type { UploadProps } from 'element-plus'

const props = defineProps({
  imageData: {
    type: Object as () => FileData & CommonField,
  },
  attributeValueIndex: {
    type: Number,
    default: 0,
  },
  attributeIndex: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits(['getData'])

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
  fileSize: '',
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
    fileSize: '',
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
  emit('getData', { attributeIndex: props.attributeIndex, attributeValueIndex: props.attributeValueIndex, fileData: fileData.value })
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
    console.log(data[0])
    imageUrl.value = data[0].fileUrl
    emit('getData', { attributeIndex: props.attributeIndex, attributeValueIndex: props.attributeValueIndex, fileData: fileData.value })
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
  emit('getData', { attributeIndex: props.attributeIndex, attributeValueIndex: props.attributeValueIndex, fileData: fileData.value })
}

defineExpose({
  getFileData,
  setFileData,
})
</script>

<template>
  <div>
    <FloatingUploadMini
      v-if="!imageUrl"
      :show-upload-button="true"
      :max-count="1"
      :max-size="5"
      :multiple="false"
      upload-path="images"
      :accept-file-type="['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']"
      @file-uploaded="handleFileUploaded"
      @selection-confirmed="setSelectionFileData"
    />
    <div
      v-else
      class="w-10 min-h-10 h-auto border border-dashed border-solid-1 border-gray-300 rounded flex flex-col items-center justify-center relative group"
    >
      <ElImage v-if="imageUrl" :src="imageUrl" lazy fit="cover" class="w-full h-full min-h-10 rounded object-cover p-1">
        <template #placeholder>
          <div class="flex items-center justify-center h-full min-h-10">
            <div class="flex flex-col items-center">
              <Icon icon="ep:loading" class="animate-spin" />
              <span class="mt-2 text-xs text-gray-500">加载中...</span>
            </div>
          </div>
        </template>
      </ElImage>
      <div
        v-if="imageUrl"
        class="absolute inset-0 bg-black bg-opacity-40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <Icon :size="4" icon="ep:delete" class="cursor-pointer" color="white" @click.stop="handleDelete" />
      </div>
    </div>
  </div>
</template>
