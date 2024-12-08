<script setup name="CommonCard" lang="ts">
import { hasContentElements } from '@/utils'
import { ElInputNumber, ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const formRef = ref()
interface FormData {
  content: {
    loadSize: number
    recentlyDays: number
  }
  status: boolean
}

const createForm = (): FormData => {
  return {
    content: {
      loadSize: 10,
      recentlyDays: 7,
    },
    status: true,
  }
}

const form = ref<FormData>(createForm()) // 使用createForm正确初始化form

watch(
  () => props.componentData,
  val => {
    if (val) {
      setFormData(val)
    }
  },
  { immediate: true },
)

async function getFormData() {
  return form.value
}

async function setFormData(formData: FormData) {
  if (hasContentElements(formData.content)) {
    await nextTick()
    form.value = { ...formData }
  } else {
    form.value = createForm()
  }
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" v-model="form" label-width="100px">
      <ElFormItem label="调用数量">
        <ElInputNumber v-model="form.content.loadSize" :min="1" :max="20" placeholder="请输入调用多少条数据" />
      </ElFormItem>
      <ElFormItem label="天数" required>
        <ElInputNumber v-model="form.content.recentlyDays" :min="1" :max="30" placeholder="请输入多少天内的数据" /> （系统将自动获取最近多少天的数据）
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
