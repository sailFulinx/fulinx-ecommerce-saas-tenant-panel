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
  productFileType: 3,
  fileIds: [],
  deletedFileIds: [],
  languageId: usePreferenceStore().preference?.language.id,
})

const imageUploadRef = ref()

const fileDataList = ref<(FileData & CommonField)[] >([])

watch(
  () => form,
  val => {
    if (val && val.id) {
      formData.value = JSON.parse(JSON.stringify(form))
      fileDataList.value = []
      if (formData.value.productTechnologyFiles && formData.value.productTechnologyFiles.length > 0) {
        formData.value.productTechnologyFiles.map(item => {
          const fileData = item.fileVo
          fileDataList.value.push({
            ...fileData,
          })
        })
        imageUploadRef.value.setFileData(fileDataList.value)
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
  if (fileDataList.value[index].id) {
    productImageData.value.deletedFileIds.push(fileDataList.value[index].id)
  }
  fileDataList.value.splice(index, 1)
}

const handleSave = async () => {
  loading.init = true
  const images = imageUploadRef.value.getFileData()
  fileDataList.value = images.fileDataList
  if (fileDataList.value.length > 0) {
    productImageData.value.fileIds = fileDataList.value.map(item => {
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
          {{ $t('product.technology') }}
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
      <UploadMultiPdf ref="imageUploadRef" @remove-file="handleRemoveImage" />
    </div>
  </ElCard>
</template>
