<script setup name="UserDetail" lang="ts">
import { componentListApi, showCompApi } from '@/api/comp'
import { createLayoutApi, editLayoutApi } from '@/api/layout'
import { useLocale } from '@/hooks/useLocale'
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash'
import { VueDraggable } from 'vue-draggable-plus'

const emit = defineEmits(['getList', 'handleChangeVisible'])

const { t: $t } = useLocale()

// 页面标题
const pageTitle = ref('')

// 组件表单
const form = reactive<LayoutData>({
  id: 0,
  layoutName: '',
  layoutContent: '',
})

const loading = reactive({
  init: true,
  save: false,
})

// 当前页面ID
const id = ref(0)

// 已选的组件
const selectedComponent = ref<LayoutComponentData>({
  id: 0,
  componentId: 0,
  sort: 0,
  componentName: '',
})

// 用于设置元素的form表单

const componentFormRef = ref()

const componentFormRules = reactive({
  componentId: [{ required: true, message: $t('layout.placeholder.componentId'), trigger: 'change' }],
})

const componentForm = reactive<LayoutComponentForm>({
  componentId: null,
})

// 操作类型
const actionType = ref('none')

/**
 * Rows
 */

const layoutContentList = ref<LayoutComponentData[]>([])

const draggingRow = ref(false)

// 改变行排序
const handleChangeRowSort = () => {
  layoutContentList.value.forEach((item, index) => {
    item.sort = index + 1
  })
}

const listComponentPayload = reactive<CompListParams>({
  componentName: null,
})

const listComponentData = ref<TableResponse<CompData & CommonField>>({
  list: [],
  total: 0,
})

const getComponentList = debounce(async () => {
  loading.init = true
  const { data } = await componentListApi(listComponentPayload).catch(error => {
    loading.init = false
    throw error
  })
  listComponentData.value = data
  loading.init = false
}, 300)

getComponentList()

