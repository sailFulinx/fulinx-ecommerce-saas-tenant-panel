<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'

const emit = defineEmits(['getRows'])

const rowColumns = ref([1, 2, 3, 4, 6])
const { t: $t } = useLocale()
const rowDialogVisible = ref(false)

const rowFormRef = ref()

const rowFormRules = reactive({
  rowName: [{ required: true, type: 'string', message: $t('comps.placeholder.rowName'), trigger: 'blur' }],
  columnsCount: [{ required: true, type: 'number', message: $t('comps.placeholder.columnsCount'), trigger: 'change' }],
})

const rowForm = ref<LayoutRowData>({
  id: 0,
  rowName: '',
  columnsCount: 1,
  columns: [],
  sort: 1,
})

// 已有的行数
const rowCount = ref<number>(0)

const isEdit = ref<boolean>(false)

const openDialog = (isEditData: boolean, rowCountData: number, rowData?: LayoutRowData) => {
  rowForm.value = {
    id: 0,
    rowName: '',
    columnsCount: 1,
    columns: [],
    sort: 1,
  }
  isEdit.value = isEditData
  rowCount.value = rowCountData
  if (rowData) {
    rowForm.value = rowData
  }
  rowDialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await rowFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  rowDialogVisible.value = false
  // 如果是编辑状态，需要判断当前的列数和rowForm里的columns条数是否一致，如果不一致，需要提醒用户
  // 如果当前最新的rowForm.value.columnCont的数量大于rowForm.value.columns的数量，需要把原来的rowForm..value.columns数据保留，并在rowForm.value.columns数组后面插入新的数据
  // 如果当前最新的rowForm.value.columnCont的数量小于rowForm.value.columns的数量，保留rowForm..value.columns中前rowForm.value.columnCont个数据
  // 如果是新增，执行原有逻辑
  if (isEdit.value) {
    if (rowForm.value.columnsCount < rowForm.value.columns.length) {
      // 当前行数小于已有行数，数据可能会丢失，从元素最后删除相应数量的数据
      const length = rowForm.value.columns.length - rowForm.value.columnsCount
      rowForm.value.columns = rowForm.value.columns.slice(0, -length)
    } else if (rowForm.value.columnsCount > rowForm.value.columns.length) {
      // 当前行数大于已有行数，在数组后面插入所缺少的数据
      const length = rowForm.value.columnsCount - rowForm.value.columns.length
      const columns = Array.from({ length }, (_, index) => ({
        // id: index + 1,
        componentName: '',
        componentId: 0,
        sort: index + 1,
      }))
      rowForm.value.columns = [...rowForm.value.columns, ...columns]
    }
  } else {
    const columns = Array.from({ length: rowForm.value.columnsCount }, (_, index) => ({
      // id: index + 1,
      componentName: '',
      componentId: 0,
      sort: index + 1,
    }))
    rowForm.value.columns = columns
    // 已有的行数的基础上+1，就是新的行数的id
    rowForm.value.id = rowCount.value + 1
  }
  emit('getRows', rowForm.value)
}

defineExpose({ openDialog })
</script>

<template>
  <ElDialog v-model="rowDialogVisible">
    <template #header>
      <div class="text-sm font-bold">
        {{ $t('common.add') }}{{ $t('comps.row') }}
      </div>
    </template>
    <div class="p-5">
      <ElForm ref="rowFormRef" :model="rowForm" :rules="rowFormRules">
        <ElFormItem :label="$t('comps.rowName')" prop="rowName">
          <ElInput v-model="rowForm.rowName" :placeholder="$t('comps.placeholder.rowName')" />
        </ElFormItem>
        <ElFormItem :label="$t('comps.rowColumns')" prop="columnsCount">
          <ElSelect v-model="rowForm.columnsCount" clearable filterable :placeholder="$t('comps.placeholder.rowColumns')">
            <ElOption v-for="item in rowColumns" :key="item" :label="`${item}列`" :value="item" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <EBtn @click="rowDialogVisible = false">
          {{ $t('common.cancel') }}
        </EBtn>
        <EBtn type="primary" @click="handleSubmit">
          {{ $t('common.submit') }}
        </EBtn>
      </div>
    </template>
  </ElDialog>
</template>
