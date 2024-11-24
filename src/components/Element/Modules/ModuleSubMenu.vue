<script setup name="ThemeSubMenu" lang="ts">
import { hasContentElements } from '@/utils'
import { ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps<{
  componentData: MenuData[]
}>()

const moduleSubMenuFormRef = ref()
const dragging = ref(false)
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

async function addSubMenu() {
  let id = subMenus.value.length > 0 ? subMenus.value.length : 0
  id = id + 1
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
  dialogVisible.value = true
  await nextTick()
  themeLinkRef.value.setLinkData(currentSubMenu.value)
}

/**
 * 改变菜单排序
 */
function handleChangeMenuSort() {
  subMenus.value.forEach((item, index) => {
    item.id = index + 1
  })
}

/**
 * 拖动结束事件
 */
function dragEnd() {
  handleChangeMenuSort()
}

async function editMenu(val: MenuData) {
  dialogVisible.value = true
  isEditMenu.value = true
  currentSubMenu.value = val
  await nextTick()
  themeLinkRef.value.setLinkData(currentSubMenu.value.link)
}

function removeMenu(val: MenuData) {
  subMenus.value = subMenus.value.filter(item => item.id !== val.id)
}

async function submitSubMenu() {
  if (!currentSubMenu.value.menuLabel) {
    ElMessage.error('请填写菜单名称')
    return
  }
  const linkData = await themeLinkRef.value.getLinkData()
  if (!linkData || !hasContentElements(linkData)) {
    ElMessage.error('请填写链接信息')
    return
  }
  currentSubMenu.value.linkType = linkData.linkType
  currentSubMenu.value.linkUrl = linkData.linkUrl
  currentSubMenu.value.linkValue = linkData.linkValue
  currentSubMenu.value.link = linkData

  if (isEditMenu.value) {
    subMenus.value = subMenus.value.map(item => {
      return item.id === currentSubMenu.value.id ? { ...currentSubMenu.value } : item
    })
  } else {
    subMenus.value.push({ ...currentSubMenu.value })
  }
  console.log(subMenus.value)
  dialogVisible.value = false
  isEditMenu.value = false
}

function getFormData() {
  return subMenus.value
}

defineExpose({
  getFormData,
})
</script>

<template>
  <div class="w-full">
    <div class="w-full">
      <ElButton type="primary" size="small" class="mb-5" style="height: 36px; line-height: 36px" @click="addSubMenu">
        添加菜单
      </ElButton>
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
      <VueDraggable v-model="subMenus" item-key="id" @start="dragging = true" @end="dragEnd">
        <div v-for="row in subMenus" :key="row.id" class="flex justify-between items-center py-2 border-b">
          <div class="text-left flex items-center">
            <span><Icon icon="ant-design:holder-outlined" /></span>
            <span>{{ row.menuLabel }}</span>
          </div>
          <div class="flex space-x-4">
            <EBtn text type="primary" @click="editMenu(row)">
              修改
            </EBtn>
            <EBtn text type="danger" @click="removeMenu(row)">
              删除
            </EBtn>
          </div>
        </div>
      </VueDraggable>
    </div>

    <ElDialog v-model="dialogVisible" title="子菜单" width="50%">
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
          <ModuleLink ref="themeLinkRef" :is-need-children="true" :link-data="currentSubMenu" />
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
