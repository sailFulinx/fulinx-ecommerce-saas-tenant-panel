<script setup name="ProductDetail" lang="ts">
import { createProductDetailApi, showProductApi, updateProductNameApi, updateProductStatusApi } from '@/api/product'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElAlert, ElCard, ElForm, ElInput, ElMessage, ElSwitch, ElTabPane } from 'element-plus'
import Base from './Modules/Base.vue'
import Image from './Modules/Image.vue'
import Parameter from './Modules/Parameter.vue'
import Price from './Modules/Price.vue'
import Seo from './Modules/Seo.vue'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  list: false,
})

const handleChangeTab = async (pane: string) => {
  console.log(pane)
}

// 创建product请求参数
const createFormData = (): ShowProduct & CommonField => {
  return {
    id: '',
    sku: '',
    mpn: '',
    productType: 0,
    isCustomLayout: true,
    isRequiredShipping: true,
    isSettingOnlineTime: true,
    onlineTime: '',
    isSettingOfflineTime: true,
    offlineTime: '',
    sort: '',
    inStockQuantity: 0,
    processingQuantity: 0,
    processingDays: 0,
    productionCycle: 0,
    supplierId: '',
    parameterGroupId: '',
    supplierShowResultDo: {
      id: '',
      status: true,
      isCustomLayout: true,
      layoutId: '',
      supplierDetailListResultDo: {
        id: '',
        supplierId: '',
        languageId: '',
        supplierName: '',
        supplierDescription: '',
        supplierFileId: '',
        supplierFileVo: {
          id: '',
          fileRemoteType: 0,
          bucket: '',
          originalPath: '',
          originalFileName: '',
          fileName: '',
          fileContentType: '',
          fileExtensionName: '',
          fileWidth: 0,
          fileHeight: 0,
          etag: '',
          bucketKey: '',
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
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: '',
      },
      supplierSeoListResultDo: {
        id: '',
        supplierId: '',
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
      slugId: '',
      slug: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    layoutId: '',
    status: true,
    productCategoryRelationListResultDos: [
      {
        id: '',
        productId: '',
        categoryId: '',
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: '',
      },
    ],
    productImages: [
      {
        id: '',
        productId: '',
        productFileType: 0,
        fileId: '',
        fileVo: {
          id: '',
          fileRemoteType: 0,
          bucket: '',
          originalPath: '',
          originalFileName: '',
          fileName: '',
          fileContentType: '',
          fileExtensionName: '',
          fileWidth: 0,
          fileHeight: 0,
          etag: '',
          bucketKey: '',
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
    productMeasureListResultDo: {
      id: '',
      productId: '',
      weightType: 0,
      weight: 0,
      lengthType: 0,
      length: 0,
      width: 0,
      height: 0,
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    productOtherListResultDo: {
      id: '',
      productId: '',
      productSourceType: 0,
      isAdult: true,
      ageGroupType: 0,
      genderType: 0,
      conditionType: 0,
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
        parameterGroupId: '',
        parameterGroupName: '',
        parameterId: '',
        parameterType: 0,
        parameterName: '',
        parameterValueId: '',
        parameterValueContent: '',
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: '',
      },
    ],
    productPriceListResultDos: [
      {
        id: '',
        productId: '',
        currencyId: '',
        currencyVo: {
          id: '',
          countryName: '',
          currencyName: '',
          currencyCode: '',
          symbolLeft: '',
          symbolRight: '',
          decimalPlace: 0,
          isHot: true,
          sort: 0,
          recordVersion: 0,
          isDelete: 0,
          remark: '',
          recordCreateName: '',
          recordUpdateName: '',
          recordCreateTime: '',
          recordUpdateTime: '',
        },
        orderQuantity: 0,
        price: 0,
        isSettingSalePrice: true,
        salePrice: 0,
        salePriceStartedAt: '',
        isSettingSaleEndedTime: true,
        salePriceEndedAt: '',
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
    slugId: '',
    slug: '',
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
    productDetailListResultDo: {
      id: '',
      productId: '',
      languageId: '',
      productName: '',
      shortDescription: '',
      productDescription: '',
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
  }
}

// form初始化
const form = reactive<ShowProduct & CommonField>(createFormData())

const showProductPayload = reactive<ShowProductParams>({
  productId: id,
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

const resetFormData = async (val: ShowProduct) => {
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

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
        <ElTabPane :label="$t('product.base')" name="base">
          <Base :form="form" @reset-form-data="resetFormData" />
        </ElTabPane>
        <ElTabPane :label="$t('product.price')" name="price">
          <Price :form="form" @reset-form-data="resetFormData" />
        </ElTabPane>
        <ElTabPane :label="$t('product.parameter')" name="parameter">
          <Parameter :form="form" @reset-form-data="resetFormData" />
        </ElTabPane>
        <ElTabPane :label="$t('product.image')" name="image">
          <Image :form="form" @reset-form-data="resetFormData" />
        </ElTabPane>
        <ElTabPane :label="$t('product.seo')" name="seo">
          <Seo :form="form" @reset-form-data="resetFormData" />
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>
