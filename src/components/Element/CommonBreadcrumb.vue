<script setup name="CommonBreadcrumbItem" lang="ts">
import { hasContentElements } from '@/utils'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const formRef = ref()
const breadcrumbItemDialogRef = ref()

interface BreadcrumbItem {
  id: number
  icon: string
  label: string
  link: LinkData
}

interface FormData {
  content: {
    breadcrumbList: BreadcrumbItem[]
  }
  status: boolean
}

const createForm = (): FormData => {
  return {
    content: {
      breadcrumbList: [{
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
      }],
    },
    status: true,
  }
}

const form = reactive<FormData>(createForm())

// 控制对话框显示状态
const dialogVisible = ref(false)
// 当前正在编辑的索引，-1表示新增
const editingIndex = ref(-1)

watch(
  () => props.componentData,
  val => {
    if (val) {
      setFormData(val)
    }
  },
  { immediate: true },
)

// 打开添加面包屑项对话框
const openAddDialog = () => {
  editingIndex.value = -1
  dialogVisible.value = true
}

// 打开编辑面包屑项对话框
const openEditDialog = (index: number) => {
  editingIndex.value = index
  dialogVisible.value = true
}

// 保存面包屑项（新增或编辑）
const saveBreadcrumbItem = (item: BreadcrumbItem) => {
  if (editingIndex.value === -1) {
    // 新增
    form.content.breadcrumbList.push(item)
  } else {
    // 编辑
    form.content.breadcrumbList[editingIndex.value] = item
  }
}

const removeBreadcrumbItem = (index: number) => {
  if (form.content.breadcrumbList.length > 1) {
    form.content.breadcrumbList.splice(index, 1)
  }
}

async function getFormData() {
  await nextTick()
  return form
}

async function setFormData(formData: FormData) {
  await nextTick()
  if (hasContentElements(formData.content)) {
    form.content = { ...formData.content }

    // 确保每个面包屑项都有正确的结构
    if (form.content.breadcrumbList && Array.isArray(form.content.breadcrumbList)) {
      form.content.breadcrumbList = form.content.breadcrumbList.map(item => ({
        id: item.id || Date.now(),
        icon: item.icon || '',
        label: item.label || '',
        link: item.link || {
          linkUrl: '',
          linkValue: '',
          linkLabel: '',
          linkType: '',
          children: [],
        },
      }))
    }
  } else {
    Object.assign(form, createForm())
  }
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" :model="form" label-width="60px" class="mt-2">
      <ElFormItem label="面包屑项">
        <div
          v-for="(item, index) in form.content.breadcrumbList"
          :key="item.id"
          class="border border-gray-200 p-4 mb-4 rounded mr-4"
        >
          <div class="flex justify-between items-center mb-3">
            <h4 class="text-md font-medium">
              面包屑项 {{ index + 1 }}
            </h4>
            <div>
              <ElButton
                type="primary"
                link
                class="mr-2"
                @click="openEditDialog(index)"
              >
                编辑
              </ElButton>
              <ElButton
                v-if="form.content.breadcrumbList.length > 1"
                type="danger"
                link
                @click="removeBreadcrumbItem(index)"
              >
                删除
              </ElButton>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div class="flex items-center">
              <span class="mr-2">图标:</span>
              <Icon v-if="item.icon" :name="item.icon" />
              <span v-else>未设置</span>
            </div>
            <div class="col-span-2">
              <span class="mr-2">标签:</span>
              <span>{{ item.label || '未设置' }}</span>
            </div>
          </div>
        </div>

        <ElButton type="primary" link @click="openAddDialog">
          <Icon name="ep:plus" class="mr-1" />
          添加面包屑项
        </ElButton>
      </ElFormItem>

      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>

    <!-- 面包屑项编辑对话框 -->
    <BreadcrumbItemDialog
      ref="breadcrumbItemDialogRef"
      v-model="dialogVisible"
      :breadcrumb-item="editingIndex >= 0 ? form.content.breadcrumbList[editingIndex] : null"
      @save="saveBreadcrumbItem"
    />
  </div>
</template>
