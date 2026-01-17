<script lang="ts" setup>
import { Refresh } from '@element-plus/icons-vue'

interface Props {
  acceptFileType?: string[] // 允许上传的文件类型，例如 ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']
}

const props = withDefaults(defineProps<Props>(), {
  acceptFileType: () => ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
})

const emit = defineEmits(['selectionConfirmed'])

const dialogVisible = ref(false)
// 图片分类数据
// const categories = ref([
//   { id: 'all', name: '所有文件', count: 0 },
//   { id: 'image', name: '图片', count: 0 },
//   { id: 'video', name: '视频', count: 0 },
// ])

const loading = reactive({
  init: false,
})

const filePayload = ref<FileListParams & Pagination>({
  originalFileName: undefined,
  pageSize: 20,
  pageNumber: 1,
})

const {
  loading: fileLoading,
  listData: fileListData,
  listPayload,
  getList,
} = useFilePagination(filePayload.value, { immediate: false })

const pagination = async (val: PaginationComponentDataType) => {
  if (val) {
    listPayload.pageSize = val.limit
    listPayload.pageNumber = val.page
  }
  await getList()
}

const fileSize = ref(0)

const getFileSize = async () => {
  const { data } = await fileSizeApi().catch(error => {
    console.error('获取文件大小失败:', error)
    throw error
  })
  fileSize.value = data
}

// 响应式状态
// const selectedCategory = ref('')
const selectedFile = ref<(FileData & CommonField)[]>([]) // 存储完整的图片对象数组
// const sortBy = ref('latest')

const open = async () => {
  selectedFile.value = []
  dialogVisible.value = true
  // 设置初始化加载状态
  loading.init = true
  try {
    // 重新获取数据
    await Promise.all([getList(), getFileSize()])
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.init = false
  }
}

// 存储容量
const usedStorage = ref(1.1 * 1024 * 1024 * 1024) // 1.1GB
const totalStorage = ref(20 * 1024 * 1024 * 1024) // 20GB

// 分类选择
const _selectCategory = (_val: number) => {}

// 图片选择 - 支持多选
const toggleSelectFile = (file: FileData & CommonField) => {
  const index = selectedFile.value.findIndex(item => item.id === file.id)
  if (index > -1) {
    // 如果已选中，则取消选中
    selectedFile.value.splice(index, 1)
  } else {
    // 如果未选中，则添加到选中列表
    // 如果props.acceptFileType包含file.fileContentType，则添加到选中列表
    if (props.acceptFileType.includes(file.fileContentType)) {
      selectedFile.value.push(file)
    } else {
      ElMessage.warning('请选择正确的文件类型')
    }
  }
}

// 确认选择
const confirmSelection = (event: Event) => {
  event.preventDefault() // 阻止默认行为，防止页面跳转
  event.stopPropagation() // 阻止事件冒泡

  if (selectedFile.value.length > 0) {
    // 直接使用selectedFile，因为已经是完整对象数组
    emit('selectionConfirmed', selectedFile.value)
    dialogVisible.value = false
  }
}

// 取消选择
const cancelSelection = (event: Event) => {
  event.preventDefault() // 阻止默认行为，防止页面跳转
  event.stopPropagation() // 阻止事件冒泡
  selectedFile.value = [] // 清空选中的图片数组

  dialogVisible.value = false
}

// 清除搜索
const clearSearch = () => {
  filePayload.value.originalFileName = undefined
  listPayload.originalFileName = undefined
  getList()
}

// 处理回车按键，防止页面跳转
const handleEnterKey = (event: KeyboardEvent) => {
  event.preventDefault()
  event.stopPropagation()
  getList()
}

// 处理输入事件，确保值正确更新
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  filePayload.value.originalFileName = target.value || undefined
}

// 全选/取消全选
const toggleSelectAll = () => {
  if (selectedFile.value.length === fileListData.value.list.length) {
    // 如果当前已全选，则取消全选
    selectedFile.value = []
  } else {
    // 否则，选中所有当前页的图片
    selectedFile.value = [...fileListData.value.list]
  }
}

