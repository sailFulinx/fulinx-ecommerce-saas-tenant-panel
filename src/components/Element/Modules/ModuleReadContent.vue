<script setup lang="ts">
import { articleListApi } from '@/api/article'
import { listCategoryApi } from '@/api/category'
import { readContentTypes } from '@/data/theme'
import { usePreferenceStore } from '@/stores/preference'
import { hasContentElements } from '@/utils'

const readContentType = ref<string>('')
const readContentValue = ref<number | null>(null)
const readContentData = reactive<ReadContentData>({
  readContentType: '',
  readContentValue: null,
})
const categoriesProps = reactive({
  value: 'id',
  label: 'categoryName',
  checkStrictly: true,
  multiple: false,
})
const categories = ref<ListCategoryRes>({
  list: [],
  total: 0,
})
const categoriesRef = ref()
let prevReadContentType = ''
const status = reactive<any>({
  category: false,
  article: false,
})
const loading = reactive({
  init: false,
  data: false,
})
const articles = ref<TableResponse<ArticleListData & CommonField>>({
  list: [],
  total: 0,
})

/**
 * 获取分类数据
 */
async function getCategoryData() {
  loading.data = true
  const { data } = await listCategoryApi().catch(err => {
    throw err
  })
  categories.value = data
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
  const { data } = await articleListApi(payload).catch(err => {
    loading.data = false
    throw err
  })
  articles.value = data
  loading.data = false
}

async function changeReadContentType() {
  readContentValue.value = null
  if (readContentType.value === 'article') {
    await getArticlesData()
  }
  if (readContentType.value === 'category') {
    await getCategoryData()
  }
  if (prevReadContentType) {
    status[prevReadContentType] = false
  }
  status[readContentType.value] = true
  prevReadContentType = readContentType.value
  readContentData.readContentValue = null
  readContentData.readContentType = readContentType.value
}
function changeReadContentValue(v: any) {
  let readContentValue = null
  if (readContentType.value === 'category') {
    const nodeRes = categoriesRef.value.getCheckedNodes()
    const data = nodeRes[0]?.data || {}
    readContentValue = data.id
  } else {
    readContentValue = v || null
  }
  readContentData.readContentValue = readContentValue
  readContentData.readContentType = readContentType.value
}

const setReadContentData = async (readContentDataVal: ReadContentData) => {
  if (!readContentDataVal || !hasContentElements(readContentDataVal)) {
    return
  }
  readContentType.value = readContentDataVal.readContentType
  await changeReadContentType()
  if (readContentDataVal.readContentValue) {
    readContentValue.value = readContentDataVal.readContentValue
  }
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
  <div class="w-full flex justify-start items-center">
    <div class="w-[150px] mr-3">
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
    <div class="w-full">
      <!-- 博客分类 -->
      <ElCascader
        v-if="status.category"
        ref="categoriesRef"
        v-model="readContentValue"
        :loading="loading.data"
        :show-all-levels="false"
        :props="categoriesProps"
        clearable
        placeholder="请选择博客分类，支持搜索"
        :options="categories.list"
        filterable
        class="w-full"
        @change="changeReadContentValue"
      />
      <!-- 文章 -->
      <ElSelect
        v-if="status.article"
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
          :label="item.articleName"
          :value="item.id"
          style="height: 60px; line-height: 60px"
        >
          <span style="line-height: 60px">{{ item.articleName }}</span>
        </ElOption>
      </ElSelect>
    </div>
  </div>
</template>

<style>
.w-350 {
  width: 350px;
}
</style>
