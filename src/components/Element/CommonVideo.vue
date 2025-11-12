<script setup name="CommonVideo" lang="ts">
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

interface FormData {
  content: {
    video: FileData
    videoThumb: FileData
    youtubeVideo: string
    vimeoVideo: string
    title: string
    description: string
    text: string
  }
  status: boolean
}

const formRef = ref()

const createForm = (): FormData => ({
  content: {
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
    videoThumb: {
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
    youtubeVideo: '',
    vimeoVideo: '',
    title: '',
    description: '',
    text: '',
  },
  status: true,
})

const form = ref<FormData>(createForm())

watch(
  () => props.componentData,
  val => {
    if (val) {
      form.value = createForm()
      setFormData(val)
    }
  },
  { immediate: true },
)

const uploadRef = ref()
const thumbUploadRef = ref()

async function getFormData() {
  // 检查互斥条件
  const hasVideo = form.value.content.video && form.value.content.video.id && form.value.content.video.id !== ''
  const hasYoutube = form.value.content.youtubeVideo && form.value.content.youtubeVideo.trim() !== ''
  const hasVimeo = form.value.content.vimeoVideo && form.value.content.vimeoVideo.trim() !== ''

  // 如果同时填写了多个视频源，报错
  const videoSourceCount = (hasVideo ? 1 : 0) + (hasYoutube ? 1 : 0) + (hasVimeo ? 1 : 0)
  if (videoSourceCount > 1) {
    ElMessage.error('只能选择一种视频源：上传视频、YouTube链接或Vimeo链接')
    return false
  }

  // 如果没有填写任何视频源，报错
  if (videoSourceCount === 0) {
    ElMessage.error('请提供视频源：上传视频、YouTube链接或Vimeo链接')
    return false
  }

  // 如果选择了上传视频，则获取上传的视频文件
  if (hasVideo) {
    const fileRes = uploadRef.value.getFileData()
    if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
      ElMessage.error('请上传视频')
      return false
    }
    form.value.content.video = fileRes.fileData
  }

  // 如果选择了视频缩略图，则获取上传的缩略图文件
  if (form.value.content.videoThumb && form.value.content.videoThumb.id && form.value.content.videoThumb.id !== '') {
    const thumbFileRes = thumbUploadRef.value.getFileData()
    if (thumbFileRes && thumbFileRes.fileData && thumbFileRes.fileData.id !== 0) {
      form.value.content.videoThumb = thumbFileRes.fileData
    }
  }

  return form.value
}

function setFormData(formData: FormData) {
  form.value = formData
}

// 监视视频源变化，确保互斥性
watch(
  () => form.value.content.video,
  newVal => {
    if (newVal && newVal.id && newVal.id !== '') {
      form.value.content.youtubeVideo = ''
      form.value.content.vimeoVideo = ''
    }
  },
  { deep: true },
)

watch(
  () => form.value.content.youtubeVideo,
  newVal => {
    if (newVal && newVal.trim() !== '') {
      form.value.content.video = {
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
      }
      form.value.content.vimeoVideo = ''
    }
  },
)

watch(
  () => form.value.content.vimeoVideo,
  newVal => {
    if (newVal && newVal.trim() !== '') {
      form.value.content.video = {
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
      }
      form.value.content.youtubeVideo = ''
    }
  },
)

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" v-model="form" label-width="100px" class="mt-2">
      <ElFormItem label="上传视频">
        <UploadVideo ref="uploadRef" :video-data="form.content.video" />
      </ElFormItem>

      <ElFormItem label="YouTube链接">
        <ElInput
          v-model="form.content.youtubeVideo"
          placeholder="请输入YouTube视频Code"
          :disabled="Boolean(
            (form.content.video && form.content.video.id && form.content.video.id !== '')
              || (form.content.vimeoVideo && form.content.vimeoVideo.trim() !== ''),
          )"
        />
      </ElFormItem>

      <ElFormItem label="Vimeo链接">
        <ElInput
          v-model="form.content.vimeoVideo"
          placeholder="请输入Vimeo视频Id"
          :disabled="Boolean(
            (form.content.video && form.content.video.id && form.content.video.id !== '')
              || (form.content.youtubeVideo && form.content.youtubeVideo.trim() !== ''),
          )"
        />
      </ElFormItem>

      <ElFormItem label="视频缩略图">
        <UploadSingleImage ref="thumbUploadRef" :file-data="form.content.videoThumb" />
      </ElFormItem>

      <ElFormItem label="标题">
        <ElInput v-model="form.content.title" placeholder="请输入文字" />
      </ElFormItem>

      <ElFormItem label="描述">
        <ElInput v-model="form.content.description" type="textarea" rows="4" placeholder="请输入文字" />
      </ElFormItem>

      <ElFormItem label="文字">
        <ElInput v-model="form.content.text" type="textarea" rows="4" placeholder="请输入文字" />
      </ElFormItem>

      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
