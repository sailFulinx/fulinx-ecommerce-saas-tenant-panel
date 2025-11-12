<script setup lang="ts">
import { ElFormItem } from 'element-plus'
import { useLocale } from '@/hooks/useLocale'

const emit = defineEmits(['getRowRows'])

const rowRowColumns = ref([1, 2, 3, 4, 6])
const { t: $t } = useLocale()
const rowRowDialogVisible = ref(false)

const rowRowFormRef = ref()

const rowRowFormRules = reactive({
  rowRowName: [{ required: true, message: $t('comps.placeholder.rowName'), trigger: 'blur' }],
  columnsCount: [{ required: true, message: $t('comps.placeholder.columnsCount'), trigger: 'change' }],
  columnGap: [{ required: true, message: $t('comps.placeholder.columnGap'), trigger: 'change' }],
  marginTop: [{ required: true, message: $t('comps.placeholder.marginTop'), trigger: 'change' }],
  marginBottom: [{ required: true, message: $t('comps.placeholder.marginBottom'), trigger: 'change' }],
  marginLeft: [{ required: true, message: $t('comps.placeholder.marginLeft'), trigger: 'change' }],
  marginRight: [{ required: true, message: $t('comps.placeholder.marginRight'), trigger: 'change' }],
  paddingTop: [{ required: true, message: $t('comps.placeholder.paddingTop'), trigger: 'change' }],
  paddingBottom: [{ required: true, message: $t('comps.placeholder.paddingBottom'), trigger: 'change' }],
  paddingLeft: [{ required: true, message: $t('comps.placeholder.paddingLeft'), trigger: 'change' }],
  paddingRight: [{ required: true, message: $t('comps.placeholder.paddingRight'), trigger: 'change' }],
})

const rowRowForm = ref<RowRowData>({
  id: 0,
  rowRowName: '',
  columnsCount: 1,
  columnGap: 3,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 5,
  marginRight: 5,
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 5,
  paddingRight: 5,
  contents: [],
  sort: 1,
})

// 已有的行数
const rowRowCount = ref<number>(0)

const activeRowIndex = ref<number>(0)

const isEdit = ref<boolean>(false)

const openDialog = async (isEditData: boolean, rowIndex: number, rowRowCountData: number, rowRowData?: RowRowData) => {
  rowRowDialogVisible.value = true
  await nextTick()
  // 当修改列数的时候，会遇到id重复的BUG
  rowRowForm.value = {
    id: 0,
    rowRowName: '',
    columnsCount: 1,
    columnGap: 3,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    contents: [],
    sort: 1,
  }
  isEdit.value = isEditData
  rowRowCount.value = rowRowCountData
  activeRowIndex.value = rowIndex
  if (rowRowData) {
    rowRowForm.value = rowRowData
  }
}

// 会遇到复制一个组件后，再次编辑组件，尤其是在新增了行内的列后，出现问题
const handleSubmit = async () => {
  const valid = await rowRowFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  rowRowDialogVisible.value = false
  // 如果是编辑状态，需要判断当前的列数和rowRowForm里的columns条数是否一致，如果不一致，需要提醒用户
  // 如果当前最新的rowRowForm.value.columnCont的数量大于rowRowForm.value.columns的数量，需要把原来的rowRowForm..value.columns数据保留，并在rowRowForm.value.columns数组后面插入新的数据
  // 如果当前最新的rowRowForm.value.columnCont的数量小于rowRowForm.value.columns的数量，保留rowRowForm..value.columns中前rowRowForm.value.columnCont个数据
  // 如果是新增，执行原有逻辑
  if (isEdit.value) {
    if (rowRowForm.value.columnsCount < rowRowForm.value.contents.length) {
      // 当前行数小于已有行数，数据可能会丢失，从元素最后删除相应数量的数据
      const length = rowRowForm.value.contents.length - rowRowForm.value.columnsCount
      rowRowForm.value.contents = rowRowForm.value.contents.slice(0, -length)
    } else if (rowRowForm.value.columnsCount > rowRowForm.value.contents.length) {
      // 当前行数大于已有行数，在数组后面插入所缺少的数据
      const length = rowRowForm.value.columnsCount - rowRowForm.value.contents.length
      const columns = Array.from({ length }, (_, index) => ({
        elementComponentCode: '',
        elementComponentConfig: {
          content: {},
          status: true,
        },
        elementName: '',
        elementType: '',
        aliasName: '',
        rowRowElementId: length + index,
        rowRowElementSort: length + index,
      }))
      rowRowForm.value.contents = [...rowRowForm.value.contents, ...columns]
    }
  } else {
    const columns = Array.from({ length: rowRowForm.value.columnsCount }, (_, index) => ({
      elementComponentCode: '',
      elementComponentConfig: {
        content: {},
        status: true,
      },
      elementName: '',
      elementType: '',
      aliasName: '',
      rowRowElementId: index + 1,
      rowRowElementSort: index + 1,
    }))
    rowRowForm.value.contents = columns
    // 已有的行数的基础上+1，就是新的行数的id
    rowRowForm.value.id = rowRowCount.value + 1
  }

  emit('getRowRows', rowRowForm.value, activeRowIndex.value)
}

