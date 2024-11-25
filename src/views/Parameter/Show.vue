<script setup name="ParameterDetail" lang="ts">
import {
  createParameterDetailApi,
  showParameterApi,
  updateParameterDetailParameterNameApi,
  parameterValueListApi,
} from '@/api/parameter'
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
  list: false,
})
const listParameterValueQuery = reactive<ParameterValueListParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  parameterId: '',
  pageSize: 20,
  pageNumber: 1,
})
const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.parameterName === '') {
    listQuery.parameterName = null
  }
  const { data } = await parameterPaginationApi(listQuery).catch(err => {
    loading.list = false
    throw err
  })
  listResult.value = data
  loading.list = false
}

// 创建parameter请求参数
const createFormData = (): ParameterShow & CommonField => {
  return {
    id: '',
    parameterType: 0,
    parameterDetailListResultDo: {
      id: '',
      parameterId: '',
      languageId: '',
      parameterName: '',
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
  }
}

// form初始化
const form = reactive<ParameterShow>(createFormData())

const showParameterPayload = reactive<ShowParameterParams>({
  parameterId: id,
  languageId: selectLanguage.value.id,
})

// 获取文章数据
const getParameterData = async () => {
  loading.init = true
  const { data } = await showParameterApi(showParameterPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: ParameterShow) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
  })
}

const initFormData = async () => {
  const res = await getParameterData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  async val => {
    if (val) {
      selectLanguage.value = val
      showParameterPayload.languageId = val.id
      await initFormData()
    }
  },
  { immediate: true },
)

// 更新名称
const inputParameterNameVisible = ref<boolean>(false)
const currentParameterName = ref<string>('')
const handleClickUpdateParameterName = (parameterName: string) => {
  currentParameterName.value = parameterName
  inputParameterNameVisible.value = true
}
const handleCancelUpdateParameterName = () => {
  inputParameterNameVisible.value = false
}
const editParameterName = async (parameterDetailId: string) => {
  if (!currentParameterName.value) {
    ElMessage.warning($t('parameter.error.parameterName'))
    return
  }
  loading.init = true
  const { data } = await updateParameterDetailParameterNameApi({
    parameterName: currentParameterName.value,
    parameterDetailId,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentParameterName.value = ''
  await resetFormData(data)
  inputParameterNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新名称新增时
const createParameterName = async () => {
  if (!currentParameterName.value) {
    ElMessage.warning($t('parameter.error.parameterName'))
    return
  }
  loading.init = true
  const { data } = await createParameterDetailApi({
    parameterName: currentParameterName.value,
    parameterId: id,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentParameterName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('parameter.show') }}</span>
        </div>
        <div />
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs">
        <ElTabPane :label="$t('parameter.base')" name="base">
          <ElCard v-if="form.parameterDetailListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <!-- 文章名称 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('parameter.parameterName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputParameterNameVisible" class="mr-2">
                    {{ form.parameterDetailListResultDo.parameterName }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentParameterName"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editParameterName(form.parameterDetailListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateParameterName">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputParameterNameVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateParameterName(form.parameterDetailListResultDo.parameterName)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
            </div>
          </ElCard>
          <ElCard v-else>
            <div class="flex justify-center items-center mb-5">
              <ElAlert :title="$t('parameter.warning.noDetailData')" type="warning" show-icon />
            </div>
            <div class="flex justify-center items-center mb-5">
              <ElInput v-model="currentParameterName" :placeholder="$t('parameter.placeholder.parameterName')" />
              <EBtn type="primary" class="ml-5" @click="createParameterName">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('parameter.parameterValue')" name="parameterValue">
          <ElTable
            v-loading="loading.list"
            :data="listResult.list"
            row-key="id"
            tooltip-effect="dark"
            default-expand-all
            highlight-current-row
            border
            @selection-change="selectedParameterItem"
          >
            <ElTableColumn type="selection" width="55" />
            <ElTableColumn :label="$t('parameter.parameterName')">
              <template #default="scope">
                <span>{{ scope.row.parameterName }}</span>
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
              <template #default="scope">
                <span class="mr-5">
                  <EBtn size="small" @click="handleRedirectEdit(scope.row)">
                    <Icon icon="ep:edit" class="mr-1" />
                    {{ $t('common.view') }}
                  </EBtn>
                </span>
                <span>
                  <EBtn size="small" type="danger" :loading="loading.del" @click="handleDelete(scope.row)">
                    <Icon icon="ep:delete" class="mr-1" />
                    {{ $t('common.remove') }}
                  </EBtn>
                </span>
              </template>
            </ElTableColumn>
          </ElTable>
          <Pagination
            v-show="listResult.total > 0"
            v-model:page="listQuery.pageNumber"
            v-model:limit="listQuery.pageSize"
            :total="listResult.total"
            @pagination="pagination"
          />
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>
