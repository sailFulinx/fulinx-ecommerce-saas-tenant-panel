<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { fetchLanguageListApi } from '@/api/language'
import { createSite, editSite, showSite } from '@/api/site'
import { themeList } from '@/api/theme'
import { siteStatuses } from '@/data/site'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

const id = useRoute().params.id as string

const { currentTenantStoreId } = storeToRefs(useTenantStore())

console.log('currentTenantStoreId', currentTenantStoreId)

const rules = reactive({
  languageId: [{ required: true, message: '语言必须选择', trigger: 'blur' }],
  siteName: [{ required: true, message: '网站名称必须填写', trigger: 'blur' }],
  status: [{ required: true, message: '状态必填', trigger: 'blur' }],
  metaTitle: [{ required: true, message: '元标题必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
  theme: false,
})

const themeListQuery = reactive<ThemeListParams>({
  themeName: '',
})

const themeListResult = ref<TableResponse<ThemeData & CommonField>>({
  list: [],
  total: 0,
})

const getList = async () => {
  loading.theme = true
  if (themeListQuery.themeName === '') {
    themeListQuery.themeName = null
  }
  const { data } = await themeList(themeListQuery).catch(err => {
    loading.theme = false
    throw err
  })
  if (data.list) {
    data.list.forEach(item => {
      if (item.themeThumbFileVo) {
        item.themeThumbFileVo.fileUrl = `${import.meta.env.VITE_RESOURCE_URL + item.themeThumbFileVo.fileUrl}?x-oss-process=image/resize,w_200`
      }
    })
  }

  themeListResult.value = data
  loading.theme = false
}

getList()

const languagePayload = reactive<LanguageListParams>({
  languageCode: null,
})

const languages = ref<ListLanguageRes>({
  list: [],
  total: 0,
})

const getLanguageList = async () => {
  const { data } = await fetchLanguageListApi(languagePayload).catch(error => {
    throw error
  })
  languages.value.list = data.list
}

getLanguageList()

const siteFormRef = ref()

const siteForm = ref<SiteRequest>({
  tenantStoreId: currentTenantStoreId.value,
  themeId: '',
  languageId: '',
  siteName: '',
  metaDescription: '',
  metaTitle: '',
  logoFileId: null,
  faviconFileId: null,
  logoFileVo: {
    id: '',
    bucketName: '',
    etag: '',
    s3Key: '',
    isPublic: true,
    originalFileName: '',
    fileName: '',
    fileContentType: '',
    fileExtensionName: '',
    path: '',
    fileUrl: '',
    fileSize: '',
    sha256: '',
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
  },
  faviconFileVo: {
    id: '',
    bucketName: '',
    etag: '',
    s3Key: '',
    isPublic: true,
    originalFileName: '',
    fileName: '',
    fileContentType: '',
    fileExtensionName: '',
    path: '',
    fileUrl: '',
    fileSize: '',
    sha256: '',
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',

  },
  status: true,
})

const siteLogo = ref<FileData & CommonField>({
  id: '',
  bucketName: '',
  etag: '',
  s3Key: '',
  isPublic: true,
  originalFileName: '',
  fileName: '',
  fileContentType: '',
  fileExtensionName: '',
  path: '',
  fileUrl: '',
  fileSize: '',
  sha256: '',
  isDelete: 0,
  remark: '',
  recordVersion: 0,
  recordCreateName: '',
  recordUpdateName: '',
  recordCreateTime: '',
  recordUpdateTime: '',
})

const siteFavicon = ref<FileData & CommonField>({
  id: '',
  bucketName: '',
  etag: '',
  s3Key: '',
  isPublic: true,
  originalFileName: '',
  fileName: '',
  fileContentType: '',
  fileExtensionName: '',
  path: '',
  fileUrl: '',
  fileSize: '',
  sha256: '',
  isDelete: 0,
  remark: '',
  recordVersion: 0,
  recordCreateName: '',
  recordUpdateName: '',
  recordCreateTime: '',
  recordUpdateTime: '',
})

const uploadLogoRef = ref()

const uploadFaviconRef = ref()

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'SiteList' })
}

