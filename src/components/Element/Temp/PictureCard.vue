<script setup name="CommonText" lang="ts">
import { ElCard, ElForm } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

interface FormData {
  content: {
    title: string
    subTitle: string
    list: MultiImageTextItem[]
    description: string

  }
  status: boolean
}

const form = reactive<FormData>({
  content: {
    title: '',
    subTitle: '',
    list: [],
    description: '',
  },
  status: true,
})

const rules = reactive({})
const uploadRef = ref()

const getRemovedFiles = (val: number) => {
  const file = form.content.list?.[val]
  if (file && file.id) {
    form.content.list?.splice(val, 1)
  }
}

onMounted(() => {
  if (!props.componentData) {
    return
  }
  setFormData(props.componentData)
})

const formRef = ref()

const editorRef = ref()

async function getFormData() {
  await nextTick()
  const files = await uploadRef.value.getFileData()
  form.content.description = await editorRef.value.getEditorContent()
  form.content.list = files.fileDataList
  return form
}

async function setFormData(formData: FormData) {
  form.content = {
    ...form.content,
    ...formData.content,
  }
  await nextTick()
  await uploadRef.value.setFileData(form.content.list)
  await editorRef.value.setEditorContent(form.content.description)
  form.status = formData.status
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="100px">
      <!-- 主营业务领域 -->
      <ElCard shadow="never" class="mb-5">
        <template #header>
          <div class="card-header flex items-center justify-between">
            <span>主营业务领域</span>
          </div>
        </template>
        <ElFormItem label="标题" required>
          <div class="flex items-center w-full">
            <ElInput v-model="form.content.title" placeholder="请输入标题" class="mr-2" />
          </div>
        </ElFormItem>
        <ElFormItem label="图片" required>
          <UploadMultiImageText ref="uploadRef" @remove-file="getRemovedFiles" />
        </ElFormItem>
        <ElFormItem label="描述" required>
          <div class="flex items-center w-full">
            <!-- <ElInput v-model="form.content.description" type="textarea" :rows="6" placeholder="请输入标题" class="mr-2" /> -->
            <Editor ref="editorRef" v-model="form.content.description" :height="300" />
          </div>
        </ElFormItem>
      </ElCard>

      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
