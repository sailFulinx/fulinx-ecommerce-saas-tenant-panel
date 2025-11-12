<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'
import { useLocale } from '@/hooks/useLocale'
import RowColDialog from './ColumnDialog.vue'
import ComponentManager from './ComponentManager.vue'
import RowDialog from './RowDialog.vue'
import RowRowDialog from './RowRowDialog.vue'

// Props
const props = defineProps<{
  rows: ComponentRowData[]
  loadingSave: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:rows', val: ComponentRowData[]): void
  (e: 'updateRow', val: ComponentRowData): void
  (e: 'updateRowRow', rowIndex: number, val: RowRowData): void
  (e: 'updateRowRowCol', rowIndex: number, rowRowIndex: number, rowColIndex: number, val: RowColumnData): void
  (e: 'editRowRowCol', rowIndex: number, rowRowIndex: number, rowRowColIndex: number, rowCol: RowColumnData): void
  (e: 'settingComponent', rowIndex: number, rowRowIndex: number, rowRowColIndex: number, val: RowColumnData): void
  (e: 'updateComponent', rowIndex: number, rowRowIndex: number, rowRowColIndex: number, componentConfig: any): void
  (e: 'deleteRow', row: ComponentRowData): void
  (e: 'deleteRowRow', rowIndex: number, rowRowIndex: number): void
  (e: 'deleteRowRowCol', rowIndex: number, rowRowIndex: number, rowColIndex: number): void
}>()

const { t: $t } = useLocale()

// 对话框引用
const rowDialogRef = ref()
const rowRowDialogRef = ref()
const rowRowColDialogRef = ref()
const componentManagerRef = ref()

// 当前选中的外层行
const activeRowIndex = ref(0)

// 当前选中的内层行
const activeRowRowIndex = ref(0)

// 当前选中的内层行中的列
const activeRowColIndex = ref(0)

// 拖拽状态
const draggingRow = ref(false)
const draggingRowRow = ref(false)
const draggingRowRowCol = ref(false)

// 处理行排序变化
const handleChangeRowSort = () => {
  const rowsCopy = [...props.rows]
  rowsCopy.forEach((item, index) => {
    item.sort = index + 1
    item.id = index + 1
  })
  emit('update:rows', rowsCopy)
}

// 处理内部行排序变化
const handleChangeRowRowSort = (rowIndex: number) => {
  const rowsCopy = [...props.rows]
  rowsCopy[rowIndex].contents.forEach((item: RowRowData, index) => {
    item.id = index + 1
    item.sort = index + 1
  })
  emit('update:rows', rowsCopy)
}

// 处理列排序变化
const handleChangeRowRowColSort = (rowIndex: number, rowRowIndex: number) => {
  const rowsCopy = [...props.rows]
  rowsCopy[rowIndex].contents[rowRowIndex].contents.forEach((item, index) => {
    item.sort = index + 1
  })
  emit('update:rows', rowsCopy)
}

// 删除行
const handleDeleteRow = (row: ComponentRowData) => {
  const rowsCopy = props.rows.filter(item => item.id !== row.id)
  // 更新排序
  rowsCopy.forEach((item, index) => {
    item.sort = index + 1
    item.id = index + 1
  })
  emit('update:rows', rowsCopy)
  emit('deleteRow', row)
}

// 删除内部行
const handleDeleteRowRow = (rowIndex: number, rowRowIndex: number) => {
  const rowsCopy = [...props.rows]
  rowsCopy[rowIndex].contents.splice(rowRowIndex, 1)
  handleChangeRowRowSort(rowIndex)
  emit('update:rows', rowsCopy)
  emit('deleteRowRow', rowIndex, rowRowIndex)
}

// 从行中删除元素
const handleDeleteRowRowCol = (rowIndex: number, rowRowIndex: number, rowColIndex: number) => {
  const rowsCopy = [...props.rows]
  // 如果只有最后一列，不允许删除
  if (rowsCopy[rowIndex].contents.length === 1) {
    ElMessage.warning($t('comps.warning.lastColumn'))
    return
  }
  rowsCopy[rowIndex].contents[rowRowIndex].contents.splice(rowColIndex, 1)
  rowsCopy[rowIndex].contents[rowRowIndex].columnsCount = rowsCopy[rowIndex].contents.length
  handleChangeRowRowColSort(rowIndex, rowRowIndex)
  emit('update:rows', rowsCopy)
  emit('deleteRowRowCol', rowIndex, rowRowIndex, rowColIndex)
}

// 设置内层行中的列
const setRowRowCols = (rowIndex: number, rowRowIndex: number, rowColIndex: number, val: RowColumnData) => {
  const rowsCopy = [...props.rows]
  rowsCopy[rowIndex].contents[rowRowIndex].contents[rowColIndex] = val
  handleChangeRowRowColSort(rowIndex, rowRowIndex)
  emit('update:rows', rowsCopy)
  emit('updateRowRowCol', rowIndex, rowRowIndex, rowColIndex, val)
}

