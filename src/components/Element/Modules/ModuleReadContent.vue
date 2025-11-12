<script setup lang="ts">
// 导入所有分类API
import { categoryBodyListApi } from '@/api/category/body'
import { categoryCosmeticListApi } from '@/api/category/cosmetic'
import { categoryDepartmentListApi } from '@/api/category/department'
import { categoryEdutainmentListApi } from '@/api/category/edutainment'
import { categoryEventListApi } from '@/api/category/event'
import { categoryListApi as normalCategoryListApi } from '@/api/category/normal'
import { categoryOutcomeListApi } from '@/api/category/outcome'
import { categoryVideoListApi } from '@/api/category/video'
// 导入所有内容API
import { articleListApi } from '@/api/content/article'
import { cosmeticListApi } from '@/api/content/cosmetic'
import { doctorListApi } from '@/api/content/doctor'
import { edutainmentListApi } from '@/api/content/edutainment'
import { eventListApi } from '@/api/content/event'
import { outcomeListApi } from '@/api/content/outcome'
import { pageListApi } from '@/api/content/page'
import { videoListApi } from '@/api/content/video'
import { readContentTypes } from '@/data/theme'
import { usePreferenceStore } from '@/stores/preference'
import { hasContentElements } from '@/utils'

const readContentType = ref<string>('')
const readContentValue = ref<string>('')
const readContentData = reactive<ReadContentData>({
  readContentType: '',
  readContentCount: 1,
  readContentValue: null,
})

const categoriesProps = reactive({
  value: 'id',
  label: 'categoryName',
  checkStrictly: true,
  multiple: false,
})
const categories = ref<TableResponse<CategoryData & CommonField>>({
  list: [],
  total: 0,
})
// const categoriesRef = ref()
let prevReadContentType = ''

// 状态管理
const status = reactive<any>({
  category: false,
  categoryBody: false,
  categoryCosmetic: false,
  categoryDepartment: false,
  categoryEdutainment: false,
  categoryEvent: false,
  categoryOutcome: false,
  categoryVideo: false,
  article: false,
  cosmetic: false,
  doctor: false,
  event: false,
  outcome: false,
  video: false,
  page: false,
  edutainment: false,
})

const loading = reactive({
  init: false,
  data: false,
})
const articles = ref<TableResponse<ArticleListData & CommonField>>({
  list: [],
  total: 0,
})

// 分类API映射
const categoryApis: Record<string, Function> = {
  category: normalCategoryListApi,
  categoryBody: categoryBodyListApi,
  categoryCosmetic: categoryCosmeticListApi,
  categoryDepartment: categoryDepartmentListApi,
  categoryEdutainment: categoryEdutainmentListApi,
  categoryEvent: categoryEventListApi,
  categoryOutcome: categoryOutcomeListApi,
  categoryVideo: categoryVideoListApi,
}

// 内容API映射
const contentApis: Record<string, Function> = {
  article: articleListApi,
  cosmetic: cosmeticListApi,
  doctor: doctorListApi,
  event: eventListApi,
  outcome: outcomeListApi,
  video: videoListApi,
  page: pageListApi,
  edutainment: edutainmentListApi,
}

// 分类标签字段映射
const categoryLabelFields: Record<string, string> = {
  category: 'categoryName',
  categoryBody: 'categoryBodyName',
  categoryCosmetic: 'categoryCosmeticName',
  categoryDepartment: 'categoryDepartmentName',
  categoryEdutainment: 'categoryEdutainmentName',
  categoryEvent: 'categoryEventName',
  categoryOutcome: 'categoryOutcomeName',
  categoryVideo: 'categoryVideoName',
}

// // 内容标签字段映射
// const contentLabelFields: Record<string, string> = {
//   article: 'articleName',
//   cosmetic: 'cosmeticName',
//   doctor: 'doctorName',
//   event: 'eventName',
//   outcome: 'outcomeName',
//   video: 'videoName',
//   page: 'pageName',
//   edutainment: 'edutainmentName',
// }

/**
 * 获取分类数据
 */
async function getCategoryData() {
  loading.data = true
  const payload = {
    languageId: usePreferenceStore().preference?.language.id,
  }

  // 根据分类类型调用对应的API
  const api = categoryApis[readContentType.value]
  if (api) {
    const { data } = await api(payload).catch((err: any) => {
      loading.data = false
      throw err
    })
    categories.value = data
  }

  // 动态设置分类标签字段
  if (categoryLabelFields[readContentType.value]) {
    categoriesProps.label = categoryLabelFields[readContentType.value]
  } else {
    categoriesProps.label = 'categoryName'
  }

  loading.data = false
}

