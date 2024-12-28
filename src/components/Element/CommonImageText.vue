<script setup name="CommonImageText" lang="ts">
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
    image: FileData
    link: LinkData
    alt: string
    title: string
    subTitle: string
    text: string[]
  }
  status: boolean
}

const createForm = (): FormData => {
  return {
    content: {
      image: {
        id: '',
        originalFileName: '',
        fileName: '',
        fileContentType: '',
        fileExtensionName: '',
        uploadPath: '',
        fileUrl: '',
        sha256: '',
      },
      link: {
        linkUrl: '',
        linkValue: '',
        linkLabel: '',
        linkType: '',
        children: [],
      },
      alt: '',
      title: '',
      subTitle: '',
      text: [],
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
const uploadSingleRef = ref()

const handleAddText = () => {
  form.value.content.text.push('') // 新增一行文字内容
  form.value.content.text = [...form.value.content.text] // 重新赋值以确保响应式更新
}

const handleRemove = (index: number) => {
  form.value.content.text.splice(index, 1) // 删除指定的文字内容
  form.value.content.text = [...form.value.content.text] // 重新赋值以确保响应式更新
}

async function getFormData() {
  const fileRes = uploadSingleRef.value.getFileData()
  const link = moduleLinkRef.value.getLinkData()
  if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
    ElMessage.error('请上传图片')
    return false
  }
  if (!form.value.content.title) {
    ElMessage.error('请输入标题')
    return false
  }
  form.value.content.link = link
  form.value.content.image = fileRes.fileData
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
      <ElFormItem label="图片" required>
        <UploadSingleImage ref="uploadSingleRef" :image-data="form.content.image" />
      </ElFormItem>
      <ElFormItem label="链接地址">
        <ModuleLink ref="moduleLinkRef" :is-need-children="false" />
      </ElFormItem>
      <ElFormItem label="Alt标签">
        <ElInput v-model="form.content.alt" placeholder="请输入Alt标签" />
      </ElFormItem>
      <ElFormItem label="标题" required>
        <ElInput v-model="form.content.title" placeholder="请输入标题" />
      </ElFormItem>
      <ElFormItem label="副标题">
        <ElInput v-model="form.content.subTitle" placeholder="请输入副标题" />
      </ElFormItem>
      <ElFormItem label="文字">
        <div v-for="(item, index) in form.content.text" :key="index" class="w-full mb-4">
          <div class="flex">
            <ElInput v-model="form.content.text[index]" placeholder="请输入文字内容" />
            <EBtn text type="danger" class="ml-5" @click="handleRemove(index)">
              <Icon icon="ep:delete" />
            </EBtn>
          </div>
        </div>
        <EBtn @click="handleAddText">
          <Icon icon="ep:plus" />
          增加一行文字
        </EBtn>
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