// 设置内层行
const setRowRows = (val: RowRowData, rowIndex: number) => {
  const rowsCopy = [...props.rows]
  // 如果val.id与rows中元素的id相同修改，否则新增
  const index = rowsCopy[rowIndex].contents.findIndex(item => item.id === val.id)
  if (index > -1) {
    rowsCopy[rowIndex].contents[index] = val
  } else {
    rowsCopy[rowIndex].contents.push(val)
  }
  handleChangeRowRowSort(rowIndex)
  emit('update:rows', rowsCopy)
  emit('updateRowRow', rowIndex, val)
}

// 设置外层行
const setRows = (val: ComponentRowData) => {
  const rowsCopy = [...props.rows]
  // 如果val.id与rows中元素的id相同修改，否则新增
  const index = rowsCopy.findIndex(item => item.id === val.id)
  if (index > -1) {
    rowsCopy[index] = val
  } else {
    rowsCopy.push(val)
  }
  handleChangeRowSort()
  emit('update:rows', rowsCopy)
  emit('updateRow', val)
}

// 添加外层行
const handleAddRow = () => {
  rowDialogRef.value.openDialog(false, props.rows.length)
}

// 修改外层行
const handleEditRow = (row: ComponentRowData) => {
  rowDialogRef.value.openDialog(true, props.rows.length, row)
}

// 添加内层行
const handleAddRowRow = (rowIndex: number) => {
  // 更新排序
  const rowsCopy = [...props.rows]
  rowsCopy[rowIndex].contents.forEach((item, index) => {
    item.id = index + 1
    item.sort = index + 1
  })
  emit('update:rows', rowsCopy)
  rowRowDialogRef.value.openDialog(false, rowIndex, props.rows[rowIndex].contents.length)
}

// 修改内层行
const handleEditRowRow = (rowIndex: number, rowRowIndex: number) => {
  rowRowDialogRef.value.openDialog(
    true,
    rowIndex,
    props.rows[rowIndex].contents.length,
    props.rows[rowIndex].contents[rowRowIndex],
  )
}

// 动态添加元素到指定列
const handleAddElementToRowRowCol = (rowIndex: number, rowRowIndex: number, rowRowColIndex: number) => {
  rowRowColDialogRef.value.openDialog(rowIndex, rowRowIndex, rowRowColIndex)
}

// 编辑列中元素
const handleEditRowRowCol = async (rowIndex: number, rowRowIndex: number, rowRowColIndex: number) => {
  rowRowColDialogRef.value.openDialog(
    rowIndex,
    rowRowIndex,
    rowRowColIndex,
    props.rows[rowIndex].contents[rowRowIndex].contents[rowRowColIndex],
  )
}

// 设置组件
const handleSettingComponent = async (
  rowIndex: number,
  rowRowIndex: number,
  rowRowColIndex: number,
  val: RowColumnData,
) => {
  activeRowIndex.value = rowIndex
  activeRowRowIndex.value = rowRowIndex
  activeRowColIndex.value = rowRowColIndex
  componentManagerRef.value.openComponentManager(val)
}
</script>

