<script setup name="CommonText" lang="ts">
const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

interface FormData {
  content: null
  status: boolean
}

const editorRef = ref()

const formRef = ref()

const form = reactive<FormData>({
  content: null,
  status: true,
})

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
  if (!editorRef.value) {
    return
  }
  return form
}

async function setFormData(formData: FormData) {
  await nextTick()
  form.status = formData.status
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" :model="form" label-width="100px">
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