// 重载图片
// 重载图片
const handleReLoadImage = async (image: FileData & CommonField, index: number) => {
  console.log('重新加载图片:', image)

  if (!image.fileUrl) {
    return
  }

  try {
    // 创建新的图片实例来测试加载
    const img = new Image()

    // 添加时间戳参数避免缓存
    const timestamp = new Date().getTime()
    const url = new URL(image.fileUrl)
    url.searchParams.set('_t', timestamp.toString())
    const newImageUrl = url.toString()

    // 返回一个Promise来处理图片加载
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(true)
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = newImageUrl
    })

    // 如果新图片加载成功，更新列表中的图片URL
    image.fileUrl = newImageUrl
    fileListData.value.list[index] = { ...image } // 使用展开运算符创建新对象以触发响应式更新

    console.log('图片重新加载成功')
  } catch (error) {
    console.error('图片重新加载失败:', error)
    // 可以在这里添加用户提示，比如显示通知
    // ElMessage.error('图片重新加载失败')
  }
}

defineExpose({
  open,
})
</script>

<template>
  <ElDialog v-model="dialogVisible" :close-on-click-modal="false" width="60%">
    <template #title>
      <h1 class="text-sm font-semibold text-gray-800">
        选择图片
      </h1>
    </template>
    <div class="max-h-screen overflow-hidden">
      <div class="mx-auto flex flex-col h-[70vh] p-4">
        <!-- 主容器 -->
        <div class="bg-white rounded-lg flex-1 overflow-hidden flex flex-col">
          <div class="flex flex-col lg:flex-row h-full">
            <!-- 左侧分类导航 -->
            <!-- <div class="lg:w-1/5 border-r border-gray-200 flex flex-col">
              <div class="p-4">
                <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  图片分类
                </h2>
                <ul class="space-y-1 flex-1 overflow-y-auto">
                  <li v-for="category in categories" :key="category.id">
                    <button
                      class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      :class="[
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                      ]"
                    >
                      {{ category.name }}
                      <span v-if="category.count" class="text-gray-500 ml-1">({{ category.count }})</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div> -->

            <!-- 右侧主内容区 -->
            <div class="lg:w-5/5 flex flex-col h-full">
              <!-- 筛选工具栏 -->
              <div class="border-b border-gray-200 p-4 flex-shrink-0">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div class="flex flex-wrap items-center gap-4">
                    <!-- 排序选择 -->
                    <!-- <div class="relative">
                      <select
                        v-model="sortBy"
                        class="pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="latest">
                          时间倒序
                        </option>
                        <option value="oldest">
                          时间升序
                        </option>
                        <option value="name">
                          按名称排序
                        </option>
                      </select>
                    </div> -->

                    <!-- 搜索框 -->
                    <div class="relative">
                      <input
                        v-model="listPayload.originalFileName"
                        type="text"
                        placeholder="查询图片名称"
                        class="pl-9 pr-10 py-2 w-full md:w-64 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        @keyup.enter.prevent.stop="getList"
                        @keydown.enter.prevent="handleEnterKey"
                        @input="handleInput"
                      >
                      <div class="absolute left-3 top-2.5 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <button
                        v-if="filePayload.originalFileName"
                        type="button"
                        class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        @click="clearSearch"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="text-sm text-gray-500">
                    共 {{ fileListData.total }} 条
                  </div>
                </div>
              </div>

              <!-- 图片网格 -->
              <div v-loading="fileLoading" class="p-4 flex-1 overflow-y-auto">
                <!-- 无图片状态 -->
                <div v-if="fileListData.total === 0" class="text-center py-12">
                  <ElEmpty description="未找到符合条件的图片" />
                </div>
                <!-- 图片网格 -->
                <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <div
                    v-for="(item, index) in fileListData.list"
                    :key="item.id"
                    class="border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md"
                    :class="[
                      selectedFile.some(sFile => sFile.id === item.id)
                        ? 'ring-2 ring-blue-500 border-blue-500'
                        : 'border-gray-200',
                    ]"
                    @click="toggleSelectFile(item)"
                  >
                    <!-- 图片容器 -->
                    <div class="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                      <div v-if="item.fileUrl" class="w-full h-full flex items-center justify-center">
                        <!-- 图片处理 -->
                        <ElImage
                          v-if="
                            item.fileContentType === 'image/jpeg'
                              || item.fileContentType === 'image/png'
                              || item.fileContentType === 'image/gif'
                              || item.fileContentType === 'image/svg+xml'
                          "
                          :src="item.fileUrl"
                          lazy
                          class="media-content"
                        >
                          @error="handleReLoadImage(item, index)" >
                          <template #error>
                            <!-- 错误处理模板保持不变 -->
                            <div class="flex items-center justify-center h-full">
                              <div class="flex flex-col items-center">
                                <div class="mt-2 text-xs text-gray-500">
                                  图片加载失败
                                </div>
                                <div
                                  class="mt-2 text-xs text-gray-500 cursor-pointer"
                                  @click.stop="handleReLoadImage(item, index)"
                                >
                                  <Icon name="ep:refresh" :size="6" />
                                </div>
                              </div>
                            </div>
                          </template>
                          <template #placeholder>
                            <!-- 占位符模板保持不变 -->
                            <div class="flex items-center justify-center h-full">
                              <div class="flex flex-col items-center">
                                <ElIcon class="is-loading text-gray-400">
                                  <Refresh />
                                </ElIcon>
                                <span class="mt-2 text-xs text-gray-500">加载中...</span>
                              </div>
                            </div>
                          </template>
                        </ElImage>

                        <!-- 视频处理 -->
                        <div
                          v-if="
                            item.fileContentType === 'video/mp4'
                              || item.fileContentType === 'video/webm'
                              || item.fileContentType === 'video/ogg'
                          "
                          class="w-full h-full flex items-center justify-center"
                        >
                          <video :src="item.fileUrl" class="media-content" controls>
                            您的浏览器不支持 HTML5 video 标签。
                          </video>
                        </div>
                      </div>

                      <!-- 图片占位符（保持不变） -->
                      <div v-else class="text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-12 w-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      <!-- 选中标记（保持不变） -->
                      <div
                        v-if="selectedFile.some(sFile => sFile.id === item.id)"
                        class="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <!-- 图片信息 -->
                    <div class="p-3">
                      <h3 class="text-sm font-medium text-gray-800 truncate">
                        {{ item.originalFileName }}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full flex justify-end">
                <Pagination
                  v-show="fileListData.total > 0"
                  v-model:page="filePayload.pageNumber"
                  v-model:limit="filePayload.pageSize"
                  :total="fileListData.total"
                  @pagination="pagination"
                />
              </div>

              <!-- 底部栏 -->
              <div class="border-t border-gray-200 p-4 flex-shrink-0">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <!-- 容量使用情况 -->
                  <div class="w-full md:w-auto">
                    <div class="text-sm text-gray-700 mb-1">
                      已使用 {{ fileSize }}G / 10G
                    </div>
                    <div class="w-full md:w-64 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-600 h-2 rounded-full"
                        :style="{ width: `${(usedStorage / totalStorage) * 100}%` }"
                      />
                    </div>
                  </div>

                  <!-- 选择状态和操作按钮 -->
                  <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div class="text-sm text-gray-600 mb-2 sm:mb-0">
                      已选择 {{ selectedFile.length }} 张图片
                      <button
                        v-if="fileListData.list.length > 0"
                        class="cursor-pointer ml-2 text-blue-500 hover:text-blue-700 underline"
                        @click="toggleSelectAll"
                      >
                        {{ selectedFile.length === fileListData.list.length ? '取消全选' : '全选' }}
                      </button>
                    </div>
                    <div class="flex space-x-3">
                      <button
                        class="cursor-pointer px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        @click="cancelSelection"
                      >
                        取消
                      </button>
                      <button
                        :disabled="selectedFile.length === 0"
                        class="cursor-pointer px-5 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        :class="[
                          selectedFile.length > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                        ]"
                        @click="confirmSelection"
                      >
                        确定 ({{ selectedFile.length }})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<style scoped>
/* 新增媒体内容样式 */
.media-content {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: scale-down; /* 关键属性：小图片不放大，大图片缩小适应 */
}
</style>
