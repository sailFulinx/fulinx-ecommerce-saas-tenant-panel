<script lang="ts" setup>
import { elements } from '@/data/element'
import { useLocale } from '@/hooks/useLocale'

const emit = defineEmits(['getColumn'])
const { t: $t } = useLocale()
// elementDialog是否显示
const dialogVisible = ref(false)

// 当前选中的外层行
const activeRowIndex = ref(0)

// 当前选中的内层行
const activeRowRowIndex = ref(0)

// 当前选中的内层行中的列
const activeRowColIndex = ref(0)

// 用于设置行中的列form表单
const rolColFormRef = ref()

// 行中的列form表单校验
const rolColFormRules = reactive({
  aliasName: [{ required: true, message: $t('comps.placeholder.aliasName'), trigger: 'blur' }],
  // elementComponentCode: [{ required: true, message: $t('comps.placeholder.element'), trigger: 'change' }],
})

// 行中的列form表单
const rowColForm = ref<CompElementFormData>({
  elementComponentCode: '',
  webComponentCode: '',
  aliasName: '',
})

const rowCol = ref<CompElementFormData>({
  elementComponentCode: '',
  webComponentCode: '',
  aliasName: '',
})

const openDialog = async (
  rowIndex: number,
  rowRowIndex: number,
  rowColIndex: number,
  rowColData?: CompElementFormData,
) => {
  rowColForm.value = {
    elementComponentCode: '',
    webComponentCode: '',
    aliasName: '',
  }
  rowCol.value = {
    elementComponentCode: '',
    webComponentCode: '',
    aliasName: '',
  }
  dialogVisible.value = true
  activeRowIndex.value = rowIndex
  activeRowRowIndex.value = rowRowIndex
  activeRowColIndex.value = rowColIndex
  await nextTick()
  if (rowColData) {
    rowColForm.value = rowColData
    rowCol.value = rowColData
  }
}

const handleCancelElementToColumn = () => {
  dialogVisible.value = false
  rowColForm.value = {
    elementComponentCode: '',
    webComponentCode: '',
    aliasName: '',
  }
  rowCol.value = {
    elementComponentCode: '',
    webComponentCode: '',
    aliasName: '',
  }
}

// 修改webComponentCode时
const handleConfirmElementToRowColumn = async () => {
  const valid = await rolColFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  // 如果rowColForm.value.elementComponentCode与当前的行列的elementComponentCode相同，只修改aliasName和webComponentCode
  if (rowCol.value.elementComponentCode === rowColForm.value.elementComponentCode) {
    rowCol.value.aliasName = rowColForm.value.aliasName
    rowCol.value.webComponentCode = rowColForm.value.webComponentCode
  } else {
    // 从elements中查找rowColForm.elementComponentCode对应的element，并重新赋值给selectedElement.value
    const element = elements.find(item => item.elementComponentCode === rowColForm.value.elementComponentCode)
    if (element) {
      const selectedElement = {
        elementId: element.elementId,
        elementComponentCode: element.elementComponentCode,
        webComponentCode: rowColForm.value.webComponentCode,
        elementComponentConfig: {
          content: {},
          status: true,
        },
        elementName: element.elementName,
        aliasName: rowColForm.value.aliasName,
      }
      rowCol.value = selectedElement
    }
  }
  emit('getColumn', activeRowIndex.value, activeRowColIndex.value, activeRowColIndex.value, rowCol.value)
  handleCancelElementToColumn()
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDialog v-model="dialogVisible">
    <template #header>
      <div class="text-sm font-bold">
        {{ $t('comps.settingElement') }}
      </div>
    </template>
    <div class="p-5">
      <ElForm ref="rolColFormRef" :model="rowColForm" :rules="rolColFormRules" label-width="120px">
        <ElFormItem :label="$t('comps.aliasName')" prop="aliasName" required>
          <ElInput v-model="rowColForm.aliasName" :placeholder="$t('comps.placeholder.aliasName')" />
        </ElFormItem>
        <!-- <ElFormItem :label="$t('comps.elementComponentCode')" prop="elementComponentCode" required>
          <ElSelect
            v-model="rowColForm.elementComponentCode"
            value-key="elementId"
            clearable
            filterable
            :placeholder="$t('comps.placeholder.element')"
          >
            <ElOption
              v-for="item in elements"
              :key="item.elementComponentCode"
              :label="item.elementName"
              :value="item.elementComponentCode"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem :label="$t('comps.webComponentCode')">
          <ElInput v-model="rowColForm.webComponentCode" :placeholder="$t('comps.placeholder.webComponentCode')" />
        </ElFormItem> -->
      </ElForm>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <EBtn @click="handleCancelElementToColumn">
          {{ $t('common.cancel') }}
        </EBtn>
        <EBtn type="primary" @click="handleConfirmElementToRowColumn">
          {{ $t('common.submit') }}
        </EBtn>
      </div>
    </template>
  </ElDialog>
</template>
