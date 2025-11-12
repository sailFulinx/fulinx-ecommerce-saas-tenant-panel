<script setup name="CommonMultiText" lang="ts">
import { ElDialog, ElMessage } from 'element-plus'
import { reactive, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import TextSetting from './Modules/TextSetting.vue'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const _dragging = ref<boolean>(false)
const _createTextItemFormRef = ref()
const dialogVisible = ref<boolean>(false)
// 添加对TextSetting组件的引用
const titleTextSettingRef = ref<InstanceType<typeof TextSetting> | null>(null)
const subTitleTextSettingRef = ref<InstanceType<typeof TextSetting> | null>(null)

interface TextItem {
  id: number
  sort: number
  title: string
  titleIcon: string
  titleIconColor: string
  titleAlign: 'left' | 'center' | 'right'
  titleColor: string
  titleSize: number
  titleLink: LinkData
  isShowTitle: boolean
  subTitle: string
  subTitleIcon: string
  subTitleIconColor: string
  subTitleAlign: 'left' | 'center' | 'right'
  subTitleColor: string
  subTitleSize: number
  subTitleLink: LinkData
  isShowSubTitle: boolean
  text: string[]
  textAlign: 'left' | 'center' | 'right'
  textColor: string
  textSize: number
}

const createTextItemForm = (): TextItem => {
  return {
    id: 0,
    sort: 1,
    title: '',
    titleIcon: '',
    titleIconColor: '#000000',
    titleAlign: 'left',
    titleColor: '#000000',
    titleSize: 12,
    titleLink: {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    },
    isShowTitle: true,
    subTitle: '',
    subTitleIcon: '',
    subTitleIconColor: '#000000',
    subTitleAlign: 'left',
    subTitleColor: '#000000',
    subTitleSize: 12,
    subTitleLink: {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    },
    isShowSubTitle: true,
    text: [],
    textAlign: 'left',
    textColor: '#000000',
    textSize: 12,
  }
}

const textItemForm = ref<TextItem>(createTextItemForm())

interface FormData {
  content: {
    textList: TextItem[]
  }
  status: boolean
}

const form = reactive<FormData>({
  content: {
    textList: [],
  },
  status: true,
})

const _rules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
})

watch(
  () => props.componentData,
  val => {
    if (val) {
      setFormData(val)
    }
  },
  { immediate: true },
)

const handleAddText = () => {
  textItemForm.value = createTextItemForm()
  titleTextSettingRef.value?.setData({
    title: '',
    titleIcon: '',
    titleIconColor: '#000000',
    titleAlign: 'left',
    titleColor: '#000000',
    titleSize: 12,
    titleLink: {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    },
    isShow: true,
  })
  subTitleTextSettingRef.value?.setData({
    title: '',
    titleIcon: '',
    titleIconColor: '#000000',
    titleAlign: 'left',
    titleColor: '#000000',
    titleSize: 12,
    titleLink: {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    },
  })
  textItemForm.value.id = form.content.textList.length + 1
  textItemForm.value.sort = form.content.textList.length + 1
  dialogVisible.value = true
}

const handleAddTextItem = () => {
  if (!textItemForm.value.text) {
    textItemForm.value.text = []
  }
  textItemForm.value.text.push('') // 新增一行文字内容
  textItemForm.value.text = [...textItemForm.value.text] // 重新赋值以确保响应式更新
}

const handleEdit = (index: number) => {
  // 创建一个新的对象而不是直接引用，避免数据污染
  // 创建一个新的对象而不是直接引用，避免数据污染
  const originalItem = form.content.textList[index]
  textItemForm.value = JSON.parse(JSON.stringify(originalItem))
  dialogVisible.value = true

  // 更新TextSetting组件中的数据
  setTimeout(() => {
    if (titleTextSettingRef.value && textItemForm.value) {
      titleTextSettingRef.value.setData({
        title: textItemForm.value.title,
        titleIcon: textItemForm.value.titleIcon,
        titleIconColor: textItemForm.value.titleIconColor,
        titleAlign: textItemForm.value.titleAlign,
        titleColor: textItemForm.value.titleColor,
        titleSize: textItemForm.value.titleSize,
        titleLink: textItemForm.value.titleLink,
        isShow: textItemForm.value.isShowTitle,
      })
    }
    if (subTitleTextSettingRef.value && textItemForm.value) {
      subTitleTextSettingRef.value.setData({
        title: textItemForm.value.subTitle,
        titleIcon: textItemForm.value.subTitleIcon,
        titleIconColor: textItemForm.value.subTitleIconColor,
        titleAlign: textItemForm.value.subTitleAlign,
        titleColor: textItemForm.value.subTitleColor,
        titleSize: textItemForm.value.subTitleSize,
        titleLink: textItemForm.value.subTitleLink,
        isShow: textItemForm.value.isShowSubTitle,
      })
    }
  }, 0)
}

/**
 * 改变排序
 */
function handleChangeItemSort() {
  form.content.textList.forEach((item, index) => {
    item.sort = index + 1
  })
}

const handleRemove = (index: number) => {
  form.content.textList.splice(index, 1)
  handleChangeItemSort()
}

const handleRemoveItem = (index: number) => {
  if (!textItemForm.value.text) {
    textItemForm.value.text = []
  }
  textItemForm.value.text.splice(index, 1) // 删除指定的文字内容
  textItemForm.value.text = [...textItemForm.value.text] // 重新赋值以确保响应式更新
}

