<script setup lang="ts">
const { width, height } = defineProps<{
  width?: string | number
  height?: string | number
  placeholder?: boolean
}>()

function styleGenerator(prop?: string | number) {
  if (!prop) {
    return ''
  }

  const value = Number(prop)
  if (!Number.isNaN(value)) {
    return `${value}px`
  }
  return prop
}
const style = computed(() => {
  const w = styleGenerator(width)
  const h = styleGenerator(height)
  return {
    display: 'flex', // 让图片的父元素使用flex布局
    justifyContent: 'center', // 水平居中
    alignItems: 'center', // 垂直居中
    objectFit: 'contain', // 保持图片比例
    width: w,
    height: h,
  }
})
</script>

<template>
  <ElImage v-bind="$attrs" :style="style">
    <template v-if="placeholder" #placeholder>
      <ElSkeleton :loading="true" animated style="width: 100%; height: 100%">
        <template #template>
          <ElSkeletonItem variant="image" style="width: 100%; height: 100%" />
        </template>
      </ElSkeleton>
    </template>
  </ElImage>
</template>

<style lang="scss" scoped></style>
