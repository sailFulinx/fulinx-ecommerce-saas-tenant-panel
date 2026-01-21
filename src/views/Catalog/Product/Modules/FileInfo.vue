<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'

const { productData, languageId, productDetail } = defineProps<{
  productData: ShowProduct & CommonField
  languageId: string
  productDetail: ProductAdminLocalizedViewDo
}>()

const emit = defineEmits(['resetFormData'])

const productImageData = ref<UpdateProductFileParams>({
  productId: productData.id,
  languageId,
  productFileRequestDos: [],
  productFileDeletedIds: [],
})

const imageUploadRef = ref()

const videoUploadRef = ref()

const imagesData = ref<(FileData & CommonField)[]>([])

const videoData = ref<(FileData & CommonField)[]>([])

watch(
  () => productData,
  async val => {
    if (val && val.id) {
      await nextTick()
      imagesData.value = []
      videoData.value = []
      if (productDetail && productDetail.productFileRelationListResultDos.length > 0) {
        productDetail.productFileRelationListResultDos.forEach(item => {
          const fileData = item.fileVo
          if (
            fileData.fileContentType === 'image/png'
            || fileData.fileContentType === 'image/jpeg'
            || fileData.fileContentType === 'image/gif'
            || fileData.fileContentType === 'image/svg+xml'
          ) {
            imagesData.value.push({
              ...fileData,
            })
          }
          if (fileData.fileContentType === 'video/mp4') {
            videoData.value.push({
              ...fileData,
            })
          }
        })
        imageUploadRef.value.setFileData(imagesData.value)
        videoUploadRef.value.setFileData(videoData.value)
      }
    }
  },
  { deep: true, immediate: true },
)

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  list: false,
})

const handleRemoveImage = (index: number) => {
  if (!imagesData.value || imagesData.value.length === 0) {
    return
  }
  if (imagesData.value[index].id) {
    const fileId = imagesData.value[index].id
    // 在productDetail.productFileRelationListResultDos中找到fileId
    productDetail.productFileRelationListResultDos.filter(item => {
      if (item.fileId === fileId) {
        productImageData.value.productFileDeletedIds.push(item.id)
      }
    })
  }
  imagesData.value.splice(index, 1)
}

const handleSave = async () => {
  loading.init = true
  const images = imageUploadRef.value.getFileData()
  const video = videoUploadRef.value.getFileData()
  // 如果video.fileData.id不存在，则把videosData中的id添加到productImageData.value.productFileDeletedIds中
  if (!video.fileData.id && videoData.value && videoData.value.length > 0) {
    const video = videoData.value[0]
    productDetail.productFileRelationListResultDos.filter(item => {
      if (item.fileId === video.id) {
        productImageData.value.productFileDeletedIds.push(item.id)
      }
    })
  }
  const files = [...images.fileDataList, video.fileData]
  if (files.length > 0) {
    files.forEach((item, index) => {
      if (item.id) {
        productImageData.value.productFileRequestDos?.push({
          languageId,
          productFileType: 1,
          fileId: item.id,
          isDefault: index === 0,
          sort: index + 1,
        })
      }
    })
  }
  const { data } = await updateProductFileApi(productImageData.value).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  emit('resetFormData', data)
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="text-base font-bold">
          {{ $t('product.file') }}
        </div>
        <div class="flex items-center justify-end">
          <EBtn type="primary" plain @click="handleSave">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </template>
    <div class="w-full mt-5">
      <UploadImage ref="imageUploadRef" @remove-file="handleRemoveImage" />
    </div>
    <div class="w-full mt-5">
      <UploadVideo ref="videoUploadRef" />
    </div>
  </ElCard>
</template>
