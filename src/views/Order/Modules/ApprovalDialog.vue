<script setup lang="ts">
import { approvalOrderApi } from '@/api/order'
import { orderApprovalStatuses } from '@/data/order'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['getOrder'])
const loading = reactive({
  init: false,
})
const orderId = ref('')
const formRef = ref()
const rules = reactive({
  approval_opinion: [
    {
      required: true,
      message: '请输入审批意见',
      trigger: 'blur',
    },
  ],
})
const form = reactive<OrderApprovalParams>({
  orderId: '',
  approvalStatus: 1,
  rejectReason: '',
})
const dialogVisible = ref<boolean>(false)
const open = (id: string) => {
  dialogVisible.value = true
  orderId.value = id
  form.orderId = id
}

const submit = async () => {
  await formRef.value.validate()
  loading.init = true
  await approvalOrderApi(form).catch(error => {
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
      <ElFormItem label="审批状态" prop="approvalStatus">
        <ElSelect v-model="form.approvalStatus" placeholder="请选择审批状态">
          <ElOption v-for="item in orderApprovalStatuses" :key="item.id" :label="item.label" :value="item.id" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem v-if="form.approvalStatus === 2" label="审批意见" prop="rejectReason">
        <ElInput v-model="form.rejectReason" placeholder="请输入审批意见" />
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
