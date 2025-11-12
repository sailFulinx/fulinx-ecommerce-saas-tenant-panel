<script setup name="FAQComponent" lang="ts">
import { hasContentElements } from '@/utils'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const formRef = ref()

interface FAQItem {
  question: string
  answer: string
}

interface FormData {
  content: {
    title: string
    faqList: FAQItem[]
  }
  status: boolean
}

const createForm = (): FormData => {
  return {
    content: {
      title: '',
      faqList: [],
    },
    status: true,
  }
}

const form = ref<FormData>(createForm())

// 控制编辑状态的变量
const editingIndex = ref<number | null>(null)
const tempFAQ = ref<FAQItem>({ question: '', answer: '' })

watch(
  () => props.componentData,
  val => {
    if (val) {
      setFormData(val)
    }
  },
  { immediate: true },
)

async function getFormData() {
  return form.value
}

async function setFormData(formData: FormData) {
  if (hasContentElements(formData.content)) {
    form.value = { ...formData }
  } else {
    form.value = createForm()
  }
}

// 开始编辑FAQ条目
const startEditing = (index: number) => {
  editingIndex.value = index
  tempFAQ.value = { ...form.value.content.faqList[index] }
}

// 添加FAQ条目
const addFAQ = () => {
  form.value.content.faqList.push({
    question: '',
    answer: '',
  })
  // 开始编辑新添加的条目
  startEditing(form.value.content.faqList.length - 1)
}

// 取消编辑
const cancelEditing = () => {
  editingIndex.value = null
  tempFAQ.value = { question: '', answer: '' }
}

// 保存编辑的FAQ条目
const saveEditing = (index: number) => {
  form.value.content.faqList[index] = { ...tempFAQ.value }
  cancelEditing()
}

// 删除FAQ条目
const removeFAQ = (index: number) => {
  if (form.value.content.faqList.length > 1) {
    // 如果正在编辑要删除的条目，取消编辑
    if (editingIndex.value === index) {
      cancelEditing()
    }

    form.value.content.faqList.splice(index, 1)

    // 更新编辑索引
    if (editingIndex.value !== null && editingIndex.value > index) {
      editingIndex.value--
    }
  }
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div class="faq-component">
    <ElForm ref="formRef" :model="form" label-width="80px">
      <ElFormItem label="标题" prop="content.title" required>
        <ElInput v-model="form.content.title" placeholder="请输入FAQ标题" />
      </ElFormItem>

      <div
        v-for="(faq, index) in form.content.faqList"
        :key="index"
        class="mb-6 border border-gray-200 rounded-lg shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50 px-4 py-3 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-800">
            FAQ条目 {{ index + 1 }}
          </h3>
          <div class="flex space-x-2">
            <ElButton
              v-if="editingIndex !== index"
              type="primary"
              size="small"
              @click="startEditing(index)"
            >
              编辑
            </ElButton>
            <ElButton
              v-else
              type="success"
              size="small"
              @click="saveEditing(index)"
            >
              保存
            </ElButton>
            <ElButton
              v-if="editingIndex === index"
              type="info"
              size="small"
              @click="cancelEditing"
            >
              取消
            </ElButton>
            <ElButton
              v-if="form.content.faqList.length > 1"
              type="danger"
              size="small"
              @click="removeFAQ(index)"
            >
              删除
            </ElButton>
          </div>
        </div>

        <div class="p-4">
          <div v-if="editingIndex === index">
            <!-- 编辑模式 -->
            <ElFormItem :label="`问题${index + 1}`" :prop="`content.faqList.${index}.question`" required>
              <ElInput
                v-model="tempFAQ.question"
                placeholder="请输入问题"
                class="mb-3"
              />
            </ElFormItem>

            <ElFormItem :label="`答案${index + 1}`" :prop="`content.faqList.${index}.answer`" required>
              <ElInput
                v-model="tempFAQ.answer"
                type="textarea"
                placeholder="请输入答案"
                :rows="4"
              />
            </ElFormItem>
          </div>

          <div v-else>
            <!-- 查看模式 -->
            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">问题:</label>
              <div class="p-3 bg-white border border-gray-300 rounded-md">
                {{ faq.question || '暂无内容' }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">答案:</label>
              <div class="p-3 bg-white border border-gray-300 rounded-md">
                {{ faq.answer || '暂无内容' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ElButton size="small" type="primary" class="mb-4" @click="addFAQ">
        <i class="el-icon-plus mr-1" />
        添加FAQ条目
      </ElButton>

      <ElFormItem label="状态" required>
        <ElSwitch
          v-model="form.status"
        />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style scoped>
.faq-component {
  padding: 20px;
}

.faq-component .el-form-item {
  margin-bottom: 20px;
}

.faq-component .el-form-item__label {
  font-weight: 500;
}
</style>
