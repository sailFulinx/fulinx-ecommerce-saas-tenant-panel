<script setup name="ThemeSubMenu" lang="ts">
import { ElMessage } from 'element-plus'
import { hasContentElements } from '@/utils'
import MenuTree from './MenuTree.vue'

const props = defineProps<{
  componentData: MenuData[]
}>()

const moduleSubMenuFormRef = ref()
const subMenus = ref<MenuData[]>([])
const dialogVisible = ref(false)
const themeLinkRef = ref()
const currentSubMenu = ref<MenuData>({
  id: 0,
  menuLabel: '',
  link: {
    id: 0,
    linkType: '',
    linkLabel: '',
    linkUrl: '',
    linkValue: '',
    children: [],
  },
  linkType: '',
  linkUrl: '',
  linkValue: '',
  children: [],
})
const isEditMenu = ref(false)
// 添加当前编辑的菜单层级
const currentLevel = ref(0)
// 添加父级菜单ID路径，用于追踪菜单层级关系
const parentPath = ref<number[]>([])

watch(
  () => props.componentData,
  val => {
    if (val && val.length > 0) {
      subMenus.value = val
    } else {
      subMenus.value = []
    }
  },
  { immediate: true, deep: true },
)

// 生成唯一ID
const generateUniqueId = () => {
  const getAllMenus = (menus: MenuData[]): MenuData[] => {
    let result: MenuData[] = []
    menus.forEach(menu => {
      result.push(menu)
      if (menu.children && menu.children.length > 0) {
        result = result.concat(getAllMenus(menu.children))
      }
    })
    return result
  }

  const allMenus = getAllMenus(subMenus.value)
  if (allMenus.length > 0) {
    const maxId = Math.max(...allMenus.map(menu => menu.id))
    return maxId + 1
  }
  return 1
}

// 添加子菜单
async function addSubMenu(parentId: number[] = []) {
  const id = generateUniqueId()

  currentSubMenu.value = {
    id,
    menuLabel: '',
    link: {
      id: 0,
      linkType: '',
      linkLabel: '',
      linkUrl: '',
      linkValue: '',
      children: [],
    },
    linkType: '',
    linkUrl: '',
    linkValue: '',
    children: [],
  }

  // 设置当前层级和父级路径
  currentLevel.value = parentId.length
  parentPath.value = [...parentId]

  dialogVisible.value = true
  await nextTick()
  if (themeLinkRef.value) {
    themeLinkRef.value.setLinkData(currentSubMenu.value)
  }
}

// 编辑菜单
async function editMenu(val: MenuData, parentId: number[] = []) {
  dialogVisible.value = true
  isEditMenu.value = true
  currentSubMenu.value = { ...val }

  // 设置当前层级和父级路径
  currentLevel.value = parentId.length
  parentPath.value = [...parentId]

  await nextTick()
  if (themeLinkRef.value) {
    themeLinkRef.value.setLinkData(currentSubMenu.value.link)
  }
}

// 删除菜单
function removeMenu(val: MenuData) {
  const removeMenuRecursive = (menus: MenuData[]): boolean => {
    const index = menus.findIndex(item => item.id === val.id)
    if (index !== -1) {
      menus.splice(index, 1)
      return true
    }

    // 递归查找子菜单
    for (const menu of menus) {
      if (menu.children && menu.children.length > 0) {
        if (removeMenuRecursive(menu.children)) {
          return true
        }
      }
    }

    return false
  }

  removeMenuRecursive(subMenus.value)
}

