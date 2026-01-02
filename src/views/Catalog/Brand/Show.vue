<script setup name="BrandDetail" lang="ts">
import BrandBaseInfo from './Components/BrandBaseInfo.vue'
import BrandLayoutInfo from './Components/BrandLayoutInfo.vue'
import BrandSeoInfo from './Components/BrandSeoInfo.vue'
import BrandSlugInfo from './Components/BrandSlugInfo.vue'
import { brandKey } from './type/injectionKeys'

const { id } = defineProps<{
  id: string
}>()

const { t: $t } = useLocale()

const { getLanguagesListByCode } = useLanguageStore()
const languageListByCode = getLanguagesListByCode()
const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const languageCode = ref('')

const paneName = readonly({
  Base: 'base',
  Seo: 'seo',
  Layout: 'layout',
  Slug: 'slug',
})

const activeName = ref(paneName.Base)

const loading = reactive({
  init: false,
  categories: false,
})

// 创建brand请求参数
const createFormData = (): BrandShowData & CommonField => {
  return {
    id: '',
    status: false,
    isTop: false,
    sort: 0,
    brandAdminLocalizedViewDos: [],
    slugId: '0',
    slug: '',
    remark: '',
    isDelete: 0,
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
  }
}

const layoutTypeList = ref<any[]>([])

const getLayoutTypeList = async () => {
  const { data } = await fetchLayoutTypeListApi({ layoutTypeCode: null }).catch(error => {
    throw error
  })
  layoutTypeList.value = data.list
}

getLayoutTypeList()

// form初始化
const form = reactive<BrandShowData & CommonField>(createFormData())

const currentForm = reactive<BrandAdminLocalizedViewDo>({
  languageId: '',
  languageCode: '',
  languageName: '',
  brandDetailListResultDo: null,
  brandSeoListResultDo: null,
})

const showBrandPayload = reactive<ShowBrandParams>({
  brandId: id,
  languageId: selectLanguage.value.id,
})

// 获取品牌数据
const getBrandData = async () => {
  loading.init = true
  const { data } = await showBrandApi(showBrandPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: BrandShowData & CommonField) => {
  Object.assign(form, $clone(val))
  if (!form?.brandAdminLocalizedViewDos) {
    return
  }

  form.brandAdminLocalizedViewDos.forEach(item => {
    if (!item.brandDetailListResultDo) {
      return
    }
    if (item.brandDetailListResultDo.customs) {
      const customData = JSON.parse(item.brandDetailListResultDo.customs)
      item.brandDetailListResultDo.customList = customData
    } else {
      item.brandDetailListResultDo.customList = []
    }
  })
}

const initFormData = async () => {
  const res = await getBrandData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  val => {
    if (val) {
      selectLanguage.value = val
      showBrandPayload.languageId = val.id
      languageCode.value = val.languageCode
      initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editBrandStatus = async () => {
  loading.init = true
  const { data } = await updateBrandStatusApi({
    brandId: id,
    status: form.status,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.edit'))
}

const handleChangeLanguageTab = () => {
  form.brandAdminLocalizedViewDos.forEach(item => {
    if (item.languageCode === languageCode.value) {
      currentForm.brandDetailListResultDo = item.brandDetailListResultDo
      currentForm.brandSeoListResultDo = item.brandSeoListResultDo
      currentForm.languageCode = item.languageCode
      currentForm.languageName = item.languageName
    }
  })
  selectLanguage.value = languageListByCode[languageCode.value]
}

provide(brandKey, {
  id,
  paneName,
  form, // 直接传递 reactive 对象
  loading, // 直接传递 reactive 对象
  activeName,
  selectLanguage,
  resetFormData,
})
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('brand.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('brand.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editBrandStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main flex flex-col h-[calc(100vh-120px)]">
      <div class="flex-none sticky top-0 bg-white z-20">
        <ElTabs v-model="languageCode" @tab-change="handleChangeLanguageTab">
          <ElTabPane
            v-for="item in form.brandAdminLocalizedViewDos"
            :key="item.languageCode"
            :label="item.languageName"
            :name="item.languageCode"
          >
            <ElTabs v-model="activeName" class="demo-tabs">
              <ElTabPane :label="$t('brand.base')" name="base" />
              <ElTabPane :label="$t('brand.seo')" name="seo" />
              <ElTabPane :label="$t('brand.layout')" name="layout" />
              <ElTabPane :label="$t('brand.slug')" name="slug" />
            </ElTabs>
          </ElTabPane>
        </ElTabs>
      </div>
      <div class="flex-1 overflow-auto pr-4 -mr-4">
        <div v-for="item in form.brandAdminLocalizedViewDos" :key="item.languageCode">
          <div v-show="languageCode === item.languageCode">
            <div v-show="activeName === 'base'">
              <BrandBaseInfo
                :current-item="item"
                :brand-admin-localized-view-dos="form.brandAdminLocalizedViewDos"
                :language-id="item.languageId"
                :brand-id="id"
              />
            </div>
            <div v-show="activeName === 'seo'">
              <BrandSeoInfo
                :current-item="item" :brand-admin-localized-view-dos="form.brandAdminLocalizedViewDos"
                :language-id="item.languageId"
                :brand-id="id"
              />
            </div>
            <div v-show="activeName === 'layout'">
              <BrandLayoutInfo
                :current-item="item" :brand-admin-localized-view-dos="form.brandAdminLocalizedViewDos"
                :layout-type-list="layoutTypeList"
                :language-id="item.languageId"
                :brand-id="id"
              />
            </div>
            <div v-show="activeName === 'slug'">
              <BrandSlugInfo
                :language-id="item.languageId"
                :form="form"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
