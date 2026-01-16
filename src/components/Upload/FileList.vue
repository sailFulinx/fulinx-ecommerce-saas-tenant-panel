<script lang="ts" setup>
// 图片分类数据
const categories = ref([
  { id: 'all', name: '我的图片', count: 13 },
  { id: 'shop', name: '店铺图', count: 0 },
  { id: 'product', name: '商品图', count: 13 },
  { id: 'pigeon', name: '飞鸽图', count: 0 },
  { id: 'robot', name: '飞鸽机器人图', count: 0 },
  { id: 'qualification', name: '商品资质图片', count: 0 },
  { id: 'detail', name: '详情', count: 0 },
])

const filePayload = ref<FileListParams & Pagination>({
  fileOriginalName: undefined,
  pageSize: 20,
  pageNumber: 1,
})

const {
  loading: fileLoading,
  listData: fileListData,
  promise: filePromise,
  getList,
} = useFileList(filePayload)

// 响应式状态
const selectedCategory = ref('product')
const selectedImageId = ref(null)
const sortBy = ref('latest')
const hideUnavailable = ref(false)
const searchQuery = ref('')

// 存储容量
const usedStorage = ref(1.1 * 1024 * 1024 * 1024) // 1.1GB
const totalStorage = ref(20 * 1024 * 1024 * 1024) // 20GB

// 格式化文件大小显示
const formatFileSize = bytes => {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

// 分类选择
const selectCategory = categoryId => {
  selectedCategory.value = categoryId
}

// 图片选择
const toggleSelectImage = imageId => {
  if (selectedImageId.value === imageId) {
    selectedImageId.value = null
  } else {
    selectedImageId.value = imageId
  }
}

// 过滤和排序图片
const filteredImages = computed(() => {
  let result = fileListData.value.list

  // 按分类过滤
  if (selectedCategory.value !== 'all') {
    result = result.filter(image => image.category === selectedCategory.value)
  }

  // 按可用性过滤
  if (hideUnavailable.value) {
    result = result.filter(image => image.available)
  }

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    result = result.filter(image =>
      image.name.toLowerCase().includes(query)
      || image.dimensions.toLowerCase().includes(query),
    )
  }

  // 排序
  result = [...result] // 创建副本以避免修改原始数据
  if (sortBy.value === 'latest') {
    result.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime))
  } else if (sortBy.value === 'oldest') {
    result.sort((a, b) => new Date(a.uploadTime) - new Date(b.uploadTime))
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  }

  return result
})

// 确认选择
const confirmSelection = () => {
  if (selectedImageId.value) {
    const selectedImage = fileListData.value.list.find(img => img.id === selectedImageId.value)
    alert(`已选择图片: ${selectedImage.name} (${selectedImage.dimensions})`)
    // 在实际应用中，这里可能会触发一个事件或调用父组件的方法
  }
}

// 取消选择
const cancelSelection = () => {
  selectedImageId.value = null
  alert('已取消选择')
  // 在实际应用中，这里可能会关闭模态框或触发取消事件
}

