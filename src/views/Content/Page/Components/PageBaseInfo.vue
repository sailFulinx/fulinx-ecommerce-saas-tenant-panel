<script setup lang="ts">
import Editor from '@/components/common/Editor.vue'
import CustomsTable from './CustomsTable.vue'

interface Props {
  pageDetail?: PageAdminLocalizedViewDo
  languageId: string
  pageId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  refreshData: []
  removeTag: [index: number]
  showInputTag: [index: number]
  inputTagConfirm: []
  cancelUpdatePageFile: []
  getRemoveFile: [index: number]
}>()

const { t: $t } = useLocale()

// 页面名称相关
const inputPageNameVisible = ref<boolean>(false)
const currentPageName = ref<string>('')
// 页面短名称相关
const inputPageShortNameVisible = ref<boolean>(false)
const currentPageShortName = ref<string>('')

const handleClickUpdatePageName = (pageName: string) => {
  currentPageName.value = pageName
  inputPageNameVisible.value = true
}

const handleCancelUpdatePageName = () => {
  inputPageNameVisible.value = false
}

const editPageName = async (pageDetailId: string) => {
  if (!currentPageName.value) {
    ElMessage.warning($t('page.error.pageName'))
    return
  }
  await updatePageNameApi({
    pageName: currentPageName.value,
    pageDetailId,
  }).catch(error => {
    throw error
  })
  currentPageName.value = ''
  inputPageNameVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 页面短名称相关方法
const handleClickUpdatePageShortName = (pageShortName: string) => {
  currentPageShortName.value = pageShortName
  inputPageShortNameVisible.value = true
}

const handleCancelUpdatePageShortName = () => {
  inputPageShortNameVisible.value = false
}

const editPageShortName = async (pageDetailId: string) => {
  // 短名称可以为空
  await updatePageShortNameApi({
    pageShortName: currentPageShortName.value,
    pageDetailId,
  }).catch(error => {
    throw error
  })
  currentPageShortName.value = ''
  inputPageShortNameVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

const createPageName = async () => {
  if (!currentPageName.value) {
    ElMessage.warning($t('page.error.pageName'))
    return
  }
  await createPageNameApi({
    pageName: currentPageName.value,
    pageId: props.pageId,
    languageId: props.languageId,
  })
  currentPageName.value = ''
  ElMessage.success($t('success.create'))
  emit('refreshData')
}

// 页面描述相关
const isExpanded = ref(false)
const inputPageDescriptionVisible = ref<boolean>(false)
const currentPageDescription = ref<string>('<p></p>')
// 页面短描述相关
const inputPageShortDescriptionVisible = ref<boolean>(false)
const currentPageShortDescription = ref<string>('')
const editorRefs = ref()

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleClickUpdatePageDescription = async (pageDescription: string) => {
  currentPageDescription.value = pageDescription
  inputPageDescriptionVisible.value = true
  await nextTick(async () => {
    await editorRefs.value?.setEditorContent(pageDescription)
  })
}

const handleCancelUpdatePageDescription = () => {
  inputPageDescriptionVisible.value = false
}

const editPageDescription = async (pageDetailId: string) => {
  await nextTick()
  const editorInstance = editorRefs.value as any
  currentPageDescription.value = editorInstance?.getEditorContent()
  await updatePageDescriptionApi({
    pageDetailId,
    pageDescription: currentPageDescription.value,
  }).catch(error => {
    throw error
  })
  currentPageDescription.value = ''
  inputPageDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 页面短描述相关方法
const handleClickUpdatePageShortDescription = (pageShortDescription: string) => {
  currentPageShortDescription.value = pageShortDescription
  inputPageShortDescriptionVisible.value = true
}

const handleCancelUpdatePageShortDescription = () => {
  inputPageShortDescriptionVisible.value = false
}

const editPageShortDescription = async (pageDetailId: string) => {
  // 短描述可以为空
  await updatePageShortDescriptionApi({
    pageDetailId,
    pageShortDescription: currentPageShortDescription.value,
  }).catch(error => {
    throw error
  })
  currentPageShortDescription.value = ''
  inputPageShortDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 复制功能相关
const pageAdminLocalizedViewDos = defineModel<PageAdminLocalizedViewDo[]>('pageAdminLocalizedViewDos', { required: true })
const copyLanguageCode = ref('')
const fromLanguageId = ref('')

const handleCopyPage = async () => {
  if (!copyLanguageCode.value) {
    ElMessage.warning($t('page.error.copyLanguageCode'))
    return
  }

  // 查找源语言ID
  if (pageAdminLocalizedViewDos.value) {
    pageAdminLocalizedViewDos.value.forEach(item => {
      if (item.languageCode === copyLanguageCode.value) {
        fromLanguageId.value = item.languageId
      }
    })
  }

  if (!fromLanguageId.value) {
    ElMessage.warning($t('page.error.copyLanguageCode'))
    return
  }

  await CopyPageApi({
    pageId: props.pageId,
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

const refreshFormData = () => {
  emit('refreshData')
}
</script>

<template>
  <ElCard v-if="pageDetail?.pageDetailListResultDo" shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <!-- 文章名称 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('page.pageName') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputPageNameVisible" class="mr-2">
            {{ pageDetail.pageDetailListResultDo.pageName }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentPageName"
              clearable
              minlength="1"
              maxlength="250"
              style="width: 300px"
              class="mr-2"
              @blur="editPageName(pageDetail.pageDetailListResultDo.id)"
            />
            <EBtn text @click="handleCancelUpdatePageName">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputPageNameVisible"
            type="primary"
            text
            @click="handleClickUpdatePageName(pageDetail.pageDetailListResultDo.pageName)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 页面短名称 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('page.pageShortName') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputPageShortNameVisible" class="mr-2">
            {{ pageDetail.pageDetailListResultDo.pageShortName }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentPageShortName"
              clearable
              minlength="1"
              maxlength="250"
              style="width: 300px"
              class="mr-2"
              @blur="editPageShortName(pageDetail.pageDetailListResultDo.id)"
            />
            <EBtn text @click="handleCancelUpdatePageShortName">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputPageShortNameVisible"
            type="primary"
            text
            @click="handleClickUpdatePageShortName(pageDetail.pageDetailListResultDo.pageShortName)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 描述 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('page.description') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <div v-if="!inputPageDescriptionVisible" class="mr-2">
            <div class="flex items-center mb-5">
              <div class="mr-2">
                <EBtn
                  type="primary"
                  plain
                  @click="
                    handleClickUpdatePageDescription(pageDetail.pageDetailListResultDo.pageDescription)
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
                  v-html="pageDetail.pageDetailListResultDo.pageDescription"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <Editor ref="editorRefs" v-model="currentPageDescription" class="mb-5" />
            <div class="flex justify-center items-center">
              <EBtn @click="handleCancelUpdatePageDescription">
                {{ $t('common.cancel') }}
              </EBtn>
              <EBtn type="primary" @click="editPageDescription(pageDetail.pageDetailListResultDo.id)">
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </div>
        </div>
      </div>
      <!-- 短描述 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('page.shortDescription') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <div v-if="!inputPageShortDescriptionVisible" class="mr-2 w-full">
            <div class="flex items-center mb-5">
              <div class="mr-2">
                <EBtn
                  type="primary"
                  plain
                  @click="
                    handleClickUpdatePageShortDescription(pageDetail.pageDetailListResultDo.pageShortDescription)
                  "
                >
                  <Icon icon="ep:edit" :size="5" class="mr-1" />
                  {{ $t('common.edit') }}
                </EBtn>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 p-4">
                {{ pageDetail.pageDetailListResultDo.pageShortDescription }}
              </div>
            </div>
          </div>
          <div v-else class="w-full">
            <ElInput
              v-model="currentPageShortDescription"
              type="textarea"
              :rows="4"
              class="mb-5"
              style="width: 100%"
            />
            <div class="flex justify-center items-center">
              <EBtn @click="handleCancelUpdatePageShortDescription">
                {{ $t('common.cancel') }}
              </EBtn>
              <EBtn type="primary" @click="editPageShortDescription(pageDetail.pageDetailListResultDo.id)">
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </div>
        </div>
      </div>
      <!-- 自定义信息 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('page.customs') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <CustomsTable
            :custom-list="pageDetail.pageDetailListResultDo.customList"
            :page-detail-id="pageDetail.pageDetailListResultDo.id"
            @refresh-data="refreshFormData"
          />
        </div>
      </div>
    </div>
  </ElCard>
  <ElCard v-else>
    <div class="flex-col justify-center items-center mb-5">
      <div class="w-full mb-5">
        <ElAlert :title="$t('page.warning.noDetailData')" type="warning" show-icon />
      </div>
      <div class="bg-red-50 pa-3 flex justify-between items-center">
        <ElSelect
          v-model="copyLanguageCode"
          placeholder="请选择"
          style="width: 200px"
        >
          <ElOption
            v-for="item in (pageAdminLocalizedViewDos || []).filter(i => i.languageCode !== pageDetail?.languageCode)"
            :key="item.languageCode"
            :label="item.languageName"
            :value="item.languageCode"
          />
        </ElSelect>
        <EBtn type="primary" @click="handleCopyPage">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          复制
        </EBtn>
      </div>
    </div>
    <div class="pa-3 flex justify-center items-center mb-5">
      <ElInput v-model="currentPageName" :placeholder="$t('page.placeholder.pageName')" />
      <EBtn type="primary" class="ml-5" @click="createPageName">
        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
        {{ $t('common.save') }}
      </EBtn>
    </div>
  </ElCard>
</template>
