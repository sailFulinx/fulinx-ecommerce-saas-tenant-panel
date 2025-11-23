<script setup lang="ts">
import AppView from './components/AppView.vue'
import ToolHeader from './components/ToolHeader.vue'

const appStore = useAppStore()
const { collapse } = storeToRefs(appStore)

const tenantStore = useTenantStore()
const { tenantStoreList } = storeToRefs(tenantStore)

// 创建店铺相关的响应式数据
const storeForm = reactive({
  storeName: '',
})

const loading = ref(false)

// 创建店铺的方法
const createStore = async () => {
  if (!storeForm.storeName.trim()) {
    ElMessage.warning('请输入店铺名称')
    return
  }

  try {
    loading.value = true
    const params: TenantStoreCreateParams = {
      storeName: storeForm.storeName.trim(),
    }

    await createTenantStoreApi(params)
    ElMessage.success('店铺创建成功')

    // 重新获取租户信息
    await tenantStore.getTenantInfo()

    // 清空表单
    storeForm.storeName = ''
  } catch (error) {
    console.error('创建店铺失败:', error)
    ElMessage.error('店铺创建失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="tenantStoreList && tenantStoreList.length > 0" class="h-screen">
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
  <div v-else>
    <div class="flex flex-col items-center justify-center h-screen">
      <h2 class="text-2xl font-bold mb-6">
        欢迎使用FULINX ECOMMERCE
      </h2>
      <p class="text-gray-600 mb-8">
        您还没有创建任何店铺，请先创建一个店铺
      </p>
      <div class="w-80">
        <ElInput
          v-model="storeForm.storeName"
          placeholder="请输入店铺名称"
          class="mb-4"
          @keyup.enter="createStore"
        />
        <ElButton
          type="primary"
          :loading="loading"
          class="w-full"
          @click="createStore"
        >
          {{ loading ? '创建中...' : '创建店铺' }}
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
