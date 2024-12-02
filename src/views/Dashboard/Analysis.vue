<script setup lang="ts">
import { fetchArticleMissingStatistics, fetchArticleSeoCheckList, fetchCategoryMissingStatistics, fetchCategorySeoCheckList, fetchDashboardAnalyticsApi } from '@/api/dashboard'
import { ElCard } from 'element-plus'

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

const missingCategory = ref<TableResponse<CategoryMissingStatisticsRes>>({
  list: [],
  total: 0,
})

const missingArticle = ref<TableResponse<ArticleMissingStatisticsRes>>({
  list: [],
  total: 0,
})

const getMissingCategory = async () => {
  const { data } = await fetchCategoryMissingStatistics({
    pageSize: 10,
    pageNumber: 1,
  }).catch(error => {
    loading.value = false
    throw error
  })
  missingCategory.value = data
}

const getMissingArticle = async () => {
  const { data } = await fetchArticleMissingStatistics({
    pageSize: 10,
    pageNumber: 1,
  }).catch(error => {
    loading.value = false
    throw error
  })
  missingArticle.value = data
}

const categorySeoCheck = ref<TableResponse<CategorySeoCheckRes>>({
  list: [],
  total: 0,
})

const articleSeoCheck = ref<TableResponse<ArticleSeoCheckRes>>({
  list: [],
  total: 0,
})

const geCategorySeoCheckList = async () => {
  const { data } = await fetchCategorySeoCheckList({
    pageSize: 10,
    pageNumber: 1,
  }).catch(error => {
    loading.value = false
    throw error
  })
  categorySeoCheck.value = data
}

const geArticleSeoCheckList = async () => {
  const { data } = await fetchArticleSeoCheckList({
    pageSize: 10,
    pageNumber: 1,
  }).catch(error => {
    loading.value = false
    throw error
  })
  articleSeoCheck.value = data
}

const init = async () => {
  loading.value = true
  await Promise.all([getStatistics(), getMissingCategory(), getMissingArticle(), geCategorySeoCheckList(), geArticleSeoCheckList()])
  loading.value = false
}

init()

const handleRedirectToArticle = (id: string) => {
  router.push({ name: 'ShowArticle', params: { id } })
}

const handleRedirectToCategory = (id: string) => {
  router.push({ name: 'ShowCategory', params: { id } })
}
</script>

<template>
  <div class="view-page">
    <div class="w-full pa-4">
      <div class="grid grid-cols-5 gap-5">
        <div class="col-span-1">
          <ElCard shadow="never">
            <template #header>
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <Icon icon="ant-design:schedule-outlined" class="mr-2" :size="6" color="#f56c6c" />我的待办
                </div>
                <span>{{ missingCategory.total + missingArticle.total + categorySeoCheck.total + articleSeoCheck.total }}条</span>
              </div>
            </template>
            <div v-if="missingCategory.total + missingArticle.total > 0" class="w-full">
              <div v-for="item in missingCategory.list" :key="item.id" class="mb-3 pb-3 border-b border-dashed border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <Icon name="ant-design:warning-outlined" class="mr-1" color="#f56c6c" />
                    分类ID: {{ item.id }}， 缺失 {{ item.languageName }} 语言内容
                  </div>
                  <div>
                    <EBtn plain type="primary" @click="handleRedirectToCategory(item.id)">
                      <Icon icon="ep:edit-pen" class="mr-1" />
                      去修改
                    </EBtn>
                  </div>
                </div>
              </div>
              <div v-for="item in missingArticle.list" :key="item.id" class="mb-3 pb-3 border-b border-dashed border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <Icon name="ant-design:warning-outlined" class="mr-1" color="#f56c6c" />
                    文章ID: {{ item.id }}， 缺失 {{ item.languageName }} 语言内容
                  </div>
                  <div>
                    <EBtn plain type="primary" @click="handleRedirectToArticle(item.id)">
                      <Icon icon="ep:edit-pen" class="mr-1" />
                      去修改
                    </EBtn>
                  </div>
                </div>
              </div>
              <div v-for="item in categorySeoCheck.list" :key="item.id" class="mb-3 pb-3 border-b border-dashed border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <Icon name="ant-design:warning-outlined" class="mr-1" color="#f56c6c" />
                    分类ID: {{ item.id }}， 缺失 {{ item.languageName }} SEO设置
                  </div>
                  <div>
                    <EBtn plain type="primary" @click="handleRedirectToCategory(item.id)">
                      <Icon icon="ep:edit-pen" class="mr-1" />
                      去修改
                    </EBtn>
                  </div>
                </div>
              </div>
              <div v-for="item in articleSeoCheck.list" :key="item.id" class="mb-3 pb-3 border-b border-dashed border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <Icon name="ant-design:warning-outlined" class="mr-1" color="#f56c6c" />
                    文章ID: {{ item.id }}， 缺失 {{ item.languageName }} SEO设置
                  </div>
                  <div>
                    <EBtn plain type="primary" @click="handleRedirectToArticle(item.id)">
                      <Icon icon="ep:edit-pen" class="mr-1" />
                      去修改
                    </EBtn>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="w-full">
              <ElEmpty description="您还没有待办任务哦" />
            </div>
          </ElCard>
        </div>
        <div class="col-span-4">
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
                    上海悦流软件有限公司
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
