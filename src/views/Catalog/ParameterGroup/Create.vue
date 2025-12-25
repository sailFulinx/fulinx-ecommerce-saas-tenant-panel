<script setup lang="ts">
import { createParameterGroupApi } from '@/api/parameter'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import { ElCard, ElInput, ElMessage } from 'element-plus'

const { t: $t } = useLocale()

const rules = reactive({
  parameterGroupType: [{ required: true, type: 'number', message: '内容类型必填', trigger: 'change' }],
  languageId: [{ required: true, type: 'number', message: '语言必须选择', trigger: 'change' }],
  status: [{ required: true, type: 'boolean', message: '状态必填', trigger: 'change' }],
  parameterGroupName: [{ required: true, type: 'string', message: '内容名称必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = $t('parameterGroup.add')

const parameterGroupFormRef = ref()

const createParameterGroupForm = (): CreateParameterGroupParams => {
  return {
    languageId: '',
    parameterGroupName: '',
  }
}

const parameterGroupForm = reactive<CreateParameterGroupParams>(createParameterGroupForm())

const closeViewTag = () => {}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'ParameterGroupList' })
}

const save = async () => {
  parameterGroupForm.languageId = usePreferenceStore().preference.language.id
  const valid = await parameterGroupFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  await createParameterGroupApi(parameterGroupForm).catch(err => {
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
        <ElForm ref="parameterGroupFormRef" :model="parameterGroupForm" :rules="rules" label-width="120px">
          <ElFormItem :label="$t('parameterGroup.parameterGroupName')" prop="parameterGroupName">
            <ElInput
              v-model="parameterGroupForm.parameterGroupName"
              minlength="1"
              maxlength="120"
              :placeholder="$t('parameterGroup.placeholder.parameterGroupName')"
            />
          </ElFormItem>
        </ElForm>
      </ElCard>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
