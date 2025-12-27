<script setup lang="ts">
import { ElCard, ElInput, ElMessage } from 'element-plus'
import { layoutListApi } from '@/api/layout'
import { createSupplierApi } from '@/api/supplier'
import { supplierCodes } from '@/data/supplier'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'

const router = useRouter()

const { t: $t } = useLocale()

const uploadRef = ref()

const rules = reactive({
  supplierType: [{ required: true, type: 'number', message: '内容类型必填', trigger: 'change' }],
  languageId: [{ required: true, type: 'number', message: '语言必须选择', trigger: 'change' }],
  status: [{ required: true, type: 'boolean', message: '状态必填', trigger: 'change' }],
  supplierCode: [{ required: true, type: 'string', message: '识别码必须填写', trigger: 'blur' }],
  supplierName: [{ required: true, type: 'string', message: '内容名称必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = $t('supplier.add')

const listLayoutPayload = reactive<LayoutListParams>({
  layoutName: null,
})

const listLayoutData = ref<TableResponse<LayoutData & CommonField>>({
  list: [],
  total: 0,
})

const getLayoutList = async () => {
  loading.init = true
  if (listLayoutPayload.layoutName === '') {
    listLayoutPayload.layoutName = null
  }
  if (listLayoutPayload.layoutName && listLayoutPayload.layoutName?.length <= 1) {
    loading.init = false
    return
  }
  const { data } = await layoutListApi(listLayoutPayload).catch(error => {
    loading.init = false
    throw error
  })
  listLayoutData.value = data
  loading.init = false
}

getLayoutList()

const supplierFormRef = ref()

const editorRef = ref()

const createSupplierForm = (): CreateSupplierParams => {
  return {
    languageId: '',
    supplierCode: '',
    supplierName: '',
    supplierDescription: '',
    supplierFileId: '',
  }
}

const supplierForm = reactive<CreateSupplierParams>(createSupplierForm())

const closeViewTag = () => {}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'SupplierList' })
}

const save = async () => {
  supplierForm.languageId = usePreferenceStore().preference.language.id
  supplierForm.supplierDescription = editorRef.value.getEditorContent()
  const file = uploadRef.value.getFileData()
  supplierForm.supplierFileId = file.fileData.id
  const valid = await supplierFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  await createSupplierApi(supplierForm).catch(err => {
    throw err
  })

  deleteTagView(true)
  ElMessage({
    message: '保存成功',
    type: 'success',
    duration: 2000,
  })
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <h4>{{ pageTitle }}</h4>
        </div>
        <div>
          <EBtn size="small" :loading="loading.button" @click="closeViewTag()">
            <Icon icon="ant-design:close-outlined" class="mr-1" />
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn size="small" type="primary" :loading="loading.button" @click="save">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </div>
    <div class="view-main theme-card">
      <ElCard shadow="never">
        <ElForm ref="supplierFormRef" :model="supplierForm" :rules="rules" label-width="120px">
          <ElFormItem :label="$t('supplier.supplierCode')" prop="supplierCode">
            <ElSelect v-model="supplierForm.supplierCode" filterable clearable style="width: 300px" class="mr-2">
              <ElOption
                v-for="item in supplierCodes"
                :key="item"
                :label="item"
                :value="item"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="$t('supplier.supplierName')" prop="supplierName">
            <ElInput
              v-model="supplierForm.supplierName"
              minlength="1"
              maxlength="120"
              :placeholder="$t('supplier.placeholder.supplierName')"
            />
          </ElFormItem>
          <ElFormItem :label="$t('supplier.supplierDescription')" prop="supplierDescription">
            <Editor ref="editorRef" v-model="supplierForm.supplierDescription" :height="300" />
          </ElFormItem>
          <ElFormItem :label="$t('supplier.supplierLogo')">
            <UploadSingleImage ref="uploadRef" />
          </ElFormItem>
        </ElForm>
      </ElCard>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
