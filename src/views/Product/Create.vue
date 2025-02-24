<script setup lang="ts">
import { listCategoryApi } from '@/api/category'
import { parameterGroupListApi, parameterListApi } from '@/api/parameter'
import { createProductApi } from '@/api/product'
import { supplierPaginationApi } from '@/api/supplier'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import { ElCard, ElInput, ElInputNumber, ElMessage, ElOption, ElSwitch } from 'element-plus'

const { t: $t } = useLocale()

const rules = reactive({
  languageId: [{ required: true, message: $t('common.placeholder.language'), trigger: 'change' }],
  productName: [{ required: true, message: $t('product.placeholder.productName'), trigger: 'blur' }],
  productType: [{ required: true, message: $t('product.placeholder.productType'), trigger: 'change' }],
  productStockStatusType: [
    { required: true, message: $t('product.placeholder.productStockStatusType'), trigger: 'change' },
  ],
  sku: [{ required: true, message: $t('product.placeholder.sku'), trigger: 'blur' }],
  productPrice: [{ required: true, message: $t('product.placeholder.productPrice'), trigger: 'blur' }],
  inStockQuantity: [{ required: true, message: $t('product.placeholder.inStockQuantity'), trigger: 'blur' }],
  processingQuantity: [{ required: false, message: $t('product.placeholder.processingQuantity'), trigger: 'blur' }],
  processingDays: [{ required: false, message: $t('product.placeholder.processingDays'), trigger: 'blur' }],
  productionCycle: [{ required: false, message: $t('product.placeholder.productionCycle'), trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
  supplier: false,
  category: false,
  parameterGroup: false,
  parameter: false,
})

/**
 * 参数
 */

const selectedParameter = ref<(ParameterListData & CommonField) | null>()

const selectedParameterList = ref<(ParameterListData & CommonField)[]>([])

const addParameter = () => {
  if (!selectedParameter.value || selectedParameter.value === null) {
    ElMessage({
      type: 'warning',
      message: '请选择参数',
    })
    return
  }
  // 如果已经存在,不重复添加
  if (selectedParameterList.value.find(item => item.id === selectedParameter.value?.id)) {
    ElMessage({
      type: 'warning',
      message: '已存在该参数',
    })
    return
  }
  selectedParameterList.value.push(selectedParameter.value)
}

const removeParameter = (index: number) => {
  selectedParameterList.value.splice(index, 1)
}

// const selectedParameterGroup = ref('')

// const listParameterGroupResult = ref<TableResponse<ParameterGroupListData & CommonField>>({
//   list: [],
//   total: 0,
// })

// const listParameterGroupQuery = reactive<ParameterGroupListParams>({
//   languageId: usePreferenceStore().preference?.language.id,
//   parameterGroupName: '',
// })

// const getParameterGroupList = async () => {
//   loading.parameterGroup = true
//   if (listParameterGroupQuery.parameterGroupName === '') {
//     listParameterGroupQuery.parameterGroupName = null
//   }
//   const { data } = await parameterGroupListApi(listParameterGroupQuery).catch(err => {
//     loading.parameterGroup = false
//     throw err
//   })
//   listParameterGroupResult.value = data
//   loading.parameterGroup = false
// }

// getParameterGroupList()

const listParameterResult = ref<TableResponse<ParameterListData & CommonField>>({
  list: [],
  total: 0,
})

const listParameterQuery = reactive<ParameterListParams>({
  languageId: usePreferenceStore().preference?.language.id,
})

const getParameterList = async () => {
  loading.parameter = true
  const { data } = await parameterListApi(listParameterQuery).catch(err => {
    loading.parameter = false
    throw err
  })
  listParameterResult.value = data
  loading.parameter = false
}

// const handleParameterGroupChange = (val: string) => {
//   listParameterQuery.parameterGroupId = val
//   getParameterList()
// }
getParameterList()

const productParameterForm = ref<ProductParameterRelationRequest[]>([])

const inputParameterForm = ref<string[]>([])

const formatInputParameterValue = (index: number, value: ParameterListData & CommonField) => {
  const parameterValueContent = inputParameterForm.value[index]
  const parameterValue: ProductParameterRelationRequest = {
    // parameterGroupId: selectedParameterGroup.value,
    parameterId: value.id,
    parameterValueContent,
    parameterValueId: '',
  }
  productParameterForm.value[index] = parameterValue
}

/**
 * 分类
 */

const categoryProps = {
  value: 'id',
  label: 'categoryName',
  multiple: true,
}

const categoryIds = ref<string[]>([])

const handleChangeCategory = (val: string[]) => {
  if (val && val.length > 0) {
    val.forEach(item => {
      const lastElement = item.at(-1) // 获取最后一个元素
      if (lastElement !== undefined) {
        // 检查是否为undefined
        categoryIds.value.push(lastElement)
      }
    })
  }
}

const listCategoryPayload = reactive<CategoryListParams>({
  languageId: usePreferenceStore().preference?.language.id,
  categoryName: '',
  categoryType: 1,
  id: null,
})

const listCategoryData = ref<ListCategoryRes>({
  list: [],
  total: 0,
})

const getCategoryList = async () => {
  loading.category = true
  const { data } = await listCategoryApi(listCategoryPayload).catch(error => {
    loading.category = true
    throw error
  })
  listCategoryData.value = { ...data }
  loading.category = false
}
getCategoryList()

/**
 * 供应商
 */
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
getSupplierList()

const remoteQuerySupplier = async (query: string) => {
  if (query.length < 3) {
    return
  }
  listSupplierQuery.supplierName = query
  await getSupplierList()
}

const pageTitle = $t('product.add')

const productFormRef = ref()

const editorRef = ref()

const imageUploadRef = ref()

const createProductForm = (): CreateProductParams => {
  return {
    languageId: usePreferenceStore().preference.language.id,
    sku: '',
    mpn: '',
    isSettingOnlineTime: false,
    onlineTime: '',
    isSettingOfflineTime: false,
    offlineTime: '',
    inStockQuantity: 0,
    processingQuantity: 0,
    processingDays: 0,
    productionCycle: 0,
    supplierId: '',
    productName: '',
    currencyId: '',
    parameterGroupId: '',
    categoryIds: [],
    productPriceCreateRequestDos: [],
    productImageRequestDos: [],
    productParameterRelationRequestDos: [],
    productDescription: '',
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
  productForm.productParameterRelationRequestDos = []
  productForm.languageId = usePreferenceStore().preference.language.id
  productForm.currencyId = usePreferenceStore().preference.currency.id
  // productForm.parameterGroupId = selectedParameterGroup.value
  const images = imageUploadRef.value.getFileData()
  productForm.productImageRequestDos = images.fileDataList
  productForm.productImageRequestDos?.map(item => {
    item.productFileType = 1
    return item
  })
  productParameterForm.value.map(item => {
    if (item?.id) {
      const result: ProductParameterRelationRequest = {
        // parameterGroupId: selectedParameterGroup.value,
        parameterId: item.parameterId,
        parameterValueId: item.id,
        parameterValueContent: item.parameterValueContent,
      }
      productForm.productParameterRelationRequestDos.push(result)
    } else {
      const result: ProductParameterRelationRequest = {
        // parameterGroupId: selectedParameterGroup.value,
        parameterId: item.parameterId,
        parameterValueId: '',
        parameterValueContent: item.parameterValueContent,
      }
      productForm.productParameterRelationRequestDos.push(result)
    }
  })
  if (categoryIds.value && categoryIds.value.length > 0) {
    productForm.categoryIds = categoryIds.value
  }
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
          <div class="col-span-8">
            <!-- 基础 -->
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
              <ElFormItem :label="$t('product.supplier')" prop="supplierId">
                <ElSelect
                  v-model="productForm.supplierId"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  :remote-method="remoteQuerySupplier"
                  :placeholder="$t('product.placeholder.supplier')"
                  style="width: 200px"
                >
                  <ElOption
                    v-for="item in listSupplierResult.list"
                    :key="item.id"
                    :value="item.id"
                    :label="item.supplierName"
                  />
                </ElSelect>
              </ElFormItem>
              <ElFormItem :label="$t('product.mpn')" prop="mpn">
                <ElInput
                  v-model="productForm.mpn"
                  minlength="1"
                  maxlength="120"
                  :placeholder="$t('product.placeholder.mpn')"
                />
              </ElFormItem>

              <ElFormItem :label="$t('product.productDescription')" prop="articleDescription">
                <Editor ref="editorRef" v-model="productForm.productDescription" :height="300" />
              </ElFormItem>
            </ElCard>
            <!-- 图片 -->
            <ElCard shadow="never" class="mb-5">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="text-base font-bold">
                    {{ $t('product.image') }}
                  </div>
                </div>
              </template>
              <UploadMultiImage ref="imageUploadRef" />
            </ElCard>
            <!-- 参数 -->
            <ElCard shadow="never" class="mb-5">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="text-base font-bold">
                    {{ $t('product.parameterInfo') }}
                  </div>
                  <div>
                    <ElSelect
                      v-model="selectedParameter"
                      value-key="id"
                      filterable
                      clearable
                      placeholder="请选择参数"
                      style="width: 200px"
                      class="mr-3"
                    >
                      <ElOption
                        v-for="item in listParameterResult.list"
                        :key="item.id"
                        :label="item.parameterName"
                        :value="item"
                      />
                    </ElSelect>

                    <EBtn size="small" type="primary" @click="addParameter">
                      <Icon icon="ant-design:plus-outlined" class="mr-1" />
                      {{ $t('common.add') }}
                    </EBtn>
                  </div>
                </div>
              </template>
              <div v-if="selectedParameterList && selectedParameterList.length > 0">
                <div v-for="(item, index) in selectedParameterList" :key="item.id">
                  <ElFormItem
                    v-if="item.parameterType === 2"
                    label-width="auto"
                    :label="item.parameterName"
                    class="flex justify-between"
                  >
                    <ElInput
                      v-model="inputParameterForm[index]"
                      style="width: 200px; margin-right: 10px"
                      placeholder="请输入参数值"
                      @input="formatInputParameterValue(index, item)"
                    />
                    <EBtn plain type="danger" @click="removeParameter(index)">
                      <Icon icon="ant-design:delete-outlined" />
                    </EBtn>
                  </ElFormItem>
                  <ElFormItem
                    v-if="item.parameterType === 1"
                    label-width="auto"
                    :label="item.parameterName"
                    class="flex justify-between"
                  >
                    <ElSelect
                      v-model="productParameterForm[index]"
                      value-key="id"
                      style="width: 200px; margin-right: 10px"
                      filterable
                      clearable
                      placeholder="请选择参数值"
                    >
                      <ElOption
                        v-for="vItem in item.parameterValueListResultDos"
                        :key="vItem.id"
                        :label="vItem.parameterValueContent"
                        :value="vItem"
                      />
                    </ElSelect>
                    <EBtn plain type="danger" @click="removeParameter(index)">
                      <Icon icon="ant-design:delete-outlined" />
                    </EBtn>
                  </ElFormItem>
                </div>
              </div>
            </ElCard>
          </div>
          <div class="col-span-4">
            <!-- 产品分类 -->
            <ElCard shadow="never" class="mb-5">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="text-base font-bold">
                    {{ $t('product.categoryInfo') }}
                  </div>
                </div>
              </template>
              <ElFormItem :label="$t('product.category')" prop="category">
                <ElCascader
                  v-model="productForm.categoryIds"
                  :props="categoryProps"
                  :options="listCategoryData.list"
                  @change="handleChangeCategory"
                />
              </ElFormItem>
            </ElCard>
            <!-- 价格信息 -->
            <ElCard shadow="never" class="mb-5">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="text-base font-bold">
                    {{ $t('product.price') }}
                  </div>
                  <EBtn type="primary" plain @click="handleAddPrice">
                    <Icon icon="ep:plus" />
                    {{ $t('product.addPrice') }}
                  </EBtn>
                </div>
              </template>
              <div class="w-full mt-5">
                <ElTable :data="productForm.productPriceCreateRequestDos" style="width: 100%">
                  <ElTableColumn prop="orderQuantity" :label="$t('product.orderQuantity')" width="180">
                    <template #default="scope">
                      <ElInputNumber
                        v-model="scope.row.orderQuantity"
                        :min="1"
                        :max="999999999"
                        :placeholder="$t('product.placeholder.orderQuantity')"
                      />
                    </template>
                  </ElTableColumn>
                  <ElTableColumn prop="price" :label="$t('product.price')">
                    <template #default="scope">
                      <ElInputNumber
                        v-model="scope.row.price"
                        :min="0.0001"
                        :max="999999999.9999"
                        :placeholder="$t('product.placeholder.productPrice')"
                      />
                    </template>
                  </ElTableColumn>
                </ElTable>
              </div>
            </ElCard>
            <!-- 库存信息 -->
            <ElCard shadow="never" class="mb-5">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="text-base font-bold">
                    {{ $t('product.stockInfo') }}
                  </div>
                </div>
              </template>
              <ElFormItem :label="$t('product.inStockQuantity')" prop="inStockQuantity">
                <ElInputNumber
                  v-model="productForm.inStockQuantity"
                  :min="0"
                  :max="9999999999"
                  class="w-[200px]"
                  :placeholder="$t('product.placeholder.inStockQuantity')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('product.processingQuantity')" prop="processingQuantity">
                <ElInputNumber
                  v-model="productForm.processingQuantity"
                  :min="0"
                  :max="9999999999"
                  class="w-[200px]"
                  :placeholder="$t('product.placeholder.processingQuantity')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('product.processingDays')" prop="processingDays">
                <ElInputNumber
                  v-model="productForm.processingDays"
                  :min="0"
                  :max="9999999999"
                  class="w-[200px]"
                  :placeholder="$t('product.placeholder.processingDays')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('product.productionCycle')" prop="productionCycle">
                <ElInputNumber
                  v-model="productForm.productionCycle"
                  :min="0"
                  :max="9999999999"
                  class="w-[200px]"
                  :placeholder="$t('product.placeholder.productionCycle')"
                />
                <span class="ml-2">(周)</span>
              </ElFormItem>
            </ElCard>
            <!-- 其他信息 -->
            <ElCard shadow="never">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="text-base font-bold">
                    {{ $t('product.other') }}
                  </div>
                </div>
              </template>

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
            </ElCard>
          </div>
        </div>
      </ElForm>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