const getComponentDetail = async (id: string) => {
  loading.init = true
  const { data } = await showCompApi(id).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

// componentDialog是否显示
const componentDialogVisible = ref(false)

// 添加组件
const handleAddComponent = () => {
  componentDialogVisible.value = true
}

// 修改组件
const handleEditComponent = (val: LayoutComponentData) => {
  selectedComponent.value = val
  componentForm.componentId = val.componentId
  componentDialogVisible.value = true
}

// 设置组件
const handleSettingComponent = async (val: LayoutComponentData) => {
  router.push({ name: 'ComponentList', query: { componentName: val.componentName } })
}

// 删除组件
const handleDeleteComponent = (val: LayoutComponentData) => {
  layoutContentList.value = layoutContentList.value.filter(item => item.componentId !== val.componentId)
  handleChangeRowSort()
}

const handleCancelComponentToLayout = () => {
  componentDialogVisible.value = false
  componentForm.componentId = null
  selectedComponent.value = {
    id: 0,
    componentId: 0,
    sort: 0,
    componentName: '',
  }
}

const handleConfirmComponentToLayout = async () => {
  const valid = await componentFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  // 从components中查找componentForm.componentLayoutCode对应的component，并重新赋值给selectedComponent.value
  const component = listComponentData.value.list.find(item => item.id === componentForm.componentId)
  if (component) {
    // 如果selectedComponent.value不存在，就新增一个,否则就修改
    if (!selectedComponent.value.componentId) {
      selectedComponent.value.id = layoutContentList.value.length + 1
      selectedComponent.value.componentId = component.id
      selectedComponent.value.componentName = component.componentName
      selectedComponent.value.sort = layoutContentList.value.length + 1
      layoutContentList.value.push(selectedComponent.value)
    } else {
      const index = layoutContentList.value.findIndex(item => item.id === selectedComponent.value.id)
      layoutContentList.value[index] = {
        id: selectedComponent.value.id,
        componentId: component.id,
        componentName: component.componentName,
        sort: selectedComponent.value.sort,
      }
    }
  }
  handleCancelComponentToLayout()
}

/**
 * 保存数据
 */
const createLayout = async () => {
  loading.save = true
  await createLayoutApi({ layoutName: form.layoutName, layoutContent: form.layoutContent }).catch(error => {
    loading.save = false
    throw error
  })
  loading.save = false
  ElMessage.success($t('success.create'))
}

const editLayout = async () => {
  loading.save = true
  await editLayoutApi(id.value, { layoutName: form.layoutName, layoutContent: form.layoutContent }).catch(error => {
    loading.save = false
    throw error
  })
  loading.save = false
  ElMessage.success($t('success.edit'))
}

const handleSubmit = async () => {
  if (form.layoutName === '') {
    ElMessage.warning($t('layout.warning.layoutName'))
    return
  }
  if (layoutContentList.value.length === 0) {
    ElMessage.warning($t('layout.warning.emptyRow'))
    return
  }
  loading.save = true
  form.layoutContent = JSON.stringify(layoutContentList.value)
  if (actionType.value === 'add' || id.value === 0) {
    await createLayout()
  } else {
    await editLayout()
  }
  loading.save = false
  emit('getList')
  emit('handleChangeVisible')
}

// 保存
const save = debounce(async () => {
  await handleSubmit()
}, 100)

function handleCancel() {
  emit('handleChangeVisible')
}

async function init(actionTypeData: string, layoutData?: LayoutData) {
  loading.init = true
  actionType.value = actionTypeData
  if (actionTypeData === 'add') {
    pageTitle.value = $t('common.create') + $t('layout.name')
    layoutContentList.value = []
    Object.assign(form, {
      layoutName: '',
      layoutContent: '',
      id: 0,
    })
  } else {
    id.value = layoutData?.id ?? 0
    if (layoutData?.layoutContent) {
      layoutContentList.value = JSON.parse(layoutData.layoutContent)
      if (layoutContentList.value.length > 0) {
        layoutContentList.value.forEach(async item => {
          const res = await getComponentDetail(item.componentId)
          item.componentName = res.componentName
        })
      }
    }
    Object.assign(form, layoutData)
    pageTitle.value = $t('common.edit') + $t('layout.name')
  }
  loading.init = false
}

defineExpose({
  init,
})
</script>

<template>
  <div class="w-full">
    <div class="bg-white h-24 flex items-center justify-between pa-5 border-b border-gray-200">
      <!-- 组件名称 -->
      <div class="flex items-center">
        <h4 class="w-30 mr-3">
          {{ pageTitle }}
        </h4>
        <div class="flex items-center w-full">
          <div class="flex items-center ">
            <span class="w-30 mr-2">{{ $t('layout.layoutName') }}： </span>
            <ElInput v-model="form.layoutName" :placeholder="$t('layout.placeholder.layoutName')" />
          </div>
        </div>
      </div>
      <!-- 组件操作按钮 -->
      <div>
        <EBtn
          class="filter-item"
          size="small"
          type="default"
          :loading="loading.save"
          @click="handleCancel"
        >
          <Icon icon="ant-design:close-outlined" class="mr-1" />
          {{ $t('common.cancel') }}
        </EBtn>
        <EBtn
          class="filter-item"
          size="small"
          type="primary"
          :loading="loading.save"
          @click="save"
        >
          <Icon icon="ant-design:save-outlined" class="mr-1" />
          {{ $t('common.save') }}
        </EBtn>
      </div>
    </div>
    <div class="view-main">
      <VueDraggable v-model="layoutContentList" class="w-full" item-key="id" @start="draggingRow = true" @end="handleChangeRowSort">
        <div v-for="item in layoutContentList" :key="item.componentId" class="mb-5">
          <div class="w-full bg-gray-50">
            <div class="border border-gray-300">
              <div class="w-full text-sm flex justify-between pa-5 bg-white">
                <div class="flex items-center">
                  <span><Icon name="ant-design:holder-outlined" class="mr-1" /></span><span>{{ item.componentName }}</span>
                </div>
                <div class="flex justify-end items-center">
                  <EBtn text @click="handleSettingComponent(item)">
                    <Icon icon="ant-design:setting-outlined" :size="5" />
                  </EBtn>
                  <EBtn text @click="handleEditComponent(item)">
                    <Icon icon="ant-design:edit-outlined" :size="5" />
                  </EBtn>
                  <ElPopconfirm :title="`${$t('common.removeConfirm')}`" @confirm="handleDeleteComponent(item)">
                    <template #reference>
                      <EBtn text>
                        <Icon icon="ant-design:delete-outlined" :size="5" color="#f56c6c" />
                      </EBtn>
                    </template>
                  </ElPopconfirm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VueDraggable>

      <!-- 添加组件 -->
      <div class="w-full">
        <EBtn
          class="filter-item w-full"
          size="small"
          plain
          type="primary"
          :loading="loading.save"
          @click="handleAddComponent"
        >
          <Icon icon="ant-design:plus-outlined" class="mr-1" />
          {{ $t('common.add') }}{{ $t('layout.component') }}
        </EBtn>
      </div>
    </div>

    <!-- Component Dialog -->
    <ElDialog v-model="componentDialogVisible">
      <template #header>
        <div class="text-sm font-bold">
          {{ $t('layout.settingComponent') }}
        </div>
      </template>
      <div class="p-5">
        <ElForm ref="componentFormRef" :model="componentForm" :rules="componentFormRules" label-width="100px">
          <ElFormItem :label="$t('layout.component')" prop="componentId" required>
            <ElSelect v-model="componentForm.componentId" value-key="componentId" clearable filterable :placeholder="$t('layout.placeholder.componentId')">
              <ElOption v-for="item in listComponentData.list" :key="item.id" :label="item.componentName" :value="item.id" />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <EBtn @click="handleCancelComponentToLayout">
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn type="primary" @click="handleConfirmComponentToLayout">
            {{ $t('common.submit') }}
          </EBtn>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
