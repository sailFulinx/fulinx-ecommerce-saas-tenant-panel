<script setup name="SupplierDetail" lang="ts">
import SupplierBaseInfo from './Components/SupplierBaseInfo.vue'
import SupplierLayoutInfo from './Components/SupplierLayoutInfo.vue'
import SupplierSeoInfo from './Components/SupplierSeoInfo.vue'
import SupplierSlugInfo from './Components/SupplierSlugInfo.vue'
import { supplierKey } from './type/injectionKeys'

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

// 创建supplier请求参数
const createFormData = (): SupplierShowData & CommonField => {
  return {
    id: '',
    status: false,
    isTop: false,
    sort: 0,
    supplierAdminLocalizedViewDos: [],
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
const form = reactive<SupplierShowData & CommonField>(createFormData())

const currentForm = reactive<SupplierAdminLocalizedViewDo>({
  languageId: '',
  languageCode: '',
  languageName: '',
  supplierDetailListResultDo: null,
  supplierSeoListResultDo: null,
})

const showSupplierPayload = reactive<ShowSupplierParams>({
  supplierId: id,
  languageId: selectLanguage.value.id,
})

// 获取供应商数据
const getSupplierData = async () => {
  loading.init = true
  const { data } = await showSupplierApi(showSupplierPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: SupplierShowData & CommonField) => {
  Object.assign(form, $clone(val))
  if (!form?.supplierAdminLocalizedViewDos) {
    return
  }

  form.supplierAdminLocalizedViewDos.forEach(item => {
    if (!item.supplierDetailListResultDo) {
      return
    }
    if (item.supplierDetailListResultDo.customs) {
      const customData = JSON.parse(item.supplierDetailListResultDo.customs)
      item.supplierDetailListResultDo.customList = customData
    } else {
      item.supplierDetailListResultDo.customList = []
    }
  })
}

const initFormData = async () => {
  const res = await getSupplierData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  val => {
    if (val) {
      selectLanguage.value = val
      showSupplierPayload.languageId = val.id
      languageCode.value = val.languageCode
      initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editSupplierStatus = async () => {
  loading.init = true
  const { data } = await updateSupplierStatusApi({
    supplierId: id,
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
  form.supplierAdminLocalizedViewDos.forEach(item => {
    if (item.languageCode === languageCode.value) {
      currentForm.supplierDetailListResultDo = item.supplierDetailListResultDo
      currentForm.supplierSeoListResultDo = item.supplierSeoListResultDo
      currentForm.languageCode = item.languageCode
      currentForm.languageName = item.languageName
    }
  })
  selectLanguage.value = languageListByCode[languageCode.value]
}

provide(supplierKey, {
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
          <span>{{ $t('supplier.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('supplier.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editSupplierStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main flex flex-col h-[calc(100vh-120px)]">
      <div class="flex-none sticky top-0 bg-white z-20">
        <ElTabs v-model="languageCode" @tab-change="handleChangeLanguageTab">
          <ElTabPane
            v-for="item in form.supplierAdminLocalizedViewDos"
            :key="item.languageCode"
            :label="item.languageName"
            :name="item.languageCode"
          >
            <ElTabs v-model="activeName" class="demo-tabs">
              <ElTabPane :label="$t('supplier.base')" name="base" />
              <ElTabPane :label="$t('supplier.seo')" name="seo" />
              <ElTabPane :label="$t('supplier.layout')" name="layout" />
              <ElTabPane :label="$t('supplier.slug')" name="slug" />
            </ElTabs>
          </ElTabPane>
        </ElTabs>
      </div>
      <div class="flex-1 overflow-auto pr-4 -mr-4">
        <div v-for="item in form.supplierAdminLocalizedViewDos" :key="item.languageCode">
          <div v-show="languageCode === item.languageCode">
            <div v-show="activeName === 'base'">
              <SupplierBaseInfo
                :current-item="item"
                :supplier-admin-localized-view-dos="form.supplierAdminLocalizedViewDos"
                :language-id="item.languageId"
                :supplier-id="id"
              />
            </div>
            <div v-show="activeName === 'seo'">
              <SupplierSeoInfo
                :current-item="item" :supplier-admin-localized-view-dos="form.supplierAdminLocalizedViewDos"
                :language-id="item.languageId"
                :supplier-id="id"
              />
            </div>
            <div v-show="activeName === 'layout'">
              <SupplierLayoutInfo
                :current-item="item" :supplier-admin-localized-view-dos="form.supplierAdminLocalizedViewDos"
                :layout-type-list="layoutTypeList"
                :language-id="item.languageId"
                :supplier-id="id"
              />
            </div>
            <div v-show="activeName === 'slug'">
              <SupplierSlugInfo
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
