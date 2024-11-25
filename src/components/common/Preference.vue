<script setup lang="ts">
import { useCurrencyStore } from '@/stores/currency'
import { useLanguageStore } from '@/stores/language'
import { usePreferenceStore } from '@/stores/preference'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)

const formRef = ref()
const languages = useLanguageStore().languages
const currencies = useCurrencyStore().currencies

let form = reactive<PreferenceType>({
  language: {
    id: languages[0].id,
    languageCode: languages[0].languageCode,
    languageName: languages[0].languageName,
  },
  currency: {
    id: currencies[0].id,
    currencyCode: currencies[0].currencyCode,
    currencyName: currencies[0].currencyName,
    symbolLeft: currencies[0].symbolLeft,
    symbolRight: currencies[0].symbolRight,
    decimalPlace: currencies[0].decimalPlace,
    isHot: currencies[0].isHot,
    countryName: currencies[0].countryName,
    sort: currencies[0].sort,
  },
})

const initForm = () => {
  form = reactive<PreferenceType>({
    language: {
      id: languages[0].id,
      languageCode: languages[0].languageCode,
      languageName: languages[0].languageName,
    },
    currency: {
      id: currencies[0].id,
      currencyCode: currencies[0].currencyCode,
      currencyName: currencies[0].currencyName,
      symbolLeft: currencies[0].symbolLeft,
      symbolRight: currencies[0].symbolRight,
      decimalPlace: currencies[0].decimalPlace,
      isHot: currencies[0].isHot,
      countryName: currencies[0].countryName,
      sort: currencies[0].sort,
    },
  })
}

const openDialog = () => {
  initForm()
  const preferenceData = useGetStorage('preference')
  if (preferenceData) {
    const preference = JSON.parse(preferenceData)
    Object.assign(form, preference)
  }
  console.log(form)
  dialogVisible.value = true
}

const handleSave = () => {
  const formData = JSON.stringify(form)
  useSetStorage('preference', formData)
  usePreferenceStore().setPreferences()
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
      <ElFormItem label="默认语言">
        <ElSelect v-model="form.language" value-key="id" filterable>
          <ElOption v-for="item in languages" :key="item.id" :label="item.languageName" :value="item" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="默认货币">
        <ElSelect v-model="form.currency" value-key="id" filterable>
          <ElOption v-for="item in currencies" :key="item.id" :label="item.currencyCode" :value="item" />
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
