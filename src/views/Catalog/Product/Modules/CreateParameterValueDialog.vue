<script setup name="CreateParameterValueDialog" lang="ts">
import type { FormRules } from 'element-plus'

const emit = defineEmits(['getList'])

const { t: $t } = useLocale()

const dialogVisible = ref(false)

const loading = reactive({
  init: false,
  parameters: false,
})

const parameterValueContentString = ref('')

const form = reactive<CreateParameterValueBatchParams>({
  languageId: '',
  parameterId: '',
  parameterValueContents: [],
})

const resetForm = () => {
  form.parameterId = ''
  form.languageId = ''
  form.parameterValueContents = []
  parameterValueContentString.value = ''
}

const openDialog = async (parameterId: string, languageId: string) => {
  resetForm()
  form.languageId = languageId
  form.parameterId = parameterId
  dialogVisible.value = true
}

const createParameterValue = async () => {
  loading.init = true
  try {
    const payload = $clone(form)
    const { data } = await createParameterValueApi(payload)
    return data
  } finally {
    loading.init = false
  }
}

const formRef = useTemplateRef('formRef')

const onSave = () => {
  $catch(async () => {
    const valid = await formRef.value!.validate()
    if (!valid) {
      return false
    }

    // 解析多行输入
    const parameterValueContents = parameterValueContentString.value
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.trim() !== '')

    if (parameterValueContents.length === 0) {
      ElMessage.error($t('common.warning.enterAtLeastOneValue'))
      return
    }

    // 批量创建
    form.parameterValueContents = parameterValueContents
    await createParameterValue()
    emit('getList')

    ElMessage.success($t('success.create'))

    dialogVisible.value = false
  })
}

const rules: FormRules = {
  // 修复：验证用户实际输入的字段
  parameterValueContentString: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        const values = parameterValueContentString.value
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.trim() !== '')

        if (values.length === 0) {
          callback(new Error($t('common.warning.enterAtLeastOneValue')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDrawer v-model="dialogVisible" :title="$t('parameter.add')" size="50%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem :label="$t('parameter.parameterValue')" prop="parameterValueContentString">
        <ElInput
          v-model="parameterValueContentString"
          class="input-line"
          type="textarea"
          :rows="6"
          clearable
          :placeholder="`${$t('parameter.placeholder.parameterValue')}（${$t('common.perLine')}）`"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">
          {{ $t('common.cancel') }}
        </ElButton>
        <ElButton type="primary" :loading="loading.init" @click="onSave">
          {{ $t('common.submit') }}
        </ElButton>
      </div>
    </template>
  </ElDrawer>
</template>
