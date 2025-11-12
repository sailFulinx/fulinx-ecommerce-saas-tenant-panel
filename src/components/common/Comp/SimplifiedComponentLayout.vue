<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { componentCategories } from '@/data/comp'
import ColumnDialog from './ColumnDialog.vue'
import ComponentManager from './ComponentManager.vue'
import RowDialog from './RowDialog.vue'
import RowRowDialog from './RowRowDialog.vue'

// 组件管理器引用
const componentManagerRef = ref()

// 行引用
const rowDialogRef = ref()
const rowRowDialogRef = ref()
const columnDialogRef = ref()

// 当前激活的组件索引
const activeRowIndex = ref(0)
const activeRowRowIndex = ref(0)
const activeColIndex = ref(0)

// 定义组件内部的rows状态，并添加一个默认行
const rows = ref<ComponentRowData[]>([
  {
    id: 1,
    rowName: 'Row 1',
    isFullScreen: false,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '',
    backgroundImage: {} as any,
    isContentFullScreen: false,
    contents: [
      {
        id: 1,
        rowRowName: '',
        columnsCount: 1,
        columnGap: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        contents: [
          {
            elementComponentCode: '',
            elementComponentConfig: { content: null, status: true },
            elementName: '',
            elementType: '',
            aliasName: '',
            sort: 1,
          },
        ],
        sort: 1,
      },
    ],
    sort: 1,
  },
])

// 添加行
const addRow = () => {
  const newRow: ComponentRowData = {
    id: rows.value.length + 1,
    rowName: `Row ${rows.value.length + 1}`,
    isFullScreen: false,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '',
    backgroundImage: {} as any,
    isContentFullScreen: false,
    contents: [
      {
        id: 1,
        rowRowName: '',
        columnsCount: 1,
        columnGap: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        contents: [
          {
            elementComponentCode: '',
            elementComponentConfig: { content: null, status: true },
            elementName: '',
            elementType: '',
            aliasName: '',
            sort: 1,
          },
        ],
        sort: 1,
      },
    ],
    sort: rows.value.length + 1,
  }

  rows.value.push(newRow)
}

// 添加内部行
const addRowRow = (rowIndex: number) => {
  const rowsCopy = [...rows.value]
  const row = rowsCopy[rowIndex]

  const newRowRow: RowRowData = {
    id: row.contents.length + 1,
    rowRowName: `Inner Row ${row.contents.length + 1}`,
    columnsCount: 1,
    columnGap: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    contents: [
      {
        elementComponentCode: '',
        elementComponentConfig: { content: null, status: true },
        elementName: '',
        elementType: '',
        aliasName: '',
        sort: 1,
      },
    ],
    sort: row.contents.length + 1,
  }

  row.contents.push(newRowRow)
  rows.value = rowsCopy
}

// 添加列
const addColumn = (rowIndex: number, rowRowIndex: number) => {
  const rowsCopy = [...rows.value]
  const row = rowsCopy[rowIndex]
  const rowRow = row.contents[rowRowIndex]

  // 增加列数
  rowRow.columnsCount = rowRow.contents.length + 1

  // 添加新的空列
  rowRow.contents.push({
    elementComponentCode: '',
    elementComponentConfig: { content: null, status: true },
    elementName: '',
    elementType: '',
    aliasName: '',
    sort: rowRow.contents.length + 1,
  })

  rows.value = rowsCopy
}

// 删除列
const deleteColumn = (rowIndex: number, rowRowIndex: number, colIndex: number) => {
  const rowsCopy = [...rows.value]
  const row = rowsCopy[rowIndex]
  const rowRow = row.contents[rowRowIndex]

  // 如果只有一列，则清空而不是删除
  if (rowRow.contents.length === 1) {
    const col = rowRow.contents[0]
    col.elementComponentCode = ''
    col.elementComponentConfig = { content: null, status: true }
    col.elementName = ''
    col.elementType = ''
    col.aliasName = ''
  } else {
    // 如果有多列，则删除指定列
    rowRow.contents.splice(colIndex, 1)
    rowRow.columnsCount = rowRow.contents.length

    // 更新排序
    rowRow.contents.forEach((col, index) => {
      col.sort = index + 1
    })
  }

  rows.value = rowsCopy
}

