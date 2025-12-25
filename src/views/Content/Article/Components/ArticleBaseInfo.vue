<script setup lang="ts">
import type { InputInstance } from 'element-plus'
import { debounce } from 'lodash-es'
import Editor from '@/components/common/Editor.vue'
import CustomsTable from './CustomsTable.vue'

interface Props {
  articleData?: ArticleShowData
  articleDetail?: ArticleAdminLocalizedViewDo
  languageId: string
  articleId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  refreshData: []
  removeTag: [index: number]
  showInputTag: [index: number]
  inputTagConfirm: []
  cancelUpdateArticleFile: []
  getRemoveFile: [index: number]
}>()

const resourceUrl = import.meta.env.VITE_RESOURCE_URL

const { t: $t } = useLocale()

// 文章名称相关
const inputArticleNameVisible = ref<boolean>(false)
const currentArticleName = ref<string>('')
// 文章短名称相关
const inputArticleShortNameVisible = ref<boolean>(false)
const currentArticleShortName = ref<string>('')

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
  await updateArticleNameApi({
    articleName: currentArticleName.value,
    articleDetailId,
  }).catch(error => {
    throw error
  })
  currentArticleName.value = ''
  inputArticleNameVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 文章短名称相关方法
const handleClickUpdateArticleShortName = (articleShortName: string) => {
  currentArticleShortName.value = articleShortName
  inputArticleShortNameVisible.value = true
}

const handleCancelUpdateArticleShortName = () => {
  inputArticleShortNameVisible.value = false
}

