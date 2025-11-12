<script setup name="CommonImageText" lang="ts">
import { hasContentElements } from '@/utils'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const buttonModuleLinkRef = ref()

const formRef = ref()
interface FormData {
  content: {
    buttonText: ''
    buttonLink: LinkData
  }
  status: boolean
}

const createForm = (): FormData => {
  return {
    content: {
      buttonText: '',
      buttonLink: {
        linkUrl: '',
        linkValue: '',
        linkLabel: '',
        linkType: '',
        children: [],
      },
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
  const buttonLink = buttonModuleLinkRef.value.getLinkData()
  form.value.content.buttonLink = buttonLink
  return form.value
}

async function setFormData(formData: FormData) {
  if (hasContentElements(formData.content)) {
    await nextTick()
    if (buttonModuleLinkRef.value) {
      form.value.content.buttonLink = buttonModuleLinkRef.value.getLinkData()
    }
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
      <ElFormItem label="按钮文字" prop="buttonText" required>
        <ElInput v-model="form.content.buttonText" />
      </ElFormItem>
      <ElFormItem label="按钮链接">
        <ModuleLink ref="buttonModuleLinkRef" :is-need-children="false" />
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
