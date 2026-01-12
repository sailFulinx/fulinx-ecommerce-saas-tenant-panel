<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'

const { t: $t } = useLocale()

const containerRef = ref()

// 直接使用useAnchorScroll返回的currentHref，避免手动声明
const currentHref = ref('')

// 定义锚点链接
const anchorLinks = [
  { href: '#productName', title: $t('product.base') },
  { href: '#productFile', title: $t('product.imageText') },
  { href: '#productOption', title: $t('product.option') },
  { href: '#productOther', title: $t('product.other') },
]

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
            AI
          </div>
          <div class="col-span-9">
            <div class="w-full mb-4 bg-white">
              <TailwindAnchor
                v-model:active-href="currentHref"
                :links="anchorLinks"
                :container="containerRef"
                direction="horizontal"
                :offset="100"
                class="pa-4"
              />
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
  height: calc(100vh - 200px); // 调整高度计算，减少减去的值
  overflow-y: auto;
}

// 为锚点元素添加滚动边距，防止内容被固定头部遮挡
#productName,
#productFile,
#productOption,
#productOther {
  scroll-margin-top: 100px; // 调整滚动边距
}

:deep(.el-card__header) {
  padding: 10px;
}

// ant-design-vue Anchor 组件样式定制
:deep(.ant-anchor) {
  .ant-anchor-link {
    padding: 8px 0;
    margin: 4px 0;
    transition: all 0.3s;

    &:hover {
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    &.ant-anchor-link-active {
      background-color: #e6f7ff;
      border-left: 3px solid #1890ff;
      font-weight: 500;

      .ant-anchor-link-title {
        color: #1890ff;
      }
    }
  }

  .ant-anchor-link-title {
    font-size: 14px;
    padding-left: 8px;
    color: #666;
    transition: all 0.3s;

    &:hover {
      color: #1890ff;
    }
  }
}

:deep(.el-anchor__link) {
  font-size: 16px;
}
:deep(.el-anchor__link.is-active) {
  color: var(--el-color-primary);
  font-weight: 500;
}
</style>
