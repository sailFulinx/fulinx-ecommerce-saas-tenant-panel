<script setup name="ProductDetail" lang="ts">
import type { InputInstance, TabPaneName } from 'element-plus'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import FileInfo from './Modules/FileInfo.vue'
import ProductAttribute from './Modules/ProductAttribute.vue'
import ProductBaseInfo from './Modules/ProductBaseInfo.vue'
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

const {
  listData: stockStatusListData,
  promise: stockStatusPromise,
} = useProductStockStatusList()

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
    productAdminLocalizedViewDos: [
      {
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
      },
    ],
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
    productSkuListResultDos: [
      {
        id: '',
        productId: '',
        skuImageFileId: '',
        skuCode: '',
        currencyId: '',
        price: 0,
        costPrice: 0,
        promotionPrice: 0,
        promotionStartedTime: '',
        promotionEndedTime: '',
        isRequiredShipping: true,
        weight: 0,
        weightUnit: 0,
        length: 0,
        width: 0,
        height: 0,
        lengthUnit: 0,
        mpn: '',
        upc: '',
        ean: '',
        jan: '',
        isbn: '',
        issn: '',
        status: true,
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: '',
        productSkuAttributeListResultDos: [
          {
            id: '',
            productSkuId: '',
            languageId: '',
            attributeId: '',
            attributeName: '',
            attributeSort: 0,
            attributeValueId: '',
            attributeValueContent: '',
            attributeValueSort: 0,
            isDelete: 0,
            remark: '',
            recordVersion: 0,
            recordCreateName: '',
            recordUpdateName: '',
            recordCreateTime: '',
            recordUpdateTime: '',
          },
        ],
        productSkuInventoryListResultDos: [
          {
            id: '',
            productId: '',
            productSkuId: '',
            warehouseId: '',
            quantity: 0,
            lockedQuantity: 0,
            isDelete: 0,
            remark: '',
            recordVersion: 0,
            recordCreateName: '',
            recordUpdateName: '',
            recordCreateTime: '',
            recordUpdateTime: '',
          },
        ],
      },
    ],
    productSupplierListResultDos: [
      {
        id: '',
        productId: '',
        supplierId: '',
        supplierUrl: '',
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: '',
      },
    ],
    productRelatedListResultDos: [
      {
        id: '',
        productId: '',
        relatedProductId: '',
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
      await initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editProductStatus = async () => {
  // loading.init = true
  // const { data } = await updateProductStatusApi({
  //   productId: id,
  //   languageId: selectLanguage.value.id,
  //   status: form.status,
  // }).catch(error => {
  //   loading.init = false
  //   throw error
  // })
  // loading.init = false
  // await resetFormData(data)
  // ElMessage.success($t('success.edit'))
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
        <div v-for="item in form.productAdminLocalizedViewDos" :key="item.languageId">
          <div v-show="languageId === item.languageId">
            <div v-show="activeName === 'base'">
              <ProductBaseInfo
                v-model:product-admin-localized-view-dos="form.productAdminLocalizedViewDos"
                :product-data="form"
                :product-detail="item"
                :language-id="item.languageId"
                :product-id="id"
                :system-category-names="systemCategoryNames"
                :system-category-list-data="systemCategoryListData"
                :product-source-type-list-data="productSourceTypeListData"
                :age-group-type-list-data="ageGroupTypeListData"
                :gender-type-list-data="genderTypeListData"
                :condition-type-list-data="conditionTypeListData"
                :brand-list-data="brandListData"
                :stock-status-list-data="stockStatusListData"
                @refresh-data="initFormData"
              />
            </div>
            <div v-show="activeName === 'file'">
              <FileInfo :language-id="item.languageId" :product-detail="item" :product-id="id" :product-data="form" @refresh-data="initFormData" />
            </div>
            <div v-show="activeName === 'parameter'">
              <ProductParameter :parameter-list-data="parameterListData" :parameter-payload="parameterPayload" :get-parameter-list="getParameterList" :language-id="item.languageId" :product-detail="item" :product-id="id" :product-data="form" @refresh-data="initFormData" />
            </div>
            <div v-show="activeName === 'priceQuantity'">
              <ProductAttribute
                :language-id="item.languageId"
                :product-id="id"
                :attribute-payload="attributePayload"
                :attribute-list-data="attributeListData"
                :warehouse-list-data="warehouseListData"
                :stock-status-list-data="stockStatusListData"
                :weight-unit-list-data="weightUnitListData"
                :length-unit-list-data="lengthUnitListData"
                :get-attribute-data-list="getAttributeDataList"
                :product-data="form"
                @refresh-data="initFormData"
              />
            </div>
            <div v-show="activeName === 'seo'">
              <ProductSeoInfo :language-id="item.languageId" :product-id="id" :product-detail="item" @refresh-data="initFormData" />
            </div>
            <div v-show="activeName === 'layout'">
              <ProductLayoutInfo :product-data="form" :layout-type-list="layoutTypeListData.list" :language-id="item.languageId" :product-id="id" :product-detail="item" @refresh-data="initFormData" />
            </div>
            <div v-show="activeName === 'slug'">
              <ProductSlugInfo :product-data="form" :slug="form.slug" :slug-id="form.slugId" :language-id="item.languageId" :product-id="id" :product-detail="item" @refresh-data="initFormData" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
