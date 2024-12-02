<script setup name="ArticleDetail" lang="ts">
import type { InputInstance } from 'element-plus'
import {
  createArticleBaseApi,
  createArticleNameApi,
  createArticleSeoApi,
  createArticleSlugApi,
  createArticleTagApi,
  removeArticleTagApi,
  showArticleApi,
  updateArticleCategoryApi,
  updateArticleDescriptionApi,
  updateArticleFileApi,
  updateArticleIsCustomLayoutApi,
  updateArticleNameApi,
  updateArticleSeoApi,
  updateArticleSlugApi,
  updateArticleStatusApi,
} from '@/api/article'
import { listCategoryApi } from '@/api/category'
import { layoutListApi } from '@/api/layout'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElAlert, ElCard, ElInput, ElMessage, ElSwitch, ElTabPane } from 'element-plus'
import { debounce } from 'lodash-es'
import CustomsTable from './Components/CustomsTable.vue'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const activeName = ref<string>('base')

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

const loading = reactive({
  init: false,
  categories: false,
})

// 创建article请求参数
const createFormData = (): ArticleShowData => {
  return {
    id: '',
    articleType: 0,
    articleTypeLabel: '',
    categoryIds: [],
    status: true,
    isCustomLayout: true,
    layoutId: null,
    layoutListResultDo: {
      id: '',
      layoutName: '',
      layoutFileId: '',
      fileVo: {
        id: '',
        originalFileName: '',
        fileName: '',
        fileContentType: '',
        fileExtensionName: '',
        originalPath: '',
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
      layoutContent: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    articleCategoryListResultDos: [],
    categoryNameList: [],
    articleDetailListResultDo: {
      id: '',
      articleId: '',
      languageId: '',
      articleName: '',
      articleDescription: '',
      customs: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    articleFileListResultDos: [],
    seoListResultDo: {
      id: '',
      articleId: '',
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
    articleTagListResultDos: [],
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
  if (data.articleCategoryListResultDos && data.articleCategoryListResultDos.length > 0) {
    data.articleCategoryListResultDos.forEach(item => {
      categoryNameList.push(item.categoryName)
    })
  }
  data.categoryNameList = categoryNameList
  loading.init = false
  return data
}

const resetFormData = async (val: ArticleShowData) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
    form.categoryNameList = []
    const categoryNameList: string[] = []
    if (val.articleCategoryListResultDos && val.articleCategoryListResultDos.length > 0) {
      val.articleCategoryListResultDos.forEach(item => {
        categoryNameList.push(item.categoryName)
      })
    }
    form.categoryNameList = categoryNameList
    if (!form.articleDetailListResultDo) {
      return
    }
    if (form.articleDetailListResultDo.customs) {
      const customData = JSON.parse(form.articleDetailListResultDo.customs)
      if (customData && customData.length) {
        form.articleDetailListResultDo.customList = customData
      }
    } else {
      form.articleDetailListResultDo.customList = []
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
  form.layoutId = form.layoutId === '' ? null : form.layoutId
  isShowLayoutEdit.value = true
}

const handleSubmitArticleLayout = async () => {
  loading.init = true
  if (!form.isCustomLayout) {
    form.layoutId = ''
  }
  const payload = {
    articleId: id,
    languageId: usePreferenceStore().preference?.language.id,
    isCustomLayout: form.isCustomLayout,
    layoutId: form.layoutId === null ? '' : form.layoutId,
  }
  const { data } = await updateArticleIsCustomLayoutApi(payload).catch(error => {
    throw error
  })
  await resetFormData(JSON.parse(JSON.stringify(data)))
  loading.init = false
  isShowLayoutEdit.value = false
  ElMessage.success($t('success.edit'))
}

const handleChangeTab = (name: string) => {
  if (name === 'layout') {
    getLayoutList()
  }
}

// 更新分类
const categoryCascaderVisible = ref<boolean>(false)
const selectedCategoryValue = ref<string[] | number[] | any>([])
const deletedCategoryValue = ref<string[] | number[] | any>([])

const cascaderProps = {
  expandTrigger: 'hover' as const,
  label: 'categoryName',
  value: 'id',
  multiple: true,
}

const handleRemoveCategory = (val: number[]) => {
  deletedCategoryValue.value.push(val)
}

const categories = ref<any[]>([])

const getCategories = async () => {
  try {
    const payload = {
      languageCode: selectLanguage.value.languageCode,
    }
    const { data } = await listCategoryApi(payload)
    selectedCategoryValue.value = form.categoryIds
    categories.value = data.list
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const handleEditArticleCategory = async () => {
  categoryCascaderVisible.value = true
  await getCategories()
}

const handleCancelEditArticleCategory = () => {
  categoryCascaderVisible.value = false
  selectedCategoryValue.value = []
  deletedCategoryValue.value = []
}

const handleConfirmEditArticleCategory = async () => {
  loading.init = true
  categoryCascaderVisible.value = false
  const categoryIds = [...new Set(selectedCategoryValue.value.flat() as string[])]
  const deletedCategoryIds = [...new Set(deletedCategoryValue.value.flat() as string[])]
  const { data } = await updateArticleCategoryApi({
    articleId: id,
    languageId: selectLanguage.value.id,
    categoryIds,
    deletedCategoryIds,
  }).catch(error => {
    loading.init = false
    throw error
  })
  selectedCategoryValue.value = []
  deletedCategoryValue.value = []
  await resetFormData(JSON.parse(JSON.stringify(data)))
  loading.init = false
  ElMessage.success($t('success.edit'))
}

// 更新状态
const editArticleStatus = async () => {
  loading.init = true
  const { data } = await updateArticleStatusApi({
    articleId: id,
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

// 更新名称
const inputArticleNameVisible = ref<boolean>(false)
const currentArticleName = ref<string>('')
const handleClickUpdateArticleName = (articleName: string) => {
  currentArticleName.value = articleName
  inputArticleNameVisible.value = true
}
const handleCancelUpdateArticleName = () => {
  inputArticleNameVisible.value = false
}
const editArticleName = async (articleDetailId: string) => {
  if (!currentArticleName.value) {
    ElMessage.warning($t('article.error.articleName'))
    return
  }
  loading.init = true
  const { data } = await updateArticleNameApi({ articleName: currentArticleName.value, articleDetailId }).catch(
    error => {
      loading.init = false
      throw error
    },
  )
  loading.init = false
  currentArticleName.value = ''
  await resetFormData(data)
  inputArticleNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新名称新增时
const createArticleName = async () => {
  if (!currentArticleName.value) {
    ElMessage.warning($t('article.error.articleName'))
    return
  }
  loading.init = true
  const { data } = await createArticleNameApi({ articleName: currentArticleName.value, articleId: id, languageId: selectLanguage.value.id }).catch(
    error => {
      loading.init = false
      throw error
    },
  )
  loading.init = false
  currentArticleName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

// 更新描述
// 定义一个 ref 来控制内容是否展开
const isExpanded = ref(false)

// 切换显示状态的函数
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
const editorRef = ref()
const inputArticleDescriptionVisible = ref<boolean>(false)
const currentArticleDescription = ref<string>('<p></p>')
const handleClickUpdateArticleDescription = async (articleDescription: string) => {
  currentArticleDescription.value = articleDescription
  inputArticleDescriptionVisible.value = true
  await nextTick(async () => {
    await editorRef.value?.setEditorContent(articleDescription)
  })
}
const handleCancelUpdateArticleDescription = () => {
  inputArticleDescriptionVisible.value = false
}
const editArticleDescription = async (articleDetailId: string) => {
  currentArticleDescription.value = editorRef.value?.getEditorContent()
  loading.init = true
  const { data } = await updateArticleDescriptionApi({
    articleDetailId,
    articleDescription: currentArticleDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentArticleDescription.value = ''
  await resetFormData(data)
  inputArticleDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新Slug
const inputArticleSlugVisible = ref<boolean>(false)
const currentSlug = ref<string>('')

const handleClickCreateArticleSlug = async () => {
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }

  const { data } = await createArticleSlugApi({ articleId: id, languageId: usePreferenceStore().preference?.language.id, slug: currentSlug.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

const handleClickUpdateArticleSlug = () => {
  currentSlug.value = form.slug
  inputArticleSlugVisible.value = true
}
const handleCancelUpdateArticleSlug = () => {
  inputArticleSlugVisible.value = false
}
const editArticleSlug = async () => {
  if (!currentSlug.value) {
    ElMessage.warning($t('article.error.slug'))
    return
  }
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }
  const { data } = await updateArticleSlugApi({ slugId: form.slugId, languageId: usePreferenceStore().preference?.language.id, slug: currentSlug.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSlug.value = ''
  await resetFormData(data)
  inputArticleSlugVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新标签
const inputArticleTagVisible = ref<boolean>(false)
const inputTagValue = ref('')
const InputTagRef = ref<InputInstance>()

const handleRemoveTag = async (index: number) => {
  loading.init = true
  const { data } = await removeArticleTagApi({ articleTagRelationId: form.articleTagListResultDos[index].id }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.edit'))
}

const showInputTag = () => {
  inputArticleTagVisible.value = true
  nextTick(() => {
    InputTagRef.value!.input!.focus()
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
  if (form.articleTagListResultDos && form.articleTagListResultDos.length >= 9) {
    ElMessage.warning($t('article.error.tagLimit'))
    return
  }
  loading.init = true
  const { data } = await createArticleTagApi({ articleId: id, languageId: selectLanguage.value.id, tagName: inputTagValue.value.trim() }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  inputArticleTagVisible.value = false
  inputTagValue.value = ''
  ElMessage.success($t('success.edit'))
}, 500)

// 更新图片
const uploadRef = ref()
const settingArticleFileVisible = ref<boolean>(false)
const articleFileList = ref<(FileData & CommonField)[]>([])
const deletedFileIds = ref<string[]>([])
const handleClickUpdateArticleFile = async () => {
  if (form.articleFileListResultDos && form.articleFileListResultDos.length !== 0) {
    const articleFileListData: (FileData & CommonField)[] = []
    form.articleFileListResultDos.forEach((item: (ArticleFileListResultDo & CommonField)) => {
      articleFileListData.push(item.fileVo)
    })
    articleFileList.value = articleFileListData
  }
  settingArticleFileVisible.value = true
  await nextTick()
  await uploadRef.value?.setFileData(articleFileList.value)
}
const handleCancelUpdateArticleFile = () => {
  settingArticleFileVisible.value = false
}

const handleGetRemoveFile = (indexValue: number) => {
  deletedFileIds.value.push(articleFileList.value[indexValue].id)
}
const editArticleFile = async () => {
  loading.init = false
  const fileList = uploadRef.value?.getFileData()
  articleFileList.value = fileList.fileDataList
  const articleFileVoList: ArticleFileVo[] = []
  articleFileList.value.map((item: (FileData & CommonField), index: number) => {
    articleFileVoList.push({
      articleFileId: item.id,
      sort: item?.sort || 0,
      isDefault: index === 0,
    })
  })
  const payload = {
    articleId: id,
    languageId: selectLanguage.value.id,
    articleFileVoList,
    articleFileDeletedIds: deletedFileIds.value,
  }
  const { data } = await updateArticleFileApi(payload).catch(error => {
    loading.init = false
    throw error
  })
  await resetFormData(data)
  settingArticleFileVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新元标题
const inputArticleMetaTitleVisible = ref<boolean>(false)
const currentArticleMetaTitle = ref<string>('')
const handleClickUpdateArticleMetaTitle = (articleMetaTitle: string) => {
  currentArticleMetaTitle.value = articleMetaTitle
  inputArticleMetaTitleVisible.value = true
}
const handleCancelUpdateArticleMetaTitle = () => {
  inputArticleMetaTitleVisible.value = false
}
const editArticleMetaTitle = async (articleSeoId: string) => {
  if (!currentArticleMetaTitle.value) {
    ElMessage.warning($t('article.error.articleMetaTitle'))
    return
  }
  loading.init = true
  const { data } = await updateArticleSeoApi({
    articleSeoId,
    metaTitle: currentArticleMetaTitle.value,
    metaDescription: form.seoListResultDo.metaDescription,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentArticleMetaTitle.value = ''
  await resetFormData(data)
  inputArticleMetaTitleVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新元标题新增时
const createArticleMetaTitle = async () => {
  if (!currentArticleMetaTitle.value) {
    ElMessage.warning($t('article.error.metaTitle'))
    return
  }
  loading.init = true
  const { data } = await createArticleSeoApi({ articleId: id, languageId: selectLanguage.value.id, metaTitle: currentArticleMetaTitle.value }).catch(
    error => {
      loading.init = false
      throw error
    },
  )
  loading.init = false
  currentArticleMetaTitle.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

// 更新元描述
const inputArticleMetaDescriptionVisible = ref<boolean>(false)
const currentArticleMetaDescription = ref<string>('')
const handleClickUpdateArticleMetaDescription = (articleMetaDescription: string) => {
  currentArticleMetaDescription.value = articleMetaDescription
  inputArticleMetaDescriptionVisible.value = true
}
const handleCancelUpdateArticleMetaDescription = () => {
  inputArticleMetaDescriptionVisible.value = false
}
const editArticleMetaDescription = async (articleSeoId: string) => {
  if (!currentArticleMetaDescription.value) {
    ElMessage.warning($t('article.error.articleMetaDescription'))
    return
  }
  loading.init = true
  const { data } = await updateArticleSeoApi({
    articleSeoId,
    metaTitle: form.seoListResultDo.metaTitle,
    metaDescription: currentArticleMetaDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentArticleMetaDescription.value = ''
  await resetFormData(data)
  inputArticleMetaDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
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
              <div v-if="!categoryCascaderVisible" class="flex items-center">
                <span class="text-sm mr-2">{{ $t('article.category') }}：</span>
                <span class="text-sm mr-2">{{ form.categoryNameList?.join(' / ') }}</span>
                <span>
                  <EBtn type="primary" text @click="handleEditArticleCategory">
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </span>
              </div>
              <div v-else class="flex items-center">
                <div class="mr-2">
                  <ElCascader
                    v-model="selectedCategoryValue"
                    :options="categories"
                    :props="cascaderProps"
                    clearable
                    filterable
                    class="flex-1 w-full"
                    style="width: 500px"
                    @remove-tag="handleRemoveCategory"
                  />
                </div>
                <div>
                  <EBtn text @click="handleCancelEditArticleCategory">
                    <Icon icon="ep:close" :size="5" class="mr-1" />
                  </EBtn>
                  <EBtn type="danger" text @click="handleConfirmEditArticleCategory">
                    <Icon icon="ep:check" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
            </div>
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('article.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editArticleStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
        <ElTabPane :label="$t('article.base')" name="base">
          <ElCard v-if="form.articleDetailListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <!-- 文章名称 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('article.articleName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputArticleNameVisible" class="mr-2">
                    {{ form.articleDetailListResultDo.articleName }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentArticleName"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editArticleName(form.articleDetailListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateArticleName">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputArticleNameVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateArticleName(form.articleDetailListResultDo.articleName)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
              <!-- 描述 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('article.description') }}:
                </div>
                <div class="col-span-11">
                  <div v-if="!inputArticleDescriptionVisible" class="mr-2">
                    <div class="flex items-center mb-5">
                      <div class="mr-2">
                        <EBtn
                          v-if="!inputArticleNameVisible"
                          type="primary"
                          plain
                          @click="
                            handleClickUpdateArticleDescription(form.articleDetailListResultDo.articleDescription)
                          "
                        >
                          <Icon icon="ep:edit" :size="5" class="mr-1" />
                          {{ $t('common.edit') }}
                        </EBtn>
                      </div>

                      <!-- 切换显示全部和隐藏的按钮 -->
                      <div class="text-right">
                        <EBtn @click="toggleExpand">
                          {{ isExpanded ? '隐藏' : '显示全部' }}
                        </EBtn>
                      </div>
                    </div>
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-12 border border-gray-200 p-4">
                        <!-- 根据 isExpanded 的状态切换 max-height -->
                        <div
                          :class="{ 'max-h-[200px]': !isExpanded, 'overflow-hidden': !isExpanded }"
                          class="transition-all ease-in-out duration-300"
                          v-html="form.articleDetailListResultDo.articleDescription"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <Editor ref="editorRef" v-model="currentArticleDescription" class="mb-5" />
                    <div class="flex justify-center items-center">
                      <EBtn @click="handleCancelUpdateArticleDescription">
                        {{ $t('common.cancel') }}
                      </EBtn>
                      <EBtn type="primary" @click="editArticleDescription(form.articleDetailListResultDo.id)">
                        {{ $t('common.save') }}
                      </EBtn>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 标签 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('article.tag') }}:
                </div>
                <div class="col-span-11">
                  <ElTag
                    v-for="(tag, index) in form.articleTagListResultDos"
                    :key="tag"
                    class="mr-2"
                    closable
                    :disable-transitions="false"
                    @close="handleRemoveTag(index)"
                  >
                    {{ tag.tagName }}
                  </ElTag>
                  <ElInput
                    v-if="inputArticleTagVisible"
                    ref="InputTagRef"
                    v-model="inputTagValue"
                    style="width: 150px"
                    size="small"
                    @keyup.enter="handleInputTagConfirm"
                    @blur="handleInputTagConfirm"
                  />
                  <ElButton v-else size="small" @click="showInputTag">
                    + 新标签
                  </ElButton>
                </div>
              </div>
              <!-- 图片 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('article.pics') }}:
                </div>
                <div class="col-span-11">
                  <div v-if="!settingArticleFileVisible">
                    <EBtn
                      type="primary"
                      text
                      class="mb-5"
                      @click="handleClickUpdateArticleFile"
                    >
                      <Icon icon="ep:edit" :size="5" class="mr-1" />
                    </EBtn>
                    <div class="grid grid-cols-6 gap-4">
                      <div v-for="item in form.articleFileListResultDos" :key="item.id" class="col-span-1 border border-gray-200 pa-4">
                        <ElImage :src="`${sourceUrl}${item.fileVo?.fileUrl}`" />
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <UploadMultiImage ref="uploadRef" class="mb-5" @remove-file="handleGetRemoveFile" />
                    <div class="flex justify-center items-center">
                      <EBtn @click="handleCancelUpdateArticleFile">
                        {{ $t('common.cancel') }}
                      </EBtn>
                      <EBtn type="primary" @click="editArticleFile">
                        {{ $t('common.save') }}
                      </EBtn>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 自定义信息 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('article.customs') }}:
                </div>
                <div class="col-span-11">
                  <CustomsTable
                    :custom-list="form.articleDetailListResultDo.customList"
                    :article-detail-id="form.articleDetailListResultDo.id"
                  />
                </div>
              </div>
            </div>
          </ElCard>
          <ElCard v-else>
            <div class="flex justify-center items-center mb-5">
              <ElAlert :title="$t('article.warning.noDetailData')" type="warning" show-icon />
            </div>
            <div class="flex justify-center items-center mb-5">
              <ElInput v-model="currentArticleName" :placeholder="$t('article.placeholder.articleName')" />
              <EBtn type="primary" class="ml-5" @click="createArticleName">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('article.seo')" name="seo">
          <ElCard v-if="form.seoListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <!-- 文章元标题 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('article.metaTitle') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputArticleMetaTitleVisible" class="mr-2">
                    {{ form.seoListResultDo.metaTitle }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentArticleMetaTitle"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editArticleMetaTitle(form.seoListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateArticleMetaTitle">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputArticleMetaTitleVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateArticleMetaTitle(form.seoListResultDo.metaTitle)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
              <!-- 文章元描述 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('article.metaDescription') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputArticleMetaDescriptionVisible" class="mr-2">
                    {{ form.seoListResultDo.metaDescription }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentArticleMetaDescription"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editArticleMetaDescription(form.seoListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateArticleMetaDescription">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputArticleMetaDescriptionVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateArticleMetaDescription(form.seoListResultDo.metaDescription)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
            </div>
          </ElCard>
          <ElCard v-else>
            <div class="flex justify-center items-center mb-5">
              <ElAlert :title="$t('article.warning.noSeoData')" type="warning" show-icon />
            </div>
            <div class="flex justify-center items-center mb-5">
              <ElInput v-model="currentArticleMetaTitle" :placeholder="$t('article.placeholder.metaTitle')" />
              <EBtn type="primary" class="ml-5" @click="createArticleMetaTitle">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('article.layout')" name="layout">
          <ElCard shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div class="w-full grid grid-cols-12 gap-8 p-4">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('article.layout') }}:
                </div>
                <div class="col-span-11">
                  <div v-if="!isShowLayoutEdit">
                    <div class="flex justify-start items-center">
                      <span class="mr-2">{{ form.isCustomLayout ? $t('common.yes') : $t('common.no') }}</span>
                      <span v-if="form.layoutListResultDo" class="mr-2">
                        ，{{ $t('article.layoutName') }}：{{ form.layoutListResultDo.layoutName }}
                      </span>
                      <span>
                        <EBtn type="primary" text @click="handleEditArticleLayout">
                          <Icon icon="ep:edit" :size="5" />
                        </EBtn>
                      </span>
                    </div>
                  </div>
                  <div v-else>
                    <div class="w-full flex items-center mb-5">
                      <span class="mr-2">{{ $t('article.isCustomLayout') }}</span>
                      <ElSwitch v-model="form.isCustomLayout" />
                    </div>
                    <div v-if="form.isCustomLayout" class="w-full flex items-center mb-5">
                      <span class="mr-2 flex-none">{{ $t('article.layout') }}</span>
                      <ElSelect
                        v-model="form.layoutId"
                        clearable
                        filterable
                        :placeholder="$t('article.placeholder.layout')"
                      >
                        <ElOption
                          v-for="item in listLayoutData.list"
                          :key="item.id"
                          :label="item.layoutName"
                          :value="item.id"
                        />
                      </ElSelect>
                    </div>

                    <div class="w-full flex">
                      <EBtn type="primary" @click="isShowLayoutEdit = false">
                        <Icon icon="ep:close" :size="3" class="mr-1" />
                        {{ $t('common.cancel') }}
                      </EBtn>
                      <EBtn type="danger" @click="handleSubmitArticleLayout">
                        <Icon icon="ep:check" :size="3" class="mr-1" />
                        {{ $t('common.submit') }}
                      </EBtn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('article.slug')" name="slug">
          <ElCard shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div v-if="!form.slug || !form.slugId" class="mb-5">
                <div class="w-full flex items-center mb-5">
                  <ElAlert :title="$t('article.warning.noSlugData')" type="warning" show-icon />
                </div>
                <div class="w-full flex items-center mb-5">
                  <ElInput v-model="currentSlug" :placeholder="$t('article.placeholder.slug')" />
                </div>
                <EBtn type="primary" class="ml-5" @click="handleClickCreateArticleSlug">
                  <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                  {{ $t('common.save') }}
                </EBtn>
              </div>
              <div v-else class="mb-5">
                <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                  <div class="col-span-1 font-semibold text-gray-700">
                    {{ $t('article.slug') }}:
                  </div>
                  <div class="col-span-11 w-full flex items-center">
                    <div v-if="!inputArticleSlugVisible" class="mr-2">
                      {{ form.slug }}
                    </div>
                    <div v-else class="flex items-center justify-start">
                      <ElInput
                        v-model="currentSlug"
                        :placeholder="$t('article.placeholder.slug')"
                        class="mr-2"
                      />
                      <EBtn text @click="handleCancelUpdateArticleSlug">
                        <Icon icon="ep:close" :size="5" class="mr-1" />
                      </EBtn>
                      <EBtn type="primary" class="ml-5" @click="editArticleSlug">
                        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                        {{ $t('common.save') }}
                      </EBtn>
                    </div>
                    <EBtn v-if="!inputArticleSlugVisible" type="primary" text @click="handleClickUpdateArticleSlug">
                      <Icon icon="ep:edit" :size="5" class="mr-1" />
                    </EBtn>
                  </div>
                </div>
              </div>
            </div>
          </ElCard>
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>
