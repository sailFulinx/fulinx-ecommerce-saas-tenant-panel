<script setup name="ProductDetail" lang="ts">
import type { InputInstance, TabPaneName } from 'element-plus'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import ProductAttribute from './Modules/ProductAttribute.vue'
import ProductBaseInfo from './Modules/ProductBaseInfo.vue'
import ProductFileInfo from './Modules/ProductFileInfo.vue'
import ProductLayoutInfo from './Modules/ProductLayoutInfo.vue'
import ProductParameter from './Modules/ProductParameter.vue'
import ProductSeoInfo from './Modules/ProductSeoInfo.vue'
import ProductSlugInfo from './Modules/ProductSlugInfo.vue'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const languageId = ref(selectLanguage.value.id)

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  list: false,
})

const listSystemCategoryPayload = reactive<SystemCategoryListParams>({
  languageId: languageId.value,
  systemCategoryName: undefined,
})

const { listData: systemCategoryListData, promise: systemCategoryPromise }
  = useSystemCategoryList(listSystemCategoryPayload)

const listCategoryPayload = reactive<CategoryListParams>({
  languageId: languageId.value,
  categoryName: undefined,
})

const { listData: categoryListData, promise: categoryPromise } = useCategoryList(listCategoryPayload)

const { listData: productSourceTypeListData, promise: productSourceTypePromise } = useProductSourceTypeList()

const { listData: ageGroupTypeListData, promise: ageGroupPromise } = useAgeGroupTypeList()

const { listData: genderTypeListData, promise: genderPromise } = useGenderTypeList()

const { listData: conditionTypeListData, promise: conditionPromise } = useConditionTypeList()

const { listData: brandListData, promise: brandPromise } = useBrandList()

const { listData: layoutTypeListData, promise: layoutPromise } = useLayoutTypeList()

const parameterPayload = reactive<ParameterListParams>({
  languageId: languageId.value,
  status: true,
})

const {
  loading: _parameterLoading,
  listData: parameterListData,
  promise: parameterPromise,
  getList: getParameterList,
} = useParameterList(parameterPayload)

const attributePayload = reactive<AttributeListParams>({
  languageId: usePreferenceStore().preference.language.id,
  status: true,
})

const {
  listData: attributeListData,
  promise: attributePromise,
  getList: getAttributeDataList,
} = useAttributeList(attributePayload)

const { listData: stockStatusListData, promise: stockStatusPromise } = useProductStockStatusList()

const { listData: warehouseListData, promise: warehousePromise } = useWarehouseList()

// 添加重量单位和长度单位列表数据
const { listData: weightUnitListData, promise: weightUnitPromise } = useWeightUnitList()
const { listData: lengthUnitListData, promise: lengthUnitPromise } = useLengthUnitList()

onMounted(async () => {
  // 设置初始化加载状态
  loading.init = true
  try {
    // 并行等待所有数据加载完成
    await Promise.all([
      productSourceTypePromise,
      stockStatusPromise,
      ageGroupPromise,
      genderPromise,
      conditionPromise,
      brandPromise,
      layoutPromise,
      parameterPromise,
      attributePromise,
      warehousePromise,
      weightUnitPromise,
      lengthUnitPromise,
    ])
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.init = false
  }
})

