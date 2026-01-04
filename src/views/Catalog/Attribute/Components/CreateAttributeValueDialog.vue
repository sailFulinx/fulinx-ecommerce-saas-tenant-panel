<script setup name="CreateAttributeValueDialog" lang="ts">
import type { FormRules } from 'element-plus'
import { attributeKey } from '../type/injectionKeys'

const { resetFormData } = inject(attributeKey)!
const { t: $t } = useLocale()

const dialogVisible = ref(false)

const loading = reactive({
  init: false,
  attributes: false,
})

const attributeValueContentString = ref('')

const form = reactive<CreateAttributeValueBatchParams>({
  languageId: '',
  attributeId: '',
  attributeValueContents: [],
})

const resetForm = () => {
  form.attributeId = ''
  form.languageId = ''
  form.attributeValueContents = []
  attributeValueContentString.value = ''
}

const openDialog = async (attributeId: string, languageId: string) => {
  resetForm()
  form.languageId = languageId
  form.attributeId = attributeId
  console.log(form)
  dialogVisible.value = true
}

const createAttributeValue = async () => {
  loading.init = true
  try {
    const payload = $clone(form)
    const { data } = await createAttributeValueApi(payload)
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
    const attributeValueContents = attributeValueContentString.value
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.trim() !== '')

    if (attributeValueContents.length === 0) {
      ElMessage.error($t('common.warning.enterAtLeastOneValue'))
      return
    }

    // 批量创建
    form.attributeValueContents = attributeValueContents
    const res = await createAttributeValue()
    await resetFormData(res)

    ElMessage.success($t('success.create'))

    dialogVisible.value = false
  })
}

const rules: FormRules = {
  // 修复：验证用户实际输入的字段
  attributeValueContentString: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        const values = attributeValueContentString.value
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
  <ElDrawer v-model="dialogVisible" :title="$t('attribute.add')" size="50%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem :label="$t('attribute.attributeValue')" prop="attributeValueContentString">
        <ElInput
          v-model="attributeValueContentString"
          class="input-line"
          type="textarea"
          :rows="6"
          clearable
          :placeholder="`${$t('attribute.placeholder.attributeValue')}（${$t('common.perLine')}）`"
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
