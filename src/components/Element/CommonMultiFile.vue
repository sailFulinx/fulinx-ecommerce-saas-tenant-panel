<script setup name="CommonMultiFile" lang="ts">
import { ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'
import { hasContentElements } from '@/utils'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const formRef = ref()
const dialogFormRef = ref()
const uploadSingleRef = ref()
const uploadVideoRef = ref()
const uploadThumbnailRef = ref()
const moduleLinkRef = ref()
const buttonModuleLinkRef = ref()
const dragging = ref(false)

interface FileItem {
  id?: number
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
  buttonText: string
  buttonLink: LinkData
  sort: number
}

interface FormData {
  content: {
    fileList: FileItem[]
  }
  status: boolean
}

// 添加dialog相关的响应式变量
const dialogVisible = ref(false)
const currentEditItem = ref<FileItem | null>(null)
const currentEditIndex = ref<number | null>(null)

const createFileItem = (): FileItem => {
  return {
    id: 1,
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
    sort: 1,
  }
}

const createForm = (): FormData => {
  return {
    content: {
      fileList: [],
    },
    status: true,
  }
}

let form = reactive<FormData>(createForm())
watch(
  () => props.componentData,
  val => {
    if (val) {
      setFormData(val)
    }
  },
  { immediate: true },
)

// 修改addItem方法，打开dialog
const addItem = () => {
  currentEditItem.value = createFileItem()
  currentEditIndex.value = null
  dialogVisible.value = true
}

// 修改removeItem方法，添加确认
const removeItem = (index: number) => {
  form.content.fileList.splice(index, 1)
}

// 添加编辑项目的方法
const editItem = (index: number) => {
  currentEditItem.value = { ...form.content.fileList[index] }
  currentEditIndex.value = index
  dialogVisible.value = true
}

// 添加保存项目的方法
const saveItem = () => {
  if (currentEditItem.value) {
    let fileRes
    if (currentEditItem.value.type === 'image') {
      if (uploadSingleRef.value) {
        fileRes = uploadSingleRef.value.getFileData()
        if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
          ElMessage.error('请上传图片')
          return false
        }
        currentEditItem.value.image = fileRes.fileData
      }
    } else {
      if (uploadVideoRef.value) {
        fileRes = uploadVideoRef.value.getFileData()
        if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
          ElMessage.error('请上传视频')
          return false
        }
        currentEditItem.value.video = fileRes.fileData
      }
      if (uploadThumbnailRef.value) {
        // 检查缩略图
        const thumbnailRes = uploadThumbnailRef.value.getFileData()
        if (!thumbnailRes || !thumbnailRes.fileData || thumbnailRes.fileData.id === 0) {
          ElMessage.error('请上传视频缩略图')
          return false
        }
        currentEditItem.value.thumbnail = thumbnailRes.fileData
      }
    }

    const link = moduleLinkRef.value.getLinkData()
    currentEditItem.value.link = link

    // 确保 form.content.fileList 已初始化
    if (!form.content.fileList) {
      form.content.fileList = []
    }

    if (currentEditIndex.value === null) {
      // 添加新项目
      form.content.fileList.push(currentEditItem.value)
    } else {
      // 更新现有项目
      form.content.fileList[currentEditIndex.value] = currentEditItem.value
    }
    dialogVisible.value = false
    currentEditItem.value = null
    currentEditIndex.value = null
  }
}

// 拖拽开始
const handleDragStart = () => {
  dragging.value = true
}

// 更新排序
function handleChangeSort() {
  form.content.fileList.forEach((item: FileItem, index: number) => {
    item.sort = index + 1
  })
}

// 拖拽结束，重新排序
const handleDragEnd = () => {
  dragging.value = false
  handleChangeSort()
}

async function getFormData() {
  // 验证每个项目
  for (let i = 0; i < form.content.fileList.length; i++) {
    const item = form.content.fileList[i]
    if (item.type === 'image') {
      // 对于图片，我们不需要额外验证，因为图片数据已存储在item.image中
    } else {
      // 对于视频，需要确保视频和缩略图都已上传
      if (!item.video || !item.video.id) {
        ElMessage.error(`第${i + 1}项：请上传视频`)
        throw new Error(`第${i + 1}项：请上传视频`)
      }
      if (!item.thumbnail || !item.thumbnail.id) {
        ElMessage.error(`第${i + 1}项：请上传视频缩略图`)
        throw new Error(`第${i + 1}项：请上传视频缩略图`)
      }
    }
  }

  return form
}

