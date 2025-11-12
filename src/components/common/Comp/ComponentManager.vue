<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import { getComponent } from '@/utils/comp'

// 组件相关 emits
const emit = defineEmits(['updateComponent'])

const { t: $t } = useLocale()

const componentDialogVisible = ref(false)
const activeComponentRef = ref()
const activeComponent = ref<RowColumnData>({
  elementComponentCode: '',
  elementComponentConfig: {
    content: {},
    status: true,
  },
  elementName: '',
  elementType: '',
  aliasName: '',
})

// 设置组件
const openComponentManager = async (
  val?: RowColumnData,
) => {
  activeComponent.value = {
    elementComponentCode: '',
    elementComponentConfig: {
      content: {},
      status: true,
    },
    elementName: '',
    elementType: '',
    aliasName: '',
  }

  if (val) {
    activeComponent.value = val
  }
  componentDialogVisible.value = true
}

const handleCancelSubmitComponent = () => {
  componentDialogVisible.value = false
}

// 提交组件数据，保存组件数据到行
const handleSubmitComponent = async () => {
  if (!activeComponentRef.value) {
    return
  }
  const res = await activeComponentRef.value.getFormData()
  if (!res) {
    return
  }
  emit('updateComponent', res)
  componentDialogVisible.value = false
}

defineExpose({
  openComponentManager,
})
</script>

<template>
  <!-- Component Dialog -->
  <ElDrawer v-model="componentDialogVisible" size="50%">
    <template #header>
      <div class="text-sm font-bold">
        {{ $t('common.setting') }}{{ $t('comps.name') }}
      </div>
    </template>
    <component
      :is="getComponent(activeComponent.elementComponentCode)"
      ref="activeComponentRef"
      :component-data="activeComponent.elementComponentConfig"
      v-bind="activeComponent"
    />
    <template #footer>
      <div class="border-t-1 p-4 border-gray-200 flex justify-end items-center">
        <EBtn @click="handleCancelSubmitComponent">
          {{ $t('common.cancel') }}
        </EBtn>
        <EBtn type="primary" @click="handleSubmitComponent">
          {{ $t('common.submit') }}
        </EBtn>
      </div>
    </template>
  </ElDrawer>
</template>
