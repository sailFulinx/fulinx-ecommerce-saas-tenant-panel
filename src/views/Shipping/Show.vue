<script setup name="ShippingCompanyDetail" lang="ts">
import {
  createShippingCompanyApi,
  shippingCompanyTemplatePaginationApi,
  showShippingCompanyApi,
  updateShippingCompanyApi,
} from '@/api/shipping'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElAlert, ElCard, ElInput, ElMessage, ElSwitch, ElTabPane } from 'element-plus'
import ShippingCompanyTemplateDialog from './Modules/ShippingCompanyTemplateDialog.vue'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  shippingTemplate: false,
})

const listShippingTemplateResult = ref<TableResponse<ShippingCompanyTemplateListData & CommonField>>({
  list: [],
  total: 0,
})

const listShippingTemplateQuery = reactive<ShippingCompanyTemplateListParams & Pagination>({
  shippingCompanyId: id,
  pageSize: 20,
  pageNumber: 1,
})
const selectedShippingCompanyTemplateItem = ref<string[]>([])

const getShippingTemplateList = async () => {
  loading.shippingTemplate = true
  const { data } = await shippingCompanyTemplatePaginationApi(listShippingTemplateQuery).catch(err => {
    loading.shippingTemplate = false
    throw err
  })
  listShippingTemplateResult.value = data
  loading.shippingTemplate = false
}

const shippingListTemplatePagination = (val: PaginationComponentDataType) => {
  if (val) {
    listShippingTemplateQuery.pageSize = val.limit
    listShippingTemplateQuery.pageNumber = val.page
  }
  getShippingTemplateList()
}

const handleEditShippingTemplate = (val: ShippingCompanyTemplateListData & CommonField) => {
  console.log(val)
}

const handleDeleteShippingTemplate = (val: ShippingCompanyTemplateListData & CommonField) => {
  console.log(val)
}

// 创建shippingCompany请求参数
const createFormData = (): ShippingCompanyShow & CommonField => {
  return {
    id: '',
    shippingCompanyName: '',
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
const form = reactive<ShippingCompanyShow>(createFormData())
// 获取文章数据
const getShippingCompanyData = async () => {
  loading.init = true
  const { data } = await showShippingCompanyApi(id).catch(error => {
    loading.init = false
    throw error
  })
  Object.assign(form, data)
  loading.init = false
  return data
}

getShippingCompanyData()

// 更新名称
const inputShippingCompanyNameVisible = ref<boolean>(false)
const currentShippingCompanyName = ref<string>('')
const handleClickUpdateShippingCompanyName = (shippingCompanyName: string) => {
  currentShippingCompanyName.value = shippingCompanyName
  inputShippingCompanyNameVisible.value = true
}
const handleCancelUpdateShippingCompanyName = () => {
  inputShippingCompanyNameVisible.value = false
}
const editShippingCompanyName = async () => {
  if (!currentShippingCompanyName.value) {
    ElMessage.warning($t('shippingCompany.error.shippingCompanyName'))
    return
  }
  loading.init = true
  await updateShippingCompanyApi({
    shippingCompanyName: currentShippingCompanyName.value,
    shippingCompanyId: id,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentShippingCompanyName.value = ''
  await getShippingCompanyData()
  inputShippingCompanyNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

const handleChangeTab = async (name: string) => {
  if (name === 'template') {
    await getShippingTemplateList()
  }
}

const shippingCompanyTemplateDialogRef = ref()
const handleCreateShippingCompanyTemplate = async () => {
  await nextTick()
  shippingCompanyTemplateDialogRef.value.open(id, false)
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('shipping.show') }}</span>
        </div>
        <div />
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
        <ElTabPane :label="$t('shipping.base')" name="base">
          <ElCard shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <!-- 文章名称 -->
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('shipping.shippingCompanyName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span v-if="!inputShippingCompanyNameVisible" class="mr-2">
                    {{ form.shippingCompanyName }}
                  </span>
                  <span v-else>
                    <ElInput
                      v-model="currentShippingCompanyName"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editShippingCompanyName"
                    />
                    <EBtn text @click="handleCancelUpdateShippingCompanyName">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
                  </span>
                  <EBtn
                    v-if="!inputShippingCompanyNameVisible"
                    type="primary"
                    text
                    @click="handleClickUpdateShippingCompanyName(form.shippingCompanyName)"
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                  </EBtn>
                </div>
              </div>
            </div>
          </ElCard>
        </ElTabPane>
        <!-- <ElTabPane :label="$t('shipping.template')" name="template">
          <div class="w-full mt-0 pt-0">
            <div class="flex justify-end items-center my-5 mt-3">
              <EBtn type="primary" @click="handleCreateShippingCompanyTemplate">
                {{ $t('common.add') }}
              </EBtn>
              <EBtn type="danger">
                {{ $t('common.remove') }}
              </EBtn>
            </div>
            <ElTable
              v-loading="loading.shippingTemplate"
              :data="listShippingTemplateResult.list"
              row-key="id"
              tooltip-effect="dark"
              default-expand-all
              highlight-current-row
              border
              @selection-change="selectedShippingCompanyTemplateItem"
            >
              <ElTableColumn type="selection" width="55" />
              <ElTableColumn :label="$t('shipping.shippingCompanyTemplateName')">
                <template #default="scope">
                  <span>{{ scope.row.shippingCompanyTemplateName }}</span>
                </template>
              </ElTableColumn>
              <ElTableColumn
                label="操作"
                header-align="center"
                width="220"
                align="center"
                class-name="pl-15 fixed-width"
              >
                <template #default="scope">
                  <span class="mr-5">
                    <EBtn size="small" @click="handleEditShippingTemplate(scope.row)">
                      <Icon icon="ep:edit" class="mr-1" />
                      {{ $t('common.view') }}
                    </EBtn>
                  </span>
                  <span>
                    <EBtn
                      size="small"
                      type="danger"
                      :loading="loading.shippingTemplate"
                      @click="handleDeleteShippingTemplate(scope.row)"
                    >
                      <Icon icon="ep:delete" class="mr-1" />
                      {{ $t('common.remove') }}
                    </EBtn>
                  </span>
                </template>
              </ElTableColumn>
            </ElTable>
            <Pagination
              v-show="listShippingTemplateResult.total > 0"
              v-model:page="listShippingTemplateQuery.pageNumber"
              v-model:limit="listShippingTemplateQuery.pageSize"
              :total="listShippingTemplateResult.total"
              @pagination="shippingListTemplatePagination"
            />
          </div>
        </ElTabPane> -->
      </ElTabs>
    </div>
    <ShippingCompanyTemplateDialog ref="shippingCompanyTemplateDialogRef" @get-list="getShippingTemplateList" />
  </div>
</template>
