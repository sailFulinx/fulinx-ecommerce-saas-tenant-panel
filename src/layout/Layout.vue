<script setup lang="ts">
import AppView from './components/AppView.vue'
import ToolHeader from './components/ToolHeader.vue'

const appStore = useAppStore()
const { collapse } = storeToRefs(appStore)
</script>

<template>
  <div class="h-screen">
    <!-- 左侧内容 -->
    <div
      :class="`${collapse ? 'w-17' : 'w-64'}`"
      class="fixed left-0 top-0 h-full border-r z-10 border-gray-950/5 dark:border-white/10"
    >
      <div class="flex items-center py-3 h-16 px-4 border-b border-gray-950/5 dark:border-white/10">
        <Logo />
        <div v-if="!collapse" class="font-bold ml-2">
          {{ appStore.title }}
        </div>
      </div>
      <!-- 修改此处：添加 flex flex-col h-[calc(100%-4rem)] -->
      <div class="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
        <Menu class="flex-1 min-h-0" />
      </div>
    </div>

    <!-- 右侧内容保持不变 -->
    <div :class="`${collapse ? 'ml-17' : 'ml-64'} flex-1 flex flex-col`">
      <div class="sticky top-0 z-20 flex flex-col">
        <div class="px-4 h-16 flex justify-between">
          <ToolHeader />
        </div>

        <div class="border-t border-b border-gray-950/5 dark:border-white/10">
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
