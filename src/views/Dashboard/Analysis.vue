<script setup lang="ts">
import { fetchDashboardAnalyticsApi } from '@/api/dashboard'

const statistics = ref<StatisticsData>({
  siteCount: 0,
  articleCount: 0,
  messageCount: 0,
  categoryCount: 0,
})

const loading = ref(false)

const getStatistics = async () => {
  const { data } = await fetchDashboardAnalyticsApi().catch(error => {
    loading.value = false
    throw error
  })
  statistics.value = { ...data }
  return data
}

const init = async () => {
  loading.value = true
  await Promise.all([getStatistics()])
  loading.value = false
}

init()
</script>

<template>
  <div class="view-page">
    <div class="w-full pa-4">
      <div class="grid grid-cols-5 gap-5">
        <div class="col-span-5">
          <div class="grid grid-cols-4 gap-5 mb-5">
            <div class="col-span-1">
              <ElCard shadow="never">
                <div class="flex items-center justify-between w-full mb-5">
                  <Icon name="ant-design:unordered-list-outlined" :size="8" color="#e18c92" class="mr-2" />
                </div>
                <div class="flex items-center justify-between w-full fs-16px">
                  <span>文章数量</span>
                  <span class="fs-24px">{{ statistics.articleCount }}</span>
                </div>
              </ElCard>
            </div>
            <div class="col-span-1">
              <ElCard shadow="never">
                <div class="flex items-center justify-between w-full mb-5">
                  <Icon name="ant-design:appstore-outlined" :size="8" color="#8ce1d0" class="mr-2" />
                </div>
                <div class="flex items-center justify-between w-full fs-16px">
                  <span>分类数量</span>
                  <span class="fs-24px">{{ statistics.categoryCount }}</span>
                </div>
              </ElCard>
            </div>
            <div class="col-span-1">
              <ElCard shadow="never">
                <div class="flex items-center justify-between w-full mb-5">
                  <Icon name="ant-design:message-outlined" :size="8" color="#8cb2e1" class="mr-2" />
                </div>
                <div class="flex items-center justify-between w-full fs-16px">
                  <span>用户留言</span>
                  <span class="fs-24px">{{ statistics.messageCount }}</span>
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
                      <Icon name="ant-design:info-circle-outlined" :size="6" color="#0dc29a" class="mr-2" />技术支持
                    </div>
                  </div>
                </template>
                <div>
                  <div class="w-full mb-5">
                    米农信息技术（上海）有限公司
                  </div>
                </div>
              </ElCard>
            </div>
            <div class="col-span-4">
              <ElCard shadow="never">
                <template #header>
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="ant-design:safety-outlined" :size="6" color="#f3850f" class="mr-2" />系统架构
                    </div>
                  </div>
                </template>
                <div>
                  <div class="w-full mb-5">
                    后端： SpringBoot 3.3.0
                  </div>
                  <div class="w-full mb-5">
                    前端： Node 20.15.0, Vue 3.5.10, Nuxt 3.0.0
                  </div>
                </div>
              </ElCard>
            </div>
            <div class="col-span-4">
              <ElCard shadow="never">
                <template #header>
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="ant-design:signature-outlined" :size="6" color="#4a90e7" class="mr-2" />软件版本
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
    </div>
  </div>
</template>
