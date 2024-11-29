<script setup lang="ts">
import { brandPaginationApi } from '@/api/brand'
import { createProductApi } from '@/api/product'
import { supplierPaginationApi } from '@/api/supplier'
import { productStockStatusTypes, productTypes } from '@/data/product'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import { ElCard, ElInput, ElInputNumber, ElMessage, ElSwitch } from 'element-plus'

const { t: $t } = useLocale()

const rules = reactive({
  languageId: [{ required: true, message: $t('common.placeholder.language'), trigger: 'change' }],
  productName: [{ required: true, message: $t('product.placeholder.productName'), trigger: 'blur' }],
  productType: [{ required: true, message: $t('product.placeholder.productType'), trigger: 'change' }],
  productStockStatusType: [{ required: true, message: $t('product.placeholder.productStockStatusType'), trigger: 'change' }],
  sku: [{ required: true, message: $t('product.placeholder.sku'), trigger: 'blur' }],
  productPrice: [{ required: true, message: $t('product.placeholder.productPrice'), trigger: 'blur' }],
  quantity: [{ required: true, message: $t('product.placeholder.quantity'), trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
  brand: false,
  supplier: false,
})

const listBrandQuery = reactive<BrandListParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  brandName: '',
  pageSize: 20,
  pageNumber: 1,
})

const listBrandResult = ref<TableResponse<BrandListData & CommonField>>({
  list: [],
  total: 0,
})

const getBrandList = async () => {
  loading.brand = true
  if (listBrandQuery.brandName === '') {
    listBrandQuery.brandName = null
  }
  const { data } = await brandPaginationApi(listBrandQuery).catch(err => {
    loading.brand = false
    throw err
  })
  listBrandResult.value = data
  loading.brand = false
}

const listSupplierQuery = reactive<SupplierListParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  supplierName: '',
  pageSize: 20,
  pageNumber: 1,
})

const listSupplierResult = ref<TableResponse<SupplierListData & CommonField>>({
  list: [],
  total: 0,
})

const getSupplierList = async () => {
  loading.supplier = true
  if (listSupplierQuery.supplierName === '') {
    listSupplierQuery.supplierName = null
  }
  const { data } = await supplierPaginationApi(listSupplierQuery).catch(err => {
    loading.supplier = false
    throw err
  })
  listSupplierResult.value = data
  loading.supplier = false
}

getBrandList()
getSupplierList()

const pageTitle = $t('product.add')

const productFormRef = ref()

const editorRef = ref()

const uploadRef = ref()

const createProductForm = (): CreateProductParams => {
  return {
    languageId: usePreferenceStore().preference.language.id,
    sku: '',
    productType: 1,
    productStockStatusType: 1,
    availabilityDate: '',
    processingDays: 1,
    isSettingOnlineTime: false,
    onlineTime: '',
    isSettingOfflineTime: false,
    offlineTime: '',
    quantity: 1,
    brandId: '',
    sort: 0,
    status: true,
    productName: '',
    currencyId: usePreferenceStore().preference.currency.id,
    productPriceCreateRequestDos: [
      {
        orderQuantity: 1,
        price: 1,
        isSettingSalePrice: false,
        salePrice: 1,
        salePriceStartedAt: '',
        isSettingSaleEndedTime: false,
        salePriceEndedAt: '',
      },
    ],
    productFileRequestDos: [],
    productDescription: '',
    supplierId: '',
    mpn: '',
  }
}

const productForm = reactive<CreateProductParams>(createProductForm())

