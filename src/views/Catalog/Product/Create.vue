<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { datePickerShortcuts } from '@/data/date'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import AttributeForm from './Modules/AttributeForm.vue'
import ParameterForm from './Modules/ParameterForm.vue'
import SupplierForm from './Modules/SupplierForm.vue'

const { t: $t } = useLocale()

const pageTitle = $t('product.add')

const productFormRef = ref()

const containerRef = ref<HTMLElement>()

// 直接使用useAnchorScroll返回的currentHref，避免手动声明
const currentHref = ref('#productName')

// 定义锚点链接
const anchorLinks = [
  { href: '#productName', title: $t('product.base') },
  { href: '#productFile', title: $t('product.imageText') },
  { href: '#productOption', title: $t('product.option') },
  { href: '#productOther', title: $t('product.other') },
]

const handleUpdateActiveHref = (href: string) => {
  currentHref.value = href
}

const rules = reactive({
  languageId: [{ required: true, message: $t('common.placeholder.language'), trigger: 'change' }],
  systemCategoryId: [{ required: true, message: $t('product.placeholder.systemCategory'), trigger: 'change' }],
  productName: [{ required: true, message: $t('product.placeholder.productName'), trigger: 'blur' }],
  productType: [{ required: true, message: $t('product.placeholder.productType'), trigger: 'change' }],
})

const loading = reactive({
  init: false,
  button: false,
  supplier: false,
  category: false,
  parameterGroup: false,
  parameter: false,
})

// 使用原有的自定义Hook，但现在可以访问返回的promise
const { loading: productTypeLoading, listData: productTypeListData, promise: productTypePromise } = useProductTypeList()

const {
  loading: productSourceTypeLoading,
  listData: productSourceTypeListData,
  promise: productSourceTypePromise,
} = useProductSourceTypeList()

const { loading: ageGroupLoading, listData: ageGroupTypeListData, promise: ageGroupPromise } = useAgeGroupTypeList()

const { loading: genderLoading, listData: genderTypeListData, promise: genderPromise } = useGenderTypeList()

const { loading: conditionLoading, listData: conditionTypeListData, promise: conditionPromise } = useConditionTypeList()

const { loading: brandLoading, listData: brandListData, promise: brandPromise } = useBrandList()

// 系统分类
const listSystemCategoryPayload = reactive<SystemCategoryListParams>({
  languageId: usePreferenceStore().preference.language.id,
  systemCategoryName: null,
})

const systemCategoryProps = {
  value: 'id',
  label: 'systemCategoryName',
  multiple: false,
}

const systemCategoryIds = ref<string[]>([])

const handleChangeSystemCategory = (val: string[]) => {
  if (val && val.length > 0) {
    val.forEach(item => {
      const lastElement = item.at(-1) // 获取最后一个元素
      if (lastElement !== undefined) {
        // 检查是否为undefined
        systemCategoryIds.value.push(lastElement)
      }
    })
  }
}

const {
  loading: systemCategoryLoading,
  listData: listSystemCategoryData,
  promise: systemCategoryPromise,
} = useSystemCategoryList(listSystemCategoryPayload)

/**
 * 分类
 */
const listCategoryPayload = reactive<CategoryListParams>({
  languageId: usePreferenceStore().preference.language.id,
  categoryName: null,
})

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

const {
  loading: categoryLoading,
  listData: listCategoryData,
  promise: categoryPromise,
} = useCategoryList(listCategoryPayload)

// 类型转换函数，将 SystemCategoryData[] 转换为 CascaderOption[] 兼容格式
const convertSystemCategoryToCascaderOptions = (categories: SystemCategoryData[]): any[] => {
  return categories.map(category => ({
    ...category,
    value: category.id,
    label: category.systemCategoryName,
    children: category.children ? convertSystemCategoryToCascaderOptions(category.children) : undefined,
  }))
}

// 类型转换函数，将 CategoryData[] 转换为 CascaderOption[] 兼容格式
const convertCategoryToCascaderOptions = (categories: CategoryData[]): any[] => {
  return categories.map(category => ({
    ...category,
    value: category.id,
    label: category.categoryName,
    children: category.children ? convertCategoryToCascaderOptions(category.children) : undefined,
  }))
}

onMounted(async () => {
  // 设置初始化加载状态
  loading.init = true
  try {
    // 并行等待所有数据加载完成
    await Promise.all([
      productTypePromise,
      productSourceTypePromise,
      ageGroupPromise,
      genderPromise,
      conditionPromise,
      systemCategoryPromise,
      categoryPromise,
      brandPromise,
    ])
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.init = false
  }
})

const editorRef = ref()

const attributeFormRef = ref()

const parameterFormRef = ref()

const supplierFormRef = ref()

const imageUploadRef = ref()

const videoUploadRef = ref()

