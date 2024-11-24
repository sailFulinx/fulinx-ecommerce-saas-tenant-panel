<script setup name="ThemeLinkType" lang="ts">
import { articleListApi } from '@/api/article'
import { listCategoryApi } from '@/api/category'
import { linkTypes } from '@/data/theme'
import { usePreferenceStore } from '@/stores/preference'

// 画面中是否需要children，children分为menu中可能有children，link中可能也有
const props = defineProps({
  isNeedChildren: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['changeLinkType'])
const linkType = ref<string>('')
// const linkValue = ref<string>('')

// TODO 需要读取对应类型的slug，也就是说这里需要加上slug，但有一个问题就是如果slug发生了更改，这个地方怎么更新？从后端更新？还是前台做一个刷新的按钮更新
const linkData = reactive<LinkData>({
  linkType: '',
  linkUrl: '',
  linkValue: '',
  linkLabel: '',
  children: [],
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
let prevLinkType: string = ''
const status = reactive<any>({
  category: false,
  article: false,
  externalLink: false,
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
  const payload = {
    languageId: usePreferenceStore().preference?.language.id,
  }
  const { data } = await listCategoryApi(payload).catch(err => {
    throw err
  })
  categories.value = data
  loading.data = false
}

const articlePayload = reactive<ArticleListParams>({
  languageId: usePreferenceStore().preference?.language.id,
  articleId: null,
  articleName: null,
})

/**
 * 获取文章数据
 */
async function getArticlesData() {
  if (linkData.linkValue === '/') {
    return
  }
  articlePayload.articleId = Number(linkData.linkValue) || null
  loading.data = true
  const { data } = await articleListApi(articlePayload).catch(err => {
    loading.data = false
    throw err
  })
  articles.value = data
  loading.data = false
}

const queryArticlesData = (query: string) => {
  if (!query || query === '/' || query.length < 2) {
    return
  }
  articlePayload.articleName = query
  getArticlesData()
}

async function getLinkRemoteData() {
  // linkValue.value = ''
  linkData.linkValue = ''
  if (linkType.value === 'article') {
    articlePayload.articleName = null
    await getArticlesData()
  }
  if (linkType.value === 'category') {
    await getCategoryData()
  }
  if (prevLinkType) {
    status[prevLinkType] = false
  }
  status[linkType.value] = true
  prevLinkType = linkType.value
  linkData.linkUrl = '/'
  linkData.linkValue = ''
  linkData.linkType = linkType.value
  linkData.linkLabel = ''
  linkData.children = []
}

async function changeLinkType() {
  await getLinkRemoteData()
  // 更改上级菜单链接类型
  emit('changeLinkType', linkData)
}
function changeLinkValue(v: any) {
  if (linkType.value === 'category') {
    const childrenConfig = [] as LinkData[]
    const nodeRes = categoriesRef.value.getCheckedNodes()
    const data = nodeRes[0]?.data || {}
    const slug = data.slug || `/category/${data.id}`
    linkData.linkValue = data.id
    linkData.linkUrl = `${slug}`
    linkData.linkLabel = data.categoryName
    linkData.linkType = linkType.value
    if (props.isNeedChildren) {
      const children = data.children
      if (children) {
        linkData.linkUrl = `${slug}`
        for (const item of children) {
          const { slug, categoryName, id } = item
          const slugData = slug || `/category/${id}`
          const childrenItem = {
            linkType: linkType.value,
            linkUrl: `${slugData}`,
            linkValue: id,
            linkLabel: categoryName,
            children: [],
          } as LinkData
          childrenConfig.push(childrenItem)
        }
        linkData.children = childrenConfig
      } else {
        linkData.children = []
      }
    }
    return
  }
  let linkUrl = ''
  if (linkType.value === 'article') {
    const slug = v.slug || `/article/${v.id}`
    linkUrl = `${slug}`
    linkData.linkUrl = linkUrl || ''
    linkData.linkLabel = v.articleName
  }
  linkData.linkValue = v.id || ''
  linkData.linkType = linkType.value
}

const setLinkData = async (linkDataVal: LinkData) => {
  linkType.value = linkDataVal.linkType
  await getLinkRemoteData()
  // linkValue.value = linkDataVal.linkValue
  linkData.linkLabel = linkDataVal.linkLabel || ''
  linkData.linkType = linkDataVal.linkType || ''
  linkData.linkUrl = linkDataVal.linkUrl || ''
  linkData.linkValue = linkDataVal.linkValue || ''
  linkData.children = linkDataVal.children || []
}

function getLinkData() {
  if (linkType.value === 'externalLink') {
    linkData.linkUrl = linkData.linkValue || '/'
  }
  if (linkType.value === 'home') {
    linkData.linkUrl = '/'
    linkData.linkValue = '/'
    linkData.linkLabel = 'Home'
  }
  return jsonParse(linkData)
}
defineExpose({
  getLinkData,
  setLinkData,
})
</script>

<template>
  <div class="flex w-full flex-col">
    <div class="flex w-full justify-start items-center">
      <div class="w-1/3 mr-1">
        <ElSelect
          v-model="linkType"
          :loading="loading.data"
          placeholder="请选择链接类型"
          clearable
          class="w-full"
          @change="changeLinkType"
        >
          <ElOption v-for="item in linkTypes" :key="item.id" :label="item.title" :value="item.code" />
        </ElSelect>
      </div>
      <div class="w-2/3">
        <!-- 博客分类 -->
        <ElCascader
          v-if="status.category"
          ref="categoriesRef"
          v-model="linkData.linkValue"
          :loading="loading.data"
          :show-all-levels="false"
          :props="categoriesProps"
          clearable
          placeholder="请选择博客分类，支持搜索"
          :options="categories.list"
          filterable
          class="w-full"
          @change="changeLinkValue"
        />
        <!-- 文章 -->
        <ElSelect
          v-if="status.article"
          v-model="linkData.linkValue"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入标题搜索"
          :remote-method="queryArticlesData"
          :loading="loading.data"
          class="w-full"
        >
          <ElOption
            v-for="item in articles.list"
            :key="item.id"
            :label="item.articleName"
            :value="item.id"
            style="height: 60px; line-height: 60px"
            @click="changeLinkValue(item)"
          >
            <span style="line-height: 60px">{{ item.articleName }}</span>
          </ElOption>
        </ElSelect>
        <!-- 外部链接 -->
        <div v-if="status.externalLink" class="flex justify-start items-center">
          <ElInput
            v-model="linkData.linkLabel"
            minlength="1"
            maxlength="60"
            placeholder="请输入外部链接标签"
            class="w-full mr-1"
          />
          <ElInput
            v-model="linkData.linkValue"
            minlength="1"
            maxlength="2000"
            placeholder="请输入外部链接"
            class="w-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
