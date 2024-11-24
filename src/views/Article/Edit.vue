<script setup lang="ts">
import { editArticleApi, fetchArticleTypeListApi, showArticleApi } from '@/api/article'
import { listCategoryApi } from '@/api/category'
import { components } from '@/data/component'
import { useLocale } from '@/hooks/useLocale'
import { useLanguageStore } from '@/stores/language'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import { convertCustomTypeValue } from '@/utils/general'
import { ElCard, ElInput, ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const { t: $t } = useLocale()

const languages = useLanguageStore().languages

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const uploadRef = ref()

const vueDraggableRef = ref()

const sourceUrl = useFileRootUrl()

const rules = reactive({
  articleType: [{ required: true, type: 'number', message: '内容类型必填', trigger: 'change' }],
  languageId: [{ required: true, type: 'number', message: '语言必须选择', trigger: 'change' }],
  status: [{ required: true, type: 'boolean', message: '状态必填', trigger: 'change' }],
})

const currentArticleDetailFormRules = reactive({
  articleName: [{ required: true, type: 'string', message: '内容名称必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = $t('article.edit')

const articleTypePayload = reactive<ArticleTypeListParams>({
  articleTypeCode: null,
})

const articleTypes = ref<ListArticleTypeRes>({
  list: [],
  total: 0,
})

const getArticleTypeList = async () => {
  const { data } = await fetchArticleTypeListApi(articleTypePayload).catch(error => {
    throw error
  })
  articleTypes.value = { ...data }
}

getArticleTypeList()

const articleFormRef = ref()

const customs = ref<any[]>([])

const customRef = ref()

const currentComponentRef = ref()

const customVisible = ref(false)

const editorRef = ref()

const customLayouts = ref<ComponentData[]>([])

const currentCustomData = ref({
  id: 0,
  customTitle: '',
  customContent: '',
})

const currentDetailFormRef = ref()

const currentDetailForm = reactive<ArticleDetailCreateParams>({
  languageId: 0,
  languageName: '',
  articleName: '',
  metaTitle: '',
  metaDescription: '',
  articleDescription: '',
  customs: '',
  fileIds: [],
  deleteArticleFileIds: [],
  tags: [],
  deleteArticleTagIds: [],
})

const createArticleForm = () => {
  return {
    articleType: 1,
    isCustomLayout: false,
    categoryIds: [],
    deletedCategoryIds: [],
    status: true,
    articleDetailVoList: [],
  }
}

const articleForm = reactive<ArticleCreateRequest>(createArticleForm())

const id = Number(useRoute().params.id)

const isShowCurrentDetail = ref(false)

const handleAddDetail = () => {
  console.log(selectLanguage.value)
  currentDetailForm.languageId = selectLanguage.value.id
  currentDetailForm.languageName = selectLanguage.value.languageName
  console.log(currentDetailForm)
  console.log(articleForm.articleDetailVoList)
  if (articleForm.articleDetailVoList && articleForm.articleDetailVoList.length > 0) {
    const index = articleForm.articleDetailVoList.findIndex(
      (item: ArticleDetailCreateParams) => item.languageId === currentDetailForm.languageId,
    )
    if (index !== -1) {
      ElMessage.error($t('article.error.duplicateLanguage') as string)
      return
    }
  }
  isShowCurrentDetail.value = true
}

const handleEditArticleDetail = async (val: ArticleDetailCreateParams) => {
  isShowCurrentDetail.value = true
  await nextTick()
  if (editorRef.value) {
    editorRef.value.setEditorData(val.articleDescription)
  }
  customs.value = JSON.parse(val.customs || '[]')
  customLayouts.value = customs.value
  if (val.articleFileList && val.articleFileList.length > 0) {
    const fileDataList: FileData[] = []
    val.articleFileList.map((item: ArticleFileData) => {
      fileDataList.push(item.tbFileVo)
    })
    uploadRef.value.setFileData(fileDataList)
  }
  val.articleTagList?.map((item: ArticleTagData) => {
    currentDetailForm.tags?.push(item.tagName)
  })
  Object.assign(currentDetailForm, val)
}

const handleDeleteArticleDetail = (index: number) => {
  articleForm.articleDetailVoList.splice(index, 1)
}

const handleCancelEditArticleDetailItem = async () => {
  currentDetailForm.languageId = 0
  currentDetailForm.articleName = ''
  currentDetailForm.metaTitle = ''
  currentDetailForm.metaDescription = ''
  currentDetailForm.articleDescription = ''
  currentDetailForm.customs = ''
  currentDetailForm.fileIds = []
  currentDetailForm.tags = []
  customs.value = []
  await nextTick()
  if (editorRef.value) {
    editorRef.value.setEditorData('<p></p>')
  }
  if (uploadRef.value) {
    uploadRef.value.setFileData([])
  }
  isShowCurrentDetail.value = false
}

const handleSaveArticleDetailItem = async () => {
  const valid = await currentDetailFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  if (!currentDetailForm.languageId) {
    currentDetailForm.languageId = selectLanguage.value.id
    currentDetailForm.languageName = selectLanguage.value.languageName
  }
  if (articleForm.isCustomLayout) {
    currentDetailForm.customs = JSON.stringify(customLayouts.value)
  } else {
    currentDetailForm.customs = JSON.stringify(customs.value)
    currentDetailForm.articleDescription = editorRef.value.getEditorData()
    const files = uploadRef.value.getFileData()
    if (files.fileDataList && files.fileDataList.length > 0) {
      files.fileDataList.map((item: FileData) => {
        currentDetailForm.fileIds?.push(item.id as number)
      })
    }
  }

  const currentArticleFormData = jsonParse(currentDetailForm)
  // 如果articleForm.articleDetailVoList中有相同languageId的数据时，直接覆盖，否则push到数组中
  const index = articleForm.articleDetailVoList.findIndex(
    (item: ArticleDetailCreateParams) => item.languageId === currentDetailForm.languageId,
  )
  if (index !== -1) {
    articleForm.articleDetailVoList.splice(index, 1, currentArticleFormData)
  } else {
    articleForm.articleDetailVoList.push(currentArticleFormData)
  }
  currentDetailForm.languageId = 0
  currentDetailForm.articleName = ''
  currentDetailForm.metaTitle = ''
  currentDetailForm.metaDescription = ''
  currentDetailForm.articleDescription = ''
  currentDetailForm.customs = ''
  currentDetailForm.fileIds = []
  currentDetailForm.tags = []
  customs.value = []
  await nextTick()
  if (editorRef.value) {
    editorRef.value.setEditorData('<p></p>')
  }
  if (uploadRef.value) {
    uploadRef.value.setFileData([])
  }
  isShowCurrentDetail.value = false
}

const categories = ref<any[]>([])

const inputTagValue = ref<string>('')
const inputTagVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const tags = ref<TagItemType[]>([])

const handleClose = (index: number) => {
  if (tags.value && tags.value.length > 0) {
    tags.value.splice(index, 1)
  }
}

const showInput = () => {
  inputTagVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputTagValue.value.length >= 3) {
    currentDetailForm.tags?.push(inputTagValue.value)
  }
  inputTagVisible.value = false
  inputTagValue.value = ''
}

const getCategories = async () => {
  try {
    const payload = {
      languageCode: selectLanguage.value.code,
    }
    const { data } = await listCategoryApi(payload)
    categories.value = data.list
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const selectedCategoryValue = ref<string[] | number[] | any>([])

const cascaderProps = {
  expandTrigger: 'hover' as const,
  label: 'categoryName',
  value: 'id',
  multiple: true,
}

const handleChangeCategory = (val: number[]) => {
  console.log(val)
}

const initCustomData = () => {
  currentCustomData.value = {
    id: 0,
    customTitle: '',
    customContent: '',
  }
  customRef.value.setFormData(currentCustomData.value)
}

const handleAddCustom = () => {
  customVisible.value = true
}

const handleRemoveCustom = (index: number) => {
  customs.value.splice(index, 1)
}

const handleEditCustom = (index: number) => {
  customVisible.value = true
  currentCustomData.value = customs.value[index]
  customRef.value.setFormData(currentCustomData.value)
}

const cancelEditCustomData = () => {
  customVisible.value = false
  initCustomData()
}

const getCustomData = (val: CustomDataType) => {
  if (val.id === 0) {
    val.id = customs.value.length + 1
    customs.value.push(val)
  } else {
    customs.value.forEach((item, index) => {
      if (item.id === val.id) {
        customs.value[index] = val
      }
    })
  }
  initCustomData()
  customVisible.value = false
}

const closeViewTag = () => { }

// 动态导入所有组件
const componentModules = import.meta.glob('@/components/Theme/Components/*.vue')

// 动态获取组件
const getComponent = (componentCode: string) => {
  const componentPath = `/src/components/Theme/Components/${componentCode}.vue`
  if (componentModules[componentPath]) {
    return defineAsyncComponent(componentModules[componentPath] as () => Promise<any>)
  } else {
    console.error(`Component not found: ${componentCode}`)
    return null
  }
}

// 添加组件Dialog是否显示
const addComponentDialogVisible = ref<boolean>(false)

// 添加组件
const handleAddComponent = () => {
  addComponentDialogVisible.value = true
}

const dragging = ref(false)

function sortCurrentThemeContentComponents() {
  customLayouts.value.forEach((item, index) => {
    item.sort = index + 1
  })
}

function dragEnd() {
  sortCurrentThemeContentComponents()
}

// 设置组件Dialog是否显示
const settingComponentDialogVisible = ref<boolean>(false)

const createComponentData = (): ComponentData => {
  return {
    backendComponentCode: '',
    componentConfig: {
      content: {},
      status: true,
    },
    componentName: '',
    isRequiredAliasName: false,
    aliasName: '',
    id: 0,
    sort: 0,
    frontComponentIdentifyCode: '',
  }
}

// 组件选择的数据
const selectComponentData = ref<ComponentData>(createComponentData())

// 当前设置的组件
const currentComponentData = ref<ComponentData | null>(null)

const aliasName = ref<string>('')

// 设置组件
const handleSettingComponent = async (item: ComponentData) => {
  if (!item.isRequiredAliasName) {
    item.isRequiredAliasName = true
    item.aliasName = item.componentName
  }
  aliasName.value = item.aliasName
  currentComponentData.value = item
  settingComponentDialogVisible.value = true
}

// 删除组件
const handleRemoveComponent = (index: number) => {
  customLayouts.value.splice(index, 1)
}

// 保存当前主题内容数据
const handleSaveCustomLayouts = () => {
  if (customLayouts.value.length > 0) {
    // 计算相同的 backendComponentCode 数量
    const sameComponentCount = customLayouts.value.filter(
      component => component.backendComponentCode === selectComponentData.value.backendComponentCode,
    ).length
    if (sameComponentCount > 0) {
      // 如果存在相同组件，编号从 1 开始
      selectComponentData.value.frontComponentIdentifyCode = `${selectComponentData.value.backendComponentCode}${sameComponentCount + 1}`
    } else {
      // 如果不存在相同组件，编号也从 1 开始
      selectComponentData.value.frontComponentIdentifyCode = `${selectComponentData.value.backendComponentCode}1`
    }
  } else {
    // 如果没有其他组件，编号从 1 开始
    selectComponentData.value.frontComponentIdentifyCode = `${selectComponentData.value.backendComponentCode}1`
  }

  // 设置 id 和排序，保证唯一
  const newComponentData = { ...selectComponentData.value } // 创建新对象副本
  newComponentData.id = customLayouts.value.length + 1
  newComponentData.sort = customLayouts.value.length + 1

  customLayouts.value.push(newComponentData)

  // 重置 selectComponentData
  selectComponentData.value = createComponentData()

  addComponentDialogVisible.value = false
}

// 保存当前组件数据
const handleSaveCurrentComponentData = async () => {
  if (currentComponentRef.value && typeof currentComponentRef.value.getFormData === 'function') {
    const formData = await currentComponentRef.value.getFormData()
    if (!formData) {
      return
    }
    customLayouts.value.map(item => {
      if (item.frontComponentIdentifyCode === currentComponentData.value?.frontComponentIdentifyCode) {
        item.componentConfig = formData
        item.aliasName = aliasName.value
      }
    })
  } else {
    console.error('Component does not have getFormData method')
  }
  currentComponentRef.value = null
  settingComponentDialogVisible.value = false
  currentComponentData.value = null
}

const getArticleData = async () => {
  loading.init = true

  const { data } = await showArticle(id).catch(err => {
    loading.init = false
    throw err
  })
  isShowCurrentDetail.value = false
  selectedCategoryValue.value = data.categoryIds
  Object.assign(articleForm, data)
  articleForm.articleDetailVoList = data.articleDetailShowResultDoList
  articleForm.articleDetailVoList.map(item => {
    const tags = []
    if (item.articleTagList && item.articleTagList.length > 0) {
      tags.push(...item.articleTagList.map(tag => tag.tagName))
    }
    item.tags = tags
    const fileIds = []
    if (item.articleFileList && item.articleFileList.length > 0) {
      fileIds.push(...item.articleFileList.map(file => file.tbFileVo.id))
    }
    item.fileIds = fileIds
    return item
  })
  loading.init = false
}

onMounted(async () => {
  await getArticleData()
})

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'Article' })
}

const save = async () => {
  articleForm.categoryIds = [...new Set(selectedCategoryValue.value.flat() as number[])]
  // 如果article.articleDetailVoList为空，直接返回
  if (articleForm.articleDetailVoList.length === 0) {
    ElMessage.error($t('article.error.noContent') as string)
    return
  }
  const valid = await articleFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  await editArticle(id, articleForm).catch(err => {
    throw err
  })

  deleteTagView(true)
  ElMessage({
    message: '保存成功',
    type: 'success',
    duration: 2000,
  })
}

onMounted(() => {
  getCategories()
})
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <h4>{{ pageTitle }}</h4>
        </div>
        <div>
          <EBtn size="small" :loading="loading.button" @click="closeViewTag()">
            <Icon icon="ant-design:close-outlined" class="mr-1" />
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn size="small" type="primary" :loading="loading.button" @click="save">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </div>
    <div class="view-main theme-card">
      <ElForm ref="articleFormRef" :model="articleForm" :rules="rules" label-width="120px">
        <!-- 基础信息 -->
        <ElCard shadow="never" class="mb-5">
          <template #header>
            <div class="card-header">
              <span>{{ $t('article.base') }}</span>
            </div>
          </template>
          <div class="flex flex-wrap items-center">
            <!-- 第一部分：ElSelect -->
            <div class="mr-4 flex items-center w-80">
              <ElFormItem label="内容类型" prop="articleType" class="w-full">
                <ElSelect v-model="articleForm.articleType" class="flex-1">
                  <ElOption
                    v-for="item in articleTypes.list"
                    :key="item.id"
                    :value="item.id"
                    :label="item.articleTypeName"
                  />
                </ElSelect>
              </ElFormItem>
            </div>

            <!-- 第二部分：ElSwitch 是否自定义布局 -->
            <div v-if="articleForm.articleType === 2" class="mr-4 flex items-center">
              <ElFormItem label="是否自定义布局" prop="isCustomLayout" class="w-full">
                <ElSwitch v-model="articleForm.isCustomLayout" />
              </ElFormItem>
            </div>

            <!-- 第三部分：ElSwitch 状态 -->
            <div class="mr-4 flex items-center">
              <ElFormItem label="状态" prop="status" class="w-full">
                <ElSwitch v-model="articleForm.status" />
              </ElFormItem>
            </div>

            <!-- 第四部分：ElCascader 所在分类 -->
            <div v-if="articleForm.articleType !== 2" class="flex-1 flex items-center">
              <ElFormItem label="分类" prop="categoryId" class="w-full">
                <ElCascader
                  v-model="selectedCategoryValue"
                  :options="categories"
                  :props="cascaderProps"
                  clearable
                  filterable
                  class="flex-1 w-full"
                  @change="handleChangeCategory"
                />
              </ElFormItem>
            </div>
          </div>
        </ElCard>
        <ElCard shadow="never" class="mb-5 theme-card">
          <template #header>
            <div class="flex justify-between">
              <div>{{ $t('article.content') }}</div>
              <div v-if="articleForm.articleDetailVoList.length !== 0 && !isShowCurrentDetail" class="flex items-center justify-start">
                <ElSelect
                  v-model="selectLanguage"
                  :placeholder="$t('placeholder.select')"
                  value-key="id"
                  filterable
                  clearable
                  class="mr-3"
                  style="width: 200px"
                >
                  <ElOption v-for="item in languages" :key="item.id" :label="item.languageName" :value="item" />
                </ElSelect>
                <EBtn size="default" plain type="primary" @click="handleAddDetail">
                  <Icon icon="ep:plus" class="mr-1" />
                  {{ $t('common.create') }}{{ $t('common.language') }}
                </EBtn>
              </div>
              <div v-else class="flex">
                <EBtn size="default" plain type="primary" @click="handleCancelEditArticleDetailItem">
                  <Icon icon="ant-design:close-outlined" class="mr-1" />
                  {{ $t('common.cancel') }}
                </EBtn>
                <EBtn size="default" plain type="primary" @click="handleSaveArticleDetailItem">
                  <Icon icon="ant-design:save-outlined" class="mr-1" />
                  {{ $t('common.save') }}
                </EBtn>
              </div>
            </div>
          </template>
          <div class="bg-gray-50 px-5 py-5">
            <div v-if="articleForm.articleDetailVoList?.length !== 0 && !isShowCurrentDetail">
              <ElCard
                v-for="(item, index) in articleForm.articleDetailVoList"
                :key="index"
                shadow="never"
                :label="item.languageName"
                :name="item.languageName"
                class="mb-5 cursor-pointer"
                @click="handleEditArticleDetail(item)"
              >
                <div class="flex justify-between items-center">
                  <div class="flex">
                    <ElTag class="mr-2">
                      {{ item.languageName }}
                    </ElTag>
                    <div class="mr-2">
                      {{ item.articleName }}
                    </div>
                  </div>
                  <div>
                    <EBtn type="primary" @click="handleEditArticleDetail(item)">
                      <Icon icon="ep:edit" class="mr-1" />
                    </EBtn>
                    <EBtn type="danger" @click="handleDeleteArticleDetail(index)">
                      <Icon icon="ep:delete" class="mr-1" />
                    </EBtn>
                  </div>
                </div>
              </ElCard>
            </div>
            <div v-else>
              <ElForm ref="currentDetailFormRef" :model="currentDetailForm" :rules="currentArticleDetailFormRules" label-width="120px">
                <div class="grid grid-cols-3 gap-5">
                  <div v-if="!articleForm.isCustomLayout" class="col-span-2">
                    <ElCard shadow="never" class="w-full mb-5">
                      <template #header>
                        <div class="card-header">
                          <span>{{ $t('article.base') }}</span>
                        </div>
                      </template>
                      <ElFormItem label="标题" prop="articleName">
                        <ElInput
                          v-model="currentDetailForm.articleName"
                          minlength="1"
                          maxlength="120"
                          placeholder="标题，少于120个字符"
                        />
                      </ElFormItem>
                      <ElFormItem label="内容" prop="articleDescription">
                        <Editor ref="editorRef" v-model="currentDetailForm.articleDescription" :height="300" />
                      </ElFormItem>
                      <ElFormItem label="内容标签">
                        <ElTag
                          v-for="(tag, index) in currentDetailForm.tags"
                          :key="index"
                          closable
                          :disable-transitions="false"
                          class="mr-2"
                          @close="handleClose(index)"
                        >
                          {{ tag }}
                        </ElTag>
                        <ElInput
                          v-if="inputTagVisible"
                          ref="InputRef"
                          v-model="inputTagValue"
                          class="w-20"
                          style="width: 100px"
                          size="small"
                          @keyup.enter="handleInputConfirm"
                          @blur="handleInputConfirm"
                        />
                        <EBtn v-else class="button-new-tag" size="small" @click="showInput">
                          + 新标签
                        </EBtn>
                      </ElFormItem>
                      <ElFormItem label="图片">
                        <UploadMultiImage ref="uploadRef" />
                      </ElFormItem>
                      <ElFormItem label="自定义信息" class="flex flex-wrap">
                        <div class="w-full mb-5">
                          <EBtn @click="handleAddCustom">
                            添加自定义信息
                          </EBtn>
                        </div>
                        <div v-if="customs.length > 0" class="w-full mb-5">
                          <ElTable :data="customs">
                            <ElTableColumn label="标题" prop="customTitle" />
                            <ElTableColumn label="类型">
                              <template #default="scope">
                                <span>{{ convertCustomTypeValue(scope.row.customType) }}</span>
                              </template>
                            </ElTableColumn>
                            <ElTableColumn label="内容" prop="customContent">
                              <template #default="scope">
                                <div v-if="scope.row.customType === 'text'">
                                  {{ scope.row.customContent }}
                                </div>
                                <div v-if="scope.row.customType === 'editor'">
                                  <div v-html="scope.row.customContent" />
                                </div>
                                <div v-if="scope.row.customType === 'image'">
                                  <div v-for="item in scope.row.customContent" :key="item">
                                    <div class="flex justify-start mb-5 space-x-0 sm:space-x-2 overflow-x-auto">
                                      <ElImage class="w-32 sm:w-40" :src="`${sourceUrl}${item.fileUrl}`" fit="contain" />
                                    </div>
                                  </div>
                                </div>
                                <div v-if="scope.row.customType === 'video'">
                                  <div class="flex justify-start mb-5 space-x-0 sm:space-x-2 overflow-x-auto">
                                    <video
                                      class="w-32 sm:w-40"
                                      :src="`${sourceUrl}${scope.row.customContent.fileUrl}`"
                                      fit="contain"
                                    />
                                  </div>
                                </div>
                              </template>
                            </ElTableColumn>
                            <ElTableColumn label="操作">
                              <template #default="scope">
                                <EBtn @click="handleEditCustom(scope.$index)">
                                  修改
                                </EBtn>
                                <EBtn @click="handleRemoveCustom(scope.$index)">
                                  删除
                                </EBtn>
                              </template>
                            </ElTableColumn>
                          </ElTable>
                        </div>
                        <div v-show="customVisible" class="w-full mb-5">
                          <Customs
                            ref="customRef"
                            @get-custom-data="getCustomData"
                            @cancel-edit-custom-data="cancelEditCustomData"
                          />
                        </div>
                      </ElFormItem>
                    </ElCard>
                  </div>
                  <div v-else class="col-span-2">
                    <ElCard shadow="never">
                      <template #header>
                        <div class="card-header">
                          <div class="flex justify-between items-center">
                            <span>组件</span>
                            <div class="flex justify-between">
                              <div class="flex items-center justify-between cursor-pointer" @click="handleAddComponent">
                                <span><Icon icon="ant-design:plus-outlined" class="mr-1" /></span>
                                <span>添加</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                      <VueDraggable ref="vueDraggableRef" v-model="customLayouts" item-key="sort" @start="dragging = true" @end="dragEnd">
                        <div
                          v-for="(item, index) in customLayouts" :key="index"
                          class="w-full mb-3 h-9 flex justify-between items-center border-1 border-gray-300 px-6 py-6 cursor-pointer"
                        >
                          <span class="flex flex-grow items-center">
                            <Icon icon="ant-design:holder-outlined" class="mr-1" />
                            <ElTag type="info" class="mr-1">排序：{{ item.sort }}</ElTag>
                            <ElTag type="warning" class="mr-1">{{ item.componentName }}</ElTag>
                            <ElTag v-if="item.aliasName" class="mr-1">{{ item.aliasName }}</ElTag>
                            <ElTag :type="`${item.componentConfig.status ? 'success' : 'danger'}`">{{ item.componentConfig.status ? '启用' : '禁用' }}</ElTag>
                          </span>
                          <span class="flex">
                            <EBtn text @click="handleSettingComponent(item)">设置</EBtn>
                            <EBtn text type="danger" @click="handleRemoveComponent(index)">删除</EBtn>
                          </span>
                        </div>
                      </VueDraggable>
                    </ElCard>
                  </div>
                  <div class="col-span-1">
                    <ElCard shadow="never" class="w-full">
                      <template #header>
                        <div class="card-header">
                          <span>{{ $t('article.seo') }}</span>
                        </div>
                      </template>
                      <ElFormItem label="元标题" prop="metaTitle">
                        <ElInput
                          v-model="currentDetailForm.metaTitle"
                          class="input-line"
                          minlength="1"
                          maxlength="60"
                          placeholder="元标题，少于60个字符"
                        />
                      </ElFormItem>
                      <ElFormItem label="元描述" prop="metaDescription">
                        <ElInput
                          v-model="currentDetailForm.metaDescription"
                          class="input-line"
                          type="textarea"
                          rows="4"
                          maxlength="160"
                          placeholder="描述，少于160个字符"
                        />
                      </ElFormItem>
                    </ElCard>
                  </div>
                </div>
              </ElForm>
            </div>
          </div>
        </ElCard>
      </ElForm>
    </div>

    <ElDialog v-model="addComponentDialogVisible" title="添加组件">
      <ElSelect v-model="selectComponentData" value-key="id" placeholder="请选择">
        <ElOption v-for="item in components" :key="item.id" :label="item.componentName" :value="item" />
      </ElSelect>
      <template #footer>
        <div class="dialog-footer">
          <EBtn @click="addComponentDialogVisible = false">
            取消
          </EBtn>
          <EBtn type="primary" @click="handleSaveCustomLayouts">
            提交
          </EBtn>
        </div>
      </template>
    </ElDialog>

    <ElDialog v-model="settingComponentDialogVisible" title="设置组件" width="70%">
      <div v-if="currentComponentData?.isRequiredAliasName">
        <ElForm label-width="140px">
          <ElFormItem label="组件别名" required>
            <ElInput v-model="aliasName" placeholder="请输入组件别名" />
          </ElFormItem>
        </ElForm>
      </div>
      <!-- 使用Vue3的动态组件，根据backendComponentCode获取对应的组件，动态展示 -->
      <component
        :is="getComponent(currentComponentData.backendComponentCode)"
        v-if="currentComponentData && currentComponentData.componentConfig"
        ref="currentComponentRef"
        :component-data="currentComponentData.componentConfig"
        v-bind="currentComponentData"
      />
      <template #footer>
        <div class="dialog-footer">
          <EBtn @click="settingComponentDialogVisible = false">
            取消
          </EBtn>
          <EBtn type="primary" @click="handleSaveCurrentComponentData">
            提交
          </EBtn>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped></style>
