<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import { iconCategories } from '@/data/icon'
// 定义组件属性
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '搜索图标...',
  },
  pageSize: {
    type: Number,
    default: 100,
  },
})
// 定义事件发射
const emit = defineEmits(['update:modelValue', 'change', 'getData'])

// 状态管理
const searchKeyword = ref('')
const currentPage = ref(1)
const selectedIcon = ref(props.modelValue)
const activeCategory = ref('ep')
const customIcon = ref('')
// 计算属性
const allIcons = computed(() => {
  const icons = []
  for (const category in iconCategories) {
    icons.push(...iconCategories[category])
  }
  return icons
})
const filteredIcons = computed(() => {
  if (!searchKeyword.value) {
    return iconCategories[activeCategory.value] || []
  }
  // 支持直接输入图标代码查找
  if (searchKeyword.value.includes(':')) {
    return [searchKeyword.value]
  }
  // 在所有图标中搜索
  return allIcons.value.filter(icon => icon.toLowerCase().includes(searchKeyword.value.toLowerCase()))
})
const paginatedIcons = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredIcons.value.slice(start, end)
})
const totalPages = computed(() => {
  return Math.ceil(filteredIcons.value.length / props.pageSize)
})
// 方法
const handleIconSelect = (iconName: string) => {
  selectedIcon.value = iconName
  emit('update:modelValue', iconName)
  emit('change', iconName)
  emit('getData', { iconName })
}
const handleSearch = (value: string) => {
  searchKeyword.value = value
  currentPage.value = 1
}
const handleCustomIcon = () => {
  if (customIcon.value) {
    handleIconSelect(customIcon.value)
  }
}
// 监听modelValue变化
watch(
  () => props.modelValue,
  newValue => {
    selectedIcon.value = newValue
  },
)
// 暴露方法给父组件
defineExpose({
  getData: () => ({ iconName: selectedIcon.value }),
})
</script>

<template>
  <div class="icon-picker">
    <ElInput v-model="searchKeyword" :placeholder="placeholder" clearable class="mb-2.5" @input="handleSearch">
      <template #prefix>
        <Icon icon="ep:search" />
      </template>
    </ElInput>
    <div class="mb-2.5 flex">
      <ElInput v-model="customIcon" placeholder="输入图标代码 (如: ep:plus, mdi:home)" class="flex-1 mr-2.5" />
      <ElButton @click="handleCustomIcon">
        添加
      </ElButton>
    </div>
    <ElTabs v-model="activeCategory" type="card" class="mb-2.5">
      <ElTabPane label="EP" name="ep" />
      <ElTabPane label="Web" name="web" />
      <ElTabPane label="社交" name="social" />
      <ElTabPane label="植物" name="plant" />
      <ElTabPane label="动物" name="animal" />
      <ElTabPane label="建筑" name="building" />
      <ElTabPane label="机械" name="machine" />
      <ElTabPane label="其他" name="other" />
    </ElTabs>
    <div class="icon-list-container">
      <ElScrollbar class="icon-scrollbar">
        <div class="icon-list">
          <div
            v-for="icon in paginatedIcons"
            :key="icon"
            class="icon-item"
            :class="{ active: selectedIcon === icon }"
            @click="handleIconSelect(icon)"
          >
            <Icon :icon="icon" :width="24" :height="24" />
            <span class="icon-name">{{ icon }}</span>
          </div>

          <div v-if="paginatedIcons.length === 0" class="no-icons">
            未找到相关图标
          </div>
        </div>
      </ElScrollbar>
    </div>
    <div v-if="totalPages > 1" class="pagination">
      <ElButton size="small" :disabled="currentPage <= 1" @click="currentPage--">
        上一页
      </ElButton>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <ElButton size="small" :disabled="currentPage >= totalPages" @click="currentPage++">
        下一页
      </ElButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.icon-picker {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 10px;
  background: var(--el-bg-color);
}

.icon-list-container {
  margin-top: 10px;
  height: 300px;
}

.icon-scrollbar {
  height: 100%;
}

.icon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-small);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
  width: 120px;

  &:hover {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

  &.active {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-8);
    box-shadow: 0 0 0 2px var(--el-color-primary-light-5);
  }
}

.icon-name {
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-name {
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-icons {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  color: var(--el-text-color-secondary);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  gap: 10px;

  .page-info {
    font-size: 14px;
    color: var(--el-text-color-regular);
  }
}
</style>
