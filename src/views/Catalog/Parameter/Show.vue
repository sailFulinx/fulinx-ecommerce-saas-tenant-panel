<script setup name="ParameterDetail" lang="ts">
import ParameterBaseInfo from './Components/ParameterBaseInfo.vue'
import ParameterValueInfo from './Components/ParameterValueInfo.vue'
import { parameterKey } from './type/injectionKeys'

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
  ParameterValue: 'parameterValue',
})

const activeName = ref(paneName.Base)

const loading = reactive({
  init: false,
  categories: false,
})

// 创建parameter请求参数
const createFormData = (): ParameterShowData & CommonField => {
  return {
    id: '',
    parameterType: null,
    status: false,
    sort: 0,
    parameterAdminLocalizedViewDos: [],
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
const form = reactive<ParameterShowData & CommonField>(createFormData())

const currentForm = reactive<ParameterAdminLocalizedViewDo>({
  languageId: '',
  languageCode: '',
  languageName: '',
  parameterDetailListResultDo: null,
  parameterValueResultDos: [],
})

const showParameterPayload = reactive<ShowParameterParams>({
  parameterId: id,
  languageId: selectLanguage.value.id,
})

// 获取参数数据
const getParameterData = async () => {
  loading.init = true
  const { data } = await showParameterApi(showParameterPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: ParameterShowData & CommonField) => {
  // 使用完整的替换方式，而不是 Object.assign
  Object.assign(form, $clone(val))
  if (val.parameterAdminLocalizedViewDos) {
    form.parameterAdminLocalizedViewDos = $clone(val.parameterAdminLocalizedViewDos)
  }
}

const initFormData = async () => {
  const res = await getParameterData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  val => {
    if (val) {
      selectLanguage.value = val
      showParameterPayload.languageId = val.id
      languageCode.value = val.languageCode
      initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editParameterStatus = async () => {
  loading.init = true
  const { data } = await updateParameterStatusApi({
    parameterId: id,
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
  form.parameterAdminLocalizedViewDos.forEach(item => {
    if (item.languageCode === languageCode.value) {
      currentForm.parameterDetailListResultDo = item.parameterDetailListResultDo
      currentForm.languageCode = item.languageCode
      currentForm.languageName = item.languageName
    }
  })
  selectLanguage.value = languageListByCode[languageCode.value]
}

provide(parameterKey, {
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
          <span>{{ $t('parameter.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('parameter.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editParameterStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main flex flex-col h-[calc(100vh-120px)]">
      <div class="flex-none sticky top-0 bg-white z-20">
        <ElTabs v-model="languageCode" @tab-change="handleChangeLanguageTab">
          <ElTabPane
            v-for="item in form.parameterAdminLocalizedViewDos"
            :key="item.languageCode"
            :label="item.languageName"
            :name="item.languageCode"
          >
            <ElTabs v-model="activeName" class="demo-tabs">
              <ElTabPane :label="$t('parameter.base')" name="base" />
              <ElTabPane
                v-if="form.parameterType === 1 "
                :label="$t('parameter.parameterValueList')"
                name="parameterValue"
              />
            </ElTabs>
          </ElTabPane>
        </ElTabs>
      </div>
      <div class="flex-1 overflow-auto pr-4 -mr-4">
        <div v-for="item in form.parameterAdminLocalizedViewDos" :key="item.languageCode">
          <div v-show="languageCode === item.languageCode">
            <div v-show="activeName === 'base'">
              <ParameterBaseInfo
                :current-item="item"
                :parameter-admin-localized-view-dos="form.parameterAdminLocalizedViewDos"
                :language-id="item.languageId"
                :parameter-id="id"
              />
            </div>
            <div v-show="activeName === 'parameterValue'">
              <ParameterValueInfo
                :current-item="item"
                :parameter-admin-localized-view-dos="form.parameterAdminLocalizedViewDos"
                :language-id="item.languageId"
                :parameter-id="id"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
