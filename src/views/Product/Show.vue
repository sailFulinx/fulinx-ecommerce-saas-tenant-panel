<script setup name="ProductDetail" lang="ts">
import {
  showProductApi,
} from '@/api/product'
import { getProductTypeLabel, productTypes } from '@/data/product'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElAlert, ElCard, ElForm, ElInput, ElMessage, ElSwitch, ElTabPane } from 'element-plus'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  list: false,
})

const listProductValueQuery = reactive<ProductProductValueListParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  productId: id,
  pageSize: 20,
  pageNumber: 1,
})
const selectedProductValueList = ref<string[]>([])

const selectedProductValueItem = (val: (ProductValueListData & CommonField)[]) => {
  selectedProductValueList.value = []
  val.forEach(item => {
    selectedProductValueList.value.push(item.id)
  })
}

const listProductValueResult = ref<TableResponse<ProductValueListData & CommonField>>({
  list: [],
  total: 0,
})

const getProductValueList = async () => {
  loading.list = true
  const { data } = await productValueListApi(listProductValueQuery).catch(err => {
    loading.list = false
    throw err
  })
  listProductValueResult.value = data
  loading.list = false
}

const paginationProductValue = (val: PaginationComponentDataType) => {
  if (val) {
    listProductValueQuery.pageSize = val.limit
    listProductValueQuery.pageNumber = val.page
  }
  getProductValueList()
}

const productValueDialogRef = ref()

const productValueFormRef = ref()

const productValueDialogVisible = ref(false)

const handleCreateProductValue = () => {
  productValueDialogVisible.value = true
}

const productValueForm = reactive<CreateProductValueParams>({
  productId: id,
  productValueDetailId: '',
  productValueContent: '',
  languageId: selectLanguage.value.id,
})

const productValueFormRules = {
  productValueContent: [
    { required: true, message: $t('product.placeholder.productValueContent'), trigger: 'blur' },
  ],
}

const isEditProductValue = ref<boolean>(false)

const handleEditProductValue = (item: ProductValueListData & CommonField) => {
  productValueForm.productValueContent = item.productValueContent
  productValueForm.productValueDetailId = item.productValueDetailId
  productValueDialogVisible.value = true
  isEditProductValue.value = true
}

const handleSubmitProductValue = async () => {
  const isValid = await useValidForm(productValueFormRef.value)
  console.log(isValid)
  if (!isValid) {
    return
  }
  productValueForm.productValueContent = productValueForm.productValueContent.trim()
  loading.list = true
  if (!isEditProductValue.value) {
    await createProductValueApi(productValueForm).catch(error => {
      loading.list = false
      throw error
    })
  } else {
    await updateProductValueDetailProductValueContentApi(productValueForm).catch(error => {
      loading.list = false
      throw error
    })
  }
  isEditProductValue.value = false
  productValueDialogVisible.value = false
  await getProductValueList()
}

const handleDeleteProductValue = async (item: ProductValueListData & CommonField) => {
  const deletedIds = [item.id]
  loading.list = true
  await removeProductValueApi({
    productValueIds: deletedIds,
  }).catch(error => {
    loading.list = false
    throw error
  })
  await getProductValueList()
  ElMessage.success($t('success.remove'))
}

const handleMultiDeleteProductValue = async () => {
  const deletedIds = selectedProductValueList.value
  loading.list = true
  await removeProductValueApi({
    productValueIds: deletedIds,
  }).catch(error => {
    loading.list = false
    throw error
  })
  await getProductValueList()
  selectedProductValueList.value = []
  ElMessage.success($t('success.remove'))
}

const handleChangeTab = async (pane: string) => {
  if (pane === 'productValue') {
    await getProductValueList()
  }
}

// 创建product请求参数
const createFormData = (): ProductShow & CommonField => {
  return {
    id: '',
    productType: 0,
    productDetailListResultDo: {
      id: '',
      productId: '',
      languageId: '',
      productName: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
  }
}

// form初始化
const form = reactive<ProductShow>(createFormData())

const showProductPayload = reactive<ShowProductParams>({
  productId: id,
  languageId: selectLanguage.value.id,
})

// 获取文章数据
const getProductData = async () => {
  loading.init = true
  const { data } = await showProductApi(showProductPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: ProductShow) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
  })
}

const initFormData = async () => {
  const res = await getProductData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  async val => {
    if (val) {
      selectLanguage.value = val
      showProductPayload.languageId = val.id
      await initFormData()
    }
  },
  { immediate: true },
)