const createProductForm = (): CreateProductParams => {
  return {
    languageId: usePreferenceStore().preference.language.id,
    spu: '',
    productType: undefined,
    onlineTime: '',
    offlineTime: '',
    brandId: '',
    productSourceType: undefined,
    isAdult: false,
    ageGroupType: undefined,
    genderType: undefined,
    conditionType: undefined,
    systemCategoryId: '',
    productName: '',
    productShortName: '',
    productDescription: '',
    productShortDescription: '',
    metaTitle: '',
    metaDescription: '',
    categoryIds: [],
    productFileRequestDos: [],
    currencyId: '',
    productSkuRequestDo: {
      stockStatus: 1,
      spu: '',
      productAttributeRequestDo: {
        attributeSummaryDos: [],
        searchIndex: '',
      },
      productSkuItemRequestDos: [],
    },
    productParameterRelationRequestDos: [],
    productRelatedRequestDos: [],
    productSupplierRequestDos: [],
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
  productForm.productParameterRelationRequestDos = []
  productForm.languageId = usePreferenceStore().preference.language.id
  productForm.currencyId = usePreferenceStore().preference.currency.id
  // productForm.parameterGroupId = selectedParameterGroup.value
  const images = imageUploadRef.value.getFileData()
  productForm.productFileRequestDos = images.fileDataList
  productForm.productFileRequestDos?.map(item => {
    item.productFileType = 1
    return item
  })

  if (categoryIds.value && categoryIds.value.length > 0) {
    productForm.categoryIds = categoryIds.value
  }

  productForm.productParameterRelationRequestDos = parameterFormRef.value.getData

  productForm.productSupplierRequestDos = supplierFormRef.value.getData

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

provide('ProductCreate', { productForm })
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
      <ElForm ref="productFormRef" :model="productForm" :rules="rules" label-width="100px">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3 bg-white pa-4">
            AI
          </div>
          <div class="col-span-9">
            <div class="w-full mb-4 bg-white">
              <TailwindAnchor
                v-model:active-href="currentHref"
                :links="anchorLinks"
                :container="containerRef"
                direction="horizontal"
                :offset="10"
                class="pa-4"
                @update:active-href="handleUpdateActiveHref"
              />
            </div>
            <div ref="containerRef" class="w-full container-custom">
              <!-- 基础 -->
              <div id="productName" class="bg-white mb-5 pa-4">
                <div class="w-full fs-16px font-bold mb-4">
                  基础信息
                </div>
                <div class="w-full">
                  <!-- 系统分类 -->
                  <ElFormItem :label="$t('product.systemCategory')" prop="systemCategoryId">
                    <ElCascader
                      v-model="productForm.systemCategoryId"
                      clearable
                      filterable
                      :placeholder="`${$t('product.placeholder.systemCategory')}`"
                      :loading="systemCategoryLoading"
                      :props="systemCategoryProps"
                      :options="convertSystemCategoryToCascaderOptions(listSystemCategoryData.list)"
                      @change="handleChangeSystemCategory"
                    />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.productType')" prop="productType">
                    <ElSelect
                      v-model="productForm.productType"
                      v-loading="productTypeLoading"
                      clearable
                      filterable
                      placeholder="请选择"
                    >
                      <ElOption
                        v-for="item in productTypeListData?.list || []"
                        :key="item.id"
                        :value="item.id"
                        :label="item.productTypeName"
                      />
                    </ElSelect>
                  </ElFormItem>
                  <!-- 产品名称 -->
                  <ElFormItem :label="$t('product.productName')" prop="productName">
                    <ElInput
                      v-model="productForm.productName"
                      clearable
                      minlength="1"
                      maxlength="120"
                      :placeholder="$t('product.placeholder.productName')"
                    />
                  </ElFormItem>
                  <!-- 产品短名称 -->
                  <ElFormItem :label="$t('product.productShortName')" prop="productShortName">
                    <ElInput
                      v-model="productForm.productShortName"
                      clearable
                      minlength="1"
                      maxlength="120"
                      :placeholder="$t('product.placeholder.productShortName')"
                    />
                  </ElFormItem>
                </div>
              </div>
              <!-- 图片 -->
              <div id="productFile" class="bg-white mb-5 pa-4">
                <div class="w-full fs-16px font-bold mb-4">
                  图文信息
                </div>
                <ElFormItem :label="$t('product.productImage')" required>
                  <UploadMultiImage ref="imageUploadRef" />
                </ElFormItem>
                <ElFormItem :label="$t('product.video')" required>
                  <UploadVideo ref="videoUploadRef" />
                </ElFormItem>
                <ElFormItem :label="$t('product.productShortDescription')" prop="productShortDescription">
                  <ElInput
                    v-model="productForm.productShortDescription"
                    clearable
                    minlength="1"
                    maxlength="120"
                    :placeholder="$t('product.placeholder.productShortDescription')"
                  />
                </ElFormItem>
                <ElFormItem :label="$t('product.productDescription')" prop="articleDescription">
                  <Editor ref="editorRef" v-model="productForm.productDescription" />
                </ElFormItem>
              </div>
              <!-- 规格 -->
              <div id="productOption" class="bg-white mb-5 pa-4">
                <div class="w-full fs-16px font-bold mb-4">
                  价格库存
                </div>
                <AttributeForm ref="attributeFormRef" />
              </div>
              <!-- 其它 -->
              <div id="productOther" class="bg-white mb-5 pa-4">
                <div class="w-full fs-16px font-bold mb-4">
                  其他信息
                </div>
                <div class="w-full">
                  <!-- 产品分类 -->
                  <ElFormItem :label="$t('product.category')" prop="category">
                    <ElCascader
                      v-model="productForm.categoryIds"
                      clearable
                      filterable
                      :loading="categoryLoading"
                      :props="categoryProps"
                      :options="convertCategoryToCascaderOptions(listCategoryData.list)"
                      @change="handleChangeCategory"
                    />
                  </ElFormItem>
                  <!-- 参数 -->
                  <ElFormItem :label="$t('product.parameter')" prop="parameter">
                    <ParameterForm ref="parameterFormRef" />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.metaTitle')" prop="metaTitle">
                    <ElInput
                      v-model="productForm.metaTitle"
                      clearable
                      minlength="1"
                      maxlength="120"
                      :placeholder="$t('product.placeholder.metaTitle')"
                    />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.metaDescription')" prop="metaDescription">
                    <ElInput
                      v-model="productForm.metaDescription"
                      clearable
                      minlength="1"
                      maxlength="120"
                      :placeholder="$t('product.placeholder.metaDescription')"
                    />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.productShortDescription')" prop="productShortDescription">
                    <ElInput
                      v-model="productForm.productShortDescription"
                      clearable
                      minlength="1"
                      maxlength="120"
                      :placeholder="$t('product.placeholder.productShortDescription')"
                    />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.onlineTime')" prop="onlineTime">
                    <ElDatePicker
                      v-model="productForm.onlineTime"
                      clearable
                      type="datetime"
                      :placeholder="`${$t('product.placeholder.onlineTime')}`"
                      :shortcuts="datePickerShortcuts"
                    />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.offlineTime')" prop="offlineTime">
                    <ElDatePicker
                      v-model="productForm.offlineTime"
                      clearable
                      type="datetime"
                      :placeholder="`${$t('product.placeholder.offlineTime')}`"
                      :shortcuts="datePickerShortcuts"
                    />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.brand')" prop="brandId">
                    <ElSelect
                      v-model="productForm.brandId"
                      v-loading="brandLoading"
                      clearable
                      filterable
                      :placeholder="`${$t('product.placeholder.brand')}`"
                    >
                      <ElOption
                        v-for="item in brandListData?.list || []"
                        :key="item.id"
                        :value="item.id"
                        :label="item.brandName"
                      />
                    </ElSelect>
                  </ElFormItem>
                  <ElFormItem :label="$t('product.supplier')" prop="supplierId">
                    <SupplierForm ref="supplierFormRef" />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.isAdult')" prop="isAdult">
                    <ElSwitch v-model="productForm.isAdult" />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.genderType')" prop="genderType">
                    <ElSelect
                      v-model="productForm.ageGroupType"
                      v-loading="genderLoading"
                      clearable
                      filterable
                      :placeholder="`${$t('product.placeholder.genderType')}`"
                    >
                      <ElOption
                        v-for="item in genderTypeListData?.list || []"
                        :key="item.id"
                        :value="item.id"
                        :label="item.genderTypeName"
                      />
                    </ElSelect>
                  </ElFormItem>
                  <ElFormItem :label="$t('product.conditionType')" prop="conditionType">
                    <ElSelect
                      v-model="productForm.conditionType"
                      v-loading="conditionLoading"
                      clearable
                      filterable
                      placeholder="请选择"
                    >
                      <ElOption
                        v-for="item in conditionTypeListData?.list || []"
                        :key="item.id"
                        :value="item.id"
                        :label="item.conditionTypeName"
                      />
                    </ElSelect>
                  </ElFormItem>
                  <ElFormItem :label="$t('product.ageGroupType')" prop="ageGroupType">
                    <ElSelect
                      v-model="productForm.ageGroupType"
                      v-loading="ageGroupLoading"
                      clearable
                      filterable
                      placeholder="请选择"
                    >
                      <ElOption
                        v-for="item in ageGroupTypeListData?.list || []"
                        :key="item.id"
                        :value="item.id"
                        :label="item.ageGroupTypeName"
                      />
                    </ElSelect>
                  </ElFormItem>
                  <ElFormItem :label="$t('product.productSourceType')" prop="productSourceType">
                    <ElSelect
                      v-model="productForm.productSourceType"
                      v-loading="productSourceTypeLoading"
                      clearable
                      filterable
                      placeholder="请选择"
                    >
                      <ElOption
                        v-for="item in productSourceTypeListData?.list || []"
                        :key="item.id"
                        :value="item.id"
                        :label="item.productSourceTypeName"
                      />
                    </ElSelect>
                  </ElFormItem>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ElForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container-custom {
  height: calc(100vh - 286px); // 调整高度计算，减少减去的值
  overflow-y: auto;
}

:deep(.el-card__header) {
  padding: 10px;
}
</style>