const editArticleShortName = async (articleDetailId: string) => {
  // 短名称可以为空
  await updateArticleShortNameApi({
    articleShortName: currentArticleShortName.value,
    articleDetailId,
  }).catch(error => {
    throw error
  })
  currentArticleShortName.value = ''
  inputArticleShortNameVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

const createArticleName = async () => {
  if (!currentArticleName.value) {
    ElMessage.warning($t('article.error.articleName'))
    return
  }
  await createArticleNameApi({
    articleName: currentArticleName.value,
    articleId: props.articleId,
    languageId: props.languageId,
  })
  currentArticleName.value = ''
  ElMessage.success($t('success.create'))
  emit('refreshData')
}

// 文章描述相关
const isExpanded = ref(false)
const inputArticleDescriptionVisible = ref<boolean>(false)
const currentArticleDescription = ref<string>('<p></p>')
// 文章短描述相关
const inputArticleShortDescriptionVisible = ref<boolean>(false)
const currentArticleShortDescription = ref<string>('')
const editorRefs = ref()

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleClickUpdateArticleDescription = async (articleDescription: string) => {
  currentArticleDescription.value = articleDescription
  inputArticleDescriptionVisible.value = true
  await nextTick(async () => {
    await editorRefs.value?.setEditorContent(articleDescription)
  })
}

const handleCancelUpdateArticleDescription = () => {
  inputArticleDescriptionVisible.value = false
}

const editArticleDescription = async (articleDetailId: string) => {
  await nextTick()
  const editorInstance = editorRefs.value as any
  currentArticleDescription.value = editorInstance?.getEditorContent()
  await updateArticleDescriptionApi({
    articleDetailId,
    articleDescription: currentArticleDescription.value,
  }).catch(error => {
    throw error
  })
  currentArticleDescription.value = ''
  inputArticleDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 文章短描述相关方法
const handleClickUpdateArticleShortDescription = (articleShortDescription: string) => {
  currentArticleShortDescription.value = articleShortDescription
  inputArticleShortDescriptionVisible.value = true
}

const handleCancelUpdateArticleShortDescription = () => {
  inputArticleShortDescriptionVisible.value = false
}

const editArticleShortDescription = async (articleDetailId: string) => {
  // 短描述可以为空
  await updateArticleShortDescriptionApi({
    articleDetailId,
    articleShortDescription: currentArticleShortDescription.value,
  }).catch(error => {
    throw error
  })
  currentArticleShortDescription.value = ''
  inputArticleShortDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 更新类型

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

const articleTypeVisible = ref<boolean>(false)

const currentArticleType = ref<number | undefined>(undefined)

const handleEditArticleType = () => {
  if (props.articleData?.articleType) {
    currentArticleType.value = props.articleData?.articleType
  }
  articleTypeVisible.value = true
  getArticleTypeList()
}

const handleCancelEditArticleType = () => {
  articleTypeVisible.value = false
}
const handleSaveArticleType = async () => {
  if (!currentArticleType.value) {
    ElMessage.warning($t('article.error.articleType'))
    return
  }
  await updateArticleTypeApi({
    articleId: props.articleId,
    languageId: props.languageId,
    articleType: currentArticleType.value,
  }).catch(error => {
    throw error
  })
  articleTypeVisible.value = false
  emit('refreshData')
  ElMessage.success($t('success.edit'))
}

// 标签相关
const inputArticleTagVisible = ref<boolean>(false)
const inputTagValue = ref('')
const InputTagRefs = ref<InputInstance[]>([])

const handleShowInputTag = () => {
  inputArticleTagVisible.value = true
  nextTick(() => {
    if (InputTagRefs.value && InputTagRefs.value[0]) {
      const inputEl = InputTagRefs.value[0].$el.querySelector('input')
      if (inputEl) {
        inputEl.focus()
      }
    }
  })
}

const handleRemoveTag = async (index: number) => {
  if (!props.articleDetail) {
    return
  }
  await removeArticleTagApi({
    articleTagRelationId: props.articleDetail.articleTagListResultDos[index].id,
  }).catch(error => {
    throw error
  })
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

const handleInputTagConfirm = debounce(async () => {
  if (!inputTagValue.value) {
    return
  }
  if (inputTagValue.value.length > 20) {
    ElMessage.warning($t('article.error.tagLength'))
    return
  }
  if (props.articleDetail?.articleTagListResultDos && props.articleDetail?.articleTagListResultDos.length >= 9) {
    ElMessage.warning($t('article.error.tagLimit'))
    return
  }
  await createArticleTagApi({
    articleId: props.articleId,
    languageId: props.languageId,
    tagName: inputTagValue.value.trim(),
  }).catch(error => {
    throw error
  })
  inputArticleTagVisible.value = false
  inputTagValue.value = ''
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}, 500)

// 图片相关
const uploadRefs = ref()
const settingArticleFileVisible = ref<boolean>(false)
const articleFileList = ref<(FileData & CommonField)[]>([])
const deletedFileIds = ref<string[]>([])

const handleClickUpdateArticleFile = async () => {
  if (
    props.articleDetail?.articleFileRelationListResultDos
    && props.articleDetail?.articleFileRelationListResultDos.length !== 0
  ) {
    const articleFileListData: (FileData & CommonField)[] = []
    props.articleDetail.articleFileRelationListResultDos.forEach((item: ArticleFileListResultDo & CommonField) => {
      articleFileListData.push(item.fileVo)
    })
    articleFileList.value = articleFileListData
  }
  settingArticleFileVisible.value = true
  await nextTick()
  const uploadInstance = uploadRefs.value as any
  await uploadInstance?.setFileData(articleFileList.value)
}

const handleCancelUpdateArticleFile = () => {
  settingArticleFileVisible.value = false
  emit('cancelUpdateArticleFile')
}

const handleGetRemoveFile = (indexValue: number) => {
  deletedFileIds.value.push(articleFileList.value[indexValue].id)
}

const editArticleFile = async () => {
  const uploadInstance = uploadRefs.value as any
  const fileList = uploadInstance?.getFileData()
  articleFileList.value = fileList.fileDataList
  const articleFileVoList: ArticleFileVo[] = []
  articleFileList.value.map((item: FileData & CommonField, index: number) => {
    articleFileVoList.push({
      articleFileId: item.id,
      sort: item?.sort || 0,
      isDefault: index === 0,
    })
  })
  const payload = {
    articleId: props.articleId,
    languageId: props.languageId,
    articleFileVoList,
    articleFileDeletedIds: deletedFileIds.value,
  }
  await updateArticleFileApi(payload).catch(error => {
    throw error
  })
  settingArticleFileVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

const refreshFormData = () => {
  emit('refreshData')
}

// 复制功能相关
const articleAdminLocalizedViewDos = defineModel<ArticleAdminLocalizedViewDo[]>('articleAdminLocalizedViewDos', { required: true })
const copyLanguageCode = ref('')
const fromLanguageId = ref('')

const handleCopyArticle = async () => {
  if (!copyLanguageCode.value) {
    ElMessage.warning($t('article.error.copyLanguageCode'))
    return
  }

  // 查找源语言ID
  if (articleAdminLocalizedViewDos.value) {
    articleAdminLocalizedViewDos.value.forEach(item => {
      if (item.languageCode === copyLanguageCode.value) {
        fromLanguageId.value = item.languageId
      }
    })
  }

  if (!fromLanguageId.value) {
    ElMessage.warning($t('article.error.copyLanguageCode'))
    return
  }

  await CopyArticleDetailApi({
    articleId: props.articleId,
    fromLanguageId: fromLanguageId.value,
    toLanguageId: props.languageId,
  }).catch(error => {
    throw error
  })

  ElMessage.success($t('success.copy'))
  copyLanguageCode.value = ''
  fromLanguageId.value = ''
  emit('refreshData')
}
</script>

<template>
  <ElCard v-if="articleDetail?.articleDetailListResultDo" shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <!-- 文章类型 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('article.articleType') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!articleTypeVisible" class="mr-2">
            {{ articleData?.articleTypeLabel }}
            <EBtn type="primary" text @click="handleEditArticleType()">
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <span v-else>
            <ElSelect
              v-model="currentArticleType"
              :placeholder="$t('article.placeholder.articleType')"
              clearable
              filterable
              class="mr-5 w-100"
              style="width: 100px"
            >
              <ElOption
                v-for="item in articleTypes.list"
                :key="item.id"
                :value="item.id"
                :label="item.articleTypeName"
              />
            </ElSelect>
            <EBtn text @click="handleCancelEditArticleType">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
            <EBtn type="danger" class="ml-5" @click="handleSaveArticleType">
              <Icon icon="ep:check" :size="5" class="mr-1" />
            </EBtn>
          </span>
        </div>
      </div>
      <!-- 文章名称 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('article.articleName') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputArticleNameVisible" class="mr-2">
            {{ articleDetail.articleDetailListResultDo.articleName }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentArticleName"
              clearable
              minlength="1"
              maxlength="250"
              style="width: 300px"
              class="mr-2"
              @blur="editArticleName(articleDetail.articleDetailListResultDo.id)"
            />
            <EBtn text @click="handleCancelUpdateArticleName">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputArticleNameVisible"
            type="primary"
            text
            @click="handleClickUpdateArticleName(articleDetail.articleDetailListResultDo.articleName)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 文章短名称 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('article.articleShortName') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputArticleShortNameVisible" class="mr-2">
            {{ articleDetail.articleDetailListResultDo.articleShortName }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentArticleShortName"
              clearable
              minlength="1"
              maxlength="250"
              style="width: 300px"
              class="mr-2"
              @blur="editArticleShortName(articleDetail.articleDetailListResultDo.id)"
            />
            <EBtn text @click="handleCancelUpdateArticleShortName">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputArticleShortNameVisible"
            type="primary"
            text
            @click="handleClickUpdateArticleShortName(articleDetail.articleDetailListResultDo.articleShortName)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 描述 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('article.description') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <div v-if="!inputArticleDescriptionVisible" class="mr-2">
            <div class="flex items-center mb-5">
              <div class="mr-2">
                <EBtn
                  type="primary"
                  plain
                  @click="
                    handleClickUpdateArticleDescription(articleDetail.articleDetailListResultDo.articleDescription)
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
                  v-html="articleDetail.articleDetailListResultDo.articleDescription"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <Editor ref="editorRefs" v-model="currentArticleDescription" class="mb-5" />
            <div class="flex justify-center items-center">
              <EBtn @click="handleCancelUpdateArticleDescription">
                {{ $t('common.cancel') }}
              </EBtn>
              <EBtn type="primary" @click="editArticleDescription(articleDetail.articleDetailListResultDo.id)">
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </div>
        </div>
      </div>
      <!-- 短描述 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('article.shortDescription') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <div v-if="!inputArticleShortDescriptionVisible" class="w-full mr-2">
            <div class="flex items-center mb-5">
              <div class="mr-2">
                <EBtn
                  type="primary"
                  plain
                  @click="
                    handleClickUpdateArticleShortDescription(articleDetail.articleDetailListResultDo.articleShortDescription)
                  "
                >
                  <Icon icon="ep:edit" :size="5" class="mr-1" />
                  {{ $t('common.edit') }}
                </EBtn>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 p-4">
                {{ articleDetail.articleDetailListResultDo.articleShortDescription }}
              </div>
            </div>
          </div>
          <div v-else class="w-full">
            <ElInput
              v-model="currentArticleShortDescription"
              type="textarea"
              :rows="4"
              class="w-full mb-5"
              style="width: 100%"
            />
            <div class="flex justify-center items-center">
              <EBtn @click="handleCancelUpdateArticleShortDescription">
                {{ $t('common.cancel') }}
              </EBtn>
              <EBtn type="primary" @click="editArticleShortDescription(articleDetail.articleDetailListResultDo.id)">
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </div>
        </div>
      </div>
      <!-- 标签 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('article.tag') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <ElTag
            v-for="(tag, index) in articleDetail.articleTagListResultDos"
            :key="tag.id"
            class="mr-2"
            closable
            :disable-transitions="false"
            @close="handleRemoveTag(index)"
          >
            {{ tag.tagName }}
          </ElTag>
          <ElInput
            v-if="inputArticleTagVisible"
            ref="InputTagRefs"
            v-model="inputTagValue"
            style="width: 150px"
            size="small"
            @keyup.enter="handleInputTagConfirm"
            @blur="handleInputTagConfirm"
          />
          <ElButton v-else size="small" @click="handleShowInputTag">
            + 新标签
          </ElButton>
        </div>
      </div>
      <!-- 图片 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('article.pics') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <div v-if="!settingArticleFileVisible">
            <EBtn type="primary" text class="mb-5" @click="handleClickUpdateArticleFile">
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </EBtn>
            <div class="grid grid-cols-6 gap-4">
              <div
                v-for="fItem in articleDetail.articleFileRelationListResultDos"
                :key="fItem.id"
                class="col-span-1 border border-gray-200 pa-4"
              >
                <ElImage :src="resourceUrl + fItem.fileVo?.fileUrl" />
              </div>
            </div>
          </div>
          <div v-else>
            <UploadMultiImage ref="uploadRefs" class="mb-5" @remove-file="handleGetRemoveFile" />
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
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('article.customs') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <CustomsTable
            :custom-list="articleDetail.articleDetailListResultDo.customList"
            :article-detail-id="articleDetail.articleDetailListResultDo.id"
            @refresh-data="refreshFormData"
          />
        </div>
      </div>
    </div>
  </ElCard>
  <ElCard v-else>
    <div class="flex-col justify-center items-center mb-5">
      <div class="w-full mb-5">
        <ElAlert :title="$t('article.warning.noDetailData')" type="warning" show-icon />
      </div>
      <div class="bg-red-50 pa-3 flex justify-between items-center">
        <ElSelect
          v-model="copyLanguageCode"
          placeholder="请选择"
          style="width: 200px"
        >
          <ElOption
            v-for="item in (articleAdminLocalizedViewDos || []).filter(i => i.languageCode !== articleDetail?.languageCode)"
            :key="item.languageCode"
            :label="item.languageName"
            :value="item.languageCode"
          />
        </ElSelect>
        <EBtn type="primary" @click="handleCopyArticle">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          复制
        </EBtn>
      </div>
    </div>
    <div class="pa-3 flex justify-center items-center mb-5">
      <ElInput v-model="currentArticleName" :placeholder="$t('article.placeholder.articleName')" />
      <EBtn type="primary" class="ml-5" @click="createArticleName">
        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
        {{ $t('common.save') }}
      </EBtn>
    </div>
  </ElCard>
</template>
