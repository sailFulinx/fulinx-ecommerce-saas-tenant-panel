<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus'

interface Props {
  title?: string
  maxItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'FAQ列表',
  maxItems: 20,
})

const faqList = ref<FaqData[]>([])
const dragging = ref(false)

// 拖拽开始
const handleDragStart = () => {
  dragging.value = true
}

// 拖拽结束，重新排序
const handleDragEnd = () => {
  dragging.value = false
  handleChangeMenuSort()
}

// 更新排序
function handleChangeMenuSort() {
  faqList.value.forEach((item: FaqData, index: number) => {
    item.sort = index + 1
  })
}

// 删除 FAQ 项目
const handleRemoveFaq = (index: number) => {
  ElMessageBox.confirm('确定要删除这个 FAQ 项目吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      faqList.value.splice(index, 1)
      handleChangeMenuSort() // 重新排序
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 用户取消删除
    })
}

// 添加 FAQ 项目
const handleAddFaq = () => {
  if (faqList.value.length >= props.maxItems) {
    ElMessage.warning(`最多只能添加 ${props.maxItems} 个项目`)
    return
  }

  faqList.value.push({
    id: Date.now(), // 使用时间戳确保唯一性
    question: '',
    answer: '',
    sort: faqList.value.length + 1,
  })
}

// 设置数据
const setData = (data: FaqData[]) => {
  if (Array.isArray(data)) {
    faqList.value = data.map((item, index) => ({
      ...item,
      sort: item.sort || index + 1,
    }))
  }
}

// 获取数据
const getData = (): FaqData[] => {
  return faqList.value
    .map((item: FaqData) => ({
      ...item,
      question: item.question?.trim() || '',
      answer: item.answer?.trim() || '',
    }))
    .filter((item: FaqData) => item.question || item.answer) // 过滤掉空项目
}

// 暴露方法给父组件
defineExpose({
  setData,
  getData,
})
</script>

<template>
  <div class="w-full">
    <div class="w-full flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
      <h3 class="text-gray-800">
        {{ title }}
      </h3>
      <EBtn type="primary" plain size="small" :disabled="faqList.length >= maxItems" @click="handleAddFaq">
        <Icon icon="ep:plus" />
        添加 FAQ
      </EBtn>
    </div>

    <div v-if="faqList.length === 0" class="py-10 text-center">
      <ElEmpty description="暂无 FAQ 数据" />
    </div>

    <VueDraggable
      v-model="faqList"
      item-key="id"
      :animation="200"
      :disabled="faqList.length < 2"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      @start="handleDragStart"
      @end="handleDragEnd"
    >
      <TransitionGroup name="faq-item">
        <div
          v-for="(item, index) in faqList"
          :key="item.id"
          class="border border-gray-200 rounded-lg bg-white transition-all duration-300 shadow-sm hover:border-blue-300 hover:shadow-md"
          :class="{ 'opacity-80 transform rotate-2': dragging }"
        >
          <div class="flex items-center p-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
            <div class="cursor-move p-1 rounded hover:bg-gray-100 transition-colors">
              <span><Icon icon="ant-design:holder-outlined" /></span>
            </div>
            <div
              class="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full mr-2"
            >
              {{ index + 1 }}
            </div>
            <div v-if="item.question" class="flex-1 text-sm font-medium text-gray-800 truncate">
              {{ item.question }}
            </div>
            <div v-else class="flex-1 text-sm text-gray-400 font-normal">
              未填写问题
            </div>
          </div>

          <div class="p-4">
            <div class="mb-4">
              <ElFormItem :label="`问题 ${index + 1}`" label-width="60px" :prop="`faqs.${index}.question`" class="mb-4">
                <ElInput v-model="faqList[index].question" placeholder="请输入问题内容" clearable />
              </ElFormItem>
            </div>

            <div class="mb-4">
              <ElFormItem :label="`答案 ${index + 1}`" label-width="60px" :prop="`faqs.${index}.answer`" class="mb-0">
                <ElInput
                  v-model="faqList[index].answer"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入答案内容"
                  clearable
                />
              </ElFormItem>
            </div>
          </div>

          <div class="px-5 pb-5 text-right">
            <EBtn text type="danger" size="small" @click="handleRemoveFaq(index)">
              <Icon icon="ep:delete" />
              删除
            </EBtn>
          </div>
        </div>
      </TransitionGroup>
    </VueDraggable>

    <div v-if="faqList.length > 0" class="mt-5 pt-4 border-t border-gray-200">
      <div class="text-sm text-gray-600">
        已添加 {{ faqList.length }} 个 FAQ 项目
        <span v-if="faqList.length >= maxItems" class="text-orange-500 ml-1">(已达到最大数量限制)</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 拖拽动画 */
.faq-item-enter-active,
.faq-item-leave-active {
  transition: all 0.3s ease;
}

.faq-item-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.faq-item-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
