<script setup name="CommonImageText" lang="ts">
import { hasContentElements } from '@/utils'
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const formRef = ref()
const moduleLinkRef = ref()

interface FormData {
  content: {
    imageTextList: MultiImageTextItem[]
    title: string
    titleAlign: 'left' | 'center' | 'right'
    subTitle: string
    subTitleAlign: 'left' | 'center' | 'right'
    link: LinkData
  }
  status: boolean
}
const createForm = (): FormData => {
  return {
    content: {
      imageTextList: [],
      title: '',
      titleAlign: 'left',
      subTitle: '',
      subTitleAlign: 'left',
      link: {
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
const form = reactive<FormData>(createForm())
watch(
  () => props.componentData,
  val => {
    if (val) {
      setFormData(val)
    }
  },
  { immediate: true },
)

const getRemovedFiles = (val: number) => {
  const file = form.content.imageTextList?.[val]
  if (file && file.id) {
    form.content.imageTextList?.splice(val, 1)
  }
}

const uploadRef = ref()
async function getFormData() {
  await nextTick()
  if (moduleLinkRef.value) {
    form.content.link = moduleLinkRef.value.getLinkData()
  }
  const fileRes = uploadRef.value.getFileData()
  if (!fileRes || !fileRes.fileDataList || fileRes.fileDataList.length === 0) {
    ElMessage.error('请上传图片')
    return false
  }
  form.content.imageTextList = fileRes.fileDataList
  return form
}

async function setFormData(formData: FormData) {
  await nextTick()
  if (hasContentElements(formData.content)) {
    if (moduleLinkRef.value && formData.content.link) {
      moduleLinkRef.value.setLinkData(formData.content.link)
    }
    if (formData.content.imageTextList && Array.isArray(formData.content.imageTextList)) {
      uploadRef.value.setFileData(formData.content.imageTextList)
    }
    form.content = { ...formData.content }
  } else {
    // form = createForm()
  }
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" v-model="form" label-width="60px" class="mt-2">
      <ElFormItem label="图片" required>
        <UploadMultiImageText ref="uploadRef" @remove-file="getRemovedFiles" />
      </ElFormItem>
      <ElFormItem label="标题">
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
      <ElFormItem label="链接">
        <ModuleLink ref="moduleLinkRef" :is-need-children="false" />
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
