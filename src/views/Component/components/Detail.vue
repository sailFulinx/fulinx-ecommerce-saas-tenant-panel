<script setup name="UserDetail" lang="ts">
import { createCompApi, editCompApi } from '@/api/comp'
import { elements } from '@/data/element'
import { useLocale } from '@/hooks/useLocale'
import { getComponent } from '@/utils/comp'
import { ElForm, ElInput, ElMessage } from 'element-plus'
import { debounce } from 'lodash'
import { VueDraggable } from 'vue-draggable-plus'
import RowDialog from './RowDialog.vue'

const emit = defineEmits(['getList', 'handleChangeVisible'])

const { t: $t } = useLocale()

// 页面标题
const pageTitle = ref('')

// 组件表单
const form = reactive<CompData>({
  id: 0,
  componentName: '',
  componentContent: '',
})

const loading = reactive({
  init: true,
  save: false,
})

// 当前页面ID
const id = ref(0)

// 操作类型
const actionType = ref('none')

/**
 * Rows
 */

const rows = ref<ComponentRowData[]>([])

const rowsDialogRef = ref()

const draggingRow = ref(false)

// 改变行排序
const handleChangeRowSort = () => {
  rows.value.forEach((item, index) => {
    item.sort = index + 1
    item.id = index + 1
  })
}

// 设置行
const setRows = (val: ComponentRowData) => {
  // 如果val.id与rows中元素的id相同修改，否则新增
  const index = rows.value.findIndex(item => item.id === val.id)
  if (index > -1) {
    rows.value[index] = val
  } else {
    rows.value.push(val)
  }
  handleChangeRowSort()
}

// 添加行
const handleAddRow = () => {
  rowsDialogRef.value.openDialog(false, rows.value.length)
}

// 修改行
const handleEditRow = (row: ComponentRowData) => {
  rowsDialogRef.value.openDialog(true, rows.value.length, row)
}

// 删除行
const handleDeleteRow = (row: ComponentRowData) => {
  rows.value = rows.value.filter(item => item.id !== row.id)
  handleChangeRowSort()
}

/**
 * Element
 */

const draggingElement = ref(false)

// 行内元素排序
function handleChangeElementSort(rowIndex: number) {
  rows.value[rowIndex].columns.forEach((item, index) => {
    item.rowElementSort = index + 1
  })
}

// 用于设置元素的form表单

const elementFormRef = ref()

const elementFormRules = reactive({
  aliasName: [{ required: true, message: $t('comps.placeholder.aliasName'), trigger: 'blur' }],
  elementComponentCode: [{ required: true, message: $t('comps.placeholder.element'), trigger: 'change' }],
})

const elementForm = ref<CompElementFormData>({
  elementComponentCode: '',
  webComponentCode: '',
  aliasName: '',
})

// elementDialog是否显示
const elementDialogVisible = ref(false)

// 当前选中的行
const activeRowIndex = ref(0)

// 当前选中的列
const activeColIndex = ref(0)

// 动态添加元素到指定列
const handleSettingElementToColumn = (rowIndex: number, colIndex: number) => {
  elementDialogVisible.value = true
  activeRowIndex.value = rowIndex
  activeColIndex.value = colIndex
}

// 从行中删除元素
const handleDeleteRowColumn = (rowIndex: number, colIndex: number) => {
  // 如果只有最后一列，不允许删除
  if (rows.value[rowIndex].columns.length === 1) {
    ElMessage.warning($t('comps.warning.lastColumn'))
    return
  }
  rows.value[rowIndex].columns.splice(colIndex, 1)
  rows.value[rowIndex].columnsCount = rows.value[rowIndex].columns.length
  handleChangeElementSort(rowIndex)
}

// 编辑列中元素
const handleEditColumnElement = async (rowIndex: number, colIndex: number) => {
  elementForm.value.aliasName = ''
  elementForm.value.elementComponentCode = ''
  elementForm.value.webComponentCode = ''
  elementDialogVisible.value = true
  const column = { ...rows.value[rowIndex].columns[colIndex] }
  activeRowIndex.value = rowIndex
  activeColIndex.value = colIndex
  elementForm.value.aliasName = column.aliasName
  elementForm.value.elementComponentCode = column.elementComponentCode
  elementForm.value.webComponentCode = column.webComponentCode
}

const handleCancelElementToColumn = () => {
  elementDialogVisible.value = false
  elementForm.value.aliasName = ''
  elementForm.value.elementComponentCode = ''
  elementForm.value.webComponentCode = ''
}

