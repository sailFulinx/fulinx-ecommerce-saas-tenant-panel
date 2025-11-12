<script setup lang="ts">
import { ref, watch } from 'vue'
import IconPicker from '@/components/common/IconPicker.vue'
import ModuleLink from '@/components/Element/Modules/ModuleLink.vue'

interface BreadcrumbItem {
  id: number
  icon: string
  label: string
  link: LinkData
}

interface LinkData {
  linkUrl: string
  linkValue: string
  linkLabel: string
  linkType: string
  children: any[]
}

const props = defineProps<{
  modelValue: boolean
  breadcrumbItem: BreadcrumbItem | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', item: BreadcrumbItem): void
}>()

const dialogVisible = ref(false)
const form = ref({
  id: 0,
  icon: '',
  label: '',
  link: {
    linkUrl: '',
    linkValue: '',
    linkLabel: '',
    linkType: '',
    children: [],
  },
} as BreadcrumbItem)

const moduleLinkRef = ref<InstanceType<typeof ModuleLink> | null>(null)

const resetForm = () => {
  form.value = {
    id: Date.now(),
    icon: '',
    label: '',
    link: {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    },
  }
}

watch(
  () => props.modelValue,
  val => {
    dialogVisible.value = val
    if (!val) {
      resetForm()
    }
  },
)

watch(
  () => props.breadcrumbItem,
  item => {
    if (item) {
      form.value = { ...item }
    } else {
      resetForm()
    }
  },
)

const handleClose = () => {
  dialogVisible.value = false
  emit('update:modelValue', false)
}

const handleSave = async () => {
  // 获取链接数据
  if (moduleLinkRef.value) {
    form.value.link = moduleLinkRef.value.getLinkData()
  }

  emit('save', { ...form.value })
  handleClose()
}

const setLinkData = async (linkData: LinkData) => {
  if (moduleLinkRef.value) {
    await moduleLinkRef.value.setLinkData(linkData)
  }
}

// 当对话框打开时，如果编辑现有项，则设置链接数据
watch(dialogVisible, val => {
  if (val && props.breadcrumbItem && props.breadcrumbItem.link) {
    nextTick(() => {
      setLinkData(props.breadcrumbItem!.link)
    })
  }
})

defineExpose({
  setLinkData,
})
</script>

<template>
  <ElDialog
    :model-value="dialogVisible"
    width="700px"
    title="面包屑项"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <ElForm
      :model="form"
      label-width="80px"
      class="mt-2"
    >
      <ElFormItem label="图标">
        <IconPicker v-model="form.icon" placeholder="请选择或搜索图标" />
      </ElFormItem>

      <ElFormItem label="标签">
        <ElInput v-model="form.label" placeholder="请输入标签" />
      </ElFormItem>

      <ElFormItem label="链接">
        <ModuleLink
          ref="moduleLinkRef"
          :is-need-children="false"
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="handleClose">
        取消
      </ElButton>
      <ElButton type="primary" @click="handleSave">
        保存
      </ElButton>
    </template>
  </ElDialog>
</template>
