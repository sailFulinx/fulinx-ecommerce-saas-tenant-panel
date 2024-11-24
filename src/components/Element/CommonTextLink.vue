<script setup name="CommonTextLink" lang="ts">
import { hasContentElements } from '@/utils'
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const moduleLinkRef = ref()

const formRef = ref()
interface FormData {
  content: {
    link: LinkData
    title: string
  }
  status: boolean
}

const createForm = (): FormData => {
  return {
    content: {
      link: {
        linkUrl: '',
        linkValue: '',
        linkLabel: '',
        linkType: '',
        children: [],
      },
      title: '',
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
  const link = moduleLinkRef.value.getLinkData()
  if (!form.value.content.title) {
    ElMessage.error('请输入标题')
    return false
  }
  form.value.content.link = link
  return form.value
}

async function setFormData(formData: FormData) {
  if (hasContentElements(formData.content)) {
    await nextTick()
    moduleLinkRef.value.setLinkData(formData.content.link)
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
      <ElFormItem label="标题" required>
        <ElInput v-model="form.content.title" placeholder="请输入标题" />
      </ElFormItem>
      <ElFormItem label="链接地址">
        <ModuleLink ref="moduleLinkRef" :is-need-children="false" />
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
