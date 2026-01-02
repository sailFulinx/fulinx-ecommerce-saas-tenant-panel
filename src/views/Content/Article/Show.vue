<script setup name="ArticleDetail" lang="ts">
import type { InputInstance, TabPaneName } from 'element-plus'
import { debounce } from 'lodash-es'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import ArticleBaseInfo from './Components/ArticleBaseInfo.vue'
import ArticleCategoryInfo from './Components/ArticleCategoryInfo.vue'
import ArticleLayoutInfo from './Components/ArticleLayoutInfo.vue'
import ArticleSeoInfo from './Components/ArticleSeoInfo.vue'
import ArticleSlugInfo from './Components/ArticleSlugInfo.vue'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const languageId = ref('')

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  categories: false,
})

// 创建article请求参数
const createFormData = (): ArticleShowData => {
  return {
    id: '',
    articleType: null,
    articleTypeLabel: '',
    categoryIds: [],
    status: true,
    articleAdminLocalizedViewDos: [],
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
const form = reactive<ArticleShowData>(createFormData())

const categoryNames = ref<string[]>([])

const showArticlePayload = reactive<ShowArticleParams>({
  articleId: id,
  languageId: selectLanguage.value.id,
})

// 获取文章数据
const getArticleData = async () => {
  loading.init = true
  const { data } = await showArticleApi(showArticlePayload).catch(error => {
    loading.init = false
    throw error
  })
  const categoryNameList: string[] = []
  if (data.articleAdminLocalizedViewDos && data.articleAdminLocalizedViewDos.length > 0) {
    data.articleAdminLocalizedViewDos.forEach((item: ArticleAdminLocalizedViewDo) => {
      if (
        item.languageId === languageId.value
        && item.articleCategoryRelationListResultDos
        && item.articleCategoryRelationListResultDos.length > 0
      ) {
        item.articleCategoryRelationListResultDos.forEach(cItem => {
          categoryNameList.push(cItem.categoryName)
        })
        item.categoryNameList = categoryNameList
        categoryNames.value = item.categoryNameList
      }
    })
  }

  loading.init = false
  return data
}

const resetFormData = async (val: ArticleShowData) => {
  await nextTick(() => {
    categoryNames.value = []
    Object.assign(form, JSON.parse(JSON.stringify(val)))
    const categoryNameList: string[] = []
    if (form.articleAdminLocalizedViewDos && form.articleAdminLocalizedViewDos.length > 0) {
      form.articleAdminLocalizedViewDos.forEach(item => {
        item.categoryNameList = []
        if (item.articleCategoryRelationListResultDos && item.articleCategoryRelationListResultDos.length > 0) {
          item.articleCategoryRelationListResultDos.forEach(cItem => {
            if (item.languageId === languageId.value) {
              categoryNameList.push(cItem.categoryName)
            }
          })
        }
        item.categoryNameList = categoryNameList
        if (item.languageId === languageId.value) {
          categoryNames.value = item.categoryNameList
        }
        if (!item.articleDetailListResultDo) {
          return
        }
        if (item.articleDetailListResultDo.customs) {
          const customData = JSON.parse(item.articleDetailListResultDo.customs)
          if (customData && customData.length) {
            item.articleDetailListResultDo.customList = customData
          }
        } else {
          item.articleDetailListResultDo.customList = []
        }
      })
    }
  })
}

const initFormData = async () => {
  const res = await getArticleData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  async val => {
    if (val) {
      selectLanguage.value = val
      showArticlePayload.languageId = val.id
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
const handleEditArticleLayout = () => {
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
const editArticleStatus = async () => {
  loading.init = true
  const { data } = await updateArticleStatusApi({
    articleId: id,
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

// 更新标签
const inputArticleTagVisible = ref<boolean>(false)
const inputTagValue = ref('')
const InputTagRefs = ref<InputInstance[]>([])

const handleRemoveTag = async (index: number) => {
  loading.init = true
  form.articleAdminLocalizedViewDos.forEach(async item => {
    if (item.languageId === languageId.value) {
      const { data } = await removeArticleTagApi({
        articleTagRelationId: item.articleTagListResultDos[index].id,
      }).catch(error => {
        loading.init = false
        throw error
      })
      loading.init = false
      await resetFormData(data)
      ElMessage.success($t('success.edit'))
    }
  })
}

const showInputTag = (index: number) => {
  inputArticleTagVisible.value = true
  nextTick(() => {
    InputTagRefs.value[index]!.input!.focus()
  })
}

const handleInputTagConfirm = debounce(async () => {
  if (!inputTagValue.value) {
    return
  }
  if (inputTagValue.value.length > 20) {
    ElMessage.warning($t('article.error.tagLength'))
    return
  }
  form.articleAdminLocalizedViewDos.forEach(async item => {
    if (item.languageId === languageId.value) {
      if (item.articleTagListResultDos && item.articleTagListResultDos.length >= 9) {
        ElMessage.warning($t('article.error.tagLimit'))
        return
      }
      loading.init = true
      const { data } = await createArticleTagApi({
        articleId: id,
        languageId: languageId.value,
        tagName: inputTagValue.value.trim(),
      }).catch(error => {
        loading.init = false
        throw error
      })
      loading.init = false
      await resetFormData(data)
      inputArticleTagVisible.value = false
      inputTagValue.value = ''
      ElMessage.success($t('success.edit'))
    }
  })
}, 500)

const handleCancelUpdateArticleFile = () => {
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
          <span>{{ $t('article.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('article.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editArticleStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card flex flex-col h-[calc(100vh-120px)]">
      <div class="flex-none sticky top-0 bg-white z-20">
        <ElTabs v-model="languageId" @tab-change="handleChangeLanguageTab">
          <ElTabPane
            v-for="item in form.articleAdminLocalizedViewDos"
            :key="item.languageId"
            :label="item.languageName"
            :name="item.languageId"
          >
            <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
              <ElTabPane :label="$t('article.base')" name="base" />
              <ElTabPane :label="$t('article.category')" name="category" />
              <ElTabPane :label="$t('article.seo')" name="seo" />
              <ElTabPane :label="$t('article.layout')" name="layout" />
              <ElTabPane :label="$t('article.slug')" name="slug" />
            </ElTabs>
          </ElTabPane>
        </ElTabs>
      </div>
      <div class="flex-1 overflow-auto pr-4 -mr-4">
        <div v-for="item in form.articleAdminLocalizedViewDos" :key="item.languageId">
          <div v-show="languageId === item.languageId">
            <div v-show="activeName === 'base'">
              <ArticleBaseInfo
                v-model:article-admin-localized-view-dos="form.articleAdminLocalizedViewDos"
                :article-data="form"
                :article-detail="item"
                :language-id="item.languageId"
                :article-id="id"
                @refresh-data="initFormData"
                @remove-tag="handleRemoveTag"
                @show-input-tag="showInputTag"
                @input-tag-confirm="handleInputTagConfirm"
                @cancel-update-article-file="handleCancelUpdateArticleFile"
                @get-remove-file="handleGetRemoveFile"
              />
            </div>
            <div v-show="activeName === 'category'">
              <ArticleCategoryInfo
                :article-id="id"
                :category-names="categoryNames"
                :category-ids="form.categoryIds"
                :language-id="item.languageId"
                @refresh-data="initFormData"
              />
            </div>
            <div v-show="activeName === 'seo'">
              <ArticleSeoInfo
                :article-seo="item.articleSeoListResultDo"
                :article-id="id"
                :language-id="item.languageId"
                @refresh-data="initFormData"
              />
            </div>
            <div v-show="activeName === 'layout'">
              <ArticleLayoutInfo
                :article-detail="item.articleDetailListResultDo"
                :article-id="id"
                :language-id="item.languageId"
                :list-layout-data="listLayoutData"
                @edit-article-layout="handleEditArticleLayout"
                @refresh-data="initFormData"
              />
            </div>
            <div v-show="activeName === 'slug'">
              <ArticleSlugInfo
                :slug="form.slug"
                :slug-id="form.slugId"
                :article-id="id"
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
