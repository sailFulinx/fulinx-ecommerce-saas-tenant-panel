<script setup name="ProductDetail" lang="ts">
import type { InputInstance, TabPaneName } from 'element-plus'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import ProductBaseInfo from './Modules/ProductBaseInfo.vue'
// import Image from './Modules/Image.vue'
// import Parameter from './Modules/Parameter.vue'
// import Price from './Modules/Price.vue'
// import Seo from './Modules/Seo.vue'
// import Technology from './Modules/Technology.vue'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const languageId = ref('')

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  list: false,
})

// 创建product请求参数
const createFormData = (): ShowProduct & CommonField => {
  return {
    id: '',
    spu: '',
    productType: 0,
    onlineTime: '',
    offlineTime: '',
    brandId: '',
    stockStatus: 0,
    sort: 0,
    isTop: true,
    status: true,
    systemStatus: 0,
    productSourceType: 0,
    isAdult: true,
    ageGroupType: 0,
    genderType: 0,
    conditionType: 0,
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

// form初始化
const form = reactive<ShowProduct & CommonField>(createFormData())

const resetFormData = async (val: ShowProduct) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
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
              <!-- <ElTabPane :label="$t('product.category')" name="category" />
              <ElTabPane :label="$t('product.seo')" name="seo" />
              <ElTabPane :label="$t('product.layout')" name="layout" />
              <ElTabPane :label="$t('product.slug')" name="slug" /> -->
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
                @refresh-data="initFormData"
              />
            </div>
            <div v-show="activeName === 'category'" />
            <div v-show="activeName === 'seo'" />
            <div v-show="activeName === 'layout'" />
            <div v-show="activeName === 'slug'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
