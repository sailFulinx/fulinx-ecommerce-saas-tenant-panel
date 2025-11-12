<script setup name="CommonFile" lang="ts">
import { ElColorPicker, ElMessage } from 'element-plus'
import { hasContentElements } from '@/utils'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const moduleLinkRef = ref()

const buttonModuleLinkRef = ref()

const formRef = ref()
interface FormData {
  content: {
    type: 'image' | 'video'
    image: FileData
    video: FileData
    thumbnail: FileData
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
      type: 'image',
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
      video: {
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
      thumbnail: {
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
const uploadVideoRef = ref()
const uploadThumbnailRef = ref()

const handleAddText = () => {
  form.value.content.text.push('') // 新增一行文字内容
  form.value.content.text = [...form.value.content.text] // 重新赋值以确保响应式更新
}

const handleRemove = (index: number) => {
  form.value.content.text.splice(index, 1) // 删除指定的文字内容
  form.value.content.text = [...form.value.content.text] // 重新赋值以确保响应式更新
}

async function getFormData() {
  let fileRes
  if (form.value.content.type === 'image') {
    if (uploadSingleRef.value) {
      fileRes = uploadSingleRef.value.getFileData()
      if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
        ElMessage.error('请上传图片')
        return false
      }
      form.value.content.image = fileRes.fileData
    }
  } else {
    if (uploadVideoRef.value) {
      fileRes = uploadVideoRef.value.getFileData()
      if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
        ElMessage.error('请上传视频')
        return false
      }
      form.value.content.video = fileRes.fileData
    }
    if (uploadThumbnailRef.value) {
      // 检查缩略图
      const thumbnailRes = uploadThumbnailRef.value.getFileData()
      if (!thumbnailRes || !thumbnailRes.fileData || thumbnailRes.fileData.id === 0) {
        ElMessage.error('请上传视频缩略图')
        return false
      }
      form.value.content.thumbnail = thumbnailRes.fileData
    }
  }

  const link = moduleLinkRef.value.getLinkData()
  form.value.content.link = link
  return form.value
}

async function setFormData(formData: FormData) {
  if (hasContentElements(formData?.content)) {
    await nextTick()
    moduleLinkRef.value.setLinkData(formData.content.link)
    if (buttonModuleLinkRef.value) {
      form.value.content.buttonLink = buttonModuleLinkRef.value.getLinkData()
    }
    if (!formData.content.type) {
      form.value.content.type = 'image'
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
      <ElFormItem label="文件类型">
        <ElRadioGroup v-model="form.content.type">
          <ElRadio label="image">
            图片
          </ElRadio>
          <ElRadio label="video">
            视频
          </ElRadio>
        </ElRadioGroup>
      </ElFormItem>

      <ElFormItem v-if="form.content.type === 'image'" label="图片" required>
        <UploadSingleImage ref="uploadSingleRef" :image-data="form.content.image" />
      </ElFormItem>

      <template v-else>
        <ElFormItem label="视频" required>
          <UploadVideo ref="uploadVideoRef" :video-data="form.content.video" />
        </ElFormItem>
        <ElFormItem label="缩略图" required>
          <UploadSingleImage ref="uploadThumbnailRef" :image-data="form.content.thumbnail" />
        </ElFormItem>
      </template>

      <ElFormItem label="链接地址">
        <ModuleLink ref="moduleLinkRef" :is-need-children="false" />
      </ElFormItem>
      <ElFormItem label="Alt标签">
        <ElInput v-model="form.content.alt" placeholder="请输入Alt标签" />
      </ElFormItem>
      <ElFormItem label="标题">
        <div class="flex items-center w-full">
          <ElInput v-model="form.content.title" placeholder="请输入标题" class="mr-2" />
          <ElColorPicker v-model="form.content.titleColor" class="mr-2" />
          <ElSelect v-model="form.content.titleSize" class="w-[200px] mr-2" placeholder="请选择字号">
            <ElOption label="10px" :value="10" />
            <ElOption label="12px" :value="12" />
            <ElOption label="14px" :value="14" />
            <ElOption label="16px" :value="16" />
            <ElOption label="18px" :value="18" />
            <ElOption label="20px" :value="20" />
            <ElOption label="22px" :value="22" />
            <ElOption label="24px" :value="24" />
            <ElOption label="26px" :value="26" />
            <ElOption label="28px" :value="28" />
            <ElOption label="30px" :value="30" />
            <ElOption label="32px" :value="32" />
            <ElOption label="34px" :value="34" />
            <ElOption label="36px" :value="36" />
            <ElOption label="38px" :value="38" />
            <ElOption label="40px" :value="40" />
            <ElOption label="42px" :value="42" />
            <ElOption label="44px" :value="44" />
            <ElOption label="46px" :value="46" />
            <ElOption label="48px" :value="48" />
            <ElOption label="50px" :value="50" />
            <ElOption label="52px" :value="52" />
            <ElOption label="54px" :value="54" />
            <ElOption label="56px" :value="56" />
            <ElOption label="58px" :value="58" />
            <ElOption label="60px" :value="60" />
            <ElOption label="62px" :value="62" />
            <ElOption label="64px" :value="64" />
          </ElSelect>
          <ElRadioGroup v-model="form.content.titleAlign" class="shrink-0">
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
          <ElColorPicker v-model="form.content.subTitleColor" class="mr-2" />
          <ElSelect v-model="form.content.subTitleSize" class="w-[200px] mr-2" placeholder="请选择字号">
            <ElOption label="10px" :value="10" />
            <ElOption label="12px" :value="12" />
            <ElOption label="14px" :value="14" />
            <ElOption label="16px" :value="16" />
            <ElOption label="18px" :value="18" />
            <ElOption label="20px" :value="20" />
            <ElOption label="22px" :value="22" />
            <ElOption label="24px" :value="24" />
            <ElOption label="26px" :value="26" />
            <ElOption label="28px" :value="28" />
            <ElOption label="30px" :value="30" />
            <ElOption label="32px" :value="32" />
            <ElOption label="34px" :value="34" />
            <ElOption label="36px" :value="36" />
            <ElOption label="38px" :value="38" />
            <ElOption label="40px" :value="40" />
            <ElOption label="42px" :value="42" />
            <ElOption label="44px" :value="44" />
            <ElOption label="46px" :value="46" />
            <ElOption label="48px" :value="48" />
            <ElOption label="50px" :value="50" />
            <ElOption label="52px" :value="52" />
            <ElOption label="54px" :value="54" />
            <ElOption label="56px" :value="56" />
            <ElOption label="58px" :value="58" />
            <ElOption label="60px" :value="60" />
            <ElOption label="62px" :value="62" />
            <ElOption label="64px" :value="64" />
          </ElSelect>
          <ElRadioGroup v-model="form.content.subTitleAlign" class="shrink-0">
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
          <ElSelect v-model="form.content.textSize" class="mr-2" style="width: 200px" placeholder="请选择字号">
            <ElOption label="10px" :value="10" />
            <ElOption label="12px" :value="12" />
            <ElOption label="14px" :value="14" />
            <ElOption label="16px" :value="16" />
            <ElOption label="18px" :value="18" />
            <ElOption label="20px" :value="20" />
            <ElOption label="22px" :value="22" />
            <ElOption label="24px" :value="24" />
            <ElOption label="26px" :value="26" />
            <ElOption label="28px" :value="28" />
            <ElOption label="30px" :value="30" />
            <ElOption label="32px" :value="32" />
            <ElOption label="34px" :value="34" />
            <ElOption label="36px" :value="36" />
            <ElOption label="38px" :value="38" />
            <ElOption label="40px" :value="40" />
            <ElOption label="42px" :value="42" />
            <ElOption label="44px" :value="44" />
            <ElOption label="46px" :value="46" />
            <ElOption label="48px" :value="48" />
            <ElOption label="50px" :value="50" />
            <ElOption label="52px" :value="52" />
            <ElOption label="54px" :value="54" />
            <ElOption label="56px" :value="56" />
            <ElOption label="58px" :value="58" />
            <ElOption label="60px" :value="60" />
            <ElOption label="62px" :value="62" />
            <ElOption label="64px" :value="64" />
          </ElSelect>
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
