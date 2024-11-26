<script setup name="ParameterGroupDetail" lang="ts">
import {
  createParameterGroupDetailApi,
  createParameterGroupParameterRelationApi,
  parameterGroupParameterRelationPaginationApi,
  parameterPaginationApi,
  removeParameterGroupParameterRelationApi,
  showParameterGroupApi,
  updateParameterGroupDetailParameterGroupNameApi,
  updateParameterGroupStatusApi,
} from '@/api/parameter'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElAlert, ElCard, ElInput, ElMessage, ElSelect, ElSwitch, ElTabPane } from 'element-plus'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  list: false,
})

const listParameterQuery = reactive<ParameterListParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  pageSize: 20,
  pageNumber: 1,
})

const listParameterResult = ref<TableResponse<ParameterListData & CommonField>>({
  list: [],
  total: 0,
})

const getParameterList = async () => {
  loading.list = true
  const { data } = await parameterPaginationApi(listParameterQuery).catch(err => {
    loading.list = false
    throw err
  })
  listParameterResult.value = data
  loading.list = false
}

const selectedParameterList = ref<string[]>([])

const selectedParameterItem = (val: (ParameterListData & CommonField)[]) => {
  selectedParameterList.value = []
  val.forEach(item => {
    selectedParameterList.value.push(item.id)
  })
}

const listParameterGroupParameterQuery = reactive<ParameterGroupParameterRelationParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  parameterGroupId: id,
  pageSize: 20,
  pageNumber: 1,
})

const listParameterGroupParameterResult = ref<TableResponse<ParameterGroupParameterRelationData & CommonField>>({
  list: [],
  total: 0,
})

const getParameterGroupParameterRelationList = async () => {
  loading.list = true
  const { data } = await parameterGroupParameterRelationPaginationApi(listParameterGroupParameterQuery).catch(err => {
    loading.list = false
    throw err
  })
  listParameterGroupParameterResult.value = data
  loading.list = false
}

const paginationParameterGroupRelation = (val: PaginationComponentDataType) => {
  if (val) {
    listParameterGroupParameterQuery.pageSize = val.limit
    listParameterGroupParameterQuery.pageNumber = val.page
  }
  getParameterGroupParameterRelationList()
}

const parameterDialogRef = ref()

const parameterDialogVisible = ref(false)

const parameterGroupRelationFormRules = {
  parameterIds: [
    {
      required: true,
      message: $t('parameterGroup.placeholder.parameterIds'),
      trigger: 'blur',
    },
  ],
}

const parameterGroupParameterRelationFormRef = ref()

const parameterGroupRelationForm = reactive<CreateParameterGroupParameterRelationParams>({
  parameterGroupId: id,
  languageId: selectLanguage.value.id,
  parameterIds: [],
})

const handleChangeTab = async (name: string) => {
  if (name === 'parameter') {
    await Promise.all([getParameterList(), getParameterGroupParameterRelationList()])
  }
}

const handleCreateParameter = () => {
  parameterDialogVisible.value = true
}

const handleDeleteParameter = async (val: ParameterGroupParameterRelationData & CommonField) => {
  loading.list = true
  await removeParameterGroupParameterRelationApi({ parameterGroupParameterIds: [val.id] }).catch(error => {
    loading.list = false
    throw error
  })
  await getParameterGroupParameterRelationList()
  ElMessage.success($t('success.remove'))
}

const handleMultiDeleteParameter = async () => {
  if (selectedParameterList.value.length === 0) {
    ElMessage.warning($t('parameterGroup.placeholder.parameterIds'))
    return
  }
  loading.list = true
  await removeParameterGroupParameterRelationApi({
    parameterGroupParameterIds: selectedParameterList.value,
  }).catch(error => {
    loading.list = false
    throw error
  })
  loading.list = false
  selectedParameterList.value = []
  await getParameterGroupParameterRelationList()
  ElMessage.success($t('success.remove'))
}

const handleSubmitParameterGroup = async () => {
  const isValid = await useValidForm(parameterGroupParameterRelationFormRef.value)
  if (!isValid) {
    return
  }
  await createParameterGroupParameterRelationApi(parameterGroupRelationForm).catch(error => {
    loading.list = false
    throw error
  })
  await getParameterGroupParameterRelationList()
  parameterDialogVisible.value = false
}