// 更新名称
const inputProductNameVisible = ref<boolean>(false)
const currentProductName = ref<string>('')
const handleClickUpdateProductName = (productName: string) => {
  currentProductName.value = productName
  inputProductNameVisible.value = true
}
const handleCancelUpdateProductName = () => {
  inputProductNameVisible.value = false
}
const editProductName = async (productDetailId: string) => {
  if (!currentProductName.value) {
    ElMessage.warning($t('product.error.productName'))
    return
  }
  loading.init = true
  const { data } = await updateProductDetailProductNameApi({
    productName: currentProductName.value,
    productDetailId,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentProductName.value = ''
  await resetFormData(data)
  inputProductNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新名称新增时
const createProductName = async () => {
  if (!currentProductName.value) {
    ElMessage.warning($t('product.error.productName'))
    return
  }
  loading.init = true
  const { data } = await createProductDetailApi({
    productName: currentProductName.value,
    productId: id,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentProductName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

const editProductTypeVisible = ref<boolean>(false)

// 更新参数类型
const editProductType = async () => {
  const payload = {
    productId: id,
    languageId: selectLanguage.value.id,
    productType: form.productType,
  }
  await updateProductTypeApi(payload).catch(error => {
    throw error
  })
  ElMessage.success($t('success.edit'))
  editProductTypeVisible.value = false
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('product.show') }}</span>
        </div>
        <div />
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
        <ElTabPane :label="$t('product.base')" name="base">
          <ElCard v-if="form.productDetailListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div class="w-full grid grid-cols-12 gap-8 p-4">
                <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
                  {{ $t('product.productName') }} :
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <div v-if="!inputProductNameVisible" class="mr-2 flex">
                    <div class="mr-1">
                      {{ form.productDetailListResultDo.productName }}
                    </div>
                    <EBtn
                      type="primary"
                      text
                      @click="handleClickUpdateProductName(form.productDetailListResultDo.productName)"
                    >
                      <Icon icon="ep:edit" :size="4" class="mr-1" />
                    </EBtn>
                  </div>
                  <div v-else>
                    <ElInput
                      v-model="currentProductName"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editProductName(form.productDetailListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateProductName">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </div>
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
                  {{ $t('product.productType') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <div v-if="!editProductTypeVisible" class="mr-2 flex">
                    <div class="mr-1">
                      {{ getProductTypeLabel(form.productType) }}
                    </div>
                    <EBtn
                      type="primary"
                      text
                      @click="editProductTypeVisible = true"
                    >
                      <Icon icon="ep:edit" :size="4" class="mr-1" />
                    </EBtn>
                  </div>
                  <div v-else>
                    <ElSelect v-model="form.productType" :placeholder="$t('product.placeholder.productType')" style="width:120px" @change="editProductType">
                      <ElOption
                        v-for="item in productTypes"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </ElSelect>
                  </div>
                </div>
              </div>
            </div>
          </ElCard>
          <ElCard v-else>
            <div class="flex justify-center items-center mb-5">
              <ElAlert :title="$t('product.warning.noDetailData')" type="warning" show-icon />
            </div>
            <div class="flex justify-center items-center mb-5">
              <ElInput v-model="currentProductName" :placeholder="$t('product.placeholder.productName')" />
              <EBtn type="primary" class="ml-5" @click="createProductName">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane v-if="form.productType === 1 || form.productType === 3" :label="$t('product.productValue')" name="productValue">
          <div class="flex justify-between items-center mb-5">
            <div>
              参数值列表
            </div>
            <div>
              <EBtn type="primary" @click="handleCreateProductValue">
                添加参数值
              </EBtn>
              <EBtn type="danger" @click="handleMultiDeleteProductValue">
                删除参数值
              </EBtn>
            </div>
          </div>
          <ElTable
            v-loading="loading.list"
            :data="listProductValueResult.list"
            row-key="id"
            tooltip-effect="dark"
            default-expand-all
            highlight-current-row
            border
            @selection-change="selectedProductValueItem"
          >
            <ElTableColumn type="selection" width="55" />
            <ElTableColumn :label="$t('product.productValueContent')">
              <template #default="scope">
                <span>{{ scope.row.productValueContent }}</span>
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
              <template #default="scope">
                <span class="mr-5">
                  <EBtn size="small" @click="handleEditProductValue(scope.row)">
                    <Icon icon="ep:edit" class="mr-1" />
                    {{ $t('common.edit') }}
                  </EBtn>
                </span>
                <span>
                  <EBtn size="small" type="danger" @click="handleDeleteProductValue(scope.row)">
                    <Icon icon="ep:delete" class="mr-1" />
                    {{ $t('common.remove') }}
                  </EBtn>
                </span>
              </template>
            </ElTableColumn>
          </ElTable>
          <Pagination
            v-show="listProductValueResult.total > 0"
            v-model:page="listProductValueQuery.pageNumber"
            v-model:limit="listProductValueQuery.pageSize"
            :total="listProductValueResult.total"
            @pagination="paginationProductValue"
          />
        </ElTabPane>
      </ElTabs>
      <ElDialog ref="productValueDialogRef" v-model="productValueDialogVisible" title="添加参数值">
        <ElForm ref="productValueFormRef" :model="productValueForm" :rules="productValueFormRules" label-width="120px">
          <ElFormItem :label="$t('product.productValueContent')" prop="productValueContent">
            <ElInput v-model="productValueForm.productValueContent" :placeholder="$t('product.placeholder.productValueContent')" />
          </ElFormItem>
        </ElForm>
        <template #footer>
          <div class="dialog-footer">
            <EBtn @click="productValueDialogVisible = false">
              {{ $t('common.cancel') }}
            </EBtn>
            <EBtn type="primary" @click="handleSubmitProductValue">
              {{ $t('common.submit') }}
            </EBtn>
          </div>
        </template>
      </ElDialog>
    </div>
  </div>
</template>
