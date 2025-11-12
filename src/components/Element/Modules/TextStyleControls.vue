<script setup lang="ts">
// 定义组件属性
const props = defineProps({
  modelValue: {
    type: Object as () => TextStyleData,
    required: true,
  },
})

// 定义事件发射
const emit = defineEmits<{
  (e: 'update:modelValue', value: TextStyleData): void
}>()

// 定义文本样式数据接口
interface TextStyleData {
  textColor: string
  textSize: number
  textAlign: 'left' | 'center' | 'right'
}

// 提供getData和setData方法以支持通用性
function getData() {
  return props.modelValue
}

function setData(value: TextStyleData) {
  emit('update:modelValue', value)
}

// 暴露方法给父组件
defineExpose({
  getData,
  setData,
})
</script>

<template>
  <div class="flex items-center gap-2">
    <ElColorPicker
      :model-value="modelValue.textColor"
      class="mr-1"
      @update:model-value="(val) => emit('update:modelValue', { ...modelValue, textColor: val as string })"
    />
    <slot name="font-size-control" />
    <ElRadioGroup
      :model-value="modelValue.textAlign"
      class="shrink-0"
      @update:model-value="(val) => emit('update:modelValue', { ...modelValue, textAlign: val as 'left' | 'center' | 'right' })"
    >
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
</template>
