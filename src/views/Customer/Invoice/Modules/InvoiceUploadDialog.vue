<script setup lang="ts">
import { uploadCustomerInvoiceApi } from '@/api/customer'
import { customerInvoiceApprovalStatuses } from '@/data/customerInvoice'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['getOrder'])
const loading = reactive({
  init: false,
})
const orderId = ref('')
const formRef = ref()
const rules = reactive({
  invoiceNumber: [
    {
      required: true,
      message: '请输入发票号码',
      trigger: 'blur',
    },
  ],
})
const form = reactive<ApprovalCustomerInvoiceUploadParams>({
  customerInvoiceId: '',
  invoiceNumber: '',
  invoiceFileId: '',
})

const uploadRef = ref()

const dialogVisible = ref<boolean>(false)
const open = (id: string) => {
  dialogVisible.value = true
  orderId.value = id
  form.customerInvoiceId = id
}

const submit = async () => {
  if (!uploadRef.value) {
    return
  }
  await nextTick()
  const files = await uploadRef.value.getFileData()
  const file = files?.fileDataList?.[0]
  form.invoiceFileId = file?.id || ''
  await formRef.value.validate()
  loading.init = true
  await uploadCustomerInvoiceApi(form).catch(error => {
    loading.init = false
    throw error
  })
  emit('getOrder')
  ElMessage.success('审批成功')
  dialogVisible.value = false
  loading.init = false
}

defineExpose({
  open,
})
</script>

<template>
  <ElDialog v-model="dialogVisible" title="提示">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem label="发票号码" prop="invoiceNumber">
        <ElInput v-model="form.invoiceNumber" placeholder="请输入发票号码" />
      </ElFormItem>

      <ElFormItem label="发票上传" required>
        <UploadSinglePdf ref="uploadRef" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">
        取 消
      </ElButton>
      <ElButton type="primary" @click="submit">
        确 定
      </ElButton>
    </template>
  </ElDialog>
</template>
