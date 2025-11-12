<script setup name="CommonText" lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import FontSizeSelect from './Modules/FontSizeSelect.vue'
import TextSetting from './Modules/TextSetting.vue'
import TextStyleControls from './Modules/TextStyleControls.vue'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

interface FormData {
  content: {
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
  status: boolean
}

const form = reactive<FormData>({
  content: {
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
  },
  status: true,
})

const rules = reactive({
  'content.text': [{ required: true, message: '请输入文字内容', trigger: 'blur' }],
})

// TextSetting组件引用
const titleTextSettingRef = ref<InstanceType<typeof TextSetting> | null>(null)
const subTitleTextSettingRef = ref<InstanceType<typeof TextSetting> | null>(null)

onMounted(() => {
  if (!props.componentData) {
    return
  }
  setFormData(props.componentData)

  // 初始化TextSetting组件数据
  setTimeout(() => {
    if (titleTextSettingRef.value && form.content) {
      titleTextSettingRef.value.setData({
        title: form.content.title,
        titleIcon: form.content.titleIcon,
        titleIconColor: form.content.titleIconColor,
        titleAlign: form.content.titleAlign,
        titleColor: form.content.titleColor,
        titleSize: form.content.titleSize,
        titleLink: form.content.titleLink,
        isShow: form.content.isShowTitle,
      })
    }
    if (subTitleTextSettingRef.value && form.content) {
      subTitleTextSettingRef.value.setData({
        title: form.content.subTitle,
        titleIcon: form.content.subTitleIcon,
        titleIconColor: form.content.subTitleIconColor,
        titleAlign: form.content.subTitleAlign,
        titleColor: form.content.subTitleColor,
        titleSize: form.content.subTitleSize,
        titleLink: form.content.subTitleLink,
        isShow: form.content.isShowSubTitle,
      })
    }
  }, 0)
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
  // 从TextSetting组件获取最新的数据
  if (titleTextSettingRef.value) {
    const titleData = titleTextSettingRef.value.getData()
    form.content.title = titleData.title
    form.content.titleIcon = titleData.titleIcon || ''
    form.content.titleIconColor = titleData.titleIconColor || '#000000'
    form.content.titleAlign = titleData.titleAlign
    form.content.titleColor = titleData.titleColor
    form.content.titleSize = titleData.titleSize
    form.content.titleLink = titleData.titleLink || {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    }
    form.content.isShowTitle = titleData.isShow !== undefined ? titleData.isShow : true
  }

  if (subTitleTextSettingRef.value) {
    const subTitleData = subTitleTextSettingRef.value.getData()
    form.content.subTitle = subTitleData.title
    form.content.subTitleIcon = subTitleData.titleIcon || ''
    form.content.subTitleIconColor = subTitleData.titleIconColor || '#000000'
    form.content.subTitleAlign = subTitleData.titleAlign
    form.content.subTitleColor = subTitleData.titleColor
    form.content.subTitleSize = subTitleData.titleSize
    form.content.subTitleLink = subTitleData.titleLink || {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    }
    form.content.isShowSubTitle = subTitleData.isShow !== undefined ? subTitleData.isShow : true
  }

  if (!form.content.title) {
    ElMessage.error('请输入标题')
    return false
  }
  return form
}

function setFormData(formData: FormData) {
  form.content = { ...formData.content }
  if (formData.content?.text && Array.isArray(formData.content?.text)) {
    form.content.text = [...formData.content.text] // 确保重新赋值，触发响应式
  }

  form.status = formData.status

  // 更新TextSetting组件数据
  if (titleTextSettingRef.value) {
    titleTextSettingRef.value.setData({
      title: form.content.title,
      titleIcon: form.content.titleIcon,
      titleIconColor: form.content.titleIconColor,
      titleAlign: form.content.titleAlign,
      titleColor: form.content.titleColor,
      titleSize: form.content.titleSize,
      titleLink: form.content.titleLink,
      isShow: form.content.isShowTitle,
    })
  }

  if (subTitleTextSettingRef.value) {
    subTitleTextSettingRef.value.setData({
      title: form.content.subTitle,
      titleIcon: form.content.subTitleIcon,
      titleIconColor: form.content.subTitleIconColor,
      titleAlign: form.content.subTitleAlign,
      titleColor: form.content.subTitleColor,
      titleSize: form.content.subTitleSize,
      titleLink: form.content.subTitleLink,
      isShow: form.content.isShowSubTitle,
    })
  }
}

// 获取文字内容样式数据
const getTextContentStyleData = (): TextStyleData => {
  return {
    textColor: form.content.textColor,
    textSize: form.content.textSize,
    textAlign: form.content.textAlign,
  }
}

// 设置文字内容样式数据
const setTextContentStyleData = (data: TextStyleData) => {
  form.content.textColor = data.textColor
  form.content.textSize = data.textSize
  form.content.textAlign = data.textAlign
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div class="w-full overflow-hidden">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="70px">
      <ElFormItem label="标题" required>
        <div class="w-full">
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
        </div>
      </ElFormItem>
      <ElFormItem label="副标题">
        <div class="w-full">
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
        </div>
      </ElFormItem>
      <ElFormItem label="文字内容">
        <!-- 文字内容输入区域 -->
        <div v-for="(item, index) in form.content.text" :key="index" class="w-full mb-4">
          <div class="flex">
            <ElInput v-model="form.content.text[index]" placeholder="请输入文字内容" />
            <EBtn text type="danger" class="ml-5" @click="handleRemove(index)">
              <Icon icon="ep:delete" />
            </EBtn>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <!-- 操作按钮和样式控制 -->
          <div class="flex items-center justify-between">
            <EBtn type="primary" plain size="default" class="mr-2" @click="handleAddText">
              <Icon icon="ep:plus" />
              增加一行文字
            </EBtn>
            <TextStyleControls :model-value="getTextContentStyleData()" @update:model-value="setTextContentStyleData">
              <template #font-size-control>
                <FontSizeSelect
                  :model-value="form.content.textSize"
                  @update:model-value="val => (form.content.textSize = val)"
                />
              </template>
            </TextStyleControls>
          </div>
        </div>
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
