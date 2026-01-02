<script setup name="CategoryDetail" lang="ts">
import CategoryBaseInfo from './Components/CategoryBaseInfo.vue'
import CategoryLayoutInfo from './Components/CategoryLayoutInfo.vue'
import CategorySeoInfo from './Components/CategorySeoInfo.vue'
import CategorySlugInfo from './Components/CategorySlugInfo.vue'
import ParentCatalog from './Components/ParentCatalog.vue'
import { categoryKey } from './type/injectionKeys'

defineOptions({ name: 'ShowCategory' })
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

// 创建category请求参数
const createFormData = (): CategoryShowData => {
  return {
    id: '0',
    categoryType: 1,
    parentId: '0',
    parentIds: [],
    status: true,
    categoryAdminLocalizedViewDos: [],
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

// form初始化
const form = reactive<CategoryShowData>(createFormData())

const currentForm = reactive<CategoryShowListItem>({
  languageCode: '',
  languageName: '',
  categoryDetailListResultDo: null,
  categorySeoListResultDo: null,
})

const showCategoryPayload = reactive<CategoryShowParams>({
  categoryId: id,
  languageId: selectLanguage.value.id,
})

// 获取分类数据
const getCategoryData = async () => {
  loading.init = true
  const { data } = await categoryShowApi(showCategoryPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const layoutTypeList = ref<any[]>([])

const getLayoutTypeList = async () => {
  const { data } = await fetchLayoutTypeListApi({ layoutTypeCode: null }).catch(error => {
    throw error
  })
  layoutTypeList.value = data.list
}

getLayoutTypeList()

const resetFormData = async (val: CategoryShowData) => {
  Object.assign(form, $clone(val))
  if (form?.parentIds[0] !== '0') {
    form.parentIds.unshift('0')
  }
  if (!form?.categoryAdminLocalizedViewDos) {
    return
  }

  form.categoryAdminLocalizedViewDos.forEach(item => {
    if (!item.categoryDetailListResultDo) {
      return
    }
    if (item.categoryDetailListResultDo.customs) {
      const customData = JSON.parse(item.categoryDetailListResultDo.customs)
      item.categoryDetailListResultDo.customList = customData
    } else {
      item.categoryDetailListResultDo.customList = []
    }
  })
}

const initFormData = async () => {
  const res = await getCategoryData()
  resetFormData(res)
}

const parentDialogRef = useTemplateRef('parentDialogRef')

// 更新父级分类
const handleClickUpdateParentId = async (val: CategoryShowData) => {
  parentDialogRef.value!.openDialog(val, selectLanguage.value.id)
}

watch(
  () => usePreferenceStore().preference?.language,
  val => {
    if (val) {
      selectLanguage.value = val
      showCategoryPayload.languageId = val.id
      languageCode.value = val.languageCode
      initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editCategoryStatus = async () => {
  loading.init = true
  const { data } = await categoryStatusEditApi({
    categoryId: id,
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
  form.categoryAdminLocalizedViewDos.forEach(item => {
    if (item.languageCode === languageCode.value) {
      currentForm.categoryDetailListResultDo = item.categoryDetailListResultDo
      currentForm.categorySeoListResultDo = item.categorySeoListResultDo
      currentForm.languageCode = item.languageCode
      currentForm.languageName = item.languageName
    }
  })
  selectLanguage.value = languageListByCode[languageCode.value]
}

provide(categoryKey, {
  id,
  paneName,
  form, // 直接传递 reactive 对象
  loading, // 直接传递 reactive 对象
  activeName,
  selectLanguage,
  resetFormData,
  handleClickUpdateParentId,
})
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('category.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('category.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editCategoryStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main flex flex-col h-[calc(100vh-120px)]">
      <div class="flex-none sticky top-0 bg-white z-20">
        <ElTabs v-model="languageCode" @tab-change="handleChangeLanguageTab">
          <ElTabPane
            v-for="item in form.categoryAdminLocalizedViewDos"
            :key="item.languageCode"
            :label="item.languageName"
            :name="item.languageCode"
          >
            <ElTabs v-model="activeName" class="demo-tabs">
              <ElTabPane :label="$t('category.base')" name="base" />
              <ElTabPane :label="$t('category.seo')" name="seo" />
              <ElTabPane :label="$t('category.layout')" name="layout" />
              <ElTabPane :label="$t('category.slug')" name="slug" />
            </ElTabs>
          </ElTabPane>
        </ElTabs>
      </div>
      <div class="flex-1 overflow-auto pr-4 -mr-4">
        <div v-for="item in form.categoryAdminLocalizedViewDos" :key="item.languageCode">
          <div v-show="languageCode === item.languageCode">
            <div v-show="activeName === 'base'">
              <CategoryBaseInfo :current-item="item" :category-admin-localized-view-dos="form.categoryAdminLocalizedViewDos" />
            </div>
            <div v-show="activeName === 'seo'">
              <CategorySeoInfo :current-item="item" />
            </div>
            <div v-show="activeName === 'layout'">
              <CategoryLayoutInfo :current-item="item" :layout-type-list="layoutTypeList" />
            </div>
            <div v-show="activeName === 'slug'">
              <CategorySlugInfo :current-item="item" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ParentCatalog ref="parentDialogRef" @init-form-data="initFormData" />
  </div>
</template>
