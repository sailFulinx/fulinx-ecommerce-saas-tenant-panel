<script setup name="BrandDetail" lang="ts">
import {
  createBrandApi,
  createBrandDetailApi,
  createBrandSeoApi,
  createBrandSlugApi,
  showBrandApi,
  updateBrandDetailBrandNameApi,
  updateBrandDetailDescriptionApi,
  updateBrandDetailFileApi,
  updateBrandSeoApi,
  updateBrandSlugApi,
  updateBrandStatusApi,
} from '@/api/brand'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElAlert, ElCard, ElInput, ElMessage, ElSwitch, ElTabPane } from 'element-plus'
import { debounce } from 'lodash-es'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const activeName = ref<string>('base')

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

const loading = reactive({
  init: false,
  categories: false,
})

// 创建brand请求参数
const createFormData = (): (BrandShow & CommonField) => {
  return {
    id: '',
    status: true,
    isCustomLayout: true,
    layoutId: '',
    brandDetailListResultDo: {
      id: '',
      brandId: '',
      languageId: '',
      brandName: '',
      brandDescription: '',
      brandFileId: '',
      brandFileVo: {
        id: '',
        originalFileName: '',
        fileName: '',
        fileContentType: '',
        fileExtensionName: '',
        uploadPath: '',
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
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    brandSeoListResultDo: {
      id: '',
      brandId: '',
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
const form = reactive<BrandShow>(createFormData())

const showBrandPayload = reactive<ShowBrandParams>({
  brandId: id,
  languageId: selectLanguage.value.id,
})

// 获取文章数据
const getBrandData = async () => {
  loading.init = true
  const { data } = await showBrandApi(showBrandPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: BrandShow) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
  })
}

const initFormData = async () => {
  const res = await getBrandData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  async val => {
    if (val) {
      selectLanguage.value = val
      showBrandPayload.languageId = val.id
      await initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editBrandStatus = async () => {
  loading.init = true
  const { data } = await updateBrandStatusApi({
    brandId: id,
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
const inputBrandNameVisible = ref<boolean>(false)
const currentBrandName = ref<string>('')
const handleClickUpdateBrandName = (brandName: string) => {
  currentBrandName.value = brandName
  inputBrandNameVisible.value = true
}
const handleCancelUpdateBrandName = () => {
  inputBrandNameVisible.value = false
}
const editBrandName = async (brandDetailId: string) => {
  if (!currentBrandName.value) {
    ElMessage.warning($t('brand.error.brandName'))
    return
  }
  loading.init = true
  const { data } = await updateBrandDetailBrandNameApi({ brandName: currentBrandName.value, brandDetailId }).catch(
    error => {
      loading.init = false
      throw error
    },
  )
  loading.init = false
  currentBrandName.value = ''
  await resetFormData(data)
  inputBrandNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新名称新增时
const createBrandName = async () => {
  if (!currentBrandName.value) {
    ElMessage.warning($t('brand.error.brandName'))
    return
  }
  loading.init = true
  const { data } = await createBrandDetailApi({ brandName: currentBrandName.value, brandId: id, languageId: selectLanguage.value.id }).catch(
    error => {
      loading.init = false
      throw error
    },
  )
  loading.init = false
  currentBrandName.value = ''
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
const inputBrandDescriptionVisible = ref<boolean>(false)
const currentBrandDescription = ref<string>('<p></p>')
const handleClickUpdateBrandDescription = async (brandDescription: string) => {
  currentBrandDescription.value = brandDescription
  inputBrandDescriptionVisible.value = true
  await nextTick(async () => {
    await editorRef.value?.setEditorContent(brandDescription)
  })
}
const handleCancelUpdateBrandDescription = () => {
  inputBrandDescriptionVisible.value = false
}
const editBrandDescription = async (brandDetailId: string) => {
  currentBrandDescription.value = editorRef.value?.getEditorContent()
  loading.init = true
  const { data } = await updateBrandDetailDescriptionApi({
    brandDetailId,
    brandDescription: currentBrandDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentBrandDescription.value = ''
  await resetFormData(data)
  inputBrandDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新Slug
const inputBrandSlugVisible = ref<boolean>(false)
const currentSlug = ref<string>('')

const handleClickCreateBrandSlug = async () => {
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }

  const { data } = await createBrandSlugApi({ brandId: id, languageId: usePreferenceStore().preference?.language.id, slug: currentSlug.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

const handleClickUpdateBrandSlug = () => {
  currentSlug.value = form.slug
  inputBrandSlugVisible.value = true
}
const handleCancelUpdateBrandSlug = () => {
  inputBrandSlugVisible.value = false
}
const editBrandSlug = async () => {
  if (!currentSlug.value) {
    ElMessage.warning($t('brand.error.slug'))
    return
  }
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }
  const { data } = await updateBrandSlugApi({ slugId: form.slugId, languageId: usePreferenceStore().preference?.language.id, slug: currentSlug.value }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSlug.value = ''
  await resetFormData(data)
  inputBrandSlugVisible.value = false
  ElMessage.success($t('success.edit'))
}
// 更新图片
const uploadRef = ref()
const settingBrandFileVisible = ref<boolean>(false)
const handleClickUpdateBrandFile = async () => {
  settingBrandFileVisible.value = true
  await nextTick()
  await uploadRef.value?.setFileData(form.brandDetailListResultDo.brandFileVo)
}
const handleCancelUpdateBrandFile = () => {
  settingBrandFileVisible.value = false
}
const editBrandFile = async () => {
  loading.init = false
  const file = uploadRef.value?.getFileData()
  const payload = {
    brandDetailId: form.brandDetailListResultDo.id,
    languageId: selectLanguage.value.id,
    brandFileId: file.fileData.id,
  }
  const { data } = await updateBrandDetailFileApi(payload).catch(error => {
    loading.init = false
    throw error
  })
  await resetFormData(data)
  settingBrandFileVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新元标题
const inputBrandMetaTitleVisible = ref<boolean>(false)
const currentBrandMetaTitle = ref<string>('')
const handleClickUpdateBrandMetaTitle = (brandMetaTitle: string) => {
  currentBrandMetaTitle.value = brandMetaTitle
  inputBrandMetaTitleVisible.value = true
}
const handleCancelUpdateBrandMetaTitle = () => {
  inputBrandMetaTitleVisible.value = false
}
const editBrandMetaTitle = async (brandSeoId: string) => {
  if (!currentBrandMetaTitle.value) {
    ElMessage.warning($t('brand.error.brandMetaTitle'))
    return
  }
  loading.init = true
  const { data } = await updateBrandSeoApi({
    brandSeoId,
    metaTitle: currentBrandMetaTitle.value,
    metaDescription: form.brandSeoListResultDo.metaDescription,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentBrandMetaTitle.value = ''
  await resetFormData(data)
  inputBrandMetaTitleVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新元标题新增时
const createBrandMetaTitle = async () => {
  if (!currentBrandMetaTitle.value) {
    ElMessage.warning($t('brand.error.metaTitle'))
    return
  }
  loading.init = true
  const { data } = await createBrandSeoApi({ brandId: id, languageId: selectLanguage.value.id, metaTitle: currentBrandMetaTitle.value }).catch(
    error => {
      loading.init = false
      throw error
    },
  )
  loading.init = false
  currentBrandMetaTitle.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

// 更新元描述
const inputBrandMetaDescriptionVisible = ref<boolean>(false)
const currentBrandMetaDescription = ref<string>('')
const handleClickUpdateBrandMetaDescription = (brandMetaDescription: string) => {
  currentBrandMetaDescription.value = brandMetaDescription
  inputBrandMetaDescriptionVisible.value = true
}
const handleCancelUpdateBrandMetaDescription = () => {
  inputBrandMetaDescriptionVisible.value = false
}
const editBrandMetaDescription = async (brandSeoId: string) => {
  if (!currentBrandMetaDescription.value) {
    ElMessage.warning($t('brand.error.brandMetaDescription'))
    return
  }
  loading.init = true
  const { data } = await updateBrandSeoApi({
    brandSeoId,
    metaTitle: form.brandSeoListResultDo.metaTitle,
    metaDescription: currentBrandMetaDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentBrandMetaDescription.value = ''
  await resetFormData(data)
  inputBrandMetaDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('brand.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2" />
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('brand.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editBrandStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs">
        <ElTabPane :label="$t('brand.base')" name="base">
          <ElCard v-if="form.brandDetailListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <!-- 文章名称 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('brand.brandName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputBrandNameVisible" class="mr-2">
                    {{ form.brandDetailListResultDo.brandName }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentBrandName"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editBrandName(form.brandDetailListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateBrandName">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputBrandNameVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateBrandName(form.brandDetailListResultDo.brandName)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
              <!-- 描述 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('brand.brandDescription') }}:
                </div>
                <div class="col-span-11">
                  <div v-if="!inputBrandDescriptionVisible" class="mr-2">
                    <div class="flex items-center mb-5">
                      <div class="mr-2">
                        <EBtn
                          v-if="!inputBrandNameVisible"
                          type="primary"
                          plain
                          @click="
                            handleClickUpdateBrandDescription(form.brandDetailListResultDo.brandDescription)
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
                          v-html="form.brandDetailListResultDo.brandDescription"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <Editor ref="editorRef" v-model="currentBrandDescription" class="mb-5" />
                    <div class="flex justify-center items-center">
                      <EBtn @click="handleCancelUpdateBrandDescription">
                        {{ $t('common.cancel') }}
                      </EBtn>
                      <EBtn type="primary" @click="editBrandDescription(form.brandDetailListResultDo.id)">
                        {{ $t('common.save') }}
                      </EBtn>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 图片 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('brand.brandLogo') }}:
                </div>
                <div class="col-span-11">
                  <div v-if="!settingBrandFileVisible">
                    <EBtn
                      type="primary"
                      text
                      class="mb-5"
                      @click="handleClickUpdateBrandFile"
                    >
                      <Icon icon="ep:edit" :size="5" class="mr-1" />
                    </EBtn>
                    <div class="grid grid-cols-6 gap-4">
                      <ElImage :src="`${sourceUrl}${form.brandDetailListResultDo.brandFileVo?.fileUrl}`" />
                    </div>
                  </div>
                  <div v-else>
                    <UploadSingleImage ref="uploadRef" class="mb-5" />
                    <div class="flex justify-center items-center">
                      <EBtn @click="handleCancelUpdateBrandFile">
                        {{ $t('common.cancel') }}
                      </EBtn>
                      <EBtn type="primary" @click="editBrandFile">
                        {{ $t('common.save') }}
                      </EBtn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ElCard>
          <ElCard v-else>
            <div class="flex justify-center items-center mb-5">
              <ElAlert :title="$t('brand.warning.noDetailData')" type="warning" show-icon />
            </div>
            <div class="flex justify-center items-center mb-5">
              <ElInput v-model="currentBrandName" :placeholder="$t('brand.placeholder.brandName')" />
              <EBtn type="primary" class="ml-5" @click="createBrandName">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('brand.seo')" name="seo">
          <ElCard v-if="form.brandSeoListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <!-- 文章元标题 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('brand.metaTitle') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputBrandMetaTitleVisible" class="mr-2">
                    {{ form.brandSeoListResultDo.metaTitle }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentBrandMetaTitle"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editBrandMetaTitle(form.brandSeoListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateBrandMetaTitle">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputBrandMetaTitleVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateBrandMetaTitle(form.brandSeoListResultDo.metaTitle)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
              <!-- 文章元描述 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('brand.metaDescription') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputBrandMetaDescriptionVisible" class="mr-2">
                    {{ form.brandSeoListResultDo.metaDescription }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentBrandMetaDescription"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editBrandMetaDescription(form.brandSeoListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateBrandMetaDescription">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputBrandMetaDescriptionVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateBrandMetaDescription(form.brandSeoListResultDo.metaDescription)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
            </div>
          </ElCard>
          <ElCard v-else>
            <div class="flex justify-center items-center mb-5">
              <ElAlert :title="$t('brand.warning.noSeoData')" type="warning" show-icon />
            </div>
            <div class="flex justify-center items-center mb-5">
              <ElInput v-model="currentBrandMetaTitle" :placeholder="$t('brand.placeholder.metaTitle')" />
              <EBtn type="primary" class="ml-5" @click="createBrandMetaTitle">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
        <!-- <ElTabPane :label="$t('brand.layout')" name="layout">
          <ElCard shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div class="w-full grid grid-cols-12 gap-8 p-4">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('brand.layout') }}:
                </div>
                <div class="col-span-11">
                  <div v-if="!isShowLayoutEdit">
                    <div class="flex justify-start items-center">
                      <span class="mr-2">{{ form.isCustomLayout ? $t('common.yes') : $t('common.no') }}</span>
                      <span v-if="form.layoutListResultDo" class="mr-2">
                        ，{{ $t('brand.layoutName') }}：{{ form.layoutListResultDo.layoutName }}
                      </span>
                      <span>
                        <EBtn type="primary" text @click="handleEditBrandLayout">
                          <Icon icon="ep:edit" :size="5" />
                        </EBtn>
                      </span>
                    </div>
                  </div>
                  <div v-else>
                    <div class="w-full flex items-center mb-5">
                      <span class="mr-2">{{ $t('brand.isCustomLayout') }}</span>
                      <ElSwitch v-model="form.isCustomLayout" />
                    </div>
                    <div v-if="form.isCustomLayout" class="w-full flex items-center mb-5">
                      <span class="mr-2 flex-none">{{ $t('brand.layout') }}</span>
                      <ElSelect
                        v-model="form.layoutId"
                        clearable
                        filterable
                        :placeholder="$t('brand.placeholder.layout')"
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
                      <EBtn type="danger" @click="handleSubmitBrandLayout">
                        <Icon icon="ep:check" :size="3" class="mr-1" />
                        {{ $t('common.submit') }}
                      </EBtn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ElCard>
        </ElTabPane> -->
        <ElTabPane :label="$t('brand.slug')" name="slug">
          <ElCard shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div v-if="!form.slug || !form.slugId" class="mb-5">
                <div class="w-full flex items-center mb-5">
                  <ElAlert :title="$t('brand.warning.noSlugData')" type="warning" show-icon />
                </div>
                <div class="w-full flex items-center mb-5">
                  <ElInput v-model="currentSlug" :placeholder="$t('brand.placeholder.slug')" />
                </div>
                <EBtn type="primary" class="ml-5" @click="handleClickCreateBrandSlug">
                  <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                  {{ $t('common.save') }}
                </EBtn>
              </div>
              <div v-else class="mb-5">
                <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                  <div class="col-span-1 font-semibold text-gray-700">
                    {{ $t('brand.slug') }}:
                  </div>
                  <div class="col-span-11 w-full flex items-center">
                    <div v-if="!inputBrandSlugVisible" class="mr-2">
                      {{ form.slug }}
                    </div>
                    <div v-else class="flex items-center justify-start">
                      <ElInput
                        v-model="currentSlug"
                        :placeholder="$t('brand.placeholder.slug')"
                        class="mr-2"
                      />
                      <EBtn text @click="handleCancelUpdateBrandSlug">
                        <Icon icon="ep:close" :size="5" class="mr-1" />
                      </EBtn>
                      <EBtn type="primary" class="ml-5" @click="editBrandSlug">
                        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                        {{ $t('common.save') }}
                      </EBtn>
                    </div>
                    <EBtn v-if="!inputBrandSlugVisible" type="primary" text @click="handleClickUpdateBrandSlug">
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
