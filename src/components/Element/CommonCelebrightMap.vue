<script setup lang="ts">
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
const _moduleLinkRef = ref()
const dragging = ref(false)
const tabFormRef = ref()

interface FileItem {
  id?: number
  image: FileData
  link: LinkData
  alt: string
  title: string
  titleAlign: 'left' | 'center' | 'right'
  titleColor: string
  titleSize: number
  text: string[]
  textAlign: 'left' | 'center' | 'right'
  textColor: string
  textSize: number
  buttonText: string
  buttonLink: LinkData
  tabs: {
    tabName: string
    title: string
    titleColor: string
    titleSize: number
    buttonText: string
    buttonLink: LinkData
    text: string[]
    textAlign: 'left' | 'center' | 'right'
    textColor: string
    textSize: number
    image: FileData
    alt: string
  }[]
  sort: number
}

interface FormData {
  content: {
    logo: FileData
    title: string
    description: string
    fileList: FileItem[]
  }
  status: boolean
}

// 添加dialog相关的响应式变量
const dialogVisible = ref(false)
const currentEditItem = ref<FileItem | null>(null)
const currentEditIndex = ref<number | null>(null)

// 添加tabs相关的响应式变量
const tabDialogVisible = ref(false)
const currentEditTab = ref<any>(null)
const currentEditTabIndex = ref<number | null>(null)
const tabDragging = ref(false)
const tabUploadRef = ref()
const tabModuleLinkRef = ref()
const logoUploadRef = ref()
const createFileItem = (): FileItem => {
  return {
    id: 1,
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
    tabs: [],
    sort: 1,
  }
}