const handleSaveTextItem = async () => {
  const valid = await _createTextItemFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  // 从TextSetting组件获取最新的数据
  if (titleTextSettingRef.value) {
    const titleData = titleTextSettingRef.value.getData()
    textItemForm.value.title = titleData.title
    textItemForm.value.titleIcon = titleData.titleIcon || ''
    textItemForm.value.titleIconColor = titleData.titleIconColor || '#000000'
    textItemForm.value.titleAlign = titleData.titleAlign
    textItemForm.value.titleColor = titleData.titleColor
    textItemForm.value.titleSize = titleData.titleSize
    textItemForm.value.titleLink = titleData.titleLink || {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    }
    textItemForm.value.isShowTitle = titleData.isShow !== undefined ? titleData.isShow : true
  }

  if (subTitleTextSettingRef.value) {
    const subTitleData = subTitleTextSettingRef.value.getData()
    textItemForm.value.subTitle = subTitleData.title
    textItemForm.value.subTitleIcon = subTitleData.titleIcon || ''
    textItemForm.value.subTitleIconColor = subTitleData.titleIconColor || '#000000'
    textItemForm.value.subTitleAlign = subTitleData.titleAlign
    textItemForm.value.subTitleColor = subTitleData.titleColor
    textItemForm.value.subTitleSize = subTitleData.titleSize
    textItemForm.value.subTitleLink = subTitleData.titleLink || {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    }
    textItemForm.value.isShowSubTitle = subTitleData.isShow !== undefined ? subTitleData.isShow : true
  }

  dialogVisible.value = false
  // 如果id在form.content.textList中不存在，则新增，否则修改
  const index = form.content.textList.findIndex(item => item.id === textItemForm.value.id)
  if (index > -1) {
    form.content.textList.splice(index, 1, textItemForm.value)
  } else {
    form.content.textList.push(textItemForm.value)
  }
  console.log(form.content.textList)
}

async function getFormData() {
  if (form.content.textList.length === 0) {
    ElMessage.error('请添加一组文字')
    return false
  }
  return form
}

function setFormData(formData: FormData) {
  if (formData.content?.textList && Array.isArray(formData.content?.textList)) {
    form.content.textList = [...formData.content.textList] // 确保重新赋值，触发响应式
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
    <ElForm :model="form" label-width="100px">
      <ElFormItem label="文字内容" required>
        <div class="flex w-full">
          <EBtn plain type="primary" @click="handleAddText">
            <Icon icon="ep:plus" />
            增加一组文字
          </EBtn>
        </div>

        <VueDraggable v-model="form.content.textList" item-key="sort" class="w-full grid grid-cols-3 gap-4 mt-5" @start="_dragging = true" @end="handleChangeItemSort">
          <div v-for="(item, index) in form.content.textList" :key="index" class="col-span-1 h-36 border border-gray-300" shadow="never">
            <div class="bg-gray-50 flex justify-between items-center p-2 border-b border-gray-300">
              <div class="flex items-center">
                <Icon name="ant-design:holder-outlined" class="mr-1" />
                第{{ item.sort }}组文字
              </div>
              <div class="flex items-center justify-end">
                <Icon icon="ep:edit" :size="4" color="#1890ff" class="mr-3 cursor-pointer" @click="handleEdit(index)" />
                <Icon icon="ep:delete" :size="4" color="#f56c6c" class="cursor-pointer" @click="handleRemove(index)" />
              </div>
            </div>
            <div class="w-full p-2">
              <div class="w-full flex">
                <span class="flex-none pr-2">标题：</span>
                <span class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{{ item.title }}</span>
              </div>
              <div class="w-full flex">
                <span class="flex-none pr-2">副标题：</span>
                <span class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{{ item.subTitle }}</span>
              </div>
            </div>
          </div>
        </VueDraggable>
      </ElFormItem>

      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>

    <ElDialog v-model="dialogVisible" title="编辑文字内容">
      <ElForm ref="_createTextItemFormRef" :model="textItemForm" :rules="_rules" label-width="140px">
        <ElFormItem label="标题" required>
          <TextSetting
            ref="titleTextSettingRef"
            :show-icon-controls="true"
            :show-display-switch="true"
            :show-font-color-control="true"
            :show-font-size-control="true"
            :show-text-align-control="true"
            :show-module-link="true"
            :is-need-children="true"
            label="标题"
          />
        </ElFormItem>

        <ElFormItem label="副标题">
          <TextSetting
            ref="subTitleTextSettingRef"
            :show-icon-controls="true"
            :show-display-switch="true"
            :show-font-color-control="true"
            :show-font-size-control="true"
            :show-text-align-control="true"
            :show-module-link="true"
            :is-need-children="true"
            label="副标题"
          />
        </ElFormItem>

        <ElFormItem label="文字">
          <div v-for="(item, index) in textItemForm.text" :key="index" class="w-full mb-4">
            <div class="flex">
              <ElInput v-model="textItemForm.text[index]" placeholder="请输入文字内容" />
              <EBtn text type="danger" class="ml-5" @click="handleRemoveItem(index)">
                <Icon icon="ep:delete" />
              </EBtn>
            </div>
          </div>
          <EBtn @click="handleAddTextItem">
            <Icon icon="ep:plus" />
            增加一行文字
          </EBtn>
        </ElFormItem>
      </ElForm>

      <template #footer>
        <div class="flex justify-end">
          <EBtn @click="dialogVisible = false">
            取消
          </EBtn>
          <EBtn type="primary" @click="handleSaveTextItem">
            提交
          </EBtn>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
