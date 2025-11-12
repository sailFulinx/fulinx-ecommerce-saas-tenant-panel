<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
// 递归菜单树组件
const props = defineProps<{
  menus: MenuData[]
  parentPath: number[]
}>()

const emit = defineEmits<{
  (e: 'addChild', menu: MenuData, parentPath: number[]): void
  (e: 'edit', menu: MenuData, parentPath: number[]): void
  (e: 'remove', menu: MenuData): void
  (e: 'updateMenus', menus: MenuData[]): void
}>()

const dragging = ref(false)
const localMenus = ref<MenuData[]>([...props.menus])

watch(() => props.menus, newMenus => {
  localMenus.value = [...newMenus]
}, { deep: true })

/**
 * 拖动结束事件
 */
function dragEnd() {
  // 发出更新事件，通知父组件菜单顺序已改变
  emit('updateMenus', localMenus.value)
}

const addChildMenu = (menu: MenuData) => {
  emit('addChild', menu, props.parentPath)
}

const editMenu = (menu: MenuData) => {
  emit('edit', menu, props.parentPath)
}

const removeMenu = (menu: MenuData) => {
  emit('remove', menu)
}
</script>

<template>
  <VueDraggable
    v-model="localMenus"
    item-key="id"
    :animation="200"
    :fallback-on-body="true"
    :swap-threshold="0.65"
    ghost-class="opacity-50"
    @start="dragging = true"
    @end="() => { dragging = false; dragEnd() }"
  >
    <div v-for="menu in localMenus" :key="menu.id" class="w-full">
      <div class="grid grid-cols-12 gap-2 py-2 border-b border-gray-300 items-center">
        <div class="col-span-6 flex items-center overflow-hidden">
          <span><Icon icon="ant-design:holder-outlined" /></span>
          <span class="ml-1 truncate">{{ menu.menuLabel }}</span>
        </div>
        <div class="col-span-6 flex justify-end space-x-2">
          <span class="text-blue-600 cursor-pointer text-sm whitespace-nowrap" @click="() => addChildMenu(menu)">添加子菜单</span>
          <span class="text-blue-600 cursor-pointer text-sm whitespace-nowrap" @click="() => editMenu(menu)">修改</span>
          <span class="text-red-600 cursor-pointer text-sm whitespace-nowrap" @click="() => removeMenu(menu)">删除</span>
        </div>
      </div>
      <!-- 递归渲染子菜单 -->
      <div v-if="menu.children && menu.children.length > 0" class="pl-6 mt-1">
        <MenuTree
          :menus="menu.children"
          :parent-path="[...parentPath, menu.id]"
          @add-child="(childMenu, path) => emit('addChild', childMenu, path)"
          @edit="(childMenu, path) => emit('edit', childMenu, path)"
          @remove="childMenu => emit('remove', childMenu)"
          @update-menus="(updatedChildren) => { menu.children = updatedChildren; dragEnd() }"
        />
      </div>
    </div>
  </VueDraggable>
</template>
