<script setup lang="ts">
import { importTypes } from '@/data/imp'
import { useLocale } from '@/hooks/useLocale'

const props = defineProps({
  importType: {
    type: String,
  },
})
const { t: $t } = useLocale()
const visible = ref(false)
const importTypeValue = ref(0)

const importData = ref({
  id: 0,
  code: '',
  fileName: '',
  importTemplateUrl: '',
})

const filePath = ref('')

const getFilePath = (filePathData: string) => {
  filePath.value = filePathData
}

const handleOpen = () => {
  visible.value = true
  if (props.importType) {
    importTypes.map(item => {
      if (item.code === props.importType) {
        importData.value = item
        importTypeValue.value = item.id
      }
    })
  }
}
const handleClose = () => {
  visible.value = false
}

defineExpose({
  handleOpen,
})
</script>

<template>
  <ElDrawer v-model="visible" size="30%" direction="rtl" :title="`${$t('imp.name')}`" @close="handleClose">
    <div class="mb-10">
      <div class="mb-5">
        导入模板：
        <a :href="importData.importTemplateUrl" target="_blank" class="text-blue-500">{{ importData.fileName }}</a>
      </div>
      <div class="font-bold mb-5">
        {{ $t('imp.notice') }}
      </div>
      <div class="text-red-800 mb-5">
        {{ $t('imp.noticeDescription.one') }}
      </div>
      <div class="text-red-800 mb-5">
        {{ $t('imp.noticeDescription.two') }}
      </div>
      <div class="text-red-800 mb-5">
        {{ $t('imp.noticeDescription.three') }}
      </div>
      <div class="text-red-800 mb-5">
        {{ $t('imp.noticeDescription.four') }}
      </div>
      <div class="text-red-800 mb-5">
        5、必须先把图片上传到服务器中，再上传excel,
        图片上传到服务器中后，会返回服务器中的图片路径，在excel中填写图片路径
        <p v-if="filePath" class="mt-5 font-bold">
          图片路径：{{ filePath }}
        </p>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <UploadZip class="mr-4" @get-file-path="getFilePath" />
      <UploadExcel v-if="filePath" class="mr-4" :import-type-value="importTypeValue" />
    </div>
  </ElDrawer>
</template>
@/data/imp
