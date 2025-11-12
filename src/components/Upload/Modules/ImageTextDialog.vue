<script setup lang="ts">
import type { UploadProps } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { uploadFileApi } from '@/api/file'

const emit = defineEmits(['save'])

const imageLinkRef = ref()

const buttonLinkRef = ref()

const dialogVisible = ref(false)

const formRef = ref()

const createFormData = (): MultiImageTextItem => {
  return {
    id: 0,
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
    imageLink: {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    },
    alt: '',
    title: '',
    subTitle: '',
    textList: [],
    buttonText: '',
    buttonLink: {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    },
    sort: 0,
  }
}

let form = reactive<MultiImageTextItem>(createFormData())

const loading = ref(false)

const imageUrl = ref('')
const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
    ElMessage.error('图片必须是PNG或JPG或GIF格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 50) {
    ElMessage.error('Picture size can not exceed 50MB!')
    return false
  }
  return true
}

const handleUpload = async ({ file }: { file: File }) => {
  loading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('uploadPath', 'uploads/images')
  const { data } = await uploadFileApi(formData).catch(err => {
    loading.value = false
    throw err
  })
  form.image = { ...data }
  loading.value = false
}

const handleAddText = () => {
  form.textList.push('')
}

const init = () => {
  form = createFormData()
}

const currentIndex = ref(-1)
const handleVisible = async (val?: MultiImageTextItem, index?: number) => {
  dialogVisible.value = true
  currentIndex.value = -1
  if (val) {
    init()
    form = reactive({ ...jsonParse(val) })
    imageUrl.value = form.image.fileUrl
    await nextTick()
    imageLinkRef.value.setLinkData(form.imageLink)
    buttonLinkRef.value.setLinkData(form.buttonLink)
  }
  if (index !== undefined && index !== null && index > -1) {
    currentIndex.value = index
  }
}

const changeLinkType = (val: { linkType: string, linkUrl: string, linkValue: string }) => {
  if (!form.imageLink) {
    return
  }
  form.imageLink.linkType = val.linkType
  form.imageLink.linkUrl = val.linkUrl
  form.imageLink.linkValue = val.linkValue
}

const setFormData = (val: MultiImageTextItem) => {
  Object.assign(form, val)
}

const getFormData = () => {
  return form
}

const handleSave = async () => {
  form.imageLink = await imageLinkRef.value.getLinkData()
  form.buttonLink = await buttonLinkRef.value.getLinkData()
  dialogVisible.value = false
  emit('save', form, currentIndex.value)
  init()
}

defineExpose({
  getFormData,
  setFormData,
  handleVisible,
})
</script>

<template>
  <ElDialog v-model="dialogVisible" :title="`编辑${form.image.originalFileName}`">
    <ElForm ref="formRef" v-model="form" label-width="100px">
      <ElFormItem label="图片">
        <ElUpload
          :loading="loading"
          class="avatar-uploader"
          action=""
          accept=".jpg,.jpeg,.png,.gif"
          :http-request="handleUpload"
          :show-file-list="false"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
        >
          <div class="w-48 h-48 border border-solid-1 border-gray-300 rounded p-2 flex items-center justify-center">
            <div v-if="imageUrl" class="flex flex-col items-center justify-center relative">
              <img class="w-full max-h-42 rounded object-cover" :src="`${imageUrl}`">
            </div>
          </div>
        </ElUpload>
      </ElFormItem>
      <ElFormItem label="图片链接" class="mt-5">
        <ModuleLink ref="imageLinkRef" @change-link-type="changeLinkType" />
      </ElFormItem>
      <ElFormItem label="图片Alt标签" class="mt-5">
        <ElInput v-model="form.alt" placeholder="请输入Alt标签" />
      </ElFormItem>
      <ElFormItem label="标题" class="mt-5">
        <ElInput v-model="form.title" placeholder="请输入标题" />
      </ElFormItem>
      <ElFormItem label="副标题" class="mt-5">
        <ElInput v-model="form.subTitle" placeholder="请输入副标题" />
      </ElFormItem>
      <ElFormItem label="文字" class="mt-5">
        <template #default>
          <EBtn type="primary" @click="handleAddText">
            增加一行文字
          </EBtn>
          <div v-for="(item, index) in form.textList" :key="index" class="w-full mt-5">
            <ElInput v-model="form.textList[index]" placeholder="请输入描述">
              <template #append>
                <ElButton :icon="Delete" @click="form.textList.splice(index, 1)" />
              </template>
            </ElInput>
          </div>
        </template>
      </ElFormItem>

      <ElFormItem label="按钮文字" class="mt-5">
        <ElInput v-model="form.buttonText" placeholder="请输入按钮标题" />
      </ElFormItem>
      <ElFormItem label="按钮链接" class="mt-5">
        <ModuleLink ref="buttonLinkRef" @change-link-type="changeLinkType" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">
          取消
        </ElButton>
        <ElButton type="primary" @click="handleSave">
          确定
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>
