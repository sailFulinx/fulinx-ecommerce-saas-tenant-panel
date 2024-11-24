<script setup lang="ts">
import { useLanguageStore } from '@/stores/language'
import { usePreferenceStore } from '@/stores/preference'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)

const formRef = ref()

let form = reactive<PreferenceType>({
  language: {
    languageCode: 'en',
    id: 1,
    languageName: 'English',
  },
})

const initForm = () => {
  form = reactive<PreferenceType>({
    language: {
      languageCode: 'en',
      id: 1,
      languageName: 'English',
    },
  })
}

const languages = useLanguageStore().languages

const openDialog = () => {
  initForm()
  const preferenceData = useGetStorage('preference')
  if (preferenceData) {
    const preference = JSON.parse(preferenceData)
    Object.assign(form, preference)
  }
  dialogVisible.value = true
}

const handleSave = () => {
  const formData = JSON.stringify(form)
  useSetStorage('preference', formData)
  usePreferenceStore().setPreference()
  ElMessage.success('保存偏好成功')
  dialogVisible.value = false
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDrawer v-model="dialogVisible" title="偏好设置" size="30%">
    <ElForm ref="formRef" :model="form" label-width="120px">
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