const createProductAdminLocalizedViewDo = ref<ProductAdminLocalizedViewDo>({
  languageId: '',
  languageCode: '',
  languageName: '',
  productCategoryRelationListResultDos: [
    {
      id: '',
      productId: '',
      categoryId: '',
      categoryName: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
  ],
  productSystemCategoryRelationListResultDos: [
    {
      id: '',
      productId: '',
      systemCategoryId: '',
      systemCategoryName: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
  ],
  productDetailListResultDo: {
    id: '',
    productId: '',
    languageId: '',
    productName: '',
    productShortName: '',
    productDescription: '',
    productShortDescription: '',
    customs: '',
    customList: [],
    layoutType: 0,
    layoutTypeLabel: '',
    devComponentName: '',
    layoutContent: '',
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
  },
  productParameterRelationListResultDos: [
    {
      id: '',
      productId: '',
      languageId: '',
      parameterGroupId: '',
      parameterGroupName: '',
      parameterId: '',
      parameterType: 0,
      parameterName: '',
      parameterValueId: '',
      parameterValueContent: '',
      sort: 0,
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
  ],
  productFileRelationListResultDos: [
    {
      id: '',
      productId: '',
      languageId: '',
      productFileType: 0,
      fileId: '',
      fileVo: {
        id: '',
        bucketName: '',
        etag: '',
        s3Key: '',
        isPublic: true,
        originalFileName: '',
        fileName: '',
        fileContentType: '',
        fileExtensionName: '',
        fileSize: '',
        path: '',
        fileUrl: '',
        sha256: '',
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: '',
      },
      isDefault: true,
      sort: 0,
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
  ],
  productSeoListResultDo: {
    id: '',
    productId: '',
    languageId: '',
    metaTitle: '',
    metaDescription: '',
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
  },
  productTagListResultDos: [
    {
      id: '',
      productId: '',
      languageId: '',
      tagName: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
  ],
})

// 创建product请求参数
const createFormData = (): ShowProduct & CommonField => {
  return {
    id: '',
    spu: '',
    productType: null,
    productTypeLabel: '',
    onlineTime: '',
    offlineTime: '',
    brandId: '',
    brandListResultDo: {
      id: '',
      languageId: '',
      brandName: '',
      brandDescription: '',
      brandFileId: '',
      brandFileVo: {
        id: '',
        bucketName: '',
        etag: '',
        s3Key: '',
        isPublic: true,
        originalFileName: '',
        fileName: '',
        fileContentType: '',
        fileExtensionName: '',
        fileSize: '',
        path: '',
        fileUrl: '',
        sha256: '',
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: '',
      },
      slugId: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      status: true,
      isCustomLayout: true,
      layoutId: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    stockStatus: null,
    stockStatusLabel: '',
    sort: 0,
    isTop: true,
    status: true,
    systemStatus: null,
    systemStatusLabel: '',
    productSourceType: null,
    productSourceTypeLabel: '',
    isAdult: true,
    ageGroupType: 0,
    ageGroupTypeLabel: '',
    genderType: null,
    genderTypeLabel: '',
    conditionType: null,
    conditionTypeLabel: '',
    categoryIds: [],
    systemCategoryIds: [],
    productAdminLocalizedViewDos: [],
    productAttributeListResultDo: {
      id: '',
      productId: '',
      languageId: '',
      attributeSummary: '',
      searchIndex: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    productSkuListResultDos: [],
    productSupplierListResultDos: [],
    productRelatedListResultDos: [],
    slugId: '',
    slug: '',
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
  }
}

const categoryNames = ref<string[]>([])

const systemCategoryNames = ref<string[]>([])

// form初始化
const form = reactive<ShowProduct & CommonField>(createFormData())

const productSkuRequestDo = ref<ProductSkuRequestDo>({
  stockStatus: 1,
  spu: '',
  currencyId: '',
  productAttributeRequestDo: {
    attributeSummaryDos: [],
    searchIndex: '',
  },
  productSkuItemRequestDos: [],
})

const resetFormData = async (val: ShowProduct) => {
  await nextTick(() => {
    categoryNames.value = []
    systemCategoryNames.value = []
    Object.assign(form, JSON.parse(JSON.stringify(val)))
    const categoryNameList: string[] = []
    const systemCategoryNameList: string[] = []
    if (form.productAdminLocalizedViewDos && form.productAdminLocalizedViewDos.length > 0) {
      form.productAdminLocalizedViewDos.forEach(item => {
        item.categoryNameList = []
        item.systemCategoryNameList = []
        if (item.productCategoryRelationListResultDos && item.productCategoryRelationListResultDos.length > 0) {
          item.productCategoryRelationListResultDos.forEach(cItem => {
            if (item.languageId === languageId.value) {
              categoryNameList.push(cItem.categoryName)
            }
          })
        }
        if (
          item.productSystemCategoryRelationListResultDos
          && item.productSystemCategoryRelationListResultDos.length > 0
        ) {
          item.productSystemCategoryRelationListResultDos.forEach(cItem => {
            if (item.languageId === languageId.value) {
              systemCategoryNameList.push(cItem.systemCategoryName)
            }
          })
        }
        item.categoryNameList = categoryNameList
        item.systemCategoryNameList = systemCategoryNameList
        if (item.languageId === languageId.value) {
          categoryNames.value = item.categoryNameList
          systemCategoryNames.value = item.systemCategoryNameList
        }
        if (!item.productDetailListResultDo) {
          return
        }
        if (item.productDetailListResultDo.customs) {
          const customData = JSON.parse(item.productDetailListResultDo.customs)
          if (customData && customData.length) {
            item.productDetailListResultDo.customList = customData
          }
        } else {
          item.productDetailListResultDo.customList = []
        }
      })
    }

    productSkuRequestDo.value.spu = form.spu
    productSkuRequestDo.value.stockStatus = form.stockStatus as number
    let currencyId = ''
    if (form.productSkuListResultDos && form.productSkuListResultDos.length > 0) {
      currencyId = form.productSkuListResultDos[0].currencyId
    }
    productSkuRequestDo.value.currencyId = currencyId

    // 安全解析 attributeSummary
    try {
      if (form.productAttributeListResultDo?.attributeSummary) {
        productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos = JSON.parse(
          form.productAttributeListResultDo.attributeSummary,
        )
      } else {
        productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos = []
      }
    } catch (error) {
      console.error('Failed to parse attributeSummary:', error)
      productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos = []
    }

    // 清空原有的SKU数据，避免重复添加
    productSkuRequestDo.value.productSkuItemRequestDos = []

    // 将 productData.productSkuListResultDos 转换并赋值给 productSkuRequestDo.value.productSkuItemRequestDos
    form.productSkuListResultDos.forEach(sku => {
      productSkuRequestDo.value.productSkuItemRequestDos.push({
        id: sku.id,
        productId: sku.productId,
        skuImageFileId: sku.skuImageFileId,
        skuImageFileVo: sku.skuImageFileVo,
        skuCode: sku.skuCode,
        currencyId: sku.currencyId,
        price: sku.price,
        costPrice: sku.costPrice,
        promotionPrice: sku.promotionPrice,
        promotionStartedTime: sku.promotionStartedTime,
        promotionEndedTime: sku.promotionEndedTime,
        isRequiredShipping: sku.isRequiredShipping,
        weight: sku.weight,
        weightUnit: sku.weightUnit, // Convert number to string
        length: sku.length,
        width: sku.width,
        height: sku.height,
        lengthUnit: sku.lengthUnit, // Convert number to string
        mpn: sku.mpn,
        upc: sku.upc,
        ean: sku.ean,
        jan: sku.jan,
        isbn: sku.isbn,
        issn: sku.issn,
        status: sku.status,
        remark: sku.remark,
        productSkuAttributeRequestDos: sku.productSkuAttributeListResultDos
          ? sku.productSkuAttributeListResultDos.map(attr => ({
              id: attr.id,
              productSkuId: attr.productSkuId,
              languageId: attr.languageId,
              attributeId: attr.attributeId,
              attributeName: attr.attributeName,
              attributeValueId: attr.attributeValueId,
              attributeValueContent: attr.attributeValueContent,
            }))
          : [],
        productSkuInventoryRequestDos: sku.productSkuInventoryListResultDos
          ? sku.productSkuInventoryListResultDos.map(inv => ({
              id: inv.id,
              skuCode: sku.skuCode, // 添加必需的skuCode字段
              productSkuId: inv.productSkuId,
              warehouseId: inv.warehouseId,
              quantity: inv.quantity,
              lockedQuantity: inv.lockedQuantity,
              remark: inv.remark,
            }))
          : [],
      })
    })
  })
}

const handleChangeTab = async (pane: string) => {
  activeName.value = pane
}

const handleChangeLanguageTab = async (_name: TabPaneName) => {
  await resetFormData(form)
}

const showProductPayload = reactive<ShowProductParams>({
  id,
  languageId: selectLanguage.value.id,
})

// 获取数据
const getProductData = async () => {
  loading.init = true
  const { data } = await showProductApi(showProductPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
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
      languageId.value = val.id
      await systemCategoryPromise
      await categoryPromise
      await initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editProductStatus = async () => {
  loading.init = true
  const { data } = await updateProductStatusApi({
    productId: id,
    languageId: selectLanguage.value.id,
    status: form.status,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.edit'))
}

provide('productData', { form })
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('product.show') }}</span>
        </div>
        <div>
          <span class="text-sm mr-2">{{ $t('product.status') }}：</span>
          <ElSwitch v-model="form.status" @change="editProductStatus" />
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card flex flex-col h-[calc(100vh-120px)]">
      <div class="flex-none sticky top-0 bg-white z-20">
        <ElTabs v-model="languageId" @tab-change="handleChangeLanguageTab">
          <ElTabPane
            v-for="item in form.productAdminLocalizedViewDos"
            :key="item.languageId"
            :label="item.languageName"
            :name="item.languageId"
          >
            <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
              <ElTabPane :label="$t('product.base')" name="base" />
              <ElTabPane :label="$t('product.file')" name="file" />
              <ElTabPane :label="$t('product.priceQuantity')" name="priceQuantity" />
              <ElTabPane :label="$t('product.parameter')" name="parameter" />
              <ElTabPane :label="$t('product.seo')" name="seo" />
              <ElTabPane :label="$t('product.layout')" name="layout" />
              <ElTabPane :label="$t('product.slug')" name="slug" />
            </ElTabs>
          </ElTabPane>
        </ElTabs>
      </div>
      <div class="flex-1 overflow-auto pr-4 -mr-4">
        <div
          v-if="activeName === 'base' && form.productAdminLocalizedViewDos.some(item => item.languageId === languageId)"
        >
          <ProductBaseInfo
            v-model:product-admin-localized-view-dos="form.productAdminLocalizedViewDos"
            :product-data="form"
            :product-detail="
              form.productAdminLocalizedViewDos.find(item => item.languageId === languageId)
                || createProductAdminLocalizedViewDo
            "
            :language-id="languageId"
            :product-id="id"
            :system-category-names="systemCategoryNames"
            :system-category-list-data="systemCategoryListData"
            :category-names="categoryNames"
            :category-list-data="categoryListData"
            :product-source-type-list-data="productSourceTypeListData"
            :age-group-type-list-data="ageGroupTypeListData"
            :gender-type-list-data="genderTypeListData"
            :condition-type-list-data="conditionTypeListData"
            :brand-list-data="brandListData"
            :stock-status-list-data="stockStatusListData"
            @reset-form-data="resetFormData"
          />
        </div>
        <div
          v-if="activeName === 'file' && form.productAdminLocalizedViewDos.some(item => item.languageId === languageId)"
        >
          <ProductFileInfo
            :language-id="languageId"
            :product-detail="
              form.productAdminLocalizedViewDos.find(item => item.languageId === languageId)
                || createProductAdminLocalizedViewDo
            "
            :product-id="id"
            :product-data="form"
            @reset-form-data="resetFormData"
          />
        </div>
        <div
          v-if="
            activeName === 'parameter' && form.productAdminLocalizedViewDos.some(item => item.languageId === languageId)
          "
        >
          <ProductParameter
            :parameter-list-data="parameterListData"
            :parameter-payload="parameterPayload"
            :get-parameter-list="getParameterList"
            :language-id="languageId"
            :product-detail="
              form.productAdminLocalizedViewDos.find(item => item.languageId === languageId)
                || createProductAdminLocalizedViewDo
            "
            :product-id="id"
            :product-data="form"
            @reset-form-data="resetFormData"
          />
        </div>
        <div
          v-if="
            activeName === 'priceQuantity'
              && form.productAdminLocalizedViewDos.some(item => item.languageId === languageId)
          "
        >
          <ProductAttribute
            :language-id="languageId"
            :product-id="id"
            :attribute-payload="attributePayload"
            :attribute-list-data="attributeListData"
            :warehouse-list-data="warehouseListData"
            :stock-status-list-data="stockStatusListData"
            :weight-unit-list-data="weightUnitListData"
            :length-unit-list-data="lengthUnitListData"
            :get-attribute-data-list="getAttributeDataList"
            :product-sku-request-do="productSkuRequestDo"
            :product-data="form"
            :product-detail="
              form.productAdminLocalizedViewDos.find(item => item.languageId === languageId)
                || createProductAdminLocalizedViewDo
            "
            @reset-form-data="resetFormData"
          />
        </div>
        <div
          v-if="activeName === 'seo' && form.productAdminLocalizedViewDos.some(item => item.languageId === languageId)"
        >
          <ProductSeoInfo
            :language-id="languageId"
            :product-id="id"
            :product-detail="
              form.productAdminLocalizedViewDos.find(item => item.languageId === languageId)
                || createProductAdminLocalizedViewDo
            "
            @reset-form-data="resetFormData"
          />
        </div>
        <div
          v-if="
            activeName === 'layout' && form.productAdminLocalizedViewDos.some(item => item.languageId === languageId)
          "
        >
          <ProductLayoutInfo
            :product-data="form"
            :layout-type-list="layoutTypeListData.list"
            :language-id="languageId"
            :product-id="id"
            :product-detail="
              form.productAdminLocalizedViewDos.find(item => item.languageId === languageId)
                || createProductAdminLocalizedViewDo
            "
            @reset-form-data="resetFormData"
          />
        </div>
        <div
          v-if="activeName === 'slug' && form.productAdminLocalizedViewDos.some(item => item.languageId === languageId)"
        >
          <ProductSlugInfo
            :product-data="form"
            :slug="form.slug"
            :slug-id="form.slugId"
            :language-id="languageId"
            :product-id="id"
            :product-detail="
              form.productAdminLocalizedViewDos.find(item => item.languageId === languageId)
                || createProductAdminLocalizedViewDo
            "
            @reset-form-data="resetFormData"
          />
        </div>
      </div>
    </div>
  </div>
</template>
