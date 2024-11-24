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
    subTitle: string
    subTitleAlign: 'left' | 'center' | 'right'
    text: string[]
    textAlign: 'left' | 'center' | 'right'
  }
  status: boolean
}

const form = reactive<FormData>({
  content: {
    title: '',
    titleAlign: 'left',
    subTitle: '',
    subTitleAlign: 'left',
    text: [],
    textAlign: 'left',
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

const handleAddText = () => {
  if (!form.content.text) {
    form.content.text = []
  }
  form.content.text.push('') // 新增一行文字内容
  form.content.text = [...form.content.text] // 重新赋值以确保响应式更新
}

const handleRemove = (index: number) => {
  if (!form.content.text) {
    form.content.text = []
  }
  if (form.content.text.length === 0) {
    return
  }
  form.content.text.splice(index, 1) // 删除指定的文字内容
  form.content.text = [...form.content.text] // 重新赋值以确保响应式更新
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
  if (formData.content.text && Array.isArray(formData.content.text)) {
    form.content.text = [...formData.content.text] // 确保重新赋值，触发响应式
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
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="100px">
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
      <ElFormItem label="文字内容">
        <div v-for="(item, index) in form.content.text" :key="index" class="w-full mb-4">
          <div class="flex">
            <ElInput v-model="form.content.text[index]" placeholder="请输入文字内容" />
            <EBtn text type="danger" class="ml-5" @click="handleRemove(index)">
              <Icon icon="ep:delete" />
            </EBtn>
          </div>
        </div>
        <div class="flex">
          <EBtn size="default" class="mr-2" @click="handleAddText">
            <Icon icon="ep:plus" />
            增加一行文字
          </EBtn>
          <ElRadioGroup v-model="form.content.textAlign" class="w-[200px]">
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
