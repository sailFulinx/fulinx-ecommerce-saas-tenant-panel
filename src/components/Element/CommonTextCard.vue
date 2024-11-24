<script setup name="CommonText" lang="ts">
import { ElMessage, ElRadioButton } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

interface FormData {
  content: {
    title: string
    titleAlign: 'left' | 'center' | 'right'
    titleContent: string[]
    titleContentAlign: 'left' | 'center' | 'right'
    subTitle: string
    subTitleAlign: 'left' | 'center' | 'right'
    subTitleContent: string[]
    subTitleContentAlign: 'left' | 'center' | 'right'
  }
  status: boolean
}

const form = reactive<FormData>({
  content: {
    title: '',
    titleAlign: 'left',
    titleContent: [],
    titleContentAlign: 'left',
    subTitle: '',
    subTitleAlign: 'left',
    subTitleContent: [],
    subTitleContentAlign: 'left',
  },
  status: true,
})

const rules = reactive({
  'content.text': [{ required: true, type: 'string', message: '请输入文字内容', trigger: 'blur' }],
})

onMounted(() => {
  if (!props.componentData) {
    return
  }
  setFormData(props.componentData)
})

const formRef = ref()

const handleAddTitleContent = () => {
  if (!form.content.titleContent) {
    form.content.titleContent = []
  }
  form.content.titleContent.push('') // 新增一行文字内容
  form.content.titleContent = [...form.content.titleContent] // 重新赋值以确保响应式更新
}

const handleRemoveTitleContent = (index: number) => {
  if (!form.content.titleContent) {
    form.content.titleContent = []
  }
  if (form.content.titleContent.length === 0) {
    return
  }
  form.content.titleContent.splice(index, 1) // 删除指定的文字内容
  form.content.titleContent = [...form.content.titleContent] // 重新赋值以确保响应式更新
}

const handleAddSubTitleContent = () => {
  if (!form.content.subTitleContent) {
    form.content.subTitleContent = []
  }
  form.content.subTitleContent.push('') // 新增一行文字内容
  form.content.subTitleContent = [...form.content.subTitleContent] // 重新赋值以确保响应式更新
}

const handleRemoveSubTitleContent = (index: number) => {
  if (!form.content.subTitleContent) {
    form.content.subTitleContent = []
  }
  if (form.content.subTitleContent.length === 0) {
    return
  }
  form.content.subTitleContent.splice(index, 1) // 删除指定的文字内容
  form.content.subTitleContent = [...form.content.subTitleContent] // 重新赋值以确保响应式更新
}

async function getFormData() {
  if (!form.content.title) {
    ElMessage.error('请输入标题')
    return false
  }
  return form
}

function setFormData(formData: FormData) {
  form.content = { ...formData.content }
  if (formData.content.titleContent && Array.isArray(formData.content.titleContent)) {
    form.content.titleContent = [...formData.content.titleContent] // 确保重新赋值，触发响应式
  }

  if (formData.content.subTitleContent && Array.isArray(formData.content.subTitleContent)) {
    form.content.subTitleContent = [...formData.content.subTitleContent] // 确保重新赋值，触发响应式
  }

  form.status = formData.status
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem label="标题" required>
        <div class="flex items-center w-full">
          <ElInput v-model="form.content.title" placeholder="请输入标题" class="mr-2" />
          <ElRadioGroup v-model="form.content.titleAlign" class="w-[200px]">
            <ElRadioButton size="default" value="left">
              <Icon name="ant-design:align-left-outlined" />
            </ElRadioButton>
            <ElRadioButton size="default" value="center">
              <Icon name="ant-design:align-center-outlined" />
            </ElRadioButton>
            <ElRadioButton size="default" value="right">
              <Icon name="ant-design:align-right-outlined" />
            </ElRadioButton>
          </ElRadioGroup>
        </div>
      </ElFormItem>
      <ElFormItem label="标题文字内容">
        <div v-for="(item, index) in form.content.titleContent" :key="index" class="w-full mb-4">
          <div class="flex">
            <ElInput v-model="form.content.titleContent[index]" placeholder="请输入文字内容" />
            <EBtn text type="danger" class="ml-5" @click="handleRemoveTitleContent(index)">
              <Icon icon="ep:delete" />
            </EBtn>
          </div>
        </div>
        <div class="flex">
          <EBtn size="default" class="mr-2" @click="handleAddTitleContent">
            <Icon icon="ep:plus" />
            增加一行文字
          </EBtn>
          <ElRadioGroup v-model="form.content.titleContentAlign" class="w-[200px]">
            <ElRadioButton size="default" value="left">
              <Icon name="ant-design:align-left-outlined" />
            </ElRadioButton>
            <ElRadioButton size="default" value="center">
              <Icon name="ant-design:align-center-outlined" />
            </ElRadioButton>
            <ElRadioButton size="default" value="right">
              <Icon name="ant-design:align-right-outlined" />
            </ElRadioButton>
          </ElRadioGroup>
        </div>
      </ElFormItem>
      <ElFormItem label="副标题">
        <div class="flex items-center w-full">
          <ElInput v-model="form.content.subTitle" placeholder="请输入副标题" class="mr-2" />
          <ElRadioGroup v-model="form.content.subTitleAlign" class="w-[200px]">
            <ElRadioButton size="default" value="left">
              <Icon name="ant-design:align-left-outlined" />
            </ElRadioButton>
            <ElRadioButton size="default" value="center">
              <Icon name="ant-design:align-center-outlined" />
            </ElRadioButton>
            <ElRadioButton size="default" value="right">
              <Icon name="ant-design:align-right-outlined" />
            </ElRadioButton>
          </ElRadioGroup>
        </div>
      </ElFormItem>
      <ElFormItem label="副标题文字内容">
        <div v-for="(item, index) in form.content.subTitleContent" :key="index" class="w-full mb-4">
          <div class="flex">
            <ElInput v-model="form.content.subTitleContent[index]" placeholder="请输入文字内容" />
            <EBtn text type="danger" class="ml-5" @click="handleRemoveSubTitleContent(index)">
              <Icon icon="ep:delete" />
            </EBtn>
          </div>
        </div>
        <div class="flex">
          <EBtn size="default" class="mr-2" @click="handleAddSubTitleContent">
            <Icon icon="ep:plus" />
            增加一行文字
          </EBtn>
          <ElRadioGroup v-model="form.content.subTitleContentAlign" class="w-[200px]">
            <ElRadioButton size="default" value="left">
              <Icon name="ant-design:align-left-outlined" />
            </ElRadioButton>
            <ElRadioButton size="default" value="center">
              <Icon name="ant-design:align-center-outlined" />
            </ElRadioButton>
            <ElRadioButton size="default" value="right">
              <Icon name="ant-design:align-right-outlined" />
            </ElRadioButton>
          </ElRadioGroup>
        </div>
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
