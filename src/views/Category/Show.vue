<script setup name="CategoryDetail" lang="ts">
import { createCategoryNameApi, createCategorySeoApi, createCategorySlugApi, editCategoryDescriptionApi, editCategoryFileApi, editCategoryLayoutApi, editCategoryNameApi, editCategorySeoApi, editCategorySlugApi, editCategoryStatusApi, showCategoryApi } from '@/api/category'
import { layoutListApi } from '@/api/layout'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElAlert, ElCard, ElInput, ElMessage, ElSwitch, ElTabPane } from 'element-plus'
import { debounce } from 'lodash-es'
import CustomsTable from './Components/CustomsTable.vue'
import ParentCatalog from './Components/ParentCatalog.vue'

const { t: $t } = useLocale()

const id = Number(useRoute().params.id as unknown)

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const activeName = ref<string>('base')

const parentDialogRef = ref()

const uploadSingleImageRef = ref()

const loading = reactive({
  init: false,
  categories: false,
})

// 创建category请求参数
const createFormData = (): CategoryShowData => {
  return {
    id: 0,
    parentId: 0,
    parentIds: [],
    status: true,
    isCustomLayout: false,
    layoutId: 0,
    layoutListResultDo: {
      id: 0,
      layoutName: '',
      layoutFileId: 0,
      fileVo: {
        id: 0,
        originalFileName: '',
        fileName: '',
        fileContentType: '',
        fileExtensionName: '',
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
      layoutContent: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    categoryDetailListResultDo: {
      id: 0,
      categoryId: 0,
      languageId: 0,
      languageCode: '',
      languageName: '',
      categoryName: '',
      parentCategoryNames: [],
      categoryDescription: '',
      categoryFileId: 0,
      fileVo: {
        id: 0,
        originalFileName: '',
        fileName: '',
        fileContentType: '',
        fileExtensionName: '',
        path: '',
        fileUrl: '',
        sha256: '',
      },
      customs: '',
      customList: [],
      isDefault: true,
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    seoListResultDo: {
      id: 0,
      categoryId: 0,
      languageId: 0,
      languageCode: '',
      languageName: '',
      metaTitle: '',
      metaDescription: '',
      isDefault: true,
      remark: '',
      isDelete: 0,
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    slugId: 0,
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

const showCategoryPayload = reactive<ShowCategoryParams>({
  categoryId: id,
  languageId: selectLanguage.value.id,
})

// 获取分类数据
const getCategoryData = async () => {
  loading.init = true
  const { data } = await showCategoryApi(showCategoryPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: CategoryShowData) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
    if (form.parentIds && form.parentIds[0] !== 0) {
      form.parentIds.unshift(0)
    }
    if (!form.categoryDetailListResultDo) {
      return
    }
    if (form.categoryDetailListResultDo.customs) {
      const customData = JSON.parse(form.categoryDetailListResultDo.customs)
      if (customData && customData.length) {
        form.categoryDetailListResultDo.customList = customData
      }
    } else {
      form.categoryDetailListResultDo.customList = []
    }
  })
}

const initFormData = async () => {
  const res = await getCategoryData()
  resetFormData(res)
}

onMounted(async () => {
  await initFormData()
})

watch(
  () => usePreferenceStore().preference?.language,
  async val => {
    if (val) {
      selectLanguage.value = val
      showCategoryPayload.languageId = val.id
      await initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editCategoryStatus = async () => {
  loading.init = true
  const { data } = await editCategoryStatusApi({ categoryId: id, status: form.status, languageId: selectLanguage.value.id }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.edit'))
}

// 更新名称
const inputCategoryNameVisible = ref<boolean>(false)
const currentCategoryName = ref<string>('')
const handleClickUpdateCategoryName = (categoryName: string) => {
  currentCategoryName.value = categoryName
  inputCategoryNameVisible.value = true
}
const handleCancelUpdateCategoryName = () => {
  inputCategoryNameVisible.value = false
}
const editCategoryName = async (categoryDetailId: string) => {
  if (!currentCategoryName.value) {
    ElMessage.warning($t('category.error.categoryName'))
    return
  }
  loading.init = true
  const { data } = await editCategoryNameApi({ categoryDetailId, categoryName: currentCategoryName.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryName.value = ''
  await resetFormData(data)
  inputCategoryNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新父级分类
const handleClickUpdateParentId = async (val: CategoryShowData) => {
  parentDialogRef.value.openDialog(val)
}

// 更改文件
const handleClickUpdateCategoryFile = async ({ fileData }: { fileData: FileData }) => {
  let fileId = null
  if (fileData && fileData.id) {
    fileId = fileData.id
  }
  loading.init = true
  const { data } = await editCategoryFileApi({ categoryDetailId: form.categoryDetailListResultDo.id, categoryFileId: fileId }).catch(error => {
    loading.init = false
    throw error
  })
  await resetFormData(data)
  loading.init = false
  ElMessage.success($t('success.edit'))
}

// 更新描述
const editorRef = ref()
const inputCategoryDescriptionVisible = ref<boolean>(false)
const currentCategoryDescription = ref<string>('<p></p>')
const handleClickUpdateCategoryDescription = async (categoryDescription: string) => {
  currentCategoryDescription.value = categoryDescription
  inputCategoryDescriptionVisible.value = true
  await nextTick(async () => {
    console.log(editorRef.value)
    await editorRef.value?.setEditorContent(categoryDescription)
  })
}
const handleCancelUpdateCategoryDescription = () => {
  inputCategoryDescriptionVisible.value = false
}
const editCategoryDescription = async (categoryDetailId: string) => {
  if (!currentCategoryDescription.value) {
    ElMessage.warning($t('category.error.categoryDescription'))
    return
  }
  currentCategoryDescription.value = editorRef.value?.getEditorContent()
  loading.init = true
  const { data } = await editCategoryDescriptionApi({ categoryDetailId, categoryDescription: currentCategoryDescription.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryDescription.value = ''
  await resetFormData(data)
  inputCategoryDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新元标题
const inputCategoryMetaTitleVisible = ref<boolean>(false)
const currentCategoryMetaTitle = ref<string>('')
const handleClickUpdateCategoryMetaTitle = (categoryMetaTitle: string) => {
  currentCategoryMetaTitle.value = categoryMetaTitle
  inputCategoryMetaTitleVisible.value = true
}
const handleCancelUpdateCategoryMetaTitle = () => {
  inputCategoryMetaTitleVisible.value = false
}
const editCategoryMetaTitle = async (categorySeoId: string) => {
  if (!currentCategoryMetaTitle.value) {
    ElMessage.warning($t('category.error.categoryMetaTitle'))
    return
  }
  loading.init = true
  const { data } = await editCategorySeoApi({ categorySeoId, metaTitle: currentCategoryMetaTitle.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryMetaTitle.value = ''
  await resetFormData(data)
  inputCategoryMetaTitleVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新元描述
const inputCategoryMetaDescriptionVisible = ref<boolean>(false)
const currentCategoryMetaDescription = ref<string>('')
const handleClickUpdateCategoryMetaDescription = (categoryMetaDescription: string) => {
  currentCategoryMetaDescription.value = categoryMetaDescription
  inputCategoryMetaDescriptionVisible.value = true
}
const handleCancelUpdateCategoryMetaDescription = () => {
  inputCategoryMetaDescriptionVisible.value = false
}
const editCategoryMetaDescription = async (categorySeoId: string) => {
  if (!currentCategoryMetaDescription.value) {
    ElMessage.warning($t('category.error.categoryMetaDescription'))
    return
  }
  loading.init = true
  const { data } = await editCategorySeoApi({ categorySeoId, metaTitle: form.seoListResultDo.metaTitle, metaDescription: currentCategoryMetaDescription.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryMetaDescription.value = ''
  await resetFormData(data)
  inputCategoryMetaDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新Slug
const inputCategorySlugVisible = ref<boolean>(false)
const currentSlug = ref<string>('')

const handleClickCreateCategorySlug = async () => {
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }

  const { data } = await createCategorySlugApi({ categoryId: id, languageId: usePreferenceStore().preference?.language.id, slug: currentSlug.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

const handleClickUpdateCategorySlug = () => {
  currentSlug.value = form.slug
  inputCategorySlugVisible.value = true
}
const handleCancelUpdateCategorySlug = () => {
  inputCategorySlugVisible.value = false
}
const editCategorySlug = async () => {
  if (!currentSlug.value) {
    ElMessage.warning($t('category.error.slug'))
    return
  }
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }
  const { data } = await editCategorySlugApi({ slugId: form.slugId, languageId: usePreferenceStore().preference?.language.id, slug: currentSlug.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSlug.value = ''
  await resetFormData(data)
  inputCategorySlugVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 创建分类名称
const createCategoryName = async () => {
  if (!currentCategoryName.value) {
    ElMessage.warning($t('category.error.categoryName'))
    return
  }
  loading.init = true
  const { data } = await createCategoryNameApi({ categoryId: id, languageId: usePreferenceStore().preference?.language.id, categoryName: currentCategoryName.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

// 创建分类SEO
const createCategorySeo = async () => {
  if (!currentCategoryMetaTitle.value) {
    ElMessage.warning($t('category.error.categoryMetaTitle'))
    return
  }
  loading.init = true
  const { data } = await createCategorySeoApi({ categoryId: id, languageId: usePreferenceStore().preference?.language.id, metaTitle: currentCategoryMetaTitle.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryMetaTitle.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

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
const handleEditCategoryLayout = () => {
  form.layoutId = form.layoutId === 0 ? null : form.layoutId
  isShowLayoutEdit.value = true
}

const handleSubmitCategoryLayout = async () => {
  loading.init = true
  if (!form.isCustomLayout) {
    form.layoutId = 0
  }
  const payload = {
    categoryId: id,
    languageId: usePreferenceStore().preference?.language.id,
    isCustomLayout: form.isCustomLayout,
    layoutId: form.layoutId === null ? 0 : form.layoutId,
  }
  const { data } = await editCategoryLayoutApi(payload).catch(error => {
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

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
        <ElTabPane :label="$t('category.base')" name="base">
          <ElCard v-if="form.categoryDetailListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <!-- 分类名称 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('category.categoryName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputCategoryNameVisible" class="mr-2">{{ form.categoryDetailListResultDo.categoryName }} </span>
                  <span v-else>
                    <ElInput
                      v-model="currentCategoryName"
                      style="width:300px"
                      class="mr-2"
                      @blur="editCategoryName(form.categoryDetailListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateCategoryName">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn v-if="!inputCategoryNameVisible" type="primary" text @click="handleClickUpdateCategoryName(form.categoryDetailListResultDo.categoryName)">
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
              <!-- 父类 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('category.parentId') }}:
                </div>
                <div class="col-span-11">
                  <span v-if="form.parentId === 0" class="mr-2">{{ $t('category.topCategory') }}</span>
                  <span v-else class="mr-2">
                    {{ form.categoryDetailListResultDo.parentCategoryNames.join(' / ') }}
                  </span>
                  <span>
                    <EBtn type="primary" text @click="handleClickUpdateParentId(form)">
                      <Icon icon="ep:edit" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                </div>
              </div>
              <!-- 图片 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('category.image') }}:
                </div>
                <div class="col-span-11">
                  <div class="w-fullf flex">
                    <UploadSingleImage ref="uploadSingleImageRef" :image-data="form.categoryDetailListResultDo.fileVo" class="mr-2" style="width: 200px" @get-data="handleClickUpdateCategoryFile" />
                  </div>
                </div>
              </div>
              <!-- 描述 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('category.description') }}:
                </div>
                <div class="col-span-11">
                  <div v-if="!inputCategoryDescriptionVisible" class="mr-2">
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-1 flex items-center">
                        <EBtn v-if="!inputCategoryNameVisible" type="primary" text @click="handleClickUpdateCategoryDescription(form.categoryDetailListResultDo.categoryDescription)">
                          <Icon icon="ep:edit" :size="5" class="mr-1" />{{ $t('common.edit') }}
                        </EBtn>
                      </div>
                      <div class="col-span-12 border border-gray-200 p-4">
                        <div v-html="form.categoryDetailListResultDo.categoryDescription" />
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <Editor ref="editorRef" v-model="currentCategoryDescription" class="mb-5" />
                    <div class="flex justify-center items-center">
                      <EBtn @click="handleCancelUpdateCategoryDescription">
                        {{ $t('common.cancel') }}
                      </EBtn>
                      <EBtn type="primary" @click="editCategoryDescription(form.categoryDetailListResultDo.id)">
                        {{ $t('common.save') }}
                      </EBtn>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 自定义信息 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('category.customs') }}:
                </div>
                <div class="col-span-11">
                  <CustomsTable :custom-list="form.categoryDetailListResultDo.customList" :category-detail-id="form.categoryDetailListResultDo.id" />
                </div>
              </div>
            </div>
          </ElCard>
          <ElCard v-else>
            <div class="flex justify-center items-center mb-5">
              <ElAlert :title="$t('category.warning.noDetailData')" type="warning" show-icon />
            </div>
            <div class="flex justify-center items-center mb-5">
              <ElInput v-model="currentCategoryName" :placeholder="$t('category.placeholder.categoryName')" />
              <EBtn type="primary" class="ml-5" @click="createCategoryName">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('category.seo')" name="seo">
          <ElCard v-if="form.seoListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <!-- 分类元标题 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('category.metaTitle') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputCategoryMetaTitleVisible" class="mr-2">{{ form.seoListResultDo.metaTitle }} </span>
                  <span v-else>
                    <ElInput
                      v-model="currentCategoryMetaTitle"
                      style="width:300px"
                      class="mr-2"
                      @blur="editCategoryMetaTitle(form.seoListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateCategoryMetaTitle">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn v-if="!inputCategoryMetaTitleVisible" type="primary" text @click="handleClickUpdateCategoryMetaTitle(form.seoListResultDo.metaTitle)">
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
              <!-- 分类元描述 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('category.metaDescription') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputCategoryMetaDescriptionVisible" class="mr-2">{{ form.seoListResultDo.metaDescription }} </span>
                  <span v-else>
                    <ElInput
                      v-model="currentCategoryMetaDescription"
                      style="width:300px"
                      class="mr-2"
                      @blur="editCategoryMetaDescription(form.seoListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateCategoryMetaDescription">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn v-if="!inputCategoryMetaDescriptionVisible" type="primary" text @click="handleClickUpdateCategoryMetaDescription(form.seoListResultDo.metaDescription)">
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
            </div>
          </ElCard>
          <ElCard v-else shadow="never" class="mb-5">
            <div class="flex justify-center items-center mb-5">
              <ElAlert :title="$t('category.warning.noSeoData')" type="warning" show-icon />
            </div>
            <div class="flex justify-center items-center mb-5">
              <ElInput v-model="currentCategoryMetaTitle" :placeholder="$t('category.placeholder.metaTItle')" />
              <EBtn type="primary" class="ml-5" @click="createCategorySeo">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('category.layout')" name="layout">
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
                        <EBtn type="primary" text @click="handleEditCategoryLayout">
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
                      <EBtn type="danger" @click="handleSubmitCategoryLayout">
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
        <ElTabPane :label="$t('category.slug')" name="slug">
          <ElCard shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div v-if="!form.slug || !form.slugId" class="mb-5">
                <div class="w-full flex items-center mb-5">
                  <ElAlert :title="$t('category.warning.noSlugData')" type="warning" show-icon />
                </div>
                <div class="w-full flex items-center mb-5">
                  <ElInput v-model="currentSlug" :placeholder="$t('category.placeholder.slug')" />
                </div>
                <EBtn type="primary" class="ml-5" @click="handleClickCreateCategorySlug">
                  <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                  {{ $t('common.save') }}
                </EBtn>
              </div>
              <div v-else class="mb-5">
                <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                  <div class="col-span-1 font-semibold text-gray-700">
                    {{ $t('category.slug') }}:
                  </div>
                  <div class="col-span-11 w-full flex items-center">
                    <div v-if="!inputCategorySlugVisible" class="mr-2">
                      {{ form.slug }}
                    </div>
                    <div v-else class="flex items-center justify-start">
                      <ElInput
                        v-model="currentSlug"
                        :placeholder="$t('category.placeholder.slug')"
                        class="mr-2"
                      />
                      <EBtn text @click="handleCancelUpdateCategorySlug">
                        <Icon icon="ep:close" :size="5" class="mr-1" />
                      </EBtn>
                      <EBtn type="primary" class="ml-5" @click="editCategorySlug">
                        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                        {{ $t('common.save') }}
                      </EBtn>
                    </div>
                    <EBtn v-if="!inputCategorySlugVisible" type="primary" text @click="handleClickUpdateCategorySlug">
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

    <ParentCatalog ref="parentDialogRef" @init-form-data="initFormData" />
  </div>
</template>
