<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { ElScrollbar } from 'element-plus'
import AppView from './components/AppView.vue'
import ToolHeader from './components/ToolHeader.vue'

const appStore = useAppStore()

const collapse = ref(appStore.collapse)

watch(
  () => appStore.collapse,
  newValue => {
    collapse.value = newValue
  },
)
</script>

<template>
  <div class="h-screen">
    <!-- 左侧内容 -->
    <div :class="`${collapse ? 'w-17' : 'w-64'} fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-10`">
      <div class="flex items-center py-3 h-16 px-4 border-b border-gray-200">
        <Logo />
        <div v-if="!collapse" class="font-bold ml-2">
          {{ appStore.title }}
        </div>
      </div>
      <div class="flex-1 overflow-y-auto">
        <Menu />
      </div>
    </div>

    <!-- 右侧内容 -->
    <div :class="`${collapse ? 'ml-17' : 'ml-64'} flex-1 flex flex-col`">
      <div class="sticky top-0 z-20 bg-white border-b border-gray-200 flex flex-col">
        <div class="px-4 h-16 flex justify-between">
          <div class="flex-1 flex">
            <ToolHeader />
          </div>
        </div>
        <div class="border-t border-b border-gray-200">
          <TagsView />
        </div>
      </div>

      <!-- main 内容区 -->
      <main class="flex-1 relative overflow-hidden">
        <!-- 添加 overflow-hidden -->
        <ElScrollbar class="absolute inset-0">
          <div class="h-full">
            <!-- 确保内部有个高度 -->
            <AppView />
          </div>
        </ElScrollbar>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