const getSiteData = async () => {
  loading.init = true
  try {
    const { data } = await showSite(id)
    if (data.logoFileVo && data.logoFileVo.fileUrl) {
      siteLogo.value = data.logoFileVo
      uploadLogoRef.value.setFileData(data.logoFileVo)
    }
    if (data.faviconFileVo && data.faviconFileVo.fileUrl) {
      siteFavicon.value = data.faviconFileVo
      uploadFaviconRef.value.setFileData(data.faviconFileVo)
    }
    Object.assign(siteForm.value, data)
  } catch (error) {
    console.error('Failed to fetch site data:', error)
  } finally {
    loading.init = false
  }
}
const init = async () => {
  if (props.isEdit && id) {
    await getSiteData()
  }
}

const save = async () => {
  if (!uploadLogoRef.value || !uploadFaviconRef.value) {
    return
  }
  const logo = uploadLogoRef.value.getFileData()
  if (!logo || !logo.fileData) {
    ElMessage.error('请上传网站logo')
    return
  }
  if (!siteForm.value.tenantStoreId || siteForm.value.tenantStoreId === '') {
    siteForm.value.tenantStoreId = currentTenantStoreId.value
  }
  console.log(siteForm.value)
  siteForm.value.logoFileId = logo.fileData.id
  const favicon = uploadFaviconRef.value.getFileData()
  siteForm.value.faviconFileId = favicon.fileData.id
  const valid = await siteFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  if (props.isEdit) {
    await editSite(id, siteForm.value).catch(err => {
      throw err
    })
    ElMessage.success('修改成功')
  } else {
    await createSite(siteForm.value).catch(err => {
      throw err
    })
    ElMessage.success('添加成功')
    deleteTagView(true)
  }
  return true
}

onMounted(() => {
  init()
})

defineExpose({
  save,
})
</script>

<template>
  <ElForm ref="siteFormRef" :model="siteForm" :rules="rules" label-width="120px">
    <ElRow :gutter="20" type="flex" justify="center">
      <ElCol :span="24">
        <ElCard shadow="never">
          <ElFormItem label="主题" prop="themeId">
            <ElSelect v-model="siteForm.themeId">
              <ElOption v-for="item in themeListResult.list" :key="item.id" :value="item.id" :label="item.themeName" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="语言" prop="languageId">
            <ElSelect v-model="siteForm.languageId">
              <ElOption v-for="item in languages.list" :key="item.id" :value="item.id" :label="item.languageName" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="网站名称" prop="siteName">
            <ElInput
              v-model="siteForm.siteName"
              class="input-line"
              minlength="1"
              maxlength="120"
              placeholder="网站名称，少于120个字符"
            />
          </ElFormItem>
          <ElFormItem label="状态">
            <ElSelect v-model="siteForm.status">
              <ElOption v-for="item in siteStatuses" :key="item.id" :value="item.value" :label="item.label" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="元标题" prop="metaTitle">
            <ElInput
              v-model="siteForm.metaTitle"
              class="input-line"
              minlength="1"
              maxlength="60"
              placeholder="元标题，少于60个字符"
            />
          </ElFormItem>
          <ElFormItem label="元描述" prop="metaDescription">
            <ElInput
              v-model="siteForm.metaDescription"
              class="input-line"
              type="textarea"
              rows="4"
              maxlength="160"
              placeholder="描述，少于160个字符"
            />
          </ElFormItem>
          <ElFormItem label="网站Logo" prop="logoFileId">
            <UploadSingleImage ref="uploadLogoRef" :image-data="siteLogo" class="mr-2" style="width: 200px" />
          </ElFormItem>
          <ElFormItem label="Favicon">
            <UploadSingleImage ref="uploadFaviconRef" :image-data="siteFavicon" class="mr-2" style="width: 200px" />
          </ElFormItem>
        </ElCard>
      </ElCol>
    </ElRow>
  </ElForm>
</template>

<style lang="scss" scoped></style>
