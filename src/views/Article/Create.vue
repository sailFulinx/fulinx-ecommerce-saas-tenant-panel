<script setup lang="ts">
import { CreateArticleApi, fetchArticleTypeListApi } from '@/api/article'
import { listCategoryApi } from '@/api/category'
import { layoutListApi } from '@/api/layout'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import { convertCustomTypeValue } from '@/utils/general'
import { ElCard, ElInput, ElMessage } from 'element-plus'

const { t: $t } = useLocale()

const uploadRef = ref()

const sourceUrl = useFileRootUrl()

const rules = reactive({
  articleType: [{ required: true, type: 'number', message: '内容类型必填', trigger: 'change' }],
  languageId: [{ required: true, type: 'number', message: '语言必须选择', trigger: 'change' }],
  status: [{ required: true, type: 'boolean', message: '状态必填', trigger: 'change' }],
  articleName: [{ required: true, type: 'string', message: '内容名称必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = $t('article.add')

const listLayoutPayload = reactive<LayoutListParams>({
  layoutName: null,
})

const listLayoutData = ref<TableResponse<LayoutData & CommonField>>({
  list: [],
  total: 0,
})

const getLayoutList = async () => {
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
}

getLayoutList()

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

const customVisible = ref(false)

const editorRef = ref()

const currentCustomData = ref({
  id: 0,
  customTitle: '',
  customContent: '',
})

const createArticleForm = (): CreateArticleParams => {
  return {
    articleType: null,
    languageId: '',
    isCustomLayout: false,
    layoutId: null,
    categoryIds: [],
    status: true,
    articleName: '',
    metaTitle: '',
    metaDescription: '',
    articleDescription: '',
    customs: '',
    articleFileVoList: [],
    tags: [],
  }
}

const articleForm = reactive<CreateArticleParams>(createArticleForm())

const categories = ref<any[]>([])

const inputTagValue = ref<string>('')
const inputTagVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const tags = ref<string[]>([])

const handleCloseTag = (index: number) => {
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
    articleForm.tags?.push(inputTagValue.value)
  }
  inputTagVisible.value = false
  inputTagValue.value = ''
}

const getCategories = async () => {
  try {
    const payload = {
      languageId: usePreferenceStore().preference.language.id,
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

const closeViewTag = () => {}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'Article' })
}

const save = async () => {
  articleForm.languageId = usePreferenceStore().preference.language.id
  articleForm.categoryIds = [...new Set(selectedCategoryValue.value.flat() as number[])]
  articleForm.articleDescription = editorRef.value.getEditorContent()
  if (!articleForm.isCustomLayout) {
    articleForm.layoutId = null
  }
  articleForm.customs = JSON.stringify(customs.value)
  const files = uploadRef.value.getFileData()
  if (files && files.fileDataList && files.fileDataList.length > 0) {
    files.fileDataList.forEach((item: FileData & CommonField, index: number) => {
      articleForm.articleFileVoList?.push({
        articleFileId: item.id,
        isDefault: index === 0,
        sort: item?.sort || 0,
      })
    })
  }
  console.log(files)
  console.log(articleForm)
  const valid = await articleFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  await CreateArticleApi(articleForm).catch(err => {
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

          <div class="grid grid-cols-4">
            <!-- 去掉 flex-wrap -->
            <!-- 第一部分：ElSelect -->
            <div class="col-span-1 mr-4 flex items-center">
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
            <div class="col-span-1 mr-4 flex items-center">
              <!-- 调整宽度 -->
              <ElFormItem label="是否自定义布局" prop="isCustomLayout" class="w-full">
                <ElSwitch v-model="articleForm.isCustomLayout" class="mr-4" />
                <ElSelect
                  v-if="articleForm.isCustomLayout"
                  v-model="articleForm.layoutId"
                  clearable
                  filterable
                  :placeholder="$t('article.placeholder.layout')"
                  class="flex-1"
                >
                  <ElOption
                    v-for="item in listLayoutData.list"
                    :key="item.id"
                    :label="item.layoutName"
                    :value="item.id"
                  />
                </ElSelect>
              </ElFormItem>
            </div>

            <!-- 第三部分：ElCascader 所在分类 -->
            <div v-if="articleForm.articleType !== 2" class="col-span-1 mr-4 flex items-center">
              <!-- 适当增加宽度 -->
              <ElFormItem label="分类" prop="categoryId" class="w-full">
                <ElCascader
                  v-model="selectedCategoryValue"
                  :options="categories"
                  :props="cascaderProps"
                  clearable
                  filterable
                  class="w-full"
                  @change="handleChangeCategory"
                />
              </ElFormItem>
            </div>

            <!-- 第四部分：ElSwitch 状态 -->
            <div class="col-span-1 flex items-center">
              <!-- 控制宽度一致 -->
              <ElFormItem label="状态" prop="status" class="w-full">
                <ElSwitch v-model="articleForm.status" />
              </ElFormItem>
            </div>
          </div>
        </ElCard>

        <ElCard shadow="never" class="mb-5 theme-card">
          <template #header>
            <div class="flex justify-between">
              <div>{{ $t('article.content') }}</div>
            </div>
          </template>
          <div>
            <div class="grid grid-cols-3 gap-5">
              <div class="col-span-2">
                <ElCard shadow="never" class="w-full mb-5">
                  <template #header>
                    <div class="card-header">
                      <span>{{ $t('article.base') }}</span>
                    </div>
                  </template>
                  <ElFormItem label="标题" prop="articleName">
                    <ElInput
                      v-model="articleForm.articleName"
                      minlength="1"
                      maxlength="120"
                      placeholder="标题，少于120个字符"
                    />
                  </ElFormItem>
                  <ElFormItem label="内容" prop="articleDescription">
                    <Editor ref="editorRef" v-model="articleForm.articleDescription" :height="300" />
                  </ElFormItem>
                  <ElFormItem label="内容标签">
                    <ElTag
                      v-for="(tag, index) in articleForm.tags"
                      :key="index"
                      closable
                      :disable-transitions="false"
                      class="mr-2"
                      @close="handleCloseTag(index)"
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
              <div class="col-span-1">
                <ElCard shadow="never" class="w-full">
                  <template #header>
                    <div class="card-header">
                      <span>{{ $t('article.seo') }}</span>
                    </div>
                  </template>
                  <ElFormItem label="元标题" prop="metaTitle">
                    <ElInput
                      v-model="articleForm.metaTitle"
                      class="input-line"
                      minlength="1"
                      maxlength="60"
                      placeholder="元标题，少于60个字符"
                    />
                  </ElFormItem>
                  <ElFormItem label="元描述" prop="metaDescription">
                    <ElInput
                      v-model="articleForm.metaDescription"
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
          </div>
        </ElCard>
      </ElForm>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