defineExpose({ openDialog })
</script>

<template>
  <ElDialog v-model="rowRowDialogVisible">
    <template #header>
      <div class="text-sm font-bold">
        {{ $t('common.add') }}{{ $t('comps.row') }}
      </div>
    </template>
    <div class="p-5">
      <ElForm ref="rowRowFormRef" :model="rowRowForm" :rules="rowRowFormRules">
        <ElFormItem :label="$t('comps.rowName')" prop="rowRowName">
          <ElInput v-model="rowRowForm.rowRowName" :placeholder="$t('comps.placeholder.rowName')" />
        </ElFormItem>
        <ElFormItem :label="$t('comps.rowColumns')" prop="columnsCount">
          <ElSelect
            v-model="rowRowForm.columnsCount"
            clearable
            filterable
            :placeholder="$t('comps.placeholder.rowColumns')"
          >
            <ElOption v-for="item in rowRowColumns" :key="item" :label="`${item}列`" :value="item" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-if="rowRowForm.columnsCount > 1" :label="$t('comps.rowGap')" prop="columnGap">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowRowForm.columnGap"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.rowGap')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              最小0，最大40
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.marginTop')" prop="marginTop">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowRowForm.marginTop"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.marginTop')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              最小0，最大40
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.marginBottom')" prop="marginBottom">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowRowForm.marginBottom"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.marginBottom')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              最小0，最大40
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.marginLeft')" prop="marginLeft">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowRowForm.marginLeft"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.marginLeft')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              最小0，最大40
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.marginRight')" prop="marginRight">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowRowForm.marginRight"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.marginRight')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              最小0，最大40
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.paddingTop')" prop="paddingTop">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowRowForm.paddingTop"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.paddingTop')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              最小0，最大40
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.paddingBottom')" prop="paddingBottom">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowRowForm.paddingBottom"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.paddingBottom')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              最小0，最大40
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.paddingLeft')" prop="paddingLeft">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowRowForm.paddingLeft"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.paddingLeft')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              最小0，最大40
            </span>
          </div>
        </ElFormItem>
        <ElFormItem :label="$t('comps.paddingRight')" prop="paddingRight">
          <div class="flex items-center">
            <ElInputNumber
              v-model="rowRowForm.paddingRight"
              :min="0"
              :max="40"
              :placeholder="$t('comps.placeholder.paddingRight')"
              class="mr-2 w-[200px]"
            />
            <span class="flex flex-1 text-xs text-gray-400">
              <Icon name="ant-design:info-circle-outlined" class="mr-1" :size="4" />
              最小0，最大40
            </span>
          </div>
        </ElFormItem>
      </ElForm>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <EBtn @click="rowRowDialogVisible = false">
          {{ $t('common.cancel') }}
        </EBtn>
        <EBtn type="primary" @click="handleSubmit">
          {{ $t('common.submit') }}
        </EBtn>
      </div>
    </template>
  </ElDialog>
</template>