// 创建parameterGroup请求参数
const createFormData = (): (ParameterGroupShow & CommonField) => {
  return {
    id: '',
    status: true,
    parameterGroupDetailListResultDo: {
      id: '',
      parameterGroupId: '',
      languageId: '',
      parameterGroupName: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    parameterGroupParameterRelationListResultDos: [
      {
        id: '',
        parameterGroupId: '',
        parameterId: '',
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: '',
      },
    ],
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
const form = reactive<ParameterGroupShow>(createFormData())

const showParameterGroupPayload = reactive<ShowParameterGroupParams>({
  parameterGroupId: id,
  languageId: selectLanguage.value.id,
})

// 获取文章数据
const getParameterGroupData = async () => {
  loading.init = true
  const { data } = await showParameterGroupApi(showParameterGroupPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: ParameterGroupShow) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
  })
}

const initFormData = async () => {
  const res = await getParameterGroupData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  async val => {
    if (val) {
      selectLanguage.value = val
      showParameterGroupPayload.languageId = val.id
      await initFormData()
    }
  },
  { immediate: true },
)

// 更新状态
const editParameterGroupStatus = async () => {
  loading.init = true
  const { data } = await updateParameterGroupStatusApi({
    parameterGroupId: id,
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
const inputParameterGroupNameVisible = ref<boolean>(false)
const currentParameterGroupName = ref<string>('')
const handleClickUpdateParameterGroupName = (parameterGroupName: string) => {
  currentParameterGroupName.value = parameterGroupName
  inputParameterGroupNameVisible.value = true
}
const handleCancelUpdateParameterGroupName = () => {
  inputParameterGroupNameVisible.value = false
}
const editParameterGroupName = async (parameterGroupDetailId: string) => {
  if (!currentParameterGroupName.value) {
    ElMessage.warning($t('parameterGroup.error.parameterGroupName'))
    return
  }
  loading.init = true
  const { data } = await updateParameterGroupDetailParameterGroupNameApi({ parameterGroupName: currentParameterGroupName.value, parameterGroupDetailId }).catch(
    error => {
      loading.init = false
      throw error
    },
  )
  loading.init = false
  currentParameterGroupName.value = ''
  await resetFormData(data)
  inputParameterGroupNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新名称新增时
const createParameterGroupName = async () => {
  if (!currentParameterGroupName.value) {
    ElMessage.warning($t('parameterGroup.error.parameterGroupName'))
    return
  }
  loading.init = true
  const { data } = await createParameterGroupDetailApi({ parameterGroupName: currentParameterGroupName.value, parameterGroupId: id, languageId: selectLanguage.value.id }).catch(
    error => {
      loading.init = false
      throw error
    },
  )
  loading.init = false
  currentParameterGroupName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('parameterGroup.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2" />
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('parameterGroup.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editParameterGroupStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
        <ElTabPane :label="$t('parameterGroup.base')" name="base">
          <ElCard v-if="form.parameterGroupDetailListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <!-- 文章名称 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4">
                <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
                  {{ $t('parameterGroup.parameterGroupName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputParameterGroupNameVisible" class="mr-2">
                    {{ form.parameterGroupDetailListResultDo.parameterGroupName }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentParameterGroupName"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editParameterGroupName(form.parameterGroupDetailListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateParameterGroupName">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputParameterGroupNameVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateParameterGroupName(form.parameterGroupDetailListResultDo.parameterGroupName)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
            </div>
          </ElCard>
          <ElCard v-else>
            <div class="flex justify-center items-center mb-5">
              <ElAlert :title="$t('parameterGroup.warning.noDetailData')" type="warning" show-icon />
            </div>
            <div class="flex justify-center items-center mb-5">
              <ElInput v-model="currentParameterGroupName" :placeholder="$t('parameterGroup.placeholder.parameterGroupName')" />
              <EBtn type="primary" class="ml-5" @click="createParameterGroupName">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('parameterGroup.parameter')" name="parameter">
          <div class="flex justify-between items-center mb-5">
            <div>
              参数列表
            </div>
            <div>
              <EBtn type="primary" @click="handleCreateParameter">
                添加参数
              </EBtn>
              <EBtn type="danger" @click="handleMultiDeleteParameter">
                删除参数
              </EBtn>
            </div>
          </div>
          <ElTable
            v-loading="loading.list"
            :data="listParameterGroupParameterResult.list"
            row-key="id"
            tooltip-effect="dark"
            default-expand-all
            highlight-current-row
            border
            @selection-change="selectedParameterItem"
          >
            <ElTableColumn type="selection" width="55" />
            <ElTableColumn :label="$t('parameterGroup.parameterName')">
              <template #default="scope">
                <span>{{ scope.row.parameterName }}</span>
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
              <template #default="scope">
                <span>
                  <EBtn size="small" type="danger" @click="handleDeleteParameter(scope.row)">
                    <Icon icon="ep:delete" class="mr-1" />
                    {{ $t('common.remove') }}
                  </EBtn>
                </span>
              </template>
            </ElTableColumn>
          </ElTable>
          <Pagination
            v-show="listParameterResult.total > 0"
            v-model:page="listParameterQuery.pageNumber"
            v-model:limit="listParameterQuery.pageSize"
            :total="listParameterResult.total"
            @pagination="paginationParameterGroupRelation"
          />
        </ElTabPane>
      </ElTabs>
    </div>
    <ElDialog ref="parameterDialogRef" v-model="parameterDialogVisible" title="添加参数">
      <ElForm ref="parameterGroupParameterRelationFormRef" :model="parameterGroupRelationForm" :rules="parameterGroupRelationFormRules" label-width="80px">
        <ElFormItem :label="$t('parameterGroup.parameter')" prop="parameterIds">
          <ElSelect v-model="parameterGroupRelationForm.parameterIds" multiple clearable filterable placeholder="请选择参数">
            <ElOption v-for="item in listParameterResult.list" :key="item.id" :label="item.parameterName" :value="item.id" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <EBtn @click="parameterDialogVisible = false">
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn type="primary" @click="handleSubmitParameterGroup">
            {{ $t('common.submit') }}
          </EBtn>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