// 组件挂载时初始化
onMounted(() => {
  // 模拟一些图片URL
  fileListData.value.list = fileListData.value.list.map(img => ({
    ...img,
    url: img.name.includes('项链')
      ? `https://picsum.photos/seed/${img.id}/400/400`
      : null,
  }))
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 头部标题 -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">
          选择图片
        </h1>
        <p class="text-gray-600 mt-1">
          最小宽度600，最小高度600，大小不超过5M
        </p>
      </div>

      <!-- 主容器 -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="flex flex-col lg:flex-row">
          <!-- 左侧分类导航 -->
          <div class="lg:w-1/5 border-r border-gray-200">
            <div class="p-4">
              <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                图片分类
              </h2>
              <ul class="space-y-1">
                <li v-for="category in categories" :key="category.id">
                  <button
                    class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors" :class="[
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                    ]"
                    @click="selectCategory(category.id)"
                  >
                    {{ category.name }}
                    <span v-if="category.count" class="text-gray-500 ml-1">({{ category.count }})</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- 右侧主内容区 -->
          <div class="lg:w-4/5">
            <!-- 筛选工具栏 -->
            <div class="border-b border-gray-200 p-4">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-wrap items-center gap-4">
                  <!-- 排序选择 -->
                  <div class="relative">
                    <select
                      v-model="sortBy"
                      class="pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="latest">
                        最新上传在前
                      </option>
                      <option value="oldest">
                        最早上传在前
                      </option>
                      <option value="name">
                        按名称排序
                      </option>
                    </select>
                  </div>

                  <!-- 隐藏不可用图片选项 -->
                  <label class="flex items-center text-sm text-gray-700 cursor-pointer">
                    <input
                      v-model="hideUnavailable"
                      type="checkbox"
                      class="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    >
                    <span class="ml-2">隐藏不可用图片</span>
                  </label>

                  <!-- 搜索框 -->
                  <div class="relative">
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="查询图片名称"
                      class="pl-9 pr-4 py-2 w-full md:w-64 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                    <div class="absolute left-3 top-2.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="text-sm text-gray-500">
                  共 {{ filteredImages.length }} 条
                </div>
              </div>
            </div>

            <!-- 图片网格 -->
            <div class="p-4">
              <!-- 无图片状态 -->
              <div v-if="filteredImages.length === 0" class="text-center py-12">
                <div class="mx-auto w-16 h-16 text-gray-300 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p class="text-gray-500">
                  未找到符合条件的图片
                </p>
              </div>

              <!-- 图片网格 -->
              <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div
                  v-for="image in filteredImages"
                  :key="image.id"
                  class="border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md" :class="[
                    selectedImageId === image.id
                      ? 'ring-2 ring-blue-500 border-blue-500'
                      : 'border-gray-200',
                  ]"
                  @click="toggleSelectImage(image.id)"
                >
                  <!-- 图片容器 -->
                  <div class="relative bg-gray-100 aspect-square flex items-center justify-center">
                    <!-- 图片预览 -->
                    <div
                      v-if="image.url"
                      class="w-full h-full bg-cover bg-center"
                      :style="{ backgroundImage: `url(${image.url})` }"
                    />

                    <!-- 图片占位符 -->
                    <div v-else class="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>

                    <!-- 选中标记 -->
                    <div
                      v-if="selectedImageId === image.id"
                      class="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>

                    <!-- 不可用标记 -->
                    <div
                      v-if="!image.available"
                      class="absolute inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center"
                    >
                      <span class="text-white text-sm font-medium">不可用</span>
                    </div>
                  </div>

                  <!-- 图片信息 -->
                  <div class="p-3">
                    <h3 class="text-sm font-medium text-gray-800 truncate">
                      {{ image.name }}
                    </h3>
                    <div class="flex justify-between items-center mt-1">
                      <span class="text-xs text-gray-500">{{ image.dimensions }}</span>
                      <span class="text-xs text-gray-500">{{ image.size }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部栏 -->
            <div class="border-t border-gray-200 p-4">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <!-- 容量使用情况 -->
                <div class="w-full md:w-auto">
                  <div class="text-sm text-gray-700 mb-1">
                    已使用 {{ formatFileSize(usedStorage) }} / {{ formatFileSize(totalStorage) }}
                  </div>
                  <div class="w-full md:w-64 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full"
                      :style="{ width: `${(usedStorage / totalStorage) * 100}%` }"
                    />
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex space-x-3">
                  <button
                    class="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    @click="cancelSelection"
                  >
                    取消
                  </button>
                  <button
                    :disabled="!selectedImageId"
                    class="px-5 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    :class="[
                      selectedImageId
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                    ]" @click="confirmSelection"
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 添加一些自定义样式以匹配原图效果 */
select:focus, input:focus {
  outline: none;
}

/* 确保图片容器保持正方形 */
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
