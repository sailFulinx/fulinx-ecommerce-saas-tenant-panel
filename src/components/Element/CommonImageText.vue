<script setup name="CommonImageText" lang="ts">
import { hasContentElements } from '@/utils'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const moduleLinkRef = ref()

const buttonModuleLinkRef = ref()

const titleTextSettingRef = ref()

const subTitleTextSettingRef = ref()

const textFontSizeSelectRef = ref()

const formRef = ref()
interface FormData {
  content: {
    image: FileData
    link: LinkData
    alt: string
    title: string
    titleAlign: 'left' | 'center' | 'right'
    titleColor: string
    titleSize: number
    subTitle: string
    subTitleAlign: 'left' | 'center' | 'right'
    subTitleColor: string
    subTitleSize: number
    text: string[]
    textAlign: 'left' | 'center' | 'right'
    textColor: string
    textSize: number
    buttonText: ''
    buttonLink: LinkData
  }
  status: boolean
}

const createForm = (): FormData => {
  return {
    content: {
      image: {
        id: '',
        bucketName: '',
        etag: '',
        s3Key: '',
        isPublic: true,
        originalFileName: '',
        fileName: '',
        fileContentType: '',
        fileExtensionName: '',
        path: '',
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
      titleAlign: 'left',
      titleColor: '#000000',
      titleSize: 12,
      subTitle: '',
      subTitleAlign: 'left',
      subTitleColor: '#000000',
      subTitleSize: 12,
      text: [],
      textAlign: 'left',
      textColor: '#000000',
      textSize: 12,
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
  form.value.content.link = link
  form.value.content.buttonLink = buttonModuleLinkRef.value.getLinkData()

  // 从TextSetting组件获取标题和副标题数据
  if (titleTextSettingRef.value) {
    const titleData = titleTextSettingRef.value.getData()
    form.value.content.title = titleData.title
    form.value.content.titleAlign = titleData.titleAlign
    form.value.content.titleColor = titleData.titleColor
    form.value.content.titleSize = titleData.titleSize
  }

  if (subTitleTextSettingRef.value) {
    const subTitleData = subTitleTextSettingRef.value.getData()
    form.value.content.subTitle = subTitleData.title
    form.value.content.subTitleAlign = subTitleData.titleAlign
    form.value.content.subTitleColor = subTitleData.titleColor
    form.value.content.subTitleSize = subTitleData.titleSize
  }

  form.value.content.image = fileRes.fileData
  return form.value
}

async function setFormData(formData: FormData) {
  if (!formData.content) {
    return
  }
  if (hasContentElements(formData.content)) {
    await nextTick()
    moduleLinkRef.value.setLinkData(formData.content.link)
    buttonModuleLinkRef.value.setLinkData(formData.content.buttonLink)

    // 设置TextSetting组件数据
    if (titleTextSettingRef.value) {
      titleTextSettingRef.value.setData({
        title: formData.content.title,
        titleAlign: formData.content.titleAlign,
        titleColor: formData.content.titleColor,
        titleSize: formData.content.titleSize,
      })
    }

    if (subTitleTextSettingRef.value) {
      subTitleTextSettingRef.value.setData({
        title: formData.content.subTitle,
        titleAlign: formData.content.subTitleAlign,
        titleColor: formData.content.subTitleColor,
        titleSize: formData.content.subTitleSize,
      })
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
      <ElFormItem label="图片" required>
        <UploadSingleImage ref="uploadSingleRef" :image-data="form.content.image" />
      </ElFormItem>
      <ElFormItem label="链接地址">
        <ModuleLink ref="moduleLinkRef" :is-need-children="false" />
      </ElFormItem>
      <ElFormItem label="Alt标签">
        <ElInput v-model="form.content.alt" placeholder="请输入Alt标签" />
      </ElFormItem>
      <ElFormItem label="标题">
        <TextSetting
          ref="titleTextSettingRef"
          :show-font-color-control="true"
          :show-font-size-control="true"
          :show-text-align-control="true"
          label="标题"
        />
      </ElFormItem>
      <ElFormItem label="副标题">
        <TextSetting
          ref="subTitleTextSettingRef"
          :show-font-color-control="true"
          :show-font-size-control="true"
          :show-text-align-control="true"
          label="副标题"
        />
      </ElFormItem>
      <ElFormItem label="按钮文字" prop="buttonText">
        <ElInput v-model="form.content.buttonText" />
      </ElFormItem>
      <ElFormItem label="按钮链接">
        <ModuleLink ref="buttonModuleLinkRef" :is-need-children="false" />
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
        <EBtn size="default" class="mr-2" @click="handleAddText">
          <Icon icon="ep:plus" />
          增加一行文字
        </EBtn>
        <div class="flex">
          <ElColorPicker v-model="form.content.textColor" class="mr-2" />
          <FontSizeSelect v-model="form.content.textSize" ref="textFontSizeSelectRef" class="mr-2" />
          <ElRadioGroup v-model="form.content.textAlign" class="shrink-0">
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