// 修改webComponentCode时
const handleConfirmElementToColumn = async () => {
  const valid = await elementFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  // 如果elementForm.value.elementComponentCode与当前的行列的elementComponentCode相同，只修改aliasName和webComponentCode
  const column = { ...rows.value[activeRowIndex.value].columns[activeColIndex.value] }
  if (column.elementComponentCode === elementForm.value.elementComponentCode) {
    column.aliasName = elementForm.value.aliasName
    column.webComponentCode = elementForm.value.webComponentCode
    Object.assign(rows.value[activeRowIndex.value].columns[activeColIndex.value], column)
  } else {
    // 从elements中查找elementForm.elementComponentCode对应的element，并重新赋值给selectedElement.value
    const element = elements.find(item => item.elementComponentCode === elementForm.value.elementComponentCode)
    if (element) {
      const selectedElement = {
        elementId: element.elementId,
        elementComponentCode: element.elementComponentCode,
        webComponentCode: elementForm.value.webComponentCode,
        elementComponentConfig: {
          content: {},
          status: true,
        },
        elementName: element.elementName,
        aliasName: elementForm.value.aliasName,
      }
      rows.value[activeRowIndex.value].columns[activeColIndex.value] = selectedElement
    }
  }

  handleCancelElementToColumn()
}

/**
 * 组件
 */
const componentDialogVisible = ref(false)
const activeComponentRef = ref()
const activeComponent = ref<ElementData>({
  elementComponentCode: '',
  elementComponentConfig: {
    content: {},
    status: true,
  },
  elementName: '',
  aliasName: '',
})

// 设置组件
const handleSettingComponent = async (rowIndex: number, colIndex: number, val: ElementData) => {
  activeComponent.value = {
    elementComponentCode: '',
    elementComponentConfig: {
      content: {},
      status: true,
    },
    elementName: '',
    aliasName: '',
  }
  activeRowIndex.value = rowIndex
  activeColIndex.value = colIndex
  activeComponent.value = val
  componentDialogVisible.value = true
}

const handleCancelSubmitComponent = () => {
  componentDialogVisible.value = false
}

// 提交组件数据，保存组件数据到行
const handleSubmitComponent = async () => {
  const res = await activeComponentRef.value.getFormData()
  if (!res) {
    return
  }
  rows.value[activeRowIndex.value].columns[activeColIndex.value].elementComponentConfig = res
  componentDialogVisible.value = false
}

/**
 * 保存数据
 */
const createComponent = async () => {
  loading.save = true
  await createCompApi({ componentName: form.componentName, componentContent: form.componentContent }).catch(error => {
    loading.save = false
    throw error
  })
  loading.save = false
  ElMessage.success($t('success.create'))
}

const editComponent = async () => {
  loading.save = true
  await editCompApi(id.value, { componentName: form.componentName, componentContent: form.componentContent }).catch(error => {
    loading.save = false
    throw error
  })
  loading.save = false
  ElMessage.success($t('success.edit'))
}

