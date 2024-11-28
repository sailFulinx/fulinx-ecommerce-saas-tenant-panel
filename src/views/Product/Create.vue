<script setup lang="ts">
import { createProductApi } from '@/api/product'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import { ElCard, ElInput, ElInputNumber, ElMessage } from 'element-plus'

const { t: $t } = useLocale()

const rules = reactive({
  languageId: [{ required: true, message: $t('common.placeholder.language'), trigger: 'change' }],
  productName: [{ required: true, message: $t('product.placeholder.productName'), trigger: 'blur' }],
  productPrice: [{ required: true, message: $t('product.placeholder.productPrice'), trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = $t('product.add')

const productFormRef = ref()

const editorRef = ref()

const uploadRef = ref()

const createProductForm = (): CreateProductParams => {
  return {
    languageId: '',
    sku: '',
    productType: 0,
    productStockStatusType: 0,
    availabilityDate: '',
    isSettingOnlineTime: true,
    onlineTime: '',
    isSettingOfflineTime: true,
    offlineTime: '',
    quantity: 0,
    brandId: '',
    sort: 0,
    status: true,
    productName: '',
    productPrice: 0,
    productFileRequestDos: [],
    productDescription: '',
    supplierId: '',
  }
}

const productForm = reactive<CreateProductParams>(createProductForm())

const closeViewTag = () => {}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'ProductList' })
}

const save = async () => {
  productForm.languageId = usePreferenceStore().preference.language.id
  const valid = await productFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  await createProductApi(productForm).catch(err => {
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
        <ElForm ref="productFormRef" :model="productForm" :rules="rules" label-width="120px">
          <ElFormItem :label="$t('product.productName')" prop="productName">
            <ElInput
              v-model="productForm.productName"
              minlength="1"
              maxlength="120"
              :placeholder="$t('product.placeholder.productName')"
            />
          </ElFormItem>
          <ElFormItem :label="$t('product.productPrice')" prop="productPrice">
            <ElInputNumber
              v-model="productForm.productPrice"
              :min="0.0001"
              :max="999999999.9999"
              :placeholder="$t('product.placeholder.productPrice')"
            />
          </ElFormItem>
          <ElFormItem :label="$t('product.productImage')">
            <UploadMultiImage ref="uploadRef" />
          </ElFormItem>
          <ElFormItem :label="$t('product.productDescription')" prop="articleDescription">
            <Editor ref="editorRef" v-model="productForm.productDescription" :height="300" />
          </ElFormItem>
        </ElForm>
      </ElCard>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
