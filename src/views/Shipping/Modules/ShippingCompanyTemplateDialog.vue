<script setup lang="ts">
import { createShippingCompanyTemplateApi, updateShippingCompanyTemplateApi } from '@/api/shipping'
import { ElMessage, ElSwitch } from 'element-plus'

const emit = defineEmits(['getList'])

const dialogVisible = ref(false)

const shippingCompanyId = ref('')

const formRef = ref()

const rules = reactive({
  shippingCompanyTemplateName: [{ required: true, type: 'string', message: '模板名称必须填写', trigger: 'blur' }],
  shippingRules: [{ required: true, type: 'string', message: '模板规则填写', trigger: 'blur' }],
})

const form = reactive<ShippingCompanyTemplateShow>({
  shippingCompanyTemplateId: '',
  shippingCompanyId: '',
  shippingCompanyTemplateName: '',
  shippingRules: '',
  isDefault: false,
})

const isEdit = ref(false)
const open = (shippingCompanyIdData: string, isEditData: boolean, val?: ShippingCompanyTemplateShow & CommonField) => {
  dialogVisible.value = true
  shippingCompanyId.value = shippingCompanyIdData
  form.shippingCompanyId = shippingCompanyId.value
  isEdit.value = isEditData
  if (isEdit.value && val) {
    form.shippingCompanyTemplateName = val.shippingCompanyTemplateName
    form.shippingRules = val.shippingRules
    form.isDefault = val.isDefault
    form.shippingCompanyTemplateId = val.id
  }
}

const submitShippingCompanyTemplate = async () => {
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  if (isEdit.value) {
    if (!form.shippingCompanyTemplateId || form.shippingCompanyTemplateId === 'undefined') {
      return
    }
    const reqParams: UpdateShippingCompanyTemplateParams = {
      shippingCompanyTemplateId: form.shippingCompanyTemplateId,
      shippingCompanyTemplateName: form.shippingCompanyTemplateName,
      shippingRules: form.shippingRules,
      isDefault: form.isDefault,
    }
    await updateShippingCompanyTemplateApi(reqParams).catch(error => {
      throw error
    })
    ElMessage.success('修改成功')
  } else {
    await createShippingCompanyTemplateApi(form).catch(error => {
      throw error
    })
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('getList')
}

defineExpose({
  open,
})
</script>

<template>
  <ElDialog v-model="dialogVisible" title="运费模板" width="50%">
    <ElForm ref="formRef" v-model="form" label-width="120px" :rules="rules">
      <ElFormItem label="模板名称" prop="shippingCompanyTemplateName">
        <ElInput v-model="form.shippingCompanyTemplateName" />
      </ElFormItem>
      <ElFormItem label="是否默认" required>
        <ElSwitch v-model="form.isDefault" />
      </ElFormItem>
      <ElFormItem label="规则" required />
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <EBtn @click="dialogVisible = false">
          取消
        </EBtn>
        <EBtn type="primary" @click="submitShippingCompanyTemplate">
          确定
        </EBtn>
      </div>
    </template>
  </ElDialog>
</template>
