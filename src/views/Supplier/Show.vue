<script setup name="SupplierDetail" lang="ts">
import {
  createSupplierApi,
  createSupplierDetailApi,
  createSupplierSeoApi,
  createSupplierSlugApi,
  showSupplierApi,
  updateSupplierCodeApi,
  updateSupplierDetailDescriptionApi,
  updateSupplierDetailFileApi,
  updateSupplierDetailSupplierNameApi,
  updateSupplierSeoApi,
  updateSupplierSlugApi,
  updateSupplierStatusApi,
} from '@/api/supplier'
import { supplierCodes } from '@/data/supplier'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElAlert, ElCard, ElInput, ElMessage, ElSwitch, ElTabPane } from 'element-plus'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const activeName = ref<string>('base')

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

const loading = reactive({
  init: false,
  categories: false,
})

// 创建supplier请求参数
const createFormData = (): SupplierShow & CommonField => {
  return {
    id: '',
    supplierCode: '',
    status: true,
    isCustomLayout: true,
    layoutId: '',
    supplierDetailListResultDo: {
      id: '',
      supplierId: '',
      languageId: '',
      supplierName: '',
      supplierDescription: '',
      supplierFileId: '',
      supplierFileVo: {
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
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    supplierSeoListResultDo: {
      id: '',
      supplierId: '',
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
const form = reactive<SupplierShow>(createFormData())

const showSupplierPayload = reactive<ShowSupplierParams>({
  supplierId: id,
  languageId: selectLanguage.value.id,
})

// 获取文章数据
const getSupplierData = async () => {
  loading.init = true
  const { data } = await showSupplierApi(showSupplierPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: SupplierShow) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
  })
}

const initFormData = async () => {
  const res = await getSupplierData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  async val => {
    if (val) {
      selectLanguage.value = val
      showSupplierPayload.languageId = val.id
      await initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editSupplierStatus = async () => {
  loading.init = true
  const { data } = await updateSupplierStatusApi({
    supplierId: id,
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

const inputSupplierCodeVisible = ref<boolean>(false)
const handleClickUpdateSupplierCode = () => {
  inputSupplierCodeVisible.value = true
}
const handleCancelUpdateSupplierCode = () => {
  inputSupplierCodeVisible.value = false
}
const editSupplierCode = async () => {
  if (!form.supplierCode) {
    ElMessage.warning($t('supplier.placeholder.supplierCode'))
    return
  }
  loading.init = true
  const { data } = await updateSupplierCodeApi({
    supplierCode: form.supplierCode,
    supplierId: id,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  inputSupplierCodeVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新名称
const inputSupplierNameVisible = ref<boolean>(false)
const currentSupplierName = ref<string>('')
const handleClickUpdateSupplierName = (supplierName: string) => {
  currentSupplierName.value = supplierName
  inputSupplierNameVisible.value = true
}
const handleCancelUpdateSupplierName = () => {
  inputSupplierNameVisible.value = false
}
const editSupplierName = async (supplierDetailId: string) => {
  if (!currentSupplierName.value) {
    ElMessage.warning($t('supplier.placeholder.supplierName'))
    return
  }
  loading.init = true
  const { data } = await updateSupplierDetailSupplierNameApi({
    supplierName: currentSupplierName.value,
    supplierDetailId,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierName.value = ''
  await resetFormData(data)
  inputSupplierNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新名称新增时
const createSupplierName = async () => {
  if (!currentSupplierName.value) {
    ElMessage.warning($t('supplier.error.supplierName'))
    return
  }
  loading.init = true
  const { data } = await createSupplierDetailApi({
    supplierName: currentSupplierName.value,
    supplierId: id,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierName.value = ''
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
const inputSupplierDescriptionVisible = ref<boolean>(false)
const currentSupplierDescription = ref<string>('<p></p>')
const handleClickUpdateSupplierDescription = async (supplierDescription: string) => {
  currentSupplierDescription.value = supplierDescription
  inputSupplierDescriptionVisible.value = true
  await nextTick(async () => {
    await editorRef.value?.setEditorContent(supplierDescription)
  })
}
const handleCancelUpdateSupplierDescription = () => {
  inputSupplierDescriptionVisible.value = false
}
const editSupplierDescription = async (supplierDetailId: string) => {
  currentSupplierDescription.value = editorRef.value?.getEditorContent()
  loading.init = true
  const { data } = await updateSupplierDetailDescriptionApi({
    supplierDetailId,
    supplierDescription: currentSupplierDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierDescription.value = ''
  await resetFormData(data)
  inputSupplierDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新Slug
const inputSupplierSlugVisible = ref<boolean>(false)
const currentSlug = ref<string>('')

const handleClickCreateSupplierSlug = async () => {
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }

  const { data } = await createSupplierSlugApi({
    supplierId: id,
    languageId: usePreferenceStore().preference?.language.id,
    slug: currentSlug.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

const handleClickUpdateSupplierSlug = () => {
  currentSlug.value = form.slug
  inputSupplierSlugVisible.value = true
}
const handleCancelUpdateSupplierSlug = () => {
  inputSupplierSlugVisible.value = false
}
const editSupplierSlug = async () => {
  if (!currentSlug.value) {
    ElMessage.warning($t('supplier.error.slug'))
    return
  }
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }
  const { data } = await updateSupplierSlugApi({
    slugId: form.slugId,
    languageId: usePreferenceStore().preference?.language.id,
    slug: currentSlug.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSlug.value = ''
  await resetFormData(data)
  inputSupplierSlugVisible.value = false
  ElMessage.success($t('success.edit'))
}
// 更新图片
const uploadRef = ref()
const settingSupplierFileVisible = ref<boolean>(false)
const handleClickUpdateSupplierFile = async () => {
  settingSupplierFileVisible.value = true
  await nextTick()
  await uploadRef.value?.setFileData(form.supplierDetailListResultDo.supplierFileVo)
}
const handleCancelUpdateSupplierFile = () => {
  settingSupplierFileVisible.value = false
}
const editSupplierFile = async () => {
  loading.init = false
  const file = uploadRef.value?.getFileData()
  const payload = {
    supplierDetailId: form.supplierDetailListResultDo.id,
    languageId: selectLanguage.value.id,
    supplierFileId: file.fileData.id,
  }
  const { data } = await updateSupplierDetailFileApi(payload).catch(error => {
    loading.init = false
    throw error
  })
  await resetFormData(data)
  settingSupplierFileVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新元标题
const inputSupplierMetaTitleVisible = ref<boolean>(false)
const currentSupplierMetaTitle = ref<string>('')
const handleClickUpdateSupplierMetaTitle = (supplierMetaTitle: string) => {
  currentSupplierMetaTitle.value = supplierMetaTitle
  inputSupplierMetaTitleVisible.value = true
}
const handleCancelUpdateSupplierMetaTitle = () => {
  inputSupplierMetaTitleVisible.value = false
}
const editSupplierMetaTitle = async (supplierSeoId: string) => {
  if (!currentSupplierMetaTitle.value) {
    ElMessage.warning($t('supplier.error.supplierMetaTitle'))
    return
  }
  loading.init = true
  const { data } = await updateSupplierSeoApi({
    supplierSeoId,
    metaTitle: currentSupplierMetaTitle.value,
    metaDescription: form.supplierSeoListResultDo.metaDescription,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierMetaTitle.value = ''
  await resetFormData(data)
  inputSupplierMetaTitleVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新元标题新增时
const createSupplierMetaTitle = async () => {
  if (!currentSupplierMetaTitle.value) {
    ElMessage.warning($t('supplier.error.metaTitle'))
    return
  }
  loading.init = true
  const { data } = await createSupplierSeoApi({
    supplierId: id,
    languageId: selectLanguage.value.id,
    metaTitle: currentSupplierMetaTitle.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierMetaTitle.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

// 更新元描述
const inputSupplierMetaDescriptionVisible = ref<boolean>(false)
const currentSupplierMetaDescription = ref<string>('')
const handleClickUpdateSupplierMetaDescription = (supplierMetaDescription: string) => {
  currentSupplierMetaDescription.value = supplierMetaDescription
  inputSupplierMetaDescriptionVisible.value = true
}
const handleCancelUpdateSupplierMetaDescription = () => {
  inputSupplierMetaDescriptionVisible.value = false
}
const editSupplierMetaDescription = async (supplierSeoId: string) => {
  if (!currentSupplierMetaDescription.value) {
    ElMessage.warning($t('supplier.error.supplierMetaDescription'))
    return
  }
  loading.init = true
  const { data } = await updateSupplierSeoApi({
    supplierSeoId,
    metaTitle: form.supplierSeoListResultDo.metaTitle,
    metaDescription: currentSupplierMetaDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierMetaDescription.value = ''
  await resetFormData(data)
  inputSupplierMetaDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('supplier.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2" />
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('supplier.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editSupplierStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs">
        <ElTabPane :label="$t('supplier.base')" name="base">
          <ElCard v-if="form.supplierDetailListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <!-- 文章名称 -->

              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('supplier.supplierCode') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputSupplierCodeVisible" class="mr-2">
                    {{ form.supplierCode }}
                  </span>
                  <span v-else>
                    <ElSelect v-model="form.supplierCode" filterable clearable style="width: 300px" class="mr-2">
                      <ElOption
                        v-for="item in supplierCodes"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </ElSelect>
                    <EBtn text class="mr-2" @click="handleCancelUpdateSupplierCode">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                    <EBtn
                      type="primary"
                      text
                      @click="editSupplierCode"
                    >
                      <Icon icon="ep:check" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputSupplierCodeVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateSupplierCode"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('supplier.supplierName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputSupplierNameVisible" class="mr-2">
                    {{ form.supplierDetailListResultDo.supplierName }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentSupplierName"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editSupplierName(form.supplierDetailListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateSupplierName">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputSupplierNameVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateSupplierName(form.supplierDetailListResultDo.supplierName)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
              <!-- 描述 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('supplier.supplierDescription') }}:
                </div>
                <div class="col-span-11">
                  <div v-if="!inputSupplierDescriptionVisible" class="mr-2">
                    <div class="flex items-center mb-5">
                      <div class="mr-2">
                        <EBtn
                          v-if="!inputSupplierDescriptionVisible"
                          type="primary"
                          plain
                          @click="
                            handleClickUpdateSupplierDescription(form.supplierDetailListResultDo.supplierDescription)
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
                          v-html="form.supplierDetailListResultDo.supplierDescription"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <Editor ref="editorRef" v-model="currentSupplierDescription" class="mb-5" />
                    <div class="flex justify-center items-center">
                      <EBtn @click="handleCancelUpdateSupplierDescription">
                        {{ $t('common.cancel') }}
                      </EBtn>
                      <EBtn type="primary" @click="editSupplierDescription(form.supplierDetailListResultDo.id)">
                        {{ $t('common.save') }}
                      </EBtn>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 图片 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('supplier.supplierLogo') }}:
                </div>
                <div class="col-span-11">
                  <div v-if="!settingSupplierFileVisible">
                    <EBtn type="primary" text class="mb-5" @click="handleClickUpdateSupplierFile">
                      <Icon icon="ep:edit" :size="5" class="mr-1" />
                    </EBtn>
                    <div class="grid grid-cols-6 gap-4">
                      <ElImage :src="`${sourceUrl}${form.supplierDetailListResultDo.supplierFileVo?.fileUrl}`" />
                    </div>
                  </div>
                  <div v-else>
                    <UploadSingleImage ref="uploadRef" class="mb-5" />
                    <div class="flex justify-center items-center">
                      <EBtn @click="handleCancelUpdateSupplierFile">
                        {{ $t('common.cancel') }}
                      </EBtn>
                      <EBtn type="primary" @click="editSupplierFile">
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
              <ElAlert :title="$t('supplier.warning.noDetailData')" type="warning" show-icon />
            </div>
            <div class="flex justify-center items-center mb-5">
              <ElInput v-model="currentSupplierName" :placeholder="$t('supplier.placeholder.supplierName')" />
              <EBtn type="primary" class="ml-5" @click="createSupplierName">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('supplier.seo')" name="seo">
          <ElCard v-if="form.supplierSeoListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <!-- 文章元标题 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('supplier.metaTitle') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputSupplierMetaTitleVisible" class="mr-2">
                    {{ form.supplierSeoListResultDo.metaTitle }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentSupplierMetaTitle"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editSupplierMetaTitle(form.supplierSeoListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateSupplierMetaTitle">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputSupplierMetaTitleVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateSupplierMetaTitle(form.supplierSeoListResultDo.metaTitle)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
              <!-- 文章元描述 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('supplier.metaDescription') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputSupplierMetaDescriptionVisible" class="mr-2">
                    {{ form.supplierSeoListResultDo.metaDescription }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentSupplierMetaDescription"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editSupplierMetaDescription(form.supplierSeoListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateSupplierMetaDescription">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputSupplierMetaDescriptionVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateSupplierMetaDescription(form.supplierSeoListResultDo.metaDescription)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
            </div>
          </ElCard>
          <ElCard v-else>
            <div class="flex justify-center items-center mb-5">
              <ElAlert :title="$t('supplier.warning.noSeoData')" type="warning" show-icon />
            </div>
            <div class="flex justify-center items-center mb-5">
              <ElInput v-model="currentSupplierMetaTitle" :placeholder="$t('supplier.placeholder.metaTitle')" />
              <EBtn type="primary" class="ml-5" @click="createSupplierMetaTitle">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('supplier.slug')" name="slug">
          <ElCard shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div v-if="!form.slug || !form.slugId" class="mb-5">
                <div class="w-full flex items-center mb-5">
                  <ElAlert :title="$t('supplier.warning.noSlugData')" type="warning" show-icon />
                </div>
                <div class="w-full flex items-center mb-5">
                  <ElInput v-model="currentSlug" :placeholder="$t('supplier.placeholder.slug')" />
                </div>
                <EBtn type="primary" class="ml-5" @click="handleClickCreateSupplierSlug">
                  <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                  {{ $t('common.save') }}
                </EBtn>
              </div>
              <div v-else class="mb-5">
                <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                  <div class="col-span-1 font-semibold text-gray-700">
                    {{ $t('supplier.slug') }}:
                  </div>
                  <div class="col-span-11 w-full flex items-center">
                    <div v-if="!inputSupplierSlugVisible" class="mr-2">
                      {{ form.slug }}
                    </div>
                    <div v-else class="flex items-center justify-start">
                      <ElInput v-model="currentSlug" :placeholder="$t('supplier.placeholder.slug')" class="mr-2" />
                      <EBtn text @click="handleCancelUpdateSupplierSlug">
                        <Icon icon="ep:close" :size="5" class="mr-1" />
                      </EBtn>
                      <EBtn type="primary" class="ml-5" @click="editSupplierSlug">
                        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                        {{ $t('common.save') }}
                      </EBtn>
                    </div>
                    <EBtn v-if="!inputSupplierSlugVisible" type="primary" text @click="handleClickUpdateSupplierSlug">
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
