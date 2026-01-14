<script setup name="CreateSupplierDialog" lang="ts">
import type { FormRules } from 'element-plus'

const emit = defineEmits(['getList'])

const { t: $t } = useLocale()

const dialogVisible = ref(false)

const loading = reactive({
  init: false,
  parameters: false,
})

const supplierNameString = ref('')

const form = reactive<CreateSupplierBatchParams>({
  languageId: '',
  supplierNames: [],
})

const resetForm = () => {
  form.languageId = ''
  form.supplierNames = []
  supplierNameString.value = ''
}

const openDialog = async (languageId: string) => {
  resetForm()
  form.languageId = languageId
  dialogVisible.value = true
}

const createSupplier = async () => {
  loading.init = true
  const payloadForm = $clone(form)
  payloadForm.supplierNames.forEach(async item => {
    try {
      const payload = {
        languageId: payloadForm.languageId,
        supplierName: item,
      }
      const { data } = await createSupplierApi(payload)
      return data
    } finally {
      loading.init = false
    }
  })
  loading.init = false
}

const formRef = useTemplateRef('formRef')

const onSave = () => {
  $catch(async () => {
    const valid = await formRef.value!.validate()
    if (!valid) {
      return false
    }

    // 解析多行输入
    const supplierNames = supplierNameString.value
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.trim() !== '')

    if (supplierNames.length === 0) {
      ElMessage.error($t('common.warning.enterAtLeastOneValue'))
      return
    }

    // 批量创建
    form.supplierNames = supplierNames
    await createSupplier()
    emit('getList')

    ElMessage.success($t('success.create'))

    dialogVisible.value = false
  })
}

const rules: FormRules = {
  // 修复：验证用户实际输入的字段
  supplierNameString: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        const values = supplierNameString.value
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
      <ElFormItem :label="$t('parameter.supplier')" prop="supplierNameString">
        <ElInput
          v-model="supplierNameString"
          class="input-line"
          type="textarea"
          :rows="6"
          clearable
          :placeholder="`${$t('parameter.placeholder.supplier')}（${$t('common.perLine')}）`"
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
