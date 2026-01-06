<script setup name="WarehouseDetail" lang="ts">
import WarehouseBaseInfo from './Components/WarehouseBaseInfo.vue'
import { warehouseKey } from './type/injectionKeys'

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
  WarehouseValue: 'warehouseValue',
})

const activeName = ref(paneName.Base)

const loading = reactive({
  init: false,
  categories: false,
})

// 创建warehouse请求参数
const createFormData = (): WarehouseShowData & CommonField => {
  return {
    id: '',
    warehouseType: null,
    status: false,
    sort: 0,
    warehouseAdminLocalizedViewDos: [],
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
const form = reactive<WarehouseShowData & CommonField>(createFormData())

const currentForm = reactive<WarehouseAdminLocalizedViewDo>({
  languageId: '',
  languageCode: '',
  languageName: '',
  warehouseDetailListResultDo: null,
  warehouseValueResultDos: [],
})

const showWarehousePayload = reactive<ShowWarehouseParams>({
  warehouseId: id,
  languageId: selectLanguage.value.id,
})

// 获取属性数据
const getWarehouseData = async () => {
  loading.init = true
  const { data } = await showWarehouseApi(showWarehousePayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: WarehouseShowData & CommonField) => {
  // 使用完整的替换方式，而不是 Object.assign
  Object.assign(form, $clone(val))
  if (val.warehouseAdminLocalizedViewDos) {
    form.warehouseAdminLocalizedViewDos = $clone(val.warehouseAdminLocalizedViewDos)
  }
}

const initFormData = async () => {
  const res = await getWarehouseData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  val => {
    if (val) {
      selectLanguage.value = val
      showWarehousePayload.languageId = val.id
      languageCode.value = val.languageCode
      initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editWarehouseStatus = async () => {
  loading.init = true
  const { data } = await updateWarehouseStatusApi({
    warehouseId: id,
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
  form.warehouseAdminLocalizedViewDos.forEach(item => {
    if (item.languageCode === languageCode.value) {
      currentForm.warehouseDetailListResultDo = item.warehouseDetailListResultDo
      currentForm.languageCode = item.languageCode
      currentForm.languageName = item.languageName
    }
  })
  selectLanguage.value = languageListByCode[languageCode.value]
}

provide(warehouseKey, {
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
          <span>{{ $t('warehouse.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('warehouse.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editWarehouseStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main flex flex-col h-[calc(100vh-120px)]">
      <div class="flex-none sticky top-0 bg-white z-20">
        <ElTabs v-model="languageCode" @tab-change="handleChangeLanguageTab">
          <ElTabPane
            v-for="item in form.warehouseAdminLocalizedViewDos"
            :key="item.languageCode"
            :label="item.languageName"
            :name="item.languageCode"
          >
            <ElTabs v-model="activeName" class="demo-tabs">
              <ElTabPane :label="$t('warehouse.base')" name="base" />
              <ElTabPane :label="$t('warehouse.warehouseValueList')" name="warehouseValue" />
            </ElTabs>
          </ElTabPane>
        </ElTabs>
      </div>
      <div class="flex-1 overflow-auto pr-4 -mr-4">
        <div v-for="item in form.warehouseAdminLocalizedViewDos" :key="item.languageCode">
          <div v-show="languageCode === item.languageCode">
            <div v-show="activeName === 'base'">
              <WarehouseBaseInfo
                :current-item="item"
                :warehouse-admin-localized-view-dos="form.warehouseAdminLocalizedViewDos"
                :language-id="item.languageId"
                :warehouse-id="id"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
