<script setup name="ParameterDetail" lang="ts">
import {
  createParameterDetailApi,
  createParameterValueApi,
  parameterValueListApi,
  removeParameterValueApi,
  showParameterApi,
  updateParameterDetailParameterNameApi,
  updateParameterTypeApi,
  updateParameterValueDetailParameterValueContentApi,
} from '@/api/parameter'
import { getParameterTypeLabel, parameterTypes } from '@/data/parameter'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElAlert, ElCard, ElForm, ElInput, ElMessage, ElSwitch, ElTabPane } from 'element-plus'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  list: false,
})

const selectedParameterValueList = ref<string[]>([])

const selectedParameterValueItem = (val: (ParameterValueListData & CommonField)[]) => {
  selectedParameterValueList.value = []
  val.forEach(item => {
    selectedParameterValueList.value.push(item.id)
  })
}

const listParameterValueQuery = reactive<ParameterParameterValueListParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  parameterId: id,
  pageSize: 20,
  pageNumber: 1,
})

const listParameterValueResult = ref<TableResponse<ParameterValueListData & CommonField>>({
  list: [],
  total: 0,
})

const getParameterValueList = async () => {
  loading.list = true
  const { data } = await parameterValueListApi(listParameterValueQuery).catch(err => {
    loading.list = false
    throw err
  })
  listParameterValueResult.value = data
  loading.list = false
}

const paginationParameterValue = (val: PaginationComponentDataType) => {
  if (val) {
    listParameterValueQuery.pageSize = val.limit
    listParameterValueQuery.pageNumber = val.page
  }
  getParameterValueList()
}

const parameterValueDialogRef = ref()

const parameterValueFormRef = ref()

const parameterValueDialogVisible = ref(false)

const parameterValueForm = reactive<CreateParameterValueParams>({
  parameterId: id,
  parameterValueDetailId: '',
  parameterValueContent: '',
  languageId: selectLanguage.value.id,
})

const handleCreateParameterValue = () => {
  parameterValueDialogVisible.value = true
  parameterValueForm.parameterValueContent = ''
}

const parameterValueFormRules = {
  parameterValueContent: [
    { required: true, message: $t('parameter.placeholder.parameterValueContent'), trigger: 'blur' },
  ],
}

const isEditParameterValue = ref<boolean>(false)

const handleEditParameterValue = (item: ParameterValueListData & CommonField) => {
  parameterValueForm.parameterValueContent = item.parameterValueContent
  parameterValueForm.parameterValueDetailId = item.parameterValueDetailId
  parameterValueDialogVisible.value = true
  isEditParameterValue.value = true
}

const handleSubmitParameterValue = async () => {
  const isValid = await useValidForm(parameterValueFormRef.value)
  console.log(isValid)
  if (!isValid) {
    return
  }
  parameterValueForm.parameterValueContent = parameterValueForm.parameterValueContent.trim()
  loading.list = true
  if (!isEditParameterValue.value) {
    await createParameterValueApi(parameterValueForm).catch(error => {
      loading.list = false
      throw error
    })
  } else {
    await updateParameterValueDetailParameterValueContentApi(parameterValueForm).catch(error => {
      loading.list = false
      throw error
    })
  }
  isEditParameterValue.value = false
  parameterValueDialogVisible.value = false
  await getParameterValueList()
}

const handleDeleteParameterValue = async (item: ParameterValueListData & CommonField) => {
  const deletedIds = [item.id]
  loading.list = true
  await removeParameterValueApi({
    parameterValueIds: deletedIds,
  }).catch(error => {
    loading.list = false
    throw error
  })
  await getParameterValueList()
  ElMessage.success($t('success.remove'))
}

const handleMultiDeleteParameterValue = async () => {
  const deletedIds = selectedParameterValueList.value
  loading.list = true
  await removeParameterValueApi({
    parameterValueIds: deletedIds,
  }).catch(error => {
    loading.list = false
    throw error
  })
  await getParameterValueList()
  selectedParameterValueList.value = []
  ElMessage.success($t('success.remove'))
}

