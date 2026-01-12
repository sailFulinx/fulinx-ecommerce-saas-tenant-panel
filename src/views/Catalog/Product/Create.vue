<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'

const { t: $t } = useLocale()

// 当前激活的锚点链接
const activeAnchor = ref('')

// 你的滚动容器引用
const containerRef = ref<HTMLElement | null>(null)

// 处理滚动事件，动态更新激活的锚点
const handleScroll = () => {
  if (!containerRef.value) {
    return
  }

  const scrollContainer = containerRef.value
  const scrollTop = scrollContainer.scrollTop
  const sections = [
    { id: 'productName', offset: 0 }, // 可以根据实际情况设置偏移量
    { id: 'productFile', offset: 0 },
    { id: 'productOption', offset: 0 },
    { id: 'productOther', offset: 0 },
  ]

  // 遍历各个区域，判断当前滚动位置处于哪个区域
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i].id)
    if (!section) {
      continue
    }

    // 计算区域相对于滚动容器顶部的位置
    const sectionTop = section.offsetTop - sections[i].offset
    if (scrollTop >= sectionTop - 10) { // 减去一个小阈值，使切换更平滑
      activeAnchor.value = `#${sections[i].id}`
      break
    }
  }
}

// 页面加载时，设置第一个锚点为默认激活状态
onMounted(() => {
  // 确保容器元素已正确挂载
  if (containerRef.value) {
    // 设置第一个锚点为默认激活项
    activeAnchor.value = '#productName' // 对应第一个 <ElAnchorLink> 的 href

    // 可选：添加滚动事件监听器，实现滚动时自动切换激活状态
    containerRef.value.addEventListener('scroll', handleScroll)
  }
})

// 组件卸载前移除事件监听
onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
})

const handleClickAnchor = (e: MouseEvent, link: any) => {
  e.preventDefault()

  // 如果是锚点点击，更新激活状态
  if (link && link.href) {
    const sectionId = link.href.replace('#', '')
    activeAnchor.value = sectionId

    // 平滑滚动到对应区域
    const targetElement = document.getElementById(sectionId)
    if (targetElement && containerRef.value) {
      containerRef.value.scrollTo({
        top: targetElement.offsetTop - 10, // 考虑offset偏移
        behavior: 'smooth',
      })
    }
  }
}

const rules = reactive({
  languageId: [{ required: true, message: $t('common.placeholder.language'), trigger: 'change' }],
  productName: [{ required: true, message: $t('product.placeholder.productName'), trigger: 'blur' }],
  productType: [{ required: true, message: $t('product.placeholder.productType'), trigger: 'change' }],
  sku: [{ required: true, message: $t('product.placeholder.sku'), trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
  supplier: false,
  category: false,
  parameterGroup: false,
  parameter: false,
})

/**
 * 参数
 */

const listParameterResult = ref<TableResponse<ParameterListData & CommonField>>({
  list: [],
  total: 0,
})

const listParameterQuery = reactive<ParameterListParams>({
  languageId: usePreferenceStore().preference?.language.id,
})

const getParameterList = async () => {
  loading.parameter = true
  const { data } = await parameterListApi(listParameterQuery).catch(err => {
    loading.parameter = false
    throw err
  })
  listParameterResult.value = data
  loading.parameter = false
}

getParameterList()

/**
 * 分类
 */

const categoryProps = {
  value: 'id',
  label: 'categoryName',
  multiple: true,
}

const categoryIds = ref<string[]>([])

const handleChangeCategory = (val: string[]) => {
  if (val && val.length > 0) {
    val.forEach(item => {
      const lastElement = item.at(-1) // 获取最后一个元素
      if (lastElement !== undefined) {
        // 检查是否为undefined
        categoryIds.value.push(lastElement)
      }
    })
  }
}

const listCategoryPayload = reactive<CategoryListParams>({
  languageId: usePreferenceStore().preference?.language.id,
  categoryName: '',
  categoryType: 1,
  id: null,
})

const listCategoryData = ref<TableResponse<CategoryData & CommonField>>({
  list: [],
  total: 0,
})

const getCategoryList = async () => {
  loading.category = true
  const { data } = await categoryListApi(listCategoryPayload).catch(error => {
    loading.category = true
    throw error
  })
  listCategoryData.value = { ...data }
  loading.category = false
}
getCategoryList()

/**
 * 供应商
 */
const listSupplierQuery = reactive<SupplierListParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  supplierName: '',
  pageSize: 20,
  pageNumber: 1,
})

const listSupplierResult = ref<TableResponse<SupplierListData & CommonField>>({
  list: [],
  total: 0,
})

const getSupplierList = async () => {
  loading.supplier = true
  if (listSupplierQuery.supplierName === '') {
    listSupplierQuery.supplierName = null
  }
  const { data } = await supplierPaginationApi(listSupplierQuery).catch(err => {
    loading.supplier = false
    throw err
  })
  listSupplierResult.value = data
  loading.supplier = false
}
getSupplierList()

const pageTitle = $t('product.add')

const productFormRef = ref()

const editorRef = ref()

const imageUploadRef = ref()