<template>
  <div class="view-main">
    <VueDraggable
      :model-value="props.rows"
      class="w-full"
      item-key="id"
      :animation="200"
      @start="draggingRow = true"
      @end="handleChangeRowSort"
      @update:model-value="(val: ComponentRowData[]) => { emit('update:rows', val); handleChangeRowSort(); }"
    >
      <div v-for="(row, rowIndex) in props.rows" :key="row.id" class="mb-5">
        <div class="w-full bg-gray-50">
          <div class="border border-gray-300">
            <div class="w-full text-sm flex justify-between mb-2 pa-5 bg-white border-b border-gray-300">
              <div class="flex items-center">
                <span><Icon name="ant-design:holder-outlined" class="mr-1" /></span>
                <span>{{ row.rowName }}</span>
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
            <div class="w-full pa-5">
              <VueDraggable
                :model-value="row.contents"
                class="w-full"
                item-key="id"
                :animation="200"
                @start="draggingRowRow = true"
                @end="handleChangeRowRowSort(rowIndex)"
                @update:model-value="(val: RowRowData[]) => { const rowsCopy = [...props.rows]; rowsCopy[rowIndex].contents = val; emit('update:rows', rowsCopy); handleChangeRowRowSort(rowIndex); }"
              >
                <div
                  v-for="(rowRow, rowRowIndex) in row.contents"
                  :key="rowRowIndex"
                  class="w-full border border-gray-300 bg-gray-100 mb-5"
                >
                  <div
                    class="w-full text-sm flex items-center justify-between mb-5 border-b border-gray-300 p-3 bg-white"
                  >
                    <div class="flex items-center">
                      <span><Icon name="ant-design:holder-outlined" class="mr-1" /></span>
                      <span>Row {{ rowRowIndex + 1 }}</span>
                      <span v-if="rowRow.rowRowName && rowRow.rowRowName !== ''" class="ml-1">
                        - {{ rowRow.rowRowName }}
                      </span>
                    </div>
                    <div class="flex items-center justify-end">
                      <EBtn
                        size="small"
                        type="primary"
                        plain
                        class="w-full"
                        @click="handleEditRowRow(rowIndex, rowRowIndex)"
                      >
                        <Icon name="ant-design:setting-outlined" />
                      </EBtn>
                      <EBtn size="small" plain type="danger" @click="handleDeleteRowRow(rowIndex, rowRowIndex)">
                        <Icon name="ant-design:delete-outlined" />
                      </EBtn>
                    </div>
                  </div>
                  <div class="w-full pa-5 pt-0">
                    <VueDraggable
                      :model-value="rowRow.contents"
                      class="w-full grid grid-cols-12 gap-5"
                      item-key="id"
                      :animation="200"
                      @start="draggingRowRowCol = true"
                      @end="handleChangeRowRowColSort(rowIndex, rowRowIndex)"
                      @update:model-value="(val: RowColumnData[]) => { const rowsCopy = [...props.rows]; rowsCopy[rowIndex].contents[rowRowIndex].contents = val; emit('update:rows', rowsCopy); handleChangeRowRowColSort(rowIndex, rowRowIndex); }"
                    >
                      <div
                        v-for="(rowCol, rowRowColIndex) in rowRow.contents"
                        :key="rowRowColIndex"
                        class="border border-gray-300"
                        :class="[
                          rowRow.contents.length === 1 ? 'col-span-12' : '',
                          rowRow.contents.length === 2 ? 'col-span-6' : '',
                          rowRow.contents.length === 3 ? 'col-span-4' : '',
                          rowRow.contents.length === 4 ? 'col-span-3' : '',
                          rowRow.contents.length === 6 ? 'col-span-2' : '',
                        ]"
                      >
                        <div
                          class="w-full text-sm flex items-center justify-between mb-5 border-b border-gray-300 p-3 bg-white"
                        >
                          <div class="flex items-center">
                            <span><Icon name="ant-design:holder-outlined" class="mr-1" /></span>
                            <span>Column {{ rowRowColIndex + 1 }}</span>
                            <span v-if="rowCol.aliasName && rowCol.aliasName !== ''">- {{ rowCol.aliasName }}</span>
                          </div>
                          <div class="flex items-center justify-end">
                            <EBtn
                              v-if="rowCol.elementComponentCode && rowCol.elementComponentCode !== ''"
                              size="small"
                              type="primary"
                              plain
                              class="w-full"
                              @click="handleEditRowRowCol(rowIndex, rowRowIndex, rowRowColIndex)"
                            >
                              <Icon name="ant-design:edit-outlined" class="mr-1" />
                            </EBtn>
                            <EBtn
                              size="small"
                              plain
                              type="danger"
                              @click="handleDeleteRowRowCol(rowIndex, rowRowIndex, rowRowColIndex)"
                            >
                              <Icon name="ant-design:delete-outlined" />
                            </EBtn>
                          </div>
                        </div>
                        <!-- 元素按钮 -->
                        <div class="w-full mb-5 p-5">
                          <EBtn
                            v-if="!rowCol.elementComponentCode || rowCol.elementComponentCode === ''"
                            size="small"
                            type="primary"
                            plain
                            class="w-full"
                            @click="handleAddElementToRowRowCol(rowIndex, rowRowIndex, rowRowColIndex)"
                          >
                            <Icon icon="ant-design:plus-outlined" class="mr-1" />
                          </EBtn>
                          <EBtn
                            v-else
                            size="small"
                            type="primary"
                            plain
                            class="w-full"
                            @click="handleSettingComponent(rowIndex, rowRowIndex, rowRowColIndex, rowCol)"
                          >
                            <Icon icon="ant-design:setting-outlined" class="mr-1" />
                          </EBtn>
                        </div>
                      </div>
                    </VueDraggable>
                  </div>
                </div>
              </VueDraggable>
              <!-- 添加行中行 -->
              <div class="w-full">
                <EBtn
                  class="filter-item w-full"
                  size="small"
                  plain
                  type="primary"
                  :loading="props.loadingSave"
                  @click="handleAddRowRow(rowIndex)"
                >
                  <Icon icon="ant-design:plus-outlined" class="mr-1" />
                  {{ $t('common.add') }}{{ $t('comps.row') }}
                </EBtn>
              </div>
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
        :loading="props.loadingSave"
        @click="handleAddRow"
      >
        <Icon icon="ant-design:plus-outlined" class="mr-1" />
        {{ $t('common.add') }}{{ $t('comps.row') }}
      </EBtn>
    </div>
    <!-- Row Dialog -->
    <RowDialog ref="rowDialogRef" @get-rows="setRows" />
    <!-- Row Row Dialog -->
    <RowRowDialog ref="rowRowDialogRef" @get-row-rows="setRowRows" />
    <!-- Row Col Dialog -->
    <RowColDialog ref="rowRowColDialogRef" @get-row-row-cols="setRowRowCols" />
    <!-- Component Manager -->
    <ComponentManager
      ref="componentManagerRef"
      @update-component="
        componentConfig =>
          emit('updateComponent', activeRowIndex, activeRowRowIndex, activeRowColIndex, componentConfig)
      "
    />
  </div>
</template>