// 设置列
const setColumn = (rowIndex: number, rowRowIndex: number, colIndex: number) => {
  activeRowIndex.value = rowIndex
  activeRowRowIndex.value = rowRowIndex
  activeColIndex.value = colIndex
  columnDialogRef.value.openDialog(
    rowIndex,
    rowRowIndex,
    colIndex,
    rows.value[rowIndex].contents[rowRowIndex].contents[colIndex],
  )
}

const getColumn = (rowIndex: number, rowRowIndex: number, colIndex: number, val: RowColumnData) => {
  const rowsCopy = [...rows.value]
  rowsCopy[rowIndex].contents[rowRowIndex].contents[colIndex] = val
  rows.value = rowsCopy
  activeRowIndex.value = -1
  activeRowRowIndex.value = -1
  activeColIndex.value = -1
}

// 处理列拖拽排序
const handleColumnSort = (rowIndex: number, rowRowIndex: number) => {
  const rowsCopy = [...rows.value]
  const row = rowsCopy[rowIndex]
  const rowRow = row.contents[rowRowIndex]

  // 更新列的排序
  rowRow.contents.forEach((col, index) => {
    col.sort = index + 1
  })

  rows.value = rowsCopy
}

// 删除内部行
const deleteRowRow = (rowIndex: number, rowRowIndex: number) => {
  const rowsCopy = [...rows.value]
  const row = rowsCopy[rowIndex]

  // 如果只有一行，不清空而是提示
  if (row.contents.length === 1) {
    ElMessage.warning('至少需要保留一个内部行')
    return
  }

  // 删除指定内部行
  row.contents.splice(rowRowIndex, 1)

  // 更新排序
  row.contents.forEach((rowRow, index) => {
    rowRow.sort = index + 1
    rowRow.id = index + 1
  })

  rows.value = rowsCopy
}

// 设置内部行
const setRowRow = (rowIndex: number, rowRowIndex: number) => {
  activeRowIndex.value = rowIndex
  activeRowRowIndex.value = rowRowIndex
  rowRowDialogRef.value.openDialog(
    true,
    rowIndex,
    rows.value[rowIndex].contents.length,
    rows.value[rowIndex].contents[rowRowIndex],
  )
}

const getRowRow = (rowIndex: number, val: RowRowData) => {
  const rowsCopy = [...rows.value]
  // 如果val.id与rows中元素的id相同修改，否则新增
  const index = rowsCopy[rowIndex].contents.findIndex(item => item.id === val.id)
  if (index > -1) {
    rowsCopy[rowIndex].contents[index] = val
  } else {
    rowsCopy[rowIndex].contents.push(val)
  }
  rows.value = rowsCopy
  activeRowIndex.value = -1
  activeRowRowIndex.value = -1
}

// 删除行
const deleteRow = (rowIndex: number) => {
  const rowsCopy = [...rows.value]
  rowsCopy.splice(rowIndex, 1)
  // 更新排序
  rowsCopy.forEach((row, index) => {
    row.sort = index + 1
    row.id = index + 1
  })
  rows.value = rowsCopy
}

// 设置行
const setRow = (rowIndex: number) => {
  activeRowIndex.value = rowIndex
  rowDialogRef.value.openDialog(true, rows.value.length, rows.value[rowIndex])
}

const getRow = (val: ComponentRowData) => {
  const rowsCopy = [...rows.value]
  // 如果val.id与rows中元素的id相同修改，否则新增
  const index = rowsCopy.findIndex(item => item.id === val.id)
  if (index > -1) {
    rowsCopy[index] = val
  } else {
    rowsCopy.push(val)
  }
  rows.value = rowsCopy
  activeRowIndex.value = -1
}

// 添加组件到指定位置
const addComponent = (rowIndex: number, rowRowIndex: number, colIndex: number, component: ComponentStructure) => {
  const rowsCopy = [...rows.value]
  const col = rowsCopy[rowIndex].contents[rowRowIndex].contents[colIndex]

  // 设置组件类型和默认值
  col.elementComponentCode = component.code
  col.elementType = component.type
  col.elementName = component.name
  col.aliasName = `${component.name} 组件`
  if (component.webComponentCode) {
    col.webComponentCode = component.webComponentCode
  }
  rows.value = rowsCopy
}

// 编辑组件
const editComponent = (rowIndex: number, rowRowIndex: number, colIndex: number, componentData: RowColumnData) => {
  const rowsCopy = [...rows.value]
  rowsCopy[rowIndex].contents[rowRowIndex].contents[colIndex] = { ...componentData }
  rows.value = rowsCopy
}