const createForm = (): FormData => {
  return {
    content: {
      logo: {} as FileData,
      title: '',
      description: '',
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

  // 确保 tabs 数组存在
  if (!currentEditItem.value.tabs) {
    currentEditItem.value.tabs = []
  }
}

// 添加保存项目的方法
const saveItem = () => {
  if (currentEditItem.value) {
    let fileRes

    if (uploadSingleRef.value) {
      fileRes = uploadSingleRef.value.getFileData()
      if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
        ElMessage.error('请上传图片')
        return false
      }
      currentEditItem.value.image = fileRes.fileData
    }

    // 确保 form.content.fileList 已初始化
    if (!form.content.fileList) {
      form.content.fileList = []
    }

    // 确保 tabs 数组已初始化
    if (!currentEditItem.value.tabs) {
      currentEditItem.value.tabs = []
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

// 添加tabs相关的方法
const createTabItem = () => {
  return {
    tabName: '',
    title: '',
    titleSize: 12,
    titleColor: '#000000',
    buttonText: '',
    buttonLink: {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    },
    text: [],
    textSize: 12,
    textColor: '#000000',
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
    alt: '',
  }
}

// 添加tab
const addTab = () => {
  if (!currentEditItem.value) {
    return
  }
  currentEditTab.value = createTabItem()
  currentEditTabIndex.value = null
  tabDialogVisible.value = true
}

// 编辑tab
const editTab = (index: number) => {
  if (!currentEditItem.value) {
    return
  }
  currentEditTab.value = { ...currentEditItem.value.tabs[index] }
  currentEditTabIndex.value = index
  tabDialogVisible.value = true

  // 在下一个tick中设置引用数据，确保DOM已更新
  nextTick(() => {
    if (tabUploadRef.value && currentEditTab.value) {
      tabUploadRef.value.setFileData(currentEditTab.value.image)
    }
    if (tabModuleLinkRef.value && currentEditTab.value) {
      tabModuleLinkRef.value.setLinkData(currentEditTab.value.buttonLink)
    }
  })
}

// 保存tab
const saveTab = () => {
  if (!currentEditItem.value || !currentEditTab.value) {
    return
  }

  // 获取图片数据（可选）
  if (tabUploadRef.value) {
    const fileRes = tabUploadRef.value.getFileData()
    if (fileRes && fileRes.fileData && fileRes.fileData.id) {
      currentEditTab.value.image = fileRes.fileData
    }
  }

  // 获取链接数据
  if (tabModuleLinkRef.value) {
    const link = tabModuleLinkRef.value.getLinkData()
    currentEditTab.value.buttonLink = link
  }

  if (currentEditTabIndex.value === null) {
    // 添加新tab
    currentEditItem.value.tabs.push(currentEditTab.value)
  } else {
    // 更新现有tab
    currentEditItem.value.tabs[currentEditTabIndex.value] = currentEditTab.value
  }

  tabDialogVisible.value = false
  currentEditTab.value = null
  currentEditTabIndex.value = null
}

// 删除tab
const removeTab = (index: number) => {
  if (!currentEditItem.value) {
    return
  }
  currentEditItem.value.tabs.splice(index, 1)
}

// tab拖拽开始
const handleTabDragStart = () => {
  tabDragging.value = true
}

// tab拖拽结束
const handleTabDragEnd = () => {
  tabDragging.value = false
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
  // 获取logo数据
  if (logoUploadRef.value) {
    const logoRes = logoUploadRef.value.getFileData()
    if (logoRes && logoRes.fileData) {
      form.content.logo = logoRes.fileData
    }
  }

  // 验证必填字段
  if (!form.content.title) {
    ElMessage.error('请输入标题')
    throw new Error('请输入标题')
  }

  if (!form.content.description) {
    ElMessage.error('请输入描述')
    throw new Error('请输入描述')
  }

  if (!form.content.logo || !form.content.logo.id) {
    ElMessage.error('请上传Logo')
    throw new Error('请上传Logo')
  }

  // 验证每个项目
  // for (let i = 0; i < form.content.fileList.length; i++) {
  //   const item = form.content.fileList[i]
  //   if (item.type === 'image') {
  //     // 对于图片，我们不需要额外验证，因为图片数据已存储在item.image中
  //   } else {
  //     // 对于视频，需要确保视频和缩略图都已上传
  //     if (!item.video || !item.video.id) {
  //       ElMessage.error(`第${i + 1}项：请上传视频`)
  //       throw new Error(`第${i + 1}项：请上传视频`)
  //     }
  //     if (!item.thumbnail || !item.thumbnail.id) {
  //       ElMessage.error(`第${i + 1}项：请上传视频缩略图`)
  //       throw new Error(`第${i + 1}项：请上传视频缩略图`)
  //     }
  //   }
  // }

  return form
}

async function setFormData(formData: FormData) {
  await nextTick()
  if (hasContentElements(formData.content || {})) {
    // 设置 logo、title 和 description 字段
    if (formData.content.logo) {
      form.content.logo = formData.content.logo
    }
    if (formData.content.title) {
      form.content.title = formData.content.title
    }
    if (formData.content.description) {
      form.content.description = formData.content.description
    }

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

  // 在下一个tick中设置logo上传组件的数据
  nextTick(() => {
    if (logoUploadRef.value && form.content.logo) {
      logoUploadRef.value.setFileData(form.content.logo)
    }
  })
}

// 生成 font size 选项
function generateFontSizeOptions() {
  const options = []
  for (let i = 10; i <= 64; i += 2) {
    options.push({ label: `${i}px`, value: i })
  }
  return options
}

const _fontSizeOptions = generateFontSizeOptions()

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" v-model="form" label-width="100px">
      <div class="w-full mb-3">
        <ElFormItem label="状态" required class="ml-auto">
          <ElSwitch v-model="form.status" />
        </ElFormItem>
        <ElFormItem label="Logo" required>
          <UploadSingleImage ref="logoUploadRef" :image-data="form.content.logo" />
        </ElFormItem>

        <ElFormItem label="标题" required>
          <ElInput v-model="form.content.title" placeholder="请输入标题" />
        </ElFormItem>

        <ElFormItem label="描述" required>
          <ElInput
            v-model="form.content.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </ElFormItem>

        <div class="flex justify-between items-center mb-3">
          <EBtn type="primary" class="mb-4" @click="addItem">
            <Icon icon="ep:plus" />
            添加项目
          </EBtn>
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
          <ElCard
            v-for="(item, index) in form.content.fileList"
            :key="index"
            shadow="never"
            class="cursor-move mb-4"
          >
            <template #header>
              <div class="flex justify-between items-center">
                <div class="flex justify-start items-center">
                  <div class="p-1 rounded hover:bg-gray-100 transition-colors">
                    <span><Icon icon="ant-design:holder-outlined" /></span>
                  </div>
                  <h3 class="text-md font-medium">
                    项目 {{ item.title || '无' }}
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
                  <span class="font-medium">标题:</span>
                  <span>{{ item.title || '无' }}</span>
                </div>

                <div>
                  <span class="font-medium">轮播数量:</span>
                  <span>{{ item.tabs ? item.tabs.length : 0 }}</span>
                </div>
              </div>
              <div class="col-span-1">
                <img
                  v-if="item.image && item.image.fileUrl"
                  :src="item.image.fileUrl"
                  class="w-full"
                >
              </div>
            </div>
          </ElCard>
        </VueDraggable>
      </div>
    </ElForm>

    <!-- 添加ElDialog -->
    <ElDialog
      v-model="dialogVisible"
      :title="currentEditIndex === null ? '添加项目' : '编辑项目'"
      width="80%"
      @close="currentEditItem = null"
    >
      <ElForm
        v-if="currentEditItem"
        ref="dialogFormRef"
        :model="currentEditItem"
        label-width="100px"
      >
        <ElFormItem label="图片">
          <UploadSingleImage ref="uploadSingleRef" :image-data="currentEditItem.image" />
        </ElFormItem>

        <ElFormItem label="Alt标签">
          <ElInput v-model="currentEditItem.alt" placeholder="请输入Alt标签" />
        </ElFormItem>

        <ElFormItem label="节点标题">
          <div class="flex items-center w-full gap-x-2">
            <ElInput v-model="currentEditItem.title" placeholder="请输入节点标题" />
            <!-- <ElColorPicker v-model="currentEditItem.titleColor" />
            <ElSelect
              v-model="currentEditItem.titleSize"
              class="w-[200px] mr-2"
              placeholder="请选择字号"
            >
              <ElOption
                v-for="option in _fontSizeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
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
            </ElRadioGroup> -->
          </div>
        </ElFormItem>

        <ElFormItem label="文字">
          <div
            v-for="(textItem, textIndex) in currentEditItem.text"
            :key="textIndex"
            class="w-full mb-4"
          >
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
            <!-- <ElColorPicker v-model="currentEditItem.textColor" class="mr-2" />
            <ElSelect
              v-model="currentEditItem.textSize"
              class="mr-2"
              style="width: 200px"
              placeholder="请选择字号"
            >
              <ElOption
                v-for="option in _fontSizeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect> -->
            <!-- <ElRadioGroup v-model="currentEditItem.textAlign" class="shrink-0">
              <ElRadioButton size="default" value="left">
                <Icon name="ant-design:align-left-outlined" />
              </ElRadioButton>
              <ElRadioButton size="default" value="center">
                <Icon name="ant-design:align-center-outlined" />
              </ElRadioButton>
              <ElRadioButton size="default" value="right">
                <Icon name="ant-design:align-right-outlined" />
              </ElRadioButton>
            </ElRadioGroup> -->
          </div>
        </ElFormItem>

        <!-- 左侧tab -->
        <ElFormItem label="轮播">
          <div class="w-full">
            <!-- 添加tab按钮 -->
            <EBtn v-if="!tabDialogVisible" type="primary" class="mb-4" @click="addTab">
              <Icon icon="ep:plus" />
              添加轮播项
            </EBtn>

            <!-- tabs卡片列表 -->
            <VueDraggable
              v-if="currentEditItem && currentEditItem.tabs && currentEditItem.tabs.length > 0"
              v-model="currentEditItem.tabs"
              item-key="tabName"
              :animation="200"
              :fallback-on-body="true"
              :swap-threshold="0.65"
              ghost-class="opacity-50"
              @start="handleTabDragStart"
              @end="handleTabDragEnd"
            >
              <ElCard
                v-for="(tab, tabIndex) in currentEditItem.tabs"
                :key="tabIndex"
                shadow="never"
                class="cursor-move mb-4"
              >
                <template #header>
                  <div class="flex justify-between items-center">
                    <div class="flex justify-start items-center">
                      <div class="p-1 rounded hover:bg-gray-100 transition-colors">
                        <span><Icon icon="ant-design:holder-outlined" /></span>
                      </div>
                      <h3 class="text-md font-medium">
                        {{ tab.tabName || `Tab ${tabIndex + 1}` }}
                      </h3>
                    </div>

                    <div class="flex justify-end items-center">
                      <EBtn type="primary" text @click="editTab(tabIndex)">
                        <Icon icon="ep:edit" class="mr-1" />
                        编辑
                      </EBtn>
                      <EBtn type="danger" text @click="removeTab(tabIndex)">
                        <Icon icon="ep:delete" class="mr-1" />
                        删除
                      </EBtn>
                    </div>
                  </div>
                </template>
                <div class="grid grid-cols-4 gap-2 mb-2">
                  <div class="col-span-3 grid grid-cols-2 gap-2">
                    <div>
                      <span class="font-medium">按钮标题:</span>
                      <span>{{ tab.tabName || '无' }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Alt标签:</span>
                      <span>{{ tab.alt || '无' }}</span>
                    </div>
                  </div>
                  <div class="col-span-1">
                    <img v-if="tab.image && tab.image.fileUrl" :src="tab.image.fileUrl" class="w-full h-20 object-cover rounded">
                  </div>
                </div>
              </ElCard>
            </VueDraggable>
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

    <!-- Tab编辑对话框 -->
    <ElDialog
      v-model="tabDialogVisible"
      :title="currentEditTabIndex === null ? '新增轮播项' : '编辑轮播项'"
      width="80%"
      @close="currentEditTab = null"
    >
      <ElForm v-if="currentEditTab" ref="tabFormRef" :model="currentEditTab" label-width="100px">
        <ElFormItem label="轮播标题">
          <ElInput v-model="currentEditTab.tabName" placeholder="请输入轮播标题" />
        </ElFormItem>
        <ElFormItem label="图片">
          <UploadSingleImage ref="tabUploadRef" :image-data="currentEditTab.image" />
        </ElFormItem>

        <ElFormItem label="图片Alt标签">
          <ElInput v-model="currentEditTab.alt" placeholder="请输入图片Alt标签" />
        </ElFormItem>

        <ElFormItem label="图片链接">
          <ModuleLink ref="tabModuleLinkRef" :is-need-children="false" />
        </ElFormItem>

        <!-- <ElFormItem label="标题">
          <div class="flex items-center w-full">
            <ElInput v-model="currentEditTab.title" placeholder="请输入标题" class="mr-2" />
            <ElColorPicker v-model="currentEditTab.titleColor" class="mr-2" />
            <ElSelect
              v-model="currentEditTab.titleSize"
              class="w-[200px] mr-2"
              placeholder="请选择字号"
            >
              <ElOption
                v-for="option in _fontSizeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </div>
        </ElFormItem> -->

        <!-- <ElFormItem label="文字">
          <div
            v-for="(textItem, textIndex) in currentEditTab.text"
            :key="textIndex"
            class="w-full mb-4"
          >
            <div class="flex">
              <ElInput v-model="currentEditTab.text[textIndex]" placeholder="请输入文字内容" />
              <EBtn
                text
                type="danger"
                class="ml-5"
                @click="
                  () => {
                    if (currentEditTab) currentEditTab.text.splice(textIndex, 1)
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
                if (currentEditTab) currentEditTab.text.push('')
              }
            "
          >
            <Icon icon="ep:plus" />
            增加一行文字
          </EBtn>
          <div class="flex">
            <ElColorPicker v-model="currentEditTab.textColor" class="mr-2" />
            <ElSelect
              v-model="currentEditTab.textSize"
              class="mr-2"
              style="width: 200px"
              placeholder="请选择字号"
            >
              <ElOption
                v-for="option in _fontSizeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </div>
        </ElFormItem>

        <ElFormItem label="按钮文字">
          <ElInput v-model="currentEditTab.buttonText" placeholder="请输入按钮文字" />
        </ElFormItem>

        <ElFormItem label="链接">
          <ModuleLink ref="tabModuleLinkRef" :is-need-children="false" />
        </ElFormItem> -->
      </ElForm>

      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="tabDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="saveTab">保存</ElButton>
        </span>
      </template>
    </ElDialog>
  </div>
</template>