const createProductForm = (): CreateProductParams => {
  return {
    languageId: usePreferenceStore().preference.language.id,
    spu: '',
    productType: 0,
    onlineTime: '',
    offlineTime: '',
    brandId: '',
    productSourceType: 0,
    isAdult: true,
    ageGroupType: 0,
    genderType: 0,
    conditionType: 0,
    systemCategoryId: '',
    productName: '',
    productShortName: '',
    productDescription: '',
    productShortDescription: '',
    metaTitle: '',
    metaDescription: '',
    categoryIds: [],
    productFileRequestDos: [],
    currencyId: '',
    productSkuRequestDo: {
      productAttributeRequestDo: {
        productAttributeSummaryDo: {
          productAttributeSummaryAttributeDos: [],
        },
        searchIndex: '',
      },
      productSkuItemRequestDos: [],
    },
    productParameterRelationRequestDos: [],
    productRelatedRequestDos: [],
    productSupplierRequestDos: [],
  }
}

const productForm = reactive<CreateProductParams>(createProductForm())

const closeViewTag = () => {}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'ProductList' })
}

const save = async () => {
  productForm.productParameterRelationRequestDos = []
  productForm.languageId = usePreferenceStore().preference.language.id
  productForm.currencyId = usePreferenceStore().preference.currency.id
  // productForm.parameterGroupId = selectedParameterGroup.value
  const images = imageUploadRef.value.getFileData()
  productForm.productFileRequestDos = images.fileDataList
  productForm.productFileRequestDos?.map(item => {
    item.productFileType = 1
    return item
  })

  if (categoryIds.value && categoryIds.value.length > 0) {
    productForm.categoryIds = categoryIds.value
  }
  const valid = await productFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  await createProductApi(productForm).catch(err => {
    throw err
  })

  deleteTagView(true)
  ElMessage({
    message: '保存成功',
    type: 'success',
    duration: 2000,
  })
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <h4>{{ pageTitle }}</h4>
        </div>
        <div>
          <EBtn size="small" :loading="loading.button" @click="closeViewTag()">
            <Icon icon="ant-design:close-outlined" class="mr-1" />
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn size="small" type="primary" :loading="loading.button" @click="save">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </div>
    <div class="view-main theme-card">
      <ElForm ref="productFormRef" :model="productForm" :rules="rules" label-width="100px">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3 bg-white pa-4">
            AI生成
          </div>
          <div class="col-span-9">
            <div class="w-full mb-4">
              <ElAnchor
                v-model="activeAnchor"
                :offset="10"
                :container="containerRef"
                direction="horizontal"
                type="default"
                class="pa-4"
                @click="handleClickAnchor"
              >
                <ElAnchorLink href="#productName" title="基础信息" />
                <ElAnchorLink href="#productFile" title="图文信息" />
                <ElAnchorLink href="#productOption" title="价格库存" />
                <ElAnchorLink href="#productOther" title="其他信息" />
              </ElAnchor>
            </div>
            <div ref="containerRef" class="w-full container-custom">
              <!-- 基础 -->
              <div id="productName" class="bg-white mb-5 pa-4">
                <div class="w-full fs-16px font-bold mb-4">
                  基础信息
                </div>
                <div class="w-full">
                  <ElFormItem :label="$t('product.productName')" prop="productName">
                    <ElInput
                      v-model="productForm.productName"
                      minlength="1"
                      maxlength="120"
                      :placeholder="$t('product.placeholder.productName')"
                    />
                  </ElFormItem>
                  <!-- 产品分类 -->
                  <ElFormItem :label="$t('product.category')" prop="category">
                    <ElCascader
                      v-model="productForm.categoryIds"
                      :props="categoryProps"
                      :options="listCategoryData.list"
                      @change="handleChangeCategory"
                    />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.sku')" prop="sku">
                    <ElInput
                      v-model="productForm.spu"
                      minlength="1"
                      maxlength="120"
                      :placeholder="$t('product.placeholder.sku')"
                    />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.productDescription')" prop="articleDescription">
                    <Editor ref="editorRef" v-model="productForm.productDescription" :height="300" />
                  </ElFormItem>
                </div>
              </div>
              <!-- 图片 -->
              <div id="productFile" class="bg-white mb-5 pa-4 h-[800px]">
                <div class="w-full fs-16px font-bold mb-4">
                  图文信息
                </div>
                <div class="w-full">
                  <UploadMultiImage ref="imageUploadRef" />
                </div>
              </div>
              <!-- 规格 -->
              <div id="productOption" class="bg-white mb-5 pa-4 h-[800px]">
                <div class="w-full fs-16px font-bold mb-4">
                  价格库存
                </div>
                <div class="w-full" />
              </div>
              <!-- 其它 -->
              <div id="productOther" class="bg-white mb-5 pa-4 h-[800px]">
                <div class="w-full fs-16px font-bold mb-4">
                  其他信息
                </div>
                <div class="w-full" />
              </div>
            </div>
          </div>
        </div>
      </ElForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container-custom {
  height: calc(100vh - 284px); // 调整高度计算，减少减去的值
  overflow-y: auto;
}

:deep(.el-anchor__link) {
  font-size: 16px;
}
:deep(.el-anchor__link.is-active) {
  color: var(--el-color-primary);
  font-weight: 500;
}
</style>