// 删除组件
const deleteComponent = (rowIndex: number, rowRowIndex: number, colIndex: number) => {
  const rowsCopy = [...rows.value]
  const col = rowsCopy[rowIndex].contents[rowRowIndex].contents[colIndex]

  // 清空组件数据而不是删除列
  col.elementComponentCode = ''
  col.elementComponentConfig = { content: null, status: true }
  col.elementName = ''
  col.elementType = ''
  col.aliasName = ''

  rows.value = rowsCopy
}

// 检查列是否可以接受新组件
const canDropComponent = (rowIndex: number, rowRowIndex: number, colIndex: number) => {
  const row = rows.value[rowIndex]
  const rowRow = row.contents[rowRowIndex]
  const col = rowRow.contents[colIndex]

  // 如果一行只有一列，且该列已有组件，则不能拖入新组件
  if (rowRow.contents.length === 1 && col.elementComponentCode) {
    return false
  }

  return true
}

// 处理行拖拽排序
const handleRowSort = () => {
  const rowsCopy = [...rows.value]
  rowsCopy.forEach((row, index) => {
    row.sort = index + 1
    row.id = index + 1
  })
  rows.value = rowsCopy
}

// 处理内部行拖拽排序
const handleRowRowSort = (rowIndex: number) => {
  const rowsCopy = [...rows.value]
  const row = rowsCopy[rowIndex]

  row.contents.forEach((rowRow, index) => {
    rowRow.sort = index + 1
    rowRow.id = index + 1
  })

  rows.value = rowsCopy
}

// 开始拖拽组件
const handleComponentDragStart = (event: DragEvent, component: ComponentStructure) => {
  event.dataTransfer?.setData('component', JSON.stringify(component))
}

// 处理放置事件
const handleDrop = (event: DragEvent, rowIndex: number, rowRowIndex: number, colIndex: number) => {
  event.preventDefault()

  // 检查是否可以放置组件
  if (!canDropComponent(rowIndex, rowRowIndex, colIndex)) {
    // 如果不能放置，显示提示信息
    ElMessage.warning('请先删除现有组件再拖入新组件')
    return
  }

  if (event.dataTransfer?.getData('component')) {
    const component = JSON.parse(event.dataTransfer?.getData('component'))
    if (component.type && component.code) {
      addComponent(rowIndex, rowRowIndex, colIndex, component)
    }
  }
}

// 阻止默认拖拽行为
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

// 提供getData方法来获取rows数据
const getData = () => {
  return rows.value
}

// 提供getData方法来获取rows数据
const setData = (val: ComponentRowData[]) => {
  rows.value = val
}

// 打开组件管理器
const openComponentManager = (rowIndex: number, rowRowIndex: number, colIndex: number) => {
  activeRowIndex.value = rowIndex
  activeRowRowIndex.value = rowRowIndex
  activeColIndex.value = colIndex
  const componentData = rows.value[rowIndex].contents[rowRowIndex].contents[colIndex]
  componentManagerRef.value.openComponentManager(componentData)
}

// 更新组件数据
const handleUpdateComponent = (componentConfig: any) => {
  const rowsCopy = [...rows.value]
  const col = rowsCopy[activeRowIndex.value].contents[activeRowRowIndex.value].contents[activeColIndex.value]
  col.elementComponentConfig = componentConfig
  rows.value = rowsCopy
}

// 暴露方法给父组件
defineExpose({
  getData,
  setData,
  addComponent,
  editComponent,
})
</script>

