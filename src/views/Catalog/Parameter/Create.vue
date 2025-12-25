<script setup lang="ts">
import { createParameterApi } from '@/api/parameter'
import { parameterTypes } from '@/data/parameter'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import { ElCard, ElInput, ElMessage } from 'element-plus'

const { t: $t } = useLocale()

const rules = reactive({
  parameterType: [{ required: true, type: 'number', message: '参数类型必填', trigger: 'change' }],
  languageId: [{ required: true, type: 'number', message: '语言必须选择', trigger: 'change' }],
  parameterName: [{ required: true, type: 'string', message: '参数名称必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = $t('parameter.add')

const parameterFormRef = ref()

const createParameterForm = (): CreateParameterParams => {
  return {
    parameterType: 1,
    languageId: '',
    parameterName: '',
  }
}

const parameterForm = reactive<CreateParameterParams>(createParameterForm())

const closeViewTag = () => {}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'ParameterList' })
}

const save = async () => {
  parameterForm.languageId = usePreferenceStore().preference.language.id
  const valid = await parameterFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  await createParameterApi(parameterForm).catch(err => {
    throw err
  })

  deleteTagView(true)
  ElMessage({
    message: '保存成功',
    type: 'success',
    duration: 2000,
  })
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <h4>{{ pageTitle }}</h4>
        </div>
        <div>
          <EBtn size="small" :loading="loading.button" @click="closeViewTag()">
            <Icon icon="ant-design:close-outlined" class="mr-1" />
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn size="small" type="primary" :loading="loading.button" @click="save">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </div>
    <div class="view-main theme-card">
      <ElCard shadow="never">
        <ElForm ref="parameterFormRef" :model="parameterForm" :rules="rules" label-width="120px">
          <ElFormItem :label="$t('parameter.parameterType')" prop="parameterType">
            <ElSelect v-model="parameterForm.parameterType" clearable filterable :placeholder="$t('parameter.placeholder.parameterType')">
              <ElOption v-for="item in parameterTypes" :key="item.value" :value="item.id" :label="item.label" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="$t('parameter.parameterName')" prop="parameterName">
            <ElInput
              v-model="parameterForm.parameterName"
              minlength="1"
              maxlength="120"
              :placeholder="$t('parameter.placeholder.parameterName')"
            />
          </ElFormItem>
        </ElForm>
      </ElCard>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
