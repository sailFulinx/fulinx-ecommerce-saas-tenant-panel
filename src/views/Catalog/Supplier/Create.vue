<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'

const { t: $t } = useLocale()

const router = useRouter()

const uploadRef = ref()

const rules = reactive({
  languageId: [{ required: true, message: '语言必须选择', trigger: 'change' }],
  status: [{ required: true, message: '状态必填', trigger: 'change' }],
  supplierName: [{ required: true, message: '供应商名称必须填写', trigger: 'blur' }],
  metaTitle: [{ required: true, message: 'Meta标题必须填写', trigger: 'blur' }],
  metaDescription: [{ required: true, message: 'Meta描述必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = $t('supplier.add')

const supplierFormRef = ref()

const editorRef = ref()

const createSupplierForm = (): CreateSupplierParams => {
  return {
    languageId: '',
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
      <ElForm ref="supplierFormRef" :model="supplierForm" :rules="rules" label-width="120px">
        <ElCard shadow="never" class="w-full mb-5">
          <template #header>
            <div class="card-header">
              <span>{{ $t('supplier.base') }}</span>
            </div>
          </template>
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
        </ElCard>
      </ElForm>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
