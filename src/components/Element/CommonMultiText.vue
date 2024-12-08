<script setup name="CommonMultiText" lang="ts">
import { ElCard, ElDialog, ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const dialogVisible = ref<boolean>(false)
const dragging = ref<boolean>(false)

interface TextItem {
  id: number
  sort: number
  title: ''
  subTitle: ''
  textList: string[]
}

const createTextItemFormRef = ref()

const createTextItemForm = (): TextItem => {
  return {
    id: 0,
    sort: 1,
    title: '',
    subTitle: '',
    textList: [],
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

const rules = reactive({
  title: [{ required: true, type: 'string', message: '请输入标题', trigger: 'blur' }],
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

const handleAddText = () => {
  textItemForm.value = createTextItemForm()
  textItemForm.value.id = form.content.textList.length + 1
  textItemForm.value.sort = form.content.textList.length + 1
  dialogVisible.value = true
}

const handleAddTextItem = () => {
  textItemForm.value.textList.push('') // 新增一行文字内容
  textItemForm.value.textList = [...textItemForm.value.textList] // 重新赋值以确保响应式更新
}

const handleEdit = (index: number) => {
  textItemForm.value = form.content.textList[index]
  dialogVisible.value = true
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
  textItemForm.value.textList.splice(index, 1) // 删除指定的文字内容
  textItemForm.value.textList = [...textItemForm.value.textList] // 重新赋值以确保响应式更新
}

const handleSaveTextItem = async () => {
  const valid = await createTextItemFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  dialogVisible.value = false
  // 如果id在form.content.textList中不存在，则新增，否则修改
  const index = form.content.textList.findIndex(item => item.id === textItemForm.value.id)
  if (index > -1) {
    form.content.textList.splice(index, 1, textItemForm.value)
  } else {
    form.content.textList.push(textItemForm.value)
  }
}

async function getFormData() {
  if (form.content.textList.length === 0) {
    ElMessage.error('请添加一组文字')
    return false
  }
  return form
}

function setFormData(formData: FormData) {
  if (formData.content.textList && Array.isArray(formData.content.textList)) {
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
    <ElForm ref="formRef" :model="form" label-width="100px">
      <ElFormItem label="文字内容" required>
        <div class="flex w-full">
          <EBtn plain type="primary" @click="handleAddText">
            <Icon icon="ep:plus" />
            增加一组文字
          </EBtn>
        </div>
        <VueDraggable v-model="form.content.textList" item-key="sort" class="w-full grid grid-cols-3 gap-4 mt-5" @start="dragging = true" @end="handleChangeItemSort">
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
      <ElForm ref="createTextItemFormRef" :model="textItemForm" :rules="rules" label-width="140px">
        <ElFormItem label="标题" prop="title" required>
          <ElInput v-model="textItemForm.title" />
        </ElFormItem>
        <ElFormItem label="副标题">
          <ElInput v-model="textItemForm.subTitle" />
        </ElFormItem>
        <ElFormItem label="文字">
          <div v-for="(item, index) in textItemForm.textList" :key="index" class="w-full mb-4">
            <div class="flex">
              <ElInput v-model="textItemForm.textList[index]" placeholder="请输入文字内容" />
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

<style lang="scss" scoped>
:deep(.el-tag) {
  justify-content: start !important;
  height: 36px !important;
  padding:5px 9px !important;
  display: block !important;
}
</style>
