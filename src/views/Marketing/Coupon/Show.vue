<script setup name="CouponDetail" lang="ts">
import type { InputInstance } from 'element-plus'
import { couponIssuePaginationApi, issueCouponApi, issueCouponToCustomerApi, showCouponApi } from '@/api/coupon'
import { useLocale } from '@/hooks/useLocale'
import { formatTime } from '@/utils'
import {
  ElAlert,
  ElCard,
  ElDialog,
  ElDivider,
  ElInput,
  ElMessage,
  ElSwitch,
  ElTable,
  ElTabPane,
  ElTag,
} from 'element-plus'
import { debounce } from 'lodash-es'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  issue: false,
  list: false,
})

// 创建coupon请求参数
const createFormData = (): CouponShowData & CommonField => {
  return {
    id: '',
    couponName: '',
    couponType: 0,
    couponTypeText: '',
    couponValue: 0,
    couponRuleValue: 0,
    couponRuleType: 0,
    couponRuleTypeText: '',
    customerRetentionCycle: 0,
    issueCount: 0,
    startedTime: '',
    endedTime: '',
    issuedStatus: true,
    couponDescription: '',
    status: true,
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
const form = reactive<CouponShowData>(createFormData())

// 获取文章数据
const getCouponData = async () => {
  loading.init = true
  const { data } = await showCouponApi(id).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: CouponShowData) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
  })
}

const initFormData = async () => {
  const res = await getCouponData()
  resetFormData(res)
}

initFormData()

const editCouponStatus = async () => {}

const issueCoupon = async () => {
  loading.issue = true
  await issueCouponApi({
    couponId: id,
  }).catch(error => {
    loading.issue = false
    throw error
  })
  ElMessage.success('发放成功')
  loading.issue = false
}

const listIssueQuery = reactive<CouponIssueListParams & Pagination>({
  pageSize: 20,
  pageNumber: 1,
  couponId: id,
})

const listIssueResult = ref<TableResponse<CouponIssueListData & CommonField>>({
  list: [],
  total: 0,
})

const getCouponIssueList = async () => {
  loading.list = true
  const { data } = await couponIssuePaginationApi(listIssueQuery).catch(err => {
    loading.list = false
    throw err
  })
  listIssueResult.value = data
  loading.list = false
}

const pagination = (val: PaginationComponentDataType) => {
  if (val) {
    listIssueQuery.pageSize = val.limit
    listIssueQuery.pageNumber = val.page
  }
  getCouponIssueList()
}

const handleChangeTab = (name: string) => {
  if (name === 'issueHistory') {
    getCouponIssueList()
  }
}

const dialogVisible = ref(false)

const issueCouponId = ref('')
const issueCustomerEmail = ref('')
const handleIssueToCustomer = (row: CouponIssueListData & CommonField) => {
  issueCustomerEmail.value = ''
  issueCouponId.value = row.id
  dialogVisible.value = true
}

const issueCouponToCustomer = async () => {
  loading.issue = true
  await issueCouponToCustomerApi({
    couponId: issueCouponId.value,
    customerEmail: issueCustomerEmail.value,
  }).catch(error => {
    loading.issue = false
    throw error
  })
  ElMessage.success('发行成功')
  await getCouponIssueList()
  dialogVisible.value = false
}

const handleRedirectToCustomer = (customerId: string) => {
  router.push({ name: 'ShowCustomer', params: { id: customerId } })
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('coupon.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2" />
            <div class="mr-2">
              <div class="flex items-center">
                <div class="mr-2">
                  <EBtn size="small" type="danger" :loading="loading.issue" @click="issueCoupon">
                    发行优惠券
                  </EBtn>
                </div>
                <div>
                  <span class="text-sm mr-2">{{ $t('coupon.status') }}：</span>
                  <ElSwitch v-model="form.status" @change="editCouponStatus" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
        <ElTabPane :label="$t('coupon.base')" name="base">
          <ElCard shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('coupon.couponName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.couponName }}
                </div>
              </div>

              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('coupon.couponType') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.couponTypeText }}
                </div>
              </div>

              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('coupon.couponRuleType') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span class="mr-2">{{ form.couponRuleTypeText }},</span>
                  <span v-if="form.couponRuleType === 2">给{{ form.customerRetentionCycle }}天内未下单用户发放</span>
                </div>
              </div>

              <div v-if="form.couponRuleType !== 3" class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('coupon.couponValue') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <span>满</span>
                  <span>{{ form.couponRuleValue }}</span>
                  <span>减</span>
                  <span>{{ form.couponValue }}</span>
                </div>
              </div>

              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('coupon.couponValue') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.couponValue }}
                </div>
              </div>

              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('coupon.issueCount') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.issueCount }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('coupon.issuedStatus') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.issuedStatus ? $t('coupon.issued') : $t('coupon.notIssued') }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('coupon.expiredTime') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ formatTime(form.startedTime) }} - {{ formatTime(form.endedTime) }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('coupon.couponDescription') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <p v-html="form.couponDescription" />
                </div>
              </div>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('coupon.issueHistory')" name="issueHistory">
          <ElCard shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <ElTable
                v-loading="loading.list"
                :data="listIssueResult.list"
                row-key="id"
                tooltip-effect="dark"
                default-expand-all
                highlight-current-row
                border
              >
                <ElTableColumn :label="$t('coupon.couponCode')">
                  <template #default="scope">
                    <span>{{ scope.row.couponCode }}</span>
                  </template>
                </ElTableColumn>
                <ElTableColumn :label="$t('coupon.customerId')" width="200">
                  <template #default="scope">
                    <ElTag
                      v-if="scope.row.customerId !== null"
                      class="cursor-pointer"
                      @click="handleRedirectToCustomer(scope.row.customerId)"
                    >
                      {{ scope.row.customerId }}
                    </ElTag>
                    <span v-else>暂未领取</span>
                  </template>
                </ElTableColumn>
                <ElTableColumn :label="$t('coupon.isUsed')" width="120">
                  <template #default="scope">
                    <span>{{ scope.row.isUsed ? $t('common.yes') : $t('common.no') }}</span>
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
                    <span v-if="scope.row.customerId === null" class="mr-5">
                      <EBtn size="small" @click="handleIssueToCustomer(scope.row)">发放给指定客户</EBtn>
                    </span>
                  </template>
                </ElTableColumn>
              </ElTable>
              <Pagination
                v-show="listIssueResult.total > 0"
                v-model:page="listIssueQuery.pageNumber"
                v-model:limit="listIssueQuery.pageSize"
                :total="listIssueResult.total"
                @pagination="pagination"
              />
            </div>
          </ElCard>
        </ElTabPane>
      </ElTabs>
    </div>
    <ElDialog v-model="dialogVisible" title="发放优惠券" width="70%">
      <ElInput v-model="issueCustomerEmail" placeholder="请输入客户邮箱" />
      <template #footer>
        <ElButton @click="dialogVisible = false">
          取 消
        </ElButton>
        <ElButton type="primary" @click="issueCouponToCustomer">
          确 定
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>