/**
 * 获取文章数据
 */
async function getArticlesData() {
  const payload = {
    languageId: usePreferenceStore().preference?.language.id,
    articleId: readContentValue.value || null,
  }
  loading.data = true

  // 根据内容类型调用对应的API
  const api = contentApis[readContentType.value]
  if (api) {
    const { data } = await api(payload).catch((err: any) => {
      loading.data = false
      throw err
    })
    articles.value = data
  }
  loading.data = false
}

async function changeReadContentType() {
  readContentValue.value = ''

  // 处理内容类型
  if (Object.keys(contentApis).includes(readContentType.value)) {
    await getArticlesData()
  }

  // 处理分类类型
  if (Object.keys(categoryApis).includes(readContentType.value)) {
    await getCategoryData()
  }

  // 重置状态
  if (prevReadContentType) {
    status[prevReadContentType] = false
  }
  status[readContentType.value] = true
  prevReadContentType = readContentType.value

  readContentData.readContentValue = null
  readContentData.readContentCount = 1
  readContentData.readContentType = readContentType.value
}

// function changeReadContentValue(v: any) {
//   let readContentValue = null

//   // 处理分类类型
//   if (Object.keys(categoryApis).includes(readContentType.value)) {
//     const nodeRes = categoriesRef.value.getCheckedNodes()
//     const data = nodeRes[0]?.data || {}
//     readContentValue = data.id
//   } else if (Object.keys(contentApis).includes(readContentType.value)) {
//     // 处理内容类型
//     readContentValue = v || null
//   }

//   readContentData.readContentValue = readContentValue
//   readContentData.readContentType = readContentType.value
// }

const setReadContentData = async (readContentDataVal: ReadContentData) => {
  if (!readContentDataVal || !hasContentElements(readContentDataVal)) {
    return
  }
  readContentType.value = readContentDataVal.readContentType
  await changeReadContentType()
  if (readContentDataVal.readContentValue) {
    readContentValue.value = readContentDataVal.readContentValue
  }
  readContentData.readContentCount = readContentDataVal.readContentCount || 5
  readContentData.readContentType = readContentDataVal.readContentType || 'category'
  readContentData.readContentValue = readContentDataVal.readContentValue || null
}

function getReadContentData() {
  return jsonParse(readContentData)
}

defineExpose({
  getReadContentData,
  setReadContentData,
})
</script>

<template>
  <div class="w-full flex flex-col justify-start items-center">
    <div class="w-full mb-5">
      内容类型:
      <ElSelect
        v-model="readContentType"
        :loading="loading.data"
        placeholder="请选择链接类型"
        class="w-full"
        style="width: 150px"
        @change="changeReadContentType"
      >
        <ElOption v-for="item in readContentTypes" :key="item.id" :label="item.title" :value="item.code" />
      </ElSelect>
    </div>
    <div class="w-full mb-5">
      调用条数:
      <ElInputNumber v-model="readContentData.readContentCount" :min="1" :max="20" placeholder="请输入数量" />
    </div>
    <!-- <div class="w-full">
    <ElCascader
      v-if="Object.keys(categoryApis).includes(readContentType)"
      ref="categoriesRef"
      v-model="readContentValue"
      :loading="loading.data"
      :show-all-levels="false"
      :props="categoriesProps"
      clearable
      placeholder="请选择分类，支持搜索"
      :options="categories.list"
      filterable
      class="w-full"
      @change="changeReadContentValue"
    />
    <ElSelect
      v-if="Object.keys(contentApis).includes(readContentType)"
      v-model="readContentValue"
      filterable
      clearable
      remote
      reserve-keyword
      placeholder="请输入标题搜索"
      :remote-method="getArticlesData"
      :loading="loading.data"
      class="w-full"
      @change="changeReadContentValue"
    >
      <ElOption
        v-for="item in articles.list"
        :key="item.id"
        :label="(item[contentLabelFields[readContentType] as keyof typeof item] as string) || item.articleName || ''"
        :value="item.id"
        style="height: 60px; line-height: 60px"
      >
        <span style="line-height: 60px">
          {{ (item[contentLabelFields[readContentType] as keyof typeof item] as string) || item.articleName || '' }}
        </span>
      </ElOption>
    </ElSelect>
  </div> -->
  </div>
</template>

<style>
.w-350 {
  width: 350px;
}
</style>
