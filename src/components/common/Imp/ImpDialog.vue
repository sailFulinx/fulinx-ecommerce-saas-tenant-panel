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
    </div>
    <UploadExcel class="mr-4" :import-type-value="importTypeValue" />
  </ElDrawer>
</template>
@/data/imp