async function setFormData(formData: FormData) {
  await nextTick()
  if (hasContentElements(formData.content)) {
    if (formData.content.fileList && Array.isArray(formData.content.fileList)) {
      form.content.fileList = formData.content.fileList.map(item => ({
        ...createFileItem(),
        ...item,
      }))
    } else {
      form.content.fileList = []
    }
    form = { ...formData }
  } else {
    form = reactive({ ...createForm() })
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
      <div class="flex justify-between items-center mb-3">
        <EBtn type="primary" class="mb-4" @click="addItem">
          <Icon icon="ep:plus" />
          添加项目
        </EBtn>

        <ElFormItem label="状态" required>
          <ElSwitch v-model="form.status" />
        </ElFormItem>
      </div>
      <VueDraggable
        v-model="form.content.fileList"
        item-key="id"
        :animation="200"
        :fallback-on-body="true"
        :swap-threshold="0.65"
        ghost-class="opacity-50"
        @start="handleDragStart"
        @end="handleDragEnd"
      >
        <ElCard v-for="(item, index) in form.content.fileList" :key="index" shadow="never" class="cursor-move mb-4">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex justify-start items-center">
                <div class="p-1 rounded hover:bg-gray-100 transition-colors">
                  <span><Icon icon="ant-design:holder-outlined" /></span>
                </div>
                <h3 class="text-md font-medium">
                  项目 {{ index + 1 }}
                </h3>
              </div>

              <div class="flex justify-end items-center">
                <EBtn type="primary" text @click="editItem(index)">
                  <Icon icon="ep:edit" class="mr-1" />
                  编辑
                </EBtn>
                <EBtn type="danger" text @click="removeItem(index)">
                  <Icon icon="ep:delete" class="mr-1" />
                  删除
                </EBtn>
              </div>
            </div>
          </template>
          <div class="grid grid-cols-4 gap-2 mb-2">
            <div class="col-span-3 grid grid-cols-2 gap-2">
              <div>
                <span class="font-medium">类型:</span>
                <span>{{ item.type === 'image' ? '图片' : '视频' }}</span>
              </div>
              <div>
                <span class="font-medium">标题:</span>
                <span>{{ item.title || '无' }}</span>
              </div>
              <div>
                <span class="font-medium">Alt标签:</span>
                <span>{{ item.alt || '无' }}</span>
              </div>
              <div>
                <span class="font-medium">按钮文字:</span>
                <span>{{ item.buttonText || '无' }}</span>
              </div>
            </div>
            <div class="col-span-1">
              <img v-if="item.image && item.image.fileUrl" :src="item.image.fileUrl" class="w-full">
              <video v-if="item.video && item.video.fileUrl" class="w-full">
                <source :src="item.video.fileUrl" type="video/mp4">
              </video>
            </div>
          </div>
        </ElCard>
      </VueDraggable>
    </ElForm>

    <!-- 添加ElDialog -->
    <ElDialog
      v-model="dialogVisible"
      :title="currentEditIndex === null ? '添加项目' : '编辑项目'"
      width="80%"
      @close="currentEditItem = null"
    >
      <ElForm v-if="currentEditItem" ref="dialogFormRef" :model="currentEditItem" label-width="100px">
        <ElFormItem label="文件类型">
          <ElRadioGroup v-model="currentEditItem.type">
            <ElRadio label="image">
              图片
            </ElRadio>
            <ElRadio label="video">
              视频
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>

        <ElFormItem v-if="currentEditItem.type === 'image'" label="图片">
          <UploadSingleImage ref="uploadSingleRef" :image-data="currentEditItem.image" />
        </ElFormItem>

        <template v-else>
          <ElFormItem label="视频">
            <UploadVideo ref="uploadVideoRef" :video-data="currentEditItem.video" />
          </ElFormItem>
          <ElFormItem label="缩略图">
            <UploadSingleImage ref="uploadThumbnailRef" :image-data="currentEditItem.thumbnail" />
          </ElFormItem>
        </template>

        <ElFormItem label="链接地址">
          <ModuleLink ref="moduleLinkRef" :is-need-children="false" />
        </ElFormItem>

        <ElFormItem label="Alt标签">
          <ElInput v-model="currentEditItem.alt" placeholder="请输入Alt标签" />
        </ElFormItem>

        <ElFormItem label="标题">
          <div class="flex items-center w-full">
            <ElInput v-model="currentEditItem.title" placeholder="请输入标题" class="mr-2" />
            <ElColorPicker v-model="currentEditItem.titleColor" class="mr-2" />
            <ElSelect v-model="currentEditItem.titleSize" class="w-[200px] mr-2" placeholder="请选择字号">
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
            <ElRadioGroup v-model="currentEditItem.titleAlign" class="shrink-0">
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
            <ElInput v-model="currentEditItem.subTitle" placeholder="请输入副标题" class="mr-2" />
            <ElColorPicker v-model="currentEditItem.subTitleColor" class="mr-2" />
            <ElSelect v-model="currentEditItem.subTitleSize" class="w-[200px] mr-2" placeholder="请选择字号">
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
            <ElRadioGroup v-model="currentEditItem.subTitleAlign" class="shrink-0">
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

        <ElFormItem label="按钮文字">
          <ElInput v-model="currentEditItem.buttonText" />
        </ElFormItem>

        <ElFormItem label="按钮链接">
          <ModuleLink ref="buttonModuleLinkRef" :is-need-children="false" />
        </ElFormItem>

        <ElFormItem label="文字">
          <div v-for="(textItem, textIndex) in currentEditItem.text" :key="textIndex" class="w-full mb-4">
            <div class="flex">
              <ElInput v-model="currentEditItem.text[textIndex]" placeholder="请输入文字内容" />
              <EBtn
                text
                type="danger"
                class="ml-5"
                @click="
                  () => {
                    if (currentEditItem) currentEditItem.text.splice(textIndex, 1)
                  }
                "
              >
                <Icon icon="ep:delete" />
              </EBtn>
            </div>
          </div>
          <EBtn
            size="default"
            class="mr-2"
            @click="
              () => {
                if (currentEditItem) currentEditItem.text.push('')
              }
            "
          >
            <Icon icon="ep:plus" />
            增加一行文字
          </EBtn>
          <div class="flex">
            <ElColorPicker v-model="currentEditItem.textColor" class="mr-2" />
            <ElSelect v-model="currentEditItem.textSize" class="mr-2" style="width: 200px" placeholder="请选择字号">
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
            <ElRadioGroup v-model="currentEditItem.textAlign" class="shrink-0">
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
      </ElForm>

      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="dialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="saveItem">保存</ElButton>
        </span>
      </template>
    </ElDialog>
  </div>
</template>