const handleChangeTab = async (pane: string) => {
  if (pane === 'parameterValue') {
    await getParameterValueList()
  }
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

const editParameterTypeVisible = ref<boolean>(false)

// 更新参数类型
const editParameterType = async () => {
  const payload = {
    parameterId: id,
    languageId: selectLanguage.value.id,
    parameterType: form.parameterType,
  }
  await updateParameterTypeApi(payload).catch(error => {
    throw error
  })
  ElMessage.success($t('success.edit'))
  editParameterTypeVisible.value = false
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
      <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
        <ElTabPane :label="$t('parameter.base')" name="base">
          <ElCard v-if="form.parameterDetailListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div class="w-full grid grid-cols-12 gap-8 p-4">
                <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
                  {{ $t('parameter.parameterName') }} :
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <div v-if="!inputParameterNameVisible" class="mr-2 flex">
                    <div class="mr-1">
                      {{ form.parameterDetailListResultDo.parameterName }}
                    </div>
                    <EBtn
                      type="primary"
                      text
                      @click="handleClickUpdateParameterName(form.parameterDetailListResultDo.parameterName)"
                    >
                      <Icon icon="ep:edit" :size="4" class="mr-1" />
                    </EBtn>
                  </div>
                  <div v-else>
                    <ElInput
                      v-model="currentParameterName"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editParameterName(form.parameterDetailListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateParameterName">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </div>
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
                  {{ $t('parameter.parameterType') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <div v-if="!editParameterTypeVisible" class="mr-2 flex">
                    <div class="mr-1">
                      {{ getParameterTypeLabel(form.parameterType) }}
                    </div>
                    <EBtn type="primary" text @click="editParameterTypeVisible = true">
                      <Icon icon="ep:edit" :size="4" class="mr-1" />
                    </EBtn>
                  </div>
                  <div v-else>
                    <ElSelect
                      v-model="form.parameterType"
                      :placeholder="$t('parameter.placeholder.parameterType')"
                      style="width: 120px"
                      @change="editParameterType"
                    >
                      <ElOption v-for="item in parameterTypes" :key="item.id" :label="item.label" :value="item.id" />
                    </ElSelect>
                  </div>
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
        <ElTabPane
          v-if="form.parameterType === 1 || form.parameterType === 3"
          :label="$t('parameter.parameterValue')"
          name="parameterValue"
        >
          <div class="flex justify-between items-center mb-5">
            <div>参数值列表</div>
            <div>
              <EBtn type="primary" @click="handleCreateParameterValue">
                添加参数值
              </EBtn>
              <EBtn type="danger" @click="handleMultiDeleteParameterValue">
                删除参数值
              </EBtn>
            </div>
          </div>
          <ElTable
            v-loading="loading.list"
            :data="listParameterValueResult.list"
            row-key="id"
            tooltip-effect="dark"
            default-expand-all
            highlight-current-row
            border
            @selection-change="selectedParameterValueItem"
          >
            <ElTableColumn type="selection" width="55" />
            <ElTableColumn :label="$t('parameter.parameterValueContent')">
              <template #default="scope">
                <span>{{ scope.row.parameterValueContent }}</span>
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
              <template #default="scope">
                <span class="mr-5">
                  <EBtn size="small" @click="handleEditParameterValue(scope.row)">
                    <Icon icon="ep:edit" class="mr-1" />
                    {{ $t('common.edit') }}
                  </EBtn>
                </span>
                <span>
                  <EBtn size="small" type="danger" @click="handleDeleteParameterValue(scope.row)">
                    <Icon icon="ep:delete" class="mr-1" />
                    {{ $t('common.remove') }}
                  </EBtn>
                </span>
              </template>
            </ElTableColumn>
          </ElTable>
          <Pagination
            v-show="listParameterValueResult.total > 0"
            v-model:page="listParameterValueQuery.pageNumber"
            v-model:limit="listParameterValueQuery.pageSize"
            :total="listParameterValueResult.total"
            @pagination="paginationParameterValue"
          />
        </ElTabPane>
      </ElTabs>
      <ElDialog ref="parameterValueDialogRef" v-model="parameterValueDialogVisible" title="添加参数值">
        <ElForm
          ref="parameterValueFormRef"
          :model="parameterValueForm"
          :rules="parameterValueFormRules"
          label-width="120px"
        >
          <ElFormItem :label="$t('parameter.parameterValueContent')" prop="parameterValueContent">
            <ElInput
              v-model="parameterValueForm.parameterValueContent"
              :placeholder="$t('parameter.placeholder.parameterValueContent')"
            />
          </ElFormItem>
        </ElForm>
        <template #footer>
          <div class="dialog-footer">
            <EBtn @click="parameterValueDialogVisible = false">
              {{ $t('common.cancel') }}
            </EBtn>
            <EBtn type="primary" @click="handleSubmitParameterValue">
              {{ $t('common.submit') }}
            </EBtn>
          </div>
        </template>
      </ElDialog>
    </div>
  </div>
</template>
