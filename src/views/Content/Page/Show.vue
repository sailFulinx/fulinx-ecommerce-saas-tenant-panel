<script setup name="PageDetail" lang="ts">
import type { InputInstance, TabPaneName } from 'element-plus'
import { debounce } from 'lodash-es'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import PageBaseInfo from './Components/PageBaseInfo.vue'
import PageLayoutInfo from './Components/PageLayoutInfo.vue'
import PageSeoInfo from './Components/PageSeoInfo.vue'
import PageSlugInfo from './Components/PageSlugInfo.vue'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const languageId = ref('')

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  categories: false,
})

// 创建page请求参数
const createFormData = (): PageShowData => {
  return {
    id: '',
    status: true,
    pageAdminLocalizedViewDos: [],
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
const form = reactive<PageShowData>(createFormData())

const categoryNames = ref<string>('')

const showPagePayload = reactive<ShowPageParams>({
  pageId: id,
  languageId: selectLanguage.value.id,
})

// 获取文章数据
const getPageData = async () => {
  loading.init = true
  const { data } = await showPageApi(showPagePayload).catch(error => {
    loading.init = false
    throw error
  })

  loading.init = false
  return data
}

const resetFormData = async (val: PageShowData) => {
  await nextTick(() => {
    categoryNames.value = ''
    Object.assign(form, JSON.parse(JSON.stringify(val)))
    if (form.pageAdminLocalizedViewDos && form.pageAdminLocalizedViewDos.length > 0) {
      form.pageAdminLocalizedViewDos.forEach(item => {
        if (!item.pageDetailListResultDo) {
          return
        }
        if (item.pageDetailListResultDo.customs) {
          const customData = JSON.parse(item.pageDetailListResultDo.customs)
          if (customData && customData.length) {
            item.pageDetailListResultDo.customList = customData
          }
        } else {
          item.pageDetailListResultDo.customList = []
        }
      })
    }
  })
}

const initFormData = async () => {
  const res = await getPageData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  async val => {
    if (val) {
      selectLanguage.value = val
      showPagePayload.languageId = val.id
      languageId.value = val.id
      await initFormData()
    }
  },
  { immediate: true },
)

// 布局
const listLayoutPayload = reactive<LayoutListParams>({
  layoutName: null,
})

const listLayoutData = ref<TableResponse<LayoutData & CommonField>>({
  list: [],
  total: 0,
})

const getLayoutList = debounce(async () => {
  loading.init = true
  if (listLayoutPayload.layoutName === '') {
    listLayoutPayload.layoutName = null
  }
  if (listLayoutPayload.layoutName && listLayoutPayload.layoutName?.length <= 1) {
    loading.init = false
    return
  }
  const { data } = await layoutListApi(listLayoutPayload).catch(error => {
    loading.init = false
    throw error
  })
  listLayoutData.value = data
  loading.init = false
}, 300)

const isShowLayoutEdit = ref<boolean>(false)
const handleEditPageLayout = () => {
  isShowLayoutEdit.value = true
}

const handleChangeTab = (name: TabPaneName) => {
  if (name === 'layout') {
    getLayoutList()
  }
}

const handleChangeLanguageTab = async (_name: TabPaneName) => {
  await resetFormData(form)
}

// 更新状态
const editPageStatus = async () => {
  loading.init = true
  const { data } = await updatePageStatusApi({
    pageId: id,
    languageId: languageId.value,
    status: form.status,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.edit'))
}

const handleCancelUpdatePageFile = () => {
  // 空实现，由子组件处理
}
const handleGetRemoveFile = (_indexValue: number) => {
  // 空实现，由子组件处理
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('page.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('page.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editPageStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card flex flex-col h-[calc(100vh-120px)]">
      <div class="flex-none sticky top-0 bg-white z-20">
        <ElTabs v-model="languageId" @tab-change="handleChangeLanguageTab">
          <ElTabPane
            v-for="item in form.pageAdminLocalizedViewDos"
            :key="item.languageId"
            :label="item.languageName"
            :name="item.languageId"
          >
            <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
              <ElTabPane :label="$t('page.base')" name="base" />
              <ElTabPane :label="$t('page.seo')" name="seo" />
              <ElTabPane :label="$t('page.layout')" name="layout" />
              <ElTabPane :label="$t('page.slug')" name="slug" />
            </ElTabs>
          </ElTabPane>
        </ElTabs>
      </div>
      <div class="flex-1 overflow-auto pr-4 -mr-4">
        <div v-for="item in form.pageAdminLocalizedViewDos" :key="item.languageId">
          <div v-show="languageId === item.languageId">
            <div v-show="activeName === 'base'">
              <PageBaseInfo
                :page-detail="item"
                :language-id="item.languageId"
                :page-id="id"
                v-model:page-admin-localized-view-dos="form.pageAdminLocalizedViewDos"
                @refresh-data="initFormData"
                @cancel-update-page-file="handleCancelUpdatePageFile"
                @get-remove-file="handleGetRemoveFile"
              />
            </div>
            <div v-show="activeName === 'seo'">
              <PageSeoInfo
                :page-seo="item.pageSeoListResultDo"
                :page-id="id"
                :language-id="item.languageId"
                @refresh-data="initFormData"
              />
            </div>
            <div v-show="activeName === 'layout'">
              <PageLayoutInfo
                :page-detail="item.pageDetailListResultDo"
                :page-id="id"
                :language-id="item.languageId"
                :list-layout-data="listLayoutData"
                @edit-page-layout="handleEditPageLayout"
                @refresh-data="initFormData"
              />
            </div>
            <div v-show="activeName === 'slug'">
              <PageSlugInfo
                :slug="form.slug"
                :slug-id="form.slugId"
                :page-id="id"
                :language-id="usePreferenceStore().preference?.language.id"
                @refresh-data="initFormData"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