// 提交子菜单
async function submitSubMenu() {
  if (!currentSubMenu.value.menuLabel) {
    ElMessage.error('请填写菜单名称')
    return
  }

  if (themeLinkRef.value) {
    const linkData = await themeLinkRef.value.getLinkData()
    if (!linkData || !hasContentElements(linkData)) {
      ElMessage.error('请填写链接信息')
      return
    }
    currentSubMenu.value.linkType = linkData.linkType
    currentSubMenu.value.linkUrl = linkData.linkUrl
    currentSubMenu.value.linkValue = linkData.linkValue
    currentSubMenu.value.link = linkData
  }

  // 根据父级路径找到正确的菜单数组进行操作
  if (isEditMenu.value) {
    // 编辑模式
    const updateMenuRecursive = (menus: MenuData[]): boolean => {
      const index = menus.findIndex(item => item.id === currentSubMenu.value.id)
      if (index !== -1) {
        menus[index] = { ...currentSubMenu.value }
        return true
      }

      // 递归查找子菜单
      for (const menu of menus) {
        if (menu.children && menu.children.length > 0) {
          if (updateMenuRecursive(menu.children)) {
            return true
          }
        }
      }

      return false
    }

    updateMenuRecursive(subMenus.value)
  } else {
    // 添加模式
    if (parentPath.value.length > 0) {
      // 添加到子菜单中
      const addToChildrenRecursive = (menus: MenuData[]): boolean => {
        if (parentPath.value.length === 0) {
          return false
        }

        const parentId = parentPath.value[0]
        const parentMenu = menus.find(menu => menu.id === parentId)

        if (parentMenu) {
          if (parentPath.value.length === 1) {
            // 到达目标父级菜单
            if (!parentMenu.children) {
              parentMenu.children = []
            }
            parentMenu.children.push({ ...currentSubMenu.value })
            return true
          } else {
            // 继续深入查找
            if (parentMenu.children && parentMenu.children.length > 0) {
              // 更新parentPath，移除第一个元素
              const remainingPath = parentPath.value.slice(1)
              const tempPath = parentPath.value
              parentPath.value = remainingPath
              const result = addToChildrenRecursive(parentMenu.children)
              parentPath.value = tempPath // 恢复parentPath
              return result
            }
          }
        }

        // 在同级的其他菜单中查找
        for (const menu of menus) {
          if (menu.id !== parentId && menu.children && menu.children.length > 0) {
            if (addToChildrenRecursive(menu.children)) {
              return true
            }
          }
        }

        return false
      }

      addToChildrenRecursive(subMenus.value)
    } else {
      // 添加到根级别
      subMenus.value.push({ ...currentSubMenu.value })
    }
  }

  dialogVisible.value = false
  isEditMenu.value = false
  currentLevel.value = 0
  parentPath.value = []
}

// 处理菜单排序更新
function handleUpdateMenus(menus: MenuData[]) {
  subMenus.value = menus
}

// 获取表单数据
function getFormData() {
  return subMenus.value
}

// 添加子级菜单
function addChildMenu(parentMenu: MenuData, parentIdPath: number[]) {
  addSubMenu([...parentIdPath, parentMenu.id])
}

defineExpose({
  getFormData,
})
</script>

<template>
  <div class="w-full">
    <div class="w-full">
      <EBtn type="primary" plain size="small" class="mb-5" @click="() => addSubMenu([])">
        添加菜单
      </EBtn>
    </div>
    <div class="w-full">
      <div class="flex justify-between border-b pb-2">
        <div class="font-semibold">
          菜单名称
        </div>
        <div class="font-semibold">
          操作
        </div>
      </div>
      <!-- 使用递归组件渲染多级菜单 -->
      <MenuTree
        :menus="subMenus"
        :parent-path="[]"
        @add-child="addChildMenu"
        @edit="editMenu"
        @remove="removeMenu"
        @update-menus="handleUpdateMenus"
      />
    </div>

    <ElDialog v-model="dialogVisible" :title="isEditMenu ? '编辑菜单' : '添加菜单'" width="50%">
      <ElForm ref="moduleSubMenuFormRef" label-width="120px">
        <ElFormItem label="菜单名称" required>
          <ElInput
            v-model="currentSubMenu.menuLabel"
            class="input-line"
            minlength="1"
            maxlength="60"
            placeholder="菜单名称"
          />
        </ElFormItem>
        <ElFormItem label="链接" required class="mt-5">
          <ModuleLink ref="themeLinkRef" :is-need-children="true" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <EBtn @click="dialogVisible = false">
          取 消
        </EBtn>
        <EBtn type="primary" @click="submitSubMenu">
          确 定
        </EBtn>
      </template>
    </ElDialog>
  </div>
</template>