<template>
  <div class="simplified-layout pa-4">
    <!-- 组件库面板 -->
    <div class="component-library">
      <div class="component-library-header">
        <h3 class="border-b-1 border-gray-600 py-3 flex items-center justify-start mb-0 px-4">
          组件库
        </h3>
      </div>
      <div class="component-library-content pa-4">
        <div v-for="category in componentCategories" :key="category.id" shadow="never" class="mb-4">
          <div class="category-title mb-4 border-dashed border-b-1 border-gray-400 pb-4">
            {{ category.name }}
          </div>

          <div class="components-grid">
            <div
              v-for="component in category.components"
              :key="component.type"
              class="component-item"
              draggable="true"
              @dragstart="event => handleComponentDragStart(event, component)"
            >
              <Icon :name="`${component.icon}`" />
              <span>{{ component.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 布局区域 -->
    <div class="layout-area">
      <VueDraggable
        :model-value="rows"
        item-key="id"
        :animation="200"
        @end="handleRowSort"
        @update:model-value="(val:ComponentRowData[]) => rows = val"
      >
        <div v-for="(row, rowIndex) in rows" :key="row.id" class="layout-row">
          <div class="row-header">
            <span v-if="!row.rowName">Row {{ rowIndex + 1 }}</span>
            <span v-else>{{ row.rowName }}</span>
            <div class="row-actions">
              <EBtn plain type="default" size="small" @click="setRow(rowIndex)">
                设置行
              </EBtn>
              <EBtn plain size="small" type="danger" @click="deleteRow(rowIndex)">
                删除行
              </EBtn>
            </div>
          </div>

          <div class="row-content">
            <VueDraggable
              :model-value="row.contents"
              item-key="id"
              :animation="200"
              @end="() => handleRowRowSort(rowIndex)"
              @update:model-value="(val: RowRowData[]) => {
                const rowsCopy = [...rows];
                rowsCopy[rowIndex].contents = val;
                rows = rowsCopy;
              }"
            >
              <div v-for="(rowRow, rowRowIndex) in row.contents" :key="rowRow.id" class="layout-row-row mb-4">
                <div class="row-row-header">
                  <span v-if="!rowRow.rowRowName">Inner Row {{ rowRowIndex + 1 }}</span>
                  <span v-else>{{ rowRow.rowRowName }}</span>
                  <div class="row-row-actions">
                    <EBtn plain type="default" size="small" @click="setRowRow(rowIndex, rowRowIndex)">
                      设置内部行
                    </EBtn>
                    <EBtn plain size="small" type="primary" @click="addColumn(rowIndex, rowRowIndex)">
                      添加列
                    </EBtn>
                    <EBtn
                      v-if="row.contents.length > 1"
                      plain
                      size="small"
                      type="danger"
                      @click="deleteRowRow(rowIndex, rowRowIndex)"
                    >
                      删除内部行
                    </EBtn>
                  </div>
                </div>

                <div class="row-row-content">
                  <VueDraggable
                    :model-value="rowRow.contents"
                    item-key="sort"
                    :animation="200"
                    class="columns-container"
                    @end="() => handleColumnSort(rowIndex, rowRowIndex)"
                    @update:model-value="(val: RowColumnData[]) => {
                      const rowsCopy = [...rows];
                      rowsCopy[rowIndex].contents[rowRowIndex].contents = val;
                      rows = rowsCopy;
                    }"
                  >
                    <div
                      v-for="(col, colIndex) in rowRow.contents"
                      :key="colIndex"
                      class="layout-column"
                      :class="`border-1 border-dashed border-gray-300 col-span-${12 / rowRow.contents.length}`"
                      @drop="event => handleDrop(event, rowIndex, rowRowIndex, colIndex)"
                      @dragover="handleDragOver"
                    >
                      <div class="column-content">
                        <div v-if="!col.elementComponentCode" class="empty-column">
                          <span>拖拽组件到此处</span>
                        </div>
                        <div v-else class="w-full">
                          <div class="w-full component-preview bg-gray-50">
                            <div
                              class="w-full flex items-center justify-between mb-4 border-b-1 border-gray-300 pb-2 px-0"
                            >
                              <div>{{ col.aliasName || col.elementName || '未命名组件' }} <span v-if="col.aliasName"> - {{ col.elementName }}</span> </div>
                              <div>
                                <div class="w-full flex items-center justify-between">
                                  <div class="mr-2">
                                    <EBtn
                                      plain
                                      size="small"
                                      type="default"
                                      @click="setColumn(rowIndex, rowRowIndex, colIndex)"
                                    >
                                      <Icon name="ant-design:setting-outlined" />
                                    </EBtn>
                                  </div>
                                  <div v-if="rowRow.contents.length > 1">
                                    <EBtn
                                      plain
                                      size="small"
                                      type="danger"
                                      @click="deleteColumn(rowIndex, rowRowIndex, colIndex)"
                                    >
                                      <Icon name="ant-design:delete-outlined" />
                                    </EBtn>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="w-full flex items-center justify-between">
                              <EBtn
                                class="w-1/2"
                                plain
                                size="small"
                                type="primary"
                                @click="() => openComponentManager(rowIndex, rowRowIndex, colIndex)"
                              >
                                <Icon name="ant-design:setting-outlined" />
                              </EBtn>
                              <EBtn
                                class="w-1/2"
                                plain
                                size="small"
                                type="danger"
                                @click="deleteComponent(rowIndex, rowRowIndex, colIndex)"
                              >
                                <Icon name="ant-design:delete-outlined" />
                              </EBtn>
                            </div>
                          </div>
                        </div>
                        <!-- 列删除按钮 -->
                        <!-- <div class="w-full flex items-center justify-between">
                          <div>
                            <EBtn plain size="small" type="default" @click="setColumn(rowIndex, rowRowIndex, colIndex)">
                              <Icon name="ant-design:setting-outlined" />
                            </EBtn>
                          </div>
                          <div v-if="rowRow.contents.length > 1">
                            <EBtn plain size="small" type="danger" @click="deleteColumn(rowIndex, rowRowIndex, colIndex)">
                              <Icon name="ant-design:delete-outlined" />
                            </EBtn>
                          </div>
                        </div> -->
                      </div>
                    </div>
                  </VueDraggable>
                </div>
              </div>
            </VueDraggable>

            <div class="add-row-row-button">
              <EBtn type="primary" plain class="w-full" @click="addRowRow(rowIndex)">
                <Icon name="ant-design:plus-outlined" />
                添加内部行
              </EBtn>
            </div>
          </div>
        </div>
      </VueDraggable>

      <div class="add-row-button">
        <EBtn type="primary" plain class="w-full" @click="addRow">
          <Icon name="ant-design:plus-outlined" />
          添加行
        </EBtn>
      </div>
    </div>

    <!-- Component Manager -->
    <ComponentManager ref="componentManagerRef" @update-component="handleUpdateComponent" />
    <!-- Row Dialog -->
    <RowDialog ref="rowDialogRef" @get-row="getRow" />
    <!-- Row Row Dialog -->
    <RowRowDialog ref="rowRowDialogRef" @get-row-row="getRowRow" />
    <!-- Column Dialog -->
    <ColumnDialog ref="columnDialogRef" @get-column="getColumn" />
  </div>