const handleAddPrice = () => {
  productForm.productPriceCreateRequestDos.push({
    orderQuantity: 1,
    price: 1,
    isSettingSalePrice: false,
    salePrice: 1,
    salePriceStartedAt: '',
    isSettingSaleEndedTime: false,
    salePriceEndedAt: '',
  })
}

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
  productForm.currencyId = usePreferenceStore().preference.currency.id
  const files = uploadRef.value.getFileData()
  productForm.productFileRequestDos = files.fileDataList
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
      <ElForm ref="productFormRef" :model="productForm" :rules="rules" label-width="140px">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-9">
            <ElCard shadow="never" class="mb-5">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="text-base font-bold">
                    {{ $t('product.base') }}
                  </div>
                </div>
              </template>
              <ElFormItem :label="$t('product.productName')" prop="productName">
                <ElInput
                  v-model="productForm.productName"
                  minlength="1"
                  maxlength="120"
                  :placeholder="$t('product.placeholder.productName')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('product.sku')" prop="sku">
                <ElInput
                  v-model="productForm.sku"
                  minlength="1"
                  maxlength="120"
                  :placeholder="$t('product.placeholder.sku')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('product.productPrice')" required>
                <EBtn type="primary" plain @click="handleAddPrice">
                  <Icon icon="ep:plus" />
                  {{ $t('product.addPrice') }}
                </EBtn>
                <div class="w-full mt-5">
                  <ElTable :data="productForm.productPriceCreateRequestDos" style="width: 100%">
                    <ElTableColumn prop="orderQuantity" :label="$t('product.orderQuantity')" width="180">
                      <template #default="scope">
                        <ElInputNumber
                          v-model="scope.row.orderQuantity"
                          :min="1"
                          :max="120"
                          :placeholder="$t('product.placeholder.orderQuantity')"
                        />
                      </template>
                    </ElTableColumn>
                    <ElTableColumn prop="price" :label="$t('product.price')" width="180">
                      <template #default="scope">
                        <ElInputNumber
                          v-model="scope.row.price"
                          :min="0.0001"
                          :max="999999999.9999"
                          :placeholder="$t('product.placeholder.productPrice')"
                        />
                      </template>
                    </ElTableColumn>
                    <ElTableColumn prop="isSettingSalePrice" :label="$t('product.isSettingSalePrice')" width="120">
                      <template #default="scope">
                        <ElSwitch v-model="scope.row.isSettingSalePrice" />
                      </template>
                    </ElTableColumn>
                    <ElTableColumn prop="salePrice" :label="$t('product.salePrice')" width="180">
                      <template #default="scope">
                        <ElInputNumber
                          v-model="scope.row.salePrice"
                          :min="0.0001"
                          :max="999999999.9999"
                          :placeholder="$t('product.placeholder.salePrice')"
                        />
                      </template>
                    </ElTableColumn>
                    <ElTableColumn prop="salePriceStartedAt" :label="$t('product.salePriceStartedAt')" width="180">
                      <template #default="scope">
                        <ElDatePicker
                          v-model="scope.row.salePriceStartedAt"
                          type="datetime"
                          :placeholder="$t('product.placeholder.salePriceStartedAt')"
                          style="width:140px"
                        />
                      </template>
                    </ElTableColumn>
                    <ElTableColumn prop="isSettingSaleEndedTime" :label="$t('product.isSettingSaleEndedTime')" width="180">
                      <template #default="scope">
                        <ElSwitch v-model="scope.row.isSettingSaleEndedTime" />
                      </template>
                    </ElTableColumn>
                    <ElTableColumn prop="salePriceEndedAt" :label="$t('product.salePriceEndedAt')">
                      <template #default="scope">
                        <ElDatePicker
                          v-model="scope.row.salePriceEndedAt"
                          type="datetime"
                          :placeholder="$t('product.placeholder.salePriceEndedAt')"
                          style="width:140px"
                        />
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </ElFormItem>
              <ElFormItem :label="$t('product.quantity')" prop="quantity">
                <ElInputNumber
                  v-model="productForm.quantity"
                  :min="1"
                  :max="9999999999"
                  class="w-[200px]"
                  :placeholder="$t('product.placeholder.quantity')"
                />
              </ElFormItem>

              <ElFormItem :label="$t('product.productDescription')" prop="articleDescription">
                <Editor ref="editorRef" v-model="productForm.productDescription" :height="300" />
              </ElFormItem>
            </ElCard>
            <ElCard shadow="never">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="text-base font-bold">
                    {{ $t('product.image') }}
                  </div>
                </div>
              </template>
              <UploadMultiImage ref="uploadRef" />
            </ElCard>
          </div>
          <div class="col-span-3">
            <ElCard shadow="never">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="text-base font-bold">
                    {{ $t('product.other') }}
                  </div>
                </div>
              </template>

              <ElFormItem :label="$t('product.mpn')" prop="mpn">
                <ElInput
                  v-model="productForm.mpn"
                  minlength="1"
                  maxlength="120"
                  :placeholder="$t('product.placeholder.mpn')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('product.productType')" prop="productType">
                <ElSelect v-model="productForm.productType" :placeholder="$t('product.placeholder.productType')">
                  <ElOption v-for="item in productTypes" :key="item.id" :value="item.id" :label="item.label" />
                </ElSelect>
              </ElFormItem>

              <ElFormItem :label="$t('product.productStockStatusType')" prop="productStockStatusType">
                <ElSelect v-model="productForm.productStockStatusType" :placeholder="$t('product.placeholder.productStockStatusType')">
                  <ElOption v-for="item in productStockStatusTypes" :key="item.id" :value="item.id" :label="item.label" />
                </ElSelect>
              </ElFormItem>

              <ElFormItem v-if="productForm.productStockStatusType === 3 || productForm.productStockStatusType === 4" :label="$t('product.availabilityDate')">
                <ElDatePicker
                  v-model="productForm.availabilityDate"
                  type="date"
                  :placeholder="$t('product.placeholder.availabilityDate')"
                />
              </ElFormItem>

              <ElFormItem :label="$t('product.processingDays')" prop="processingDays">
                <ElInputNumber
                  v-model="productForm.processingDays"
                  :min="1"
                  :max="120"
                  :placeholder="$t('product.placeholder.processingDays')"
                />
              </ElFormItem>

              <ElFormItem :label="$t('product.isSettingOnlineTime')" prop="isSettingOnlineTime">
                <ElSwitch v-model="productForm.isSettingOnlineTime" />
              </ElFormItem>

              <ElFormItem v-if="productForm.isSettingOnlineTime" :label="$t('product.onlineTime')" prop="onlineTime">
                <ElDatePicker
                  v-model="productForm.onlineTime"
                  type="datetime"
                  :placeholder="$t('product.placeholder.onlineTime')"
                />
              </ElFormItem>

              <ElFormItem :label="$t('product.isSettingOfflineTime')" prop="isSettingOfflineTime">
                <ElSwitch v-model="productForm.isSettingOfflineTime" />
              </ElFormItem>

              <ElFormItem v-if="productForm.isSettingOfflineTime" :label="$t('product.offlineTime')" prop="offlineTime">
                <ElDatePicker
                  v-model="productForm.offlineTime"
                  type="datetime"
                  :placeholder="$t('product.placeholder.offlineTime')"
                />
              </ElFormItem>

              <ElFormItem :label="$t('product.brand')" prop="brandId">
                <ElSelect v-model="productForm.brandId" :placeholder="$t('product.placeholder.brand')">
                  <ElOption v-for="item in listBrandResult.list" :key="item.id" :value="item.id" :label="item.brandName" />
                </ElSelect>
              </ElFormItem>

              <ElFormItem :label="$t('product.supplier')" prop="supplierId">
                <ElSelect v-model="productForm.supplierId" :placeholder="$t('product.placeholder.supplier')">
                  <ElOption v-for="item in listSupplierResult.list" :key="item.id" :value="item.id" :label="item.supplierName" />
                </ElSelect>
              </ElFormItem>
            </ElCard>
          </div>
        </div>
      </ElForm>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
