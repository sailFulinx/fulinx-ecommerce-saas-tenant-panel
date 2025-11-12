<script setup lang="ts">
const dialogVisible = ref(false)

const { languages } = useInStore(useLanguageStore)
const { preference } = useInStore(usePreferenceStore)

const defaultPreference = $clone(preference.value)

const form = reactive<PreferenceType>(defaultPreference)

const openDialog = () => {
  dialogVisible.value = true
}

const handleSave = () => {
  preference.value = $clone(form)
  ElMessage.success('保存偏好成功')
  dialogVisible.value = false
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDrawer v-model="dialogVisible" title="偏好设置" size="30%">
    <ElForm :model="form" label-width="120px">
      <ElFormItem label="默认内容语言">
        <ElSelect v-model="form.language" value-key="id" filterable>
          <ElOption v-for="item in languages" :key="item.id" :label="item.languageName" :value="item" />
        </ElSelect>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">
          {{ $t('common.cancel') }}
        </ElButton>
        <ElButton type="primary" @click="handleSave">
          {{ $t('common.save') }}
        </ElButton>
      </div>
    </template>
  </ElDrawer>
</template>
