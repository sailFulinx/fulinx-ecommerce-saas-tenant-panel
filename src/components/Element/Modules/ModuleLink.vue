<script setup name="ThemeLinkType" lang="ts">
// 导入所有分类API
import { categoryBodyListApi } from '@/api/category/body'
import { categoryCosmeticListApi } from '@/api/category/cosmetic'
import { categoryDepartmentListApi } from '@/api/category/department'
import { categoryEdutainmentListApi } from '@/api/category/edutainment'
import { categoryEventListApi } from '@/api/category/event'
import { categoryListApi as normalCategoryListApi } from '@/api/category/normal'
import { categoryOutcomeListApi } from '@/api/category/outcome'
import { categorySurgeryListApi } from '@/api/category/surgery'
import { categoryTweakmentListApi } from '@/api/category/tweakment'
import { categoryVideoListApi } from '@/api/category/video'
// 导入所有内容API
import { articleListApi } from '@/api/content/article'
import { cosmeticListApi } from '@/api/content/cosmetic'
import { doctorListApi } from '@/api/content/doctor'
import { edutainmentListApi } from '@/api/content/edutainment'
import { eventListApi } from '@/api/content/event'
import { outcomeListApi } from '@/api/content/outcome'
import { pageListApi } from '@/api/content/page'
import { surgeryListApi } from '@/api/content/surgery'
import { tweakmentListApi } from '@/api/content/tweakment'
import { videoListApi } from '@/api/content/video'
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
let prevLinkType: string = ''
const categories = ref<TableResponse<CategoryData & CommonField>>({
  list: [],
  total: 0,
})
const categoriesRef = ref()
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
  externalLink: false,
  home: false,
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
  categorySurgery: categorySurgeryListApi,
  categoryTweakment: categoryTweakmentListApi,
}

// 内容API映射
const contentApis: Record<string, Function> = {
  article: articleListApi,
  edutainment: edutainmentListApi,
  cosmetic: cosmeticListApi,
  doctor: doctorListApi,
  event: eventListApi,
  outcome: outcomeListApi,
  video: videoListApi,
  page: pageListApi,
  surgery: surgeryListApi,
  tweakment: tweakmentListApi,
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
  categorySurgery: 'categorySurgeryName',
  categoryTweakment: 'categoryTweakmentName',
}

// 内容标签字段映射
const contentLabelFields: Record<string, string> = {
  article: 'articleName',
  edutainment: 'edutainmentName',
  cosmetic: 'cosmeticName',
  doctor: 'doctorName',
  event: 'eventName',
  outcome: 'outcomeName',
  video: 'videoName',
  page: 'pageName',
  surgery: 'surgeryName',
  tweakment: 'tweakmentName',
}

/**
 * 获取分类数据
 */
async function getCategoryData() {
  loading.data = true
  const payload = {
    languageId: usePreferenceStore().preference?.language.id,
  }

  // 根据分类类型调用对应的API
  const api = categoryApis[linkType.value]
  if (api) {
    const { data } = await api(payload).catch((err: any) => {
      loading.data = false
      throw err
    })
    categories.value = data
  }

  // 动态设置分类标签字段
  if (categoryLabelFields[linkType.value]) {
    categoriesProps.label = categoryLabelFields[linkType.value]
  } else {
    categoriesProps.label = 'categoryName'
  }

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
  articlePayload.articleId = linkData.linkValue || null
  loading.data = true

  // 根据内容类型调用对应的API
  const api = contentApis[linkType.value]
  if (api) {
    const { data } = await api(articlePayload).catch((err: any) => {
      loading.data = false
      throw err
    })
    articles.value = data
  }
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

  // 处理内容类型
  if (Object.keys(contentApis).includes(linkType.value)) {
    articlePayload.articleName = null
    await getArticlesData()
  }

  // 处理分类类型
  if (Object.keys(categoryApis).includes(linkType.value)) {
    await getCategoryData()
  }

  // 重置状态
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
  // 处理分类类型
  if (Object.keys(categoryApis).includes(linkType.value)) {
    const childrenConfig = [] as LinkData[]
    const nodeRes = categoriesRef.value.getCheckedNodes()
    const data = nodeRes[0]?.data || {}
    const slug = data.slug || `/${linkType.value}/${data.id}`
    linkData.linkValue = data.id
    linkData.linkUrl = `${slug}`
    linkData.linkLabel = data[categoryLabelFields[linkType.value] as keyof typeof data] || data.categoryName
    linkData.linkType = linkType.value
    if (props.isNeedChildren) {
      const children = data.children
      if (children) {
        linkData.linkUrl = `${slug}`
        for (const item of children) {
          const { slug, id } = item
          const label = item[categoryLabelFields[linkType.value] as keyof typeof item] || item.categoryName
          const slugData = slug || `/${linkType.value}/${id}`
          const childrenItem = {
            linkType: linkType.value,
            linkUrl: `${slugData}`,
            linkValue: id,
            linkLabel: label,
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

  // 处理内容类型
  if (Object.keys(contentApis).includes(linkType.value)) {
    const slug = v.slug || `/${linkType.value}/${v.id}`
    linkData.linkUrl = `${slug}` || ''
    linkData.linkLabel = v[contentLabelFields[linkType.value] as keyof typeof v] || v.articleName || ''
    linkData.linkValue = v.id || ''
    linkData.linkType = linkType.value
  }
}

// 保留原有的 setLinkData 方法，但内部实现改为更新 linkData 和 linkType
const setLinkData = async (linkDataVal: LinkData) => {
  linkType.value = linkDataVal.linkType
  await getLinkRemoteData()
  linkData.linkLabel = linkDataVal.linkLabel || ''
  linkData.linkType = linkDataVal.linkType || ''
  linkData.linkUrl = linkDataVal.linkUrl || ''
  linkData.linkValue = linkDataVal.linkValue || ''
  linkData.children = linkDataVal.children || []
}

// 添加一个辅助函数来安全地访问对象属性
function getLabelValue(item: any, fieldName: string): string {
  return item[fieldName] || ''
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
  return { ...linkData }
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
        <!-- 分类类型 -->
        <ElCascader
          v-if="Object.keys(categoryApis).includes(linkType)"
          ref="categoriesRef"
          v-model="linkData.linkValue"
          :loading="loading.data"
          :show-all-levels="false"
          :props="categoriesProps"
          clearable
          placeholder="请选择分类，支持搜索"
          :options="categories.list"
          filterable
          class="w-full"
          @change="changeLinkValue"
        />
        <!-- 内容类型 -->
        <ElSelect
          v-if="Object.keys(contentApis).includes(linkType)"
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
            :label="getLabelValue(item, contentLabelFields[linkType]) || item.articleName || ''"
            :value="item.id"
            style="height: 60px; line-height: 60px"
            @click="changeLinkValue(item)"
          >
            <span style="line-height: 60px">
              {{ getLabelValue(item, contentLabelFields[linkType]) || item.articleName || '' }}
            </span>
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
