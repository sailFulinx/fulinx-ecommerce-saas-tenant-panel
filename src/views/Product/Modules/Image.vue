<script setup lang="ts">
import { updateProductImageApi } from '@/api/product'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElMessage, ElSwitch, ElTableColumn } from 'element-plus'

const { form } = defineProps<{ form: ShowProduct & CommonField }>()

const emit = defineEmits(['resetFormData'])

const id = useRoute().params.id as string

const formData = ref<ShowProduct & CommonField>(form)

const productImageData = ref<UpdateProductImageParams>({
  productId: id,
  productFileType: 1,
  fileIds: [],
  deletedFileIds: [],
  languageId: usePreferenceStore().preference?.language.id,
})

const imageUploadRef = ref()

const imagesData = ref<(FileData & CommonField)[] >([])

watch(
  () => form,
  val => {
    if (val && val.id) {
      formData.value = JSON.parse(JSON.stringify(form))
      imagesData.value = []
      if (formData.value.productImages && formData.value.productImages.length > 0) {
        formData.value.productImages.map(item => {
          const fileData = item.fileVo
          imagesData.value.push({
            ...fileData,
          })
        })
        imageUploadRef.value.setFileData(imagesData.value)
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
  if (imagesData.value[index].id) {
    productImageData.value.deletedFileIds.push(imagesData.value[index].id)
  }
  imagesData.value.splice(index, 1)
}

const handleSave = async () => {
  loading.init = true
  const images = imageUploadRef.value.getFileData()
  imagesData.value = images.fileDataList
  if (imagesData.value.length > 0) {
    productImageData.value.fileIds = imagesData.value.map(item => {
      return item.id
    })
  }
  const { data } = await updateProductImageApi(productImageData.value).catch(error => {
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
          {{ $t('product.price') }}
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
      <UploadMultiImage ref="imageUploadRef" @remove-file="handleRemoveImage" />
    </div>
  </ElCard>
</template>