const handleSubmit = async () => {
  if (form.componentName === '') {
    ElMessage.warning($t('comps.warning.componentName'))
    return
  }
  if (rows.value.length === 0) {
    ElMessage.warning($t('comps.warning.emptyRow'))
    return
  }
  loading.save = true
  form.componentContent = JSON.stringify(rows.value)
  if (actionType.value === 'add' || id.value === 0) {
    await createComponent()
  } else {
    await editComponent()
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

function init(actionTypeData: string, compData?: CompData) {
  loading.init = true
  actionType.value = actionTypeData
  if (actionTypeData === 'add') {
    pageTitle.value = $t('common.create') + $t('comps.name')
    rows.value = []
    Object.assign(form, {
      componentName: '',
      componentContent: '',
      id: 0,
    })
  } else {
    id.value = compData?.id ?? 0
    if (compData?.componentContent) {
      rows.value = JSON.parse(compData.componentContent)
    }
    Object.assign(form, compData)
    pageTitle.value = $t('common.edit') + $t('comps.name')
  }
  loading.init = false
}

defineExpose({
  init,
})
</script>

<template>
  <div class="w-full">
    <div class="bg-white flex items-center justify-between pa-5 border-b border-gray-200">
      <!-- 组件名称 -->
      <div class="flex items-center">
        <h4 class="w-30 mr-3">
          {{ pageTitle }}
        </h4>
        <div class="flex items-center w-full">
          <div class="flex items-center ">
            <span class="w-30 mr-2">{{ $t('comps.componentName') }}： </span>
            <ElInput v-model="form.componentName" :placeholder="$t('comps.placeholder.componentName')" />
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
      <VueDraggable v-model="rows" class="w-full" item-key="id" @start="draggingRow = true" @end="handleChangeRowSort">
        <div v-for="(row, rowIndex) in rows" :key="row.id" class="mb-5">
          <div class="w-full bg-gray-50">
            <div class="border border-gray-300">
              <div class="w-full text-sm flex justify-between mb-2 pa-5 bg-white border-b border-gray-300">
                <div class="flex items-center">
                  <span><Icon name="ant-design:holder-outlined" class="mr-1" /></span><span>{{ row.rowName }}</span>
                </div>
                <div class="flex justify-end items-center">
                  <EBtn text @click="handleEditRow(row)">
                    <Icon icon="ant-design:setting-outlined" :size="5" />
                  </EBtn>
                  <ElPopconfirm :title="`${$t('common.removeConfirm')}`" @confirm="handleDeleteRow(row)">
                    <template #reference>
                      <EBtn text>
                        <Icon icon="ant-design:delete-outlined" :size="5" color="#f56c6c" />
                      </EBtn>
                    </template>
                  </ElPopconfirm>
                </div>
              </div>
              <div>
                <VueDraggable v-model="row.columns" class="grid grid-cols-12 gap-5 pa-5" item-key="id" @start="draggingElement = true" @end="handleChangeElementSort(rowIndex)">
                  <div
                    v-for="(col, colIndex) in row.columns"
                    :key="colIndex"
                    class="border border-gray-300" :class="[
                      row.columns.length === 1 ? 'col-span-12' : '',
                      row.columns.length === 2 ? 'col-span-6' : '',
                      row.columns.length === 3 ? 'col-span-4' : '',
                      row.columns.length === 4 ? 'col-span-3' : '',
                      row.columns.length === 6 ? 'col-span-2' : '',
                    ]"
                  >
                    <div class="w-full text-sm flex items-center justify-between mb-5 border-b border-gray-300 p-3 bg-white">
                      <div class="flex items-center">
                        <span><Icon name="ant-design:holder-outlined" class="mr-1" /></span><span>Column {{ colIndex + 1 }}</span><span v-if="col.aliasName && col.aliasName !== ''"> - {{ col.aliasName }}</span>
                      </div>
                      <div class="flex items-center justify-end">
                        <EBtn
                          v-if="col.elementComponentCode && col.elementComponentCode !== ''"
                          size="small"
                          type="primary"
                          plain
                          class="w-full"
                          @click="handleEditColumnElement(rowIndex, colIndex)"
                        >
                          <Icon name="ant-design:edit-outlined" class="mr-1" />
                        </EBtn>
                        <EBtn size="small" plain type="danger" @click="handleDeleteRowColumn(rowIndex, colIndex)">
                          <Icon name="ant-design:delete-outlined" />
                        </EBtn>
                      </div>
                    </div>
                    <!-- 元素按钮 -->
                    <div class="w-full mb-5 p-5">
                      <EBtn
                        v-if="!col.elementComponentCode || col.elementComponentCode === ''"
                        size="small"
                        type="primary"
                        plain
                        class="w-full"
                        @click="handleSettingElementToColumn(rowIndex, colIndex)"
                      >
                        <Icon icon="ant-design:plus-outlined" class="mr-1" />
                      </EBtn>
                      <EBtn
                        v-else
                        size="small"
                        type="primary"
                        plain
                        class="w-full"
                        @click="handleSettingComponent(rowIndex, colIndex, col)"
                      >
                        <Icon icon="ant-design:setting-outlined" class="mr-1" />
                      </EBtn>
                    </div>
                  </div>
                </VueDraggable>
              </div>
            </div>
          </div>
        </div>
      </VueDraggable>

      <!-- 添加行 -->
      <div class="w-full">
        <EBtn
          class="filter-item w-full"
          size="small"
          plain
          type="primary"
          :loading="loading.save"
          @click="handleAddRow"
        >
          <Icon icon="ant-design:plus-outlined" class="mr-1" />
          {{ $t('common.add') }}{{ $t('comps.row') }}
        </EBtn>
      </div>
    </div>

    <!-- Row Dialog -->
    <RowDialog ref="rowsDialogRef" @get-rows="setRows" />
    <!-- Element Dialog -->
    <ElDialog v-model="elementDialogVisible">
      <template #header>
        <div class="text-sm font-bold">
          {{ $t('comps.settingElement') }}
        </div>
      </template>
      <div class="p-5">
        <ElForm ref="elementFormRef" :model="elementForm" :rules="elementFormRules" label-width="120px">
          <ElFormItem :label="$t('comps.aliasName')" prop="aliasName" required>
            <ElInput v-model="elementForm.aliasName" :placeholder="$t('comps.placeholder.aliasName')" />
          </ElFormItem>
          <ElFormItem :label="$t('comps.elementComponentCode')" prop="elementComponentCode" required>
            <ElSelect v-model="elementForm.elementComponentCode" value-key="elementId" clearable filterable :placeholder="$t('comps.placeholder.element')">
              <ElOption v-for="item in elements" :key="item.elementComponentCode" :label="item.elementName" :value="item.elementComponentCode" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="$t('comps.webComponentCode')">
            <ElInput v-model="elementForm.webComponentCode" :placeholder="$t('comps.placeholder.webComponentCode')" />
          </ElFormItem>
        </ElForm>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <EBtn @click="handleCancelElementToColumn">
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn type="primary" @click="handleConfirmElementToColumn">
            {{ $t('common.submit') }}
          </EBtn>
        </div>
      </template>
    </ElDialog>
    <!-- Component Dialog -->
    <ElDialog v-model="componentDialogVisible" width="70%">
      <template #header>
        <div class="text-sm font-bold">
          {{ $t('common.setting') }}{{ $t('comps.name') }}
        </div>
      </template>
      <component
        :is="getComponent(activeComponent.elementComponentCode)"
        ref="activeComponentRef"
        :component-data="activeComponent.elementComponentConfig"
        v-bind="activeComponent"
      />
      <template #footer>
        <div class="dialog-footer">
          <EBtn @click="handleCancelSubmitComponent">
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn type="primary" @click="handleSubmitComponent">
            {{ $t('common.submit') }}
          </EBtn>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
