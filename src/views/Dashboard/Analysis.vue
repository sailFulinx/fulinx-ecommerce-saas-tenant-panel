<script setup lang="ts">
import { formatTime } from '@/utils'

const router = useRouter()
const statistics = ref<StatisticsData>({
  siteCount: '',
  orderCount: '',
  customerCount: '',
  appointmentCount: '',
})

const loading = reactive({
  list: false,
  statics: false,
})

const getStatistics = async () => {
  loading.statics = true
  const { data } = await fetchDashboardAnalyticsApi().catch(error => {
    loading.statics = false
    throw error
  })
  statistics.value = { ...data }
  loading.statics = false
  return data
}

const listResult = ref<TableResponse<OrderData & CommonField>>({
  list: [],
  total: 0,
})

const listQuery = reactive<OrderListParams & Pagination>({
  orderId: null,
  pageSize: 20,
  pageNumber: 1,
})

const getList = async () => {
  loading.list = true
  if (listQuery.orderId === '') {
    listQuery.orderId = null
  }
  const { data } = await orderPaginationApi(listQuery).catch(err => {
    loading.list = false
    throw err
  })
  listResult.value = data
  loading.list = false
}
const handleRedirectEdit = (val: OrderData & CommonField) => {
  router.push({ name: 'ShowOrder', params: { id: val.id } })
}
getStatistics()
getList()
</script>

<template>
  <div class="view-page">
    <div class="w-full pa-4">
      <div class="grid grid-cols-5 gap-5">
        <div class="col-span-4">
          <div class="grid grid-cols-4 gap-5 mb-5">
            <div class="col-span-1">
              <ElCard shadow="never">
                <div class="flex items-center justify-between w-full mb-5">
                  <Icon name="ant-design:unordered-list-outlined" :size="8" color="#e18c92" class="mr-2" />
                </div>
                <div class="flex items-center justify-between w-full fs-16px">
                  <span>订单数量</span>
                  <span class="fs-24px">{{ statistics.orderCount }}</span>
                </div>
              </ElCard>
            </div>
            <div class="col-span-1">
              <ElCard shadow="never">
                <div class="flex items-center justify-between w-full mb-5">
                  <Icon name="ant-design:user-outlined" :size="8" color="#8ce1d0" class="mr-2" />
                </div>
                <div class="flex items-center justify-between w-full fs-16px">
                  <span>顾客数量</span>
                  <span class="fs-24px">{{ statistics.customerCount }}</span>
                </div>
              </ElCard>
            </div>
            <div class="col-span-1">
              <ElCard shadow="never">
                <div class="flex items-center justify-between w-full mb-5">
                  <Icon name="ant-design:message-outlined" :size="8" color="#8cb2e1" class="mr-2" />
                </div>
                <div class="flex items-center justify-between w-full fs-16px">
                  <span>预约数量</span>
                  <span class="fs-24px">{{ statistics.appointmentCount }}</span>
                </div>
              </ElCard>
            </div>
            <div class="col-span-1">
              <ElCard shadow="never">
                <div class="flex items-center justify-between w-full mb-5">
                  <Icon name="ant-design:database-outlined" :size="8" color="#1890ff" class="mr-2" />
                </div>
                <div class="flex items-center justify-between w-full fs-16px">
                  <span>网站数量</span>
                  <span class="fs-24px">{{ statistics.siteCount }}</span>
                </div>
              </ElCard>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-5 mb-5">
            <div class="col-span-4">
              <ElCard shadow="never">
                <template #header>
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon icon="ant-design:schedule-outlined" class="mr-2" :size="6" color="#f56c6c" />
                      最新订单
                    </div>
                    <span>{{ listResult.total }} 条</span>
                  </div>
                </template>
                <div v-if="listResult.total > 0" class="w-full">
                  <ElTable
                    v-loading="loading.list"
                    :data="listResult.list"
                    row-key="id"
                    tooltip-effect="dark"
                    default-expand-all
                    highlight-current-row
                    border
                  >
                    <ElTableColumn :label="$t('order.orderId')">
                      <template #default="scope">
                        <span>{{ scope.row.orderNumber }}</span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn :label="$t('order.email')">
                      <template #default="scope">
                        <span>{{ scope.row.customerEmail }}</span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn :label="$t('order.orderTotalAmount')">
                      <template #default="scope">
                        <span>{{ scope.row.currencyVo.symbolLeft }}{{ scope.row.orderTotalAmount.toFixed(2) }}</span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn :label="$t('order.status')">
                      <template #default="scope">
                        <span>{{ scope.row.orderStatusText }}</span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn :label="$t('common.recordCreateTime')">
                      <template #default="scope">
                        <span>{{ formatTime(scope.row.recordCreateTime) }}</span>
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
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
                <div v-else class="w-full">
                  <ElEmpty description="您还没有订单哦" />
                </div>
              </ElCard>
            </div>
          </div>
        </div>
        <div class="col-span-1">
          <ElCard shadow="never" class="mb-5">
            <template #header>
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <Icon name="ant-design:info-circle-outlined" :size="6" color="#0dc29a" class="mr-2" />
                  技术支持
                </div>
              </div>
            </template>
            <div>
              <div class="w-full mb-5">
                米农信息技术（上海）有限公司
              </div>
            </div>
          </ElCard>
          <ElCard shadow="never" class="mb-5">
            <template #header>
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <Icon name="ant-design:safety-outlined" :size="6" color="#f3850f" class="mr-2" />
                  系统架构
                </div>
              </div>
            </template>
            <div>
              <div class="w-full mb-5">
                后端： SpringBoot 3.3.0
              </div>
              <div class="w-full mb-5">
                前端： Node 20.15.0, Vue 3.5.10, Nuxt 4.2
              </div>
            </div>
          </ElCard>
          <ElCard shadow="never" class="mb-5">
            <template #header>
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <Icon name="ant-design:signature-outlined" :size="6" color="#4a90e7" class="mr-2" />
                  软件版本
                </div>
              </div>
            </template>
            <div>
              <div class="w-full mb-5">
                API版本： V1.0.0
              </div>
              <div class="w-full mb-5">
                后台管理界面版本： V1.0.0
              </div>
              <div class="w-full mb-5">
                网站版本： V1.0.0
              </div>
            </div>
          </ElCard>
        </div>
      </div>
    </div>
  </div>
</template>
