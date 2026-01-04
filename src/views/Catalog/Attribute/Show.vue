<script setup name="AttributeDetail" lang="ts">
import AttributeBaseInfo from './Components/AttributeBaseInfo.vue'
import AttributeValueInfo from './Components/AttributeValueInfo.vue'
import { attributeKey } from './type/injectionKeys'

const { id } = defineProps<{
  id: string
}>()

const { t: $t } = useLocale()

const { getLanguagesListByCode } = useLanguageStore()
const languageListByCode = getLanguagesListByCode()
const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const languageCode = ref('')

const paneName = readonly({
  Base: 'base',
  AttributeValue: 'attributeValue',
})

const activeName = ref(paneName.Base)

const loading = reactive({
  init: false,
  categories: false,
})

// 创建attribute请求参数
const createFormData = (): AttributeShowData & CommonField => {
  return {
    id: '',
    attributeType: null,
    status: false,
    sort: 0,
    attributeAdminLocalizedViewDos: [],
    remark: '',
    isDelete: 0,
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
  }
}

const layoutTypeList = ref<any[]>([])

const getLayoutTypeList = async () => {
  const { data } = await fetchLayoutTypeListApi({ layoutTypeCode: null }).catch(error => {
    throw error
  })
  layoutTypeList.value = data.list
}

getLayoutTypeList()

// form初始化
const form = reactive<AttributeShowData & CommonField>(createFormData())

const currentForm = reactive<AttributeAdminLocalizedViewDo>({
  languageId: '',
  languageCode: '',
  languageName: '',
  attributeDetailListResultDo: null,
  attributeValueResultDos: [],
})

const showAttributePayload = reactive<ShowAttributeParams>({
  attributeId: id,
  languageId: selectLanguage.value.id,
})

// 获取属性数据
const getAttributeData = async () => {
  loading.init = true
  const { data } = await showAttributeApi(showAttributePayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: AttributeShowData & CommonField) => {
  // 使用完整的替换方式，而不是 Object.assign
  Object.assign(form, $clone(val))
  if (val.attributeAdminLocalizedViewDos) {
    form.attributeAdminLocalizedViewDos = $clone(val.attributeAdminLocalizedViewDos)
  }
}

const initFormData = async () => {
  const res = await getAttributeData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  val => {
    if (val) {
      selectLanguage.value = val
      showAttributePayload.languageId = val.id
      languageCode.value = val.languageCode
      initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editAttributeStatus = async () => {
  loading.init = true
  const { data } = await updateAttributeStatusApi({
    attributeId: id,
    status: form.status,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.edit'))
}

const handleChangeLanguageTab = () => {
  form.attributeAdminLocalizedViewDos.forEach(item => {
    if (item.languageCode === languageCode.value) {
      currentForm.attributeDetailListResultDo = item.attributeDetailListResultDo
      currentForm.languageCode = item.languageCode
      currentForm.languageName = item.languageName
    }
  })
  selectLanguage.value = languageListByCode[languageCode.value]
}

provide(attributeKey, {
  id,
  paneName,
  form, // 直接传递 reactive 对象
  loading, // 直接传递 reactive 对象
  activeName,
  selectLanguage,
  resetFormData,
})
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('attribute.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('attribute.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editAttributeStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main flex flex-col h-[calc(100vh-120px)]">
      <div class="flex-none sticky top-0 bg-white z-20">
        <ElTabs v-model="languageCode" @tab-change="handleChangeLanguageTab">
          <ElTabPane
            v-for="item in form.attributeAdminLocalizedViewDos"
            :key="item.languageCode"
            :label="item.languageName"
            :name="item.languageCode"
          >
            <ElTabs v-model="activeName" class="demo-tabs">
              <ElTabPane :label="$t('attribute.base')" name="base" />
              <ElTabPane :label="$t('attribute.attributeValueList')" name="attributeValue" />
            </ElTabs>
          </ElTabPane>
        </ElTabs>
      </div>
      <div class="flex-1 overflow-auto pr-4 -mr-4">
        <div v-for="item in form.attributeAdminLocalizedViewDos" :key="item.languageCode">
          <div v-show="languageCode === item.languageCode">
            <div v-show="activeName === 'base'">
              <AttributeBaseInfo
                :current-item="item"
                :attribute-admin-localized-view-dos="form.attributeAdminLocalizedViewDos"
                :language-id="item.languageId"
                :attribute-id="id"
              />
            </div>
            <div v-show="activeName === 'attributeValue'">
              <AttributeValueInfo
                :current-item="item"
                :attribute-admin-localized-view-dos="form.attributeAdminLocalizedViewDos"
                :language-id="item.languageId"
                :attribute-id="id"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
