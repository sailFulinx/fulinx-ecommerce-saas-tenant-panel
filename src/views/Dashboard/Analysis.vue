<script setup lang="ts">
// import { formatTime } from '@/utils'

// const router = useRouter()
// const statistics = ref<StatisticsData>({
//   siteCount: 0,
//   orderCount: 0,
//   customerCount: '',
//   appointmentCount: '',
// })

// const loading = reactive({
//   list: false,
//   statics: false,
// })

// const getStatistics = async () => {
//   loading.statics = true
//   const { data } = await fetchDashboardAnalyticsApi().catch(error => {
//     loading.statics = false
//     throw error
//   })
//   statistics.value = { ...data }
//   loading.statics = false
//   return data
// }

// const listResult = ref<TableResponse<OrderData & CommonField>>({
//   list: [],
//   total: 0,
// })

// const listQuery = reactive<OrderListParams & Pagination>({
//   orderId: null,
//   pageSize: 20,
//   pageNumber: 1,
// })

// const getList = async () => {
//   loading.list = true
//   if (listQuery.orderId === '') {
//     listQuery.orderId = null
//   }
//   const { data } = await orderPaginationApi(listQuery).catch(err => {
//     loading.list = false
//     throw err
//   })
//   listResult.value = data
//   loading.list = false
// }
// const handleRedirectEdit = (val: OrderData & CommonField) => {
//   router.push({ name: 'ShowOrder', params: { id: val.id } })
// }
// getStatistics()
// getList()
</script>

<template>
  <div class="view-page">
    <div class="w-full pa-4">

    </div>
  </div>
</template>