</template>

<style scoped>
.simplified-layout {
  width: 100%;
  display: flex;
  gap: 20px;
}

.component-library {
  width: 250px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: calc(100vh - 212px);
  display: flex;
  flex-direction: column;
}

.component-library-header {
  border-bottom: 1px solid #dcdfe6;
}

.component-library-content {
  flex: 1;
  overflow-y: auto;
}

.category {
  margin-bottom: 20px;
}

.category h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #606266;
}

.components-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  cursor: grab;
  font-size: 12px;
  color: #606266;
}

.component-item:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.layout-area {
  flex: 1;
  height: calc(100vh - 212px);
  overflow-y: auto;
}

.layout-row {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 20px;
  background-color: #f5f7fa;
}

.row-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #dcdfe6;
  background-color: white;
}

.row-actions {
  display: flex;
  gap: 10px;
}

.row-content {
  padding: 15px;
}

.layout-row-row {
  border: 1px dashed #909399;
  border-radius: 4px;
  background-color: #ffffff;
}

.row-row-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px dashed #909399;
  background-color: #f0f2f5;
  font-size: 13px;
}

.row-row-actions {
  display: flex;
  gap: 8px;
}

.row-row-content {
  padding: 12px;
}

.columns-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 10px;
}

.layout-column {
  grid-column: span 12;
  /* border: 1px dashed #dcdfe6;
  border-radius: 4px; */
  min-height: 90px;
  position: relative;
  cursor: grab;
}

.layout-column.col-span-1 {
  grid-column: span 1;
}
.layout-column.col-span-2 {
  grid-column: span 2;
}
.layout-column.col-span-3 {
  grid-column: span 3;
}
.layout-column.col-span-4 {
  grid-column: span 4;
}
.layout-column.col-span-6 {
  grid-column: span 6;
}
.layout-column.col-span-12 {
  grid-column: span 12;
}

.column-content {
  /* padding: 10px; */
  height: 100%;
}

.empty-column {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #c0c4cc;
  font-size: 14px;
}

.filled-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.component-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 10px;
  min-height: 80px;
}

.component-placeholder {
  margin-bottom: 10px;
}

.column-delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
}

.add-row-row-button {
  width: 100%;
  text-align: center;
  padding: 8px 0;
}

.add-row-button {
  width: 100%;
  text-align: center;
  padding: 10px 0;
}
</style>
