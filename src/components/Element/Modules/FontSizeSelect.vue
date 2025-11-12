<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Number,
    default: 12,
  },
})

const emit = defineEmits(['update:modelValue'])

const fontSizeOptions: FontSizeOption[] = [
  { label: '10px', value: 10 },
  { label: '12px', value: 12 },
  { label: '14px', value: 14 },
  { label: '16px', value: 16 },
  { label: '18px', value: 18 },
  { label: '20px', value: 20 },
  { label: '22px', value: 22 },
  { label: '24px', value: 24 },
  { label: '26px', value: 26 },
  { label: '28px', value: 28 },
  { label: '30px', value: 30 },
  { label: '32px', value: 32 },
  { label: '34px', value: 34 },
  { label: '36px', value: 36 },
  { label: '38px', value: 38 },
  { label: '40px', value: 40 },
  { label: '42px', value: 42 },
  { label: '44px', value: 44 },
  { label: '46px', value: 46 },
  { label: '48px', value: 48 },
  { label: '50px', value: 50 },
  { label: '52px', value: 52 },
  { label: '54px', value: 54 },
  { label: '56px', value: 56 },
  { label: '58px', value: 58 },
  { label: '60px', value: 60 },
  { label: '62px', value: 62 },
  { label: '64px', value: 64 },
]

function getData() {
  return props.modelValue
}

function setData(value: number) {
  emit('update:modelValue', value)
}

defineExpose({
  getData,
  setData,
})
</script>

<template>
  <ElSelect
    :model-value="modelValue"
    placeholder="请选择字号"
    style="width: 200px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <ElOption v-for="item in fontSizeOptions" :key="item.value" :label="item.label" :value="item.value" />
  </ElSelect>
</template>
