<script setup name="CommonMultiButton" lang="ts">
import { ElCard, ElDialog, ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const dialogVisible = ref<boolean>(false)
const moduleLinkRef = ref()
const dragging = ref<boolean>(false)

interface ButtonItem {
  id: string
  sort: number
  buttonText: ''
  buttonLink: LinkData
}

const createButtonItemFormRef = ref()

const createButtonItemForm = (): ButtonItem => {
  return {
    id: 0,
    sort: 1,
    buttonText: '',
    buttonLink: {
      linkUrl: '',
      linkValue: '',
      linkLabel: '',
      linkType: '',
      children: [],
    },
  }
}

const buttonItemForm = ref<ButtonItem>(createButtonItemForm())

interface FormData {
  content: {
    buttonList: ButtonItem[]
  }
  status: boolean
}

const form = reactive<FormData>({
  content: {
    buttonList: [],
  },
  status: true,
})

const rules = reactive({
  buttonText: [{ required: true, type: 'string', message: '请输入标题', trigger: 'blur' }],
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

const formRef = ref()

const handleAddButton = async () => {
  buttonItemForm.value = createButtonItemForm()
  buttonItemForm.value.id = form.content.buttonList.length + 1
  buttonItemForm.value.sort = form.content.buttonList.length + 1
  dialogVisible.value = true
  await nextTick()
  if (moduleLinkRef.value) {
    moduleLinkRef.value.setLinkData(buttonItemForm.value.buttonLink)
  }
}

const handleEdit = async (index: number) => {
  dialogVisible.value = true
  buttonItemForm.value = form.content.buttonList[index]
  await nextTick()
  if (moduleLinkRef.value) {
    moduleLinkRef.value.setLinkData(buttonItemForm.value.buttonLink)
  }
}

/**
 * 改变排序
 */
function handleChangeItemSort() {
  form.content.buttonList.forEach((item, index) => {
    item.sort = index + 1
  })
}

const handleRemove = (index: number) => {
  form.content.buttonList.splice(index, 1)
  handleChangeItemSort()
}

const handleSaveButtonItem = async () => {
  const valid = await createButtonItemFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  await nextTick()
  if (moduleLinkRef.value) {
    buttonItemForm.value.buttonLink = moduleLinkRef.value.getLinkData()
  }
  dialogVisible.value = false
  // 如果id在form.content.buttonList中不存在，则新增，否则修改
  const index = form.content.buttonList.findIndex(item => item.id === buttonItemForm.value.id)
  if (index > -1) {
    form.content.buttonList.splice(index, 1, buttonItemForm.value)
  } else {
    form.content.buttonList.push(buttonItemForm.value)
  }
}

async function getFormData() {
  if (form.content.buttonList.length === 0) {
    ElMessage.error('请添加一组文字')
    return false
  }
  return form
}

function setFormData(formData: FormData) {
  if (formData.content.buttonList && Array.isArray(formData.content.buttonList)) {
    form.content.buttonList = [...formData.content.buttonList] // 确保重新赋值，触发响应式
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
    <ElForm ref="formRef" :model="form" label-width="100px">
      <ElFormItem label="按钮" required>
        <div class="flex w-full">
          <EBtn plain type="primary" @click="handleAddButton">
            <Icon icon="ep:plus" />
            增加一个按钮
          </EBtn>
        </div>
        <VueDraggable v-model="form.content.buttonList" item-key="sort" class="w-full grid grid-cols-3 gap-4 mt-5" @start="dragging = true" @end="handleChangeItemSort">
          <div v-for="(item, index) in form.content.buttonList" :key="index" class="col-span-1 h-26 border border-gray-300" shadow="never">
            <div class="bg-gray-50 flex justify-between items-center p-2 border-b border-gray-300">
              <div class="flex items-center">
                <Icon name="ant-design:holder-outlined" class="mr-1" />
                第{{ item.sort }}个按钮
              </div>
              <div class="flex items-center justify-end">
                <Icon icon="ep:edit" :size="4" color="#1890ff" class="mr-3 cursor-pointer" @click="handleEdit(index)" />
                <Icon icon="ep:delete" :size="4" color="#f56c6c" class="cursor-pointer" @click="handleRemove(index)" />
              </div>
            </div>
            <div class="w-full p-2">
              <EBtn type="primary" plain class="w-full" @click="handleEdit(index)">
                {{ item.buttonText }}
              </EBtn>
            </div>
          </div>
        </VueDraggable>
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
    <ElDialog v-model="dialogVisible" title="编辑按钮内容">
      <ElForm ref="createButtonItemFormRef" :model="buttonItemForm" :rules="rules" label-width="140px">
        <ElFormItem label="按钮文字" prop="buttonText" required>
          <ElInput v-model="buttonItemForm.buttonText" />
        </ElFormItem>
        <ElFormItem label="链接">
          <ModuleLink ref="moduleLinkRef" :is-need-children="false" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="flex justify-end">
          <EBtn @click="dialogVisible = false">
            取消
          </EBtn>
          <EBtn type="primary" @click="handleSaveButtonItem">
            提交
          </EBtn>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tag) {
  justify-content: start !important;
  height: 36px !important;
  padding:5px 9px !important;
  display: block !important;
}
</style>
