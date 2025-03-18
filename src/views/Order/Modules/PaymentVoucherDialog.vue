<script setup lang="ts">
const dialogVisible = ref<boolean>(false)

const fileData = ref<FileData & CommonField>()

const sourceUrl = import.meta.env.VITE_RESOURCE_URL
const open = (fileDataValue: FileData & CommonField) => {
  dialogVisible.value = true
  fileData.value = fileDataValue
}

defineExpose({
  open,
})
</script>

<template>
  <ElDialog v-model="dialogVisible" title="付款凭证" width="60%" class="min-h-screen">
    <div class="p-6 bg-white">
      <ElImage :src="`${sourceUrl}${fileData?.fileUrl}`" />
    </div>
  </ElDialog>
</template>
