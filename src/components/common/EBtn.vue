<script setup name="EBtn" inheritAttrs="false" lang="ts">
const emit = defineEmits(['click'])
const attrs = useAttrs()

// 修复类型错误，设置默认值为small，并进行类型断言
const size = (attrs.size && ['default', 'small', 'large'].includes(attrs.size as string))
  ? (attrs.size as 'default' | 'small' | 'large')
  : 'small'

const onClick = (event: Event) => {
  emit('click', event)
}
</script>

<template>
  <ElButton v-bind="attrs" :size="size" @click="onClick">
    <slot />
  </ElButton>
</template>
