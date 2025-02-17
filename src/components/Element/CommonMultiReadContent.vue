<script setup name="CommonText" lang="ts">
import { hasContentElements } from '@/utils'
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const formRef = ref()

const uploadSingleRef = ref()

const dialogVisible = ref(false)

interface FormData {
  content: {
    contents: MultiReadContentData[]
    image: FileData
    title: string
  }
  status: boolean
}

const createForm = (): FormData => {
  return {
    content: {
      contents: [],
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
      title: '',
    },
    status: true,
  }
}

const form = ref<FormData>(createForm())

watch(
  () => props.componentData,
  val => {
    if (val) {
      setFormData(val)
    }
  },
  { immediate: true },
)

const moduleReadContentRef = ref()

const handleAddContent = () => {
  dialogVisible.value = true
}

const handleSubmitContent = async () => {
  const content = await moduleReadContentRef.value.getReadContentData()
  if (!content) {
    ElMessage.error('请添加内容')
    return
  }
  form.value.content.contents.push(content)
  dialogVisible.value = false
  ElMessage.success('添加成功')
}

const handleRemoveContent = (index: number) => {
  form.value.content.contents.splice(index, 1)
}

async function getFormData() {
  const fileRes = await uploadSingleRef.value.getFileData()
  if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
    ElMessage.error('请上传图片')
    return false
  }
  if (!form.value.content.title) {
    ElMessage.error('请输入标题')
    return false
  }
  form.value.content.image = fileRes.fileData
  return form
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
    <ElForm ref="formRef" :model="form" label-width="100px">
      <ElFormItem label="标题">
        <ElInput v-model="form.content.title" placeholder="请输入标题" />
      </ElFormItem>
      <ElFormItem label="图片" required>
        <UploadSingleImage ref="uploadSingleRef" :image-data="form.content.image" />
      </ElFormItem>
      <ElFormItem label="内容" required>
        <ElButton @click="handleAddContent">
          添加内容
        </ElButton>
        <ElTag v-for="(item, index) in form.content.contents" :key="index" closable class="ml-4" @close="handleRemoveContent(index)">
          {{ item.readContentLabel }}
        </ElTag>
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
    <ElDialog v-model="dialogVisible" title="编辑文字内容">
      <ModuleReadContent ref="moduleReadContentRef" />
      <template #footer>
        <ElButton @click="dialogVisible = false">
          取 消
        </ElButton>
        <ElButton type="primary" @click="handleSubmitContent">
          确 定
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>
