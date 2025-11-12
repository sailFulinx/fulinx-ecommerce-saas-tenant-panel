<script setup lang="ts">
import { ElDialog } from 'element-plus'
import { ref } from 'vue'
import IconPicker from '@/components/common/IconPicker.vue'
import FontSizeSelect from './FontSizeSelect.vue'
import ModuleLink from './ModuleLink.vue'

// 定义组件属性
const props = defineProps({
  showIconControls: {
    type: Boolean,
    default: false,
  },
  showDisplaySwitch: {
    type: Boolean,
    default: false,
  },
  showFontColorControl: {
    type: Boolean,
    default: false,
  },
  showFontSizeControl: {
    type: Boolean,
    default: false,
  },
  showTextAlignControl: {
    type: Boolean,
    default: false,
  },
  showModuleLink: {
    type: Boolean,
    default: false,
  },
  isNeedChildren: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '标题',
  },
})

// 图标选择器可见性
const iconPickerVisible = ref(false)
// ModuleLink组件引用
const moduleLinkRef = ref<InstanceType<typeof ModuleLink> | null>(null)

// 内部数据
const internalData = ref<TitleSettingData>({
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

// 图标选择相关方法
const openIconPicker = () => {
  iconPickerVisible.value = true
}

const handleIconSelect = (icon: string) => {
  internalData.value.titleIcon = icon
  iconPickerVisible.value = false
}

const removeIcon = () => {
  internalData.value.titleIcon = ''
  internalData.value.titleIconColor = '#000000'
}

// 获取链接数据
const getLinkData = () => {
  if (moduleLinkRef.value && props.showModuleLink) {
    return moduleLinkRef.value.getLinkData()
  }
  return {
    linkUrl: '',
    linkValue: '',
    linkLabel: '',
    linkType: '',
    children: [],
  }
}

// 设置链接数据
const setLinkData = (data: LinkData) => {
  if (moduleLinkRef.value && props.showModuleLink) {
    moduleLinkRef.value.setLinkData(data)
  }
  internalData.value.titleLink = data
}

// 提供getData和setData方法以支持通用性
function getData() {
  if (moduleLinkRef.value && props.showModuleLink) {
    internalData.value.titleLink = moduleLinkRef.value.getLinkData()
  }
  return { ...internalData.value }
}

function setData(value: TitleSettingData) {
  internalData.value = { ...internalData.value, ...value }
  if (value.titleLink && moduleLinkRef.value && props.showModuleLink) {
    moduleLinkRef.value.setLinkData(value.titleLink)
  }
}

// 暴露方法给父组件
defineExpose({
  getData,
  setData,
  getLinkData,
  setLinkData,
})
</script>

<template>
  <div class="w-full">
    <div class="w-full flex items-center mb-2">
      <ElSwitch v-if="showDisplaySwitch" v-model="internalData.isShow" class="mr-2" />
    </div>

    <div v-if="showIconControls" class="w-full flex items-center mb-2">
      <ElButton class="mr-2" @click="openIconPicker">
        <Icon
          v-if="internalData.titleIcon"
          :icon="internalData.titleIcon"
          :style="{ color: internalData.titleIconColor }"
        />
        <span v-else>选择图标</span>
      </ElButton>
      <ElColorPicker v-if="internalData.titleIcon" v-model="internalData.titleIconColor" class="mr-2" />
      <ElButton v-if="internalData.titleIcon" link type="danger" class="mr-1" @click="removeIcon">
        <Icon icon="ep:delete" />
      </ElButton>
    </div>
    <div class="w-full flex items-center mb-2">
      <ElInput v-model="internalData.title" :placeholder="`请输入${label}`" class="flex-1 min-w-0" />
    </div>

    <div class="w-full flex items-center mb-2">
      <ElColorPicker v-if="showFontColorControl" v-model="internalData.titleColor" class="mr-2" />
      <FontSizeSelect v-if="showFontSizeControl" v-model="internalData.titleSize" class="mr-2" />
      <ElRadioGroup v-if="showTextAlignControl" v-model="internalData.titleAlign" class="mr-2 w-[140px]">
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
    <div class="w-full flex items-center mb-2">
      <ModuleLink v-if="showModuleLink" ref="moduleLinkRef" :is-need-children="isNeedChildren" />
    </div>
    <!-- 图标选择弹窗 -->
    <ElDialog v-if="showIconControls" v-model="iconPickerVisible" title="选择图标" width="600px" append-to-body>
      <IconPicker :model-value="internalData.titleIcon || ''" @update:model-value="handleIconSelect" />
    </ElDialog>
  </div>
</template>
