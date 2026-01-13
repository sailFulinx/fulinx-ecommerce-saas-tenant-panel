<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'

const { t: $t } = useLocale()

const pageTitle = $t('product.add')

const productFormRef = ref()

const containerRef = ref<HTMLElement>()

// 直接使用useAnchorScroll返回的currentHref，避免手动声明
const currentHref = ref('#productName')

// 定义锚点链接
const anchorLinks = [
  { href: '#productName', title: $t('product.base') },
  { href: '#productFile', title: $t('product.imageText') },
  { href: '#productOption', title: $t('product.option') },
  { href: '#productOther', title: $t('product.other') },
]

const handleUpdateActiveHref = (href: string) => {
  currentHref.value = href
}

const rules = reactive({
  languageId: [{ required: true, message: $t('common.placeholder.language'), trigger: 'change' }],
  systemCategoryId: [{ required: true, message: $t('product.placeholder.systemCategory'), trigger: 'change' }],
  productName: [{ required: true, message: $t('product.placeholder.productName'), trigger: 'blur' }],
  productType: [{ required: true, message: $t('product.placeholder.productType'), trigger: 'change' }],
  spu: [{ required: true, message: $t('product.placeholder.spu'), trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
  supplier: false,
  category: false,
  parameterGroup: false,
  parameter: false,
})

const { loading: productTypeloading, listData: productTypeListData } = useProductTypeList()

const { loading: productSourceTypeLoading, listData: productSourceTypeListData } = useProductSourceTypeList()

const { loading: ageGroupLoading, listData: ageGroupTypeListData } = useAgeGroupTypeList()
console.log(ageGroupTypeListData)

console.log(ageGroupTypeListData.value)

const { loading: genderLoading, listData: genderTypeListData } = useGenderTypeList()

const { loading: conditionLoading, listData: conditionTypeListData } = useConditionTypeList()

/**
 * 系统分类
 */
const listSystemCategoryPayload = reactive<SystemCategoryListParams>({
  languageId: usePreferenceStore().preference.language.id,
  systemCategoryName: null,
})

const {
  loading: systemCategoryLoading,
  listData: listSystemCategoryData,
} = useSystemCategoryList(listSystemCategoryPayload)

const systemCategoryProps = {
  value: 'id',
  label: 'systemCategoryName',
}

const systemCategoryIds = ref<string[]>([])

const handleChangeSystemCategory = (val: string[]) => {
  if (val && val.length > 0) {
    val.forEach(item => {
      const lastElement = item.at(-1) // 获取最后一个元素
      if (lastElement !== undefined) {
        // 检查是否为undefined
        systemCategoryIds.value.push(lastElement)
      }
    })
  }
}

/**
 * 分类
 */
const listCategoryPayload = reactive<CategoryListParams>({
  languageId: usePreferenceStore().preference.language.id,
  categoryName: null,
})

const { loading: categoryLoading, listData: listCategoryData } = useCategoryList(listCategoryPayload)

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

// 参数
const { loading: parameterLoading, listData: listParameterData, getList: getParameterList } = useParameterList()

// 供应商
const listSupplierPayload = reactive<SupplierListParams>({
  languageId: usePreferenceStore().preference.language.id,
  supplierName: null,
})
const { loading: supplierLoading, listData: listSupplierData, getList: getSupplierList } = useSupplierList(listSupplierPayload)

// 品牌
const listBrandPayload = reactive<BrandListParams>({
  languageId: usePreferenceStore().preference.language.id,
  brandName: null,
})
const { loading: brandLoading, listData: listBrandData, getList: getBrandList } = useBrandList(listBrandPayload)

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
                :offset="10"
                class="pa-4"
                @update:active-href="handleUpdateActiveHref"
              />
            </div>
            <div ref="containerRef" class="w-full container-custom">
              <!-- 基础 -->
              <div id="productName" class="bg-white mb-5 pa-4">
                <div class="w-full fs-16px font-bold mb-4">
                  基础信息
                </div>
                <div class="w-full">
                  <!-- 系统分类 -->
                  <ElFormItem :label="$t('product.systemCategory')" prop="systemCategoryId">
                    <ElCascader
                      v-model="productForm.systemCategoryId"
                      :placeholder="`${$t('product.placeholder.systemCategory')}`"
                      :loading="systemCategoryLoading"
                      :props="systemCategoryProps"
                      :options="listSystemCategoryData.list"
                      @change="handleChangeSystemCategory"
                    />
                  </ElFormItem>
                  <!-- 产品名称 -->
                  <ElFormItem :label="$t('product.productName')" prop="productName">
                    <ElInput
                      v-model="productForm.productName"
                      minlength="1"
                      maxlength="120"
                      :placeholder="$t('product.placeholder.productName')"
                    />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.spu')" prop="spu">
                    <ElInput
                      v-model="productForm.spu"
                      minlength="1"
                      maxlength="120"
                      :placeholder="$t('product.placeholder.spu')"
                    />
                  </ElFormItem>
                  <!-- 产品短名称 -->
                  <ElFormItem :label="$t('product.productShortName')" prop="productShortName">
                    <ElInput
                      v-model="productForm.productShortName"
                      minlength="1"
                      maxlength="120"
                      :placeholder="$t('product.placeholder.productShortName')"
                    />
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
                <ElFormItem :label="$t('product.productDescription')" prop="articleDescription">
                  <Editor ref="editorRef" v-model="productForm.productDescription" />
                </ElFormItem>
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
                <div class="w-full">
                  <!-- 产品分类 -->
                  <ElFormItem :label="$t('product.category')" prop="category">
                    <ElCascader
                      v-model="productForm.categoryIds"
                      :loading="categoryLoading"
                      :props="categoryProps"
                      :options="listCategoryData.list"
                      @change="handleChangeCategory"
                    />
                  </ElFormItem>
                  <ElFormItem :label="$t('product.ageGroup')" prop="ageGroupType">
                    <ElSelect v-model="productForm.ageGroupType" placeholder="请选择">
                      {{ ageGroupTypeListData }}
                      <!-- <ElOption v-for="item in listAgeGroupData.list" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </ElOption> -->
                    </ElSelect>
                  </ElFormItem>
                </div>
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
  height: calc(100vh - 286px); // 调整高度计算，减少减去的值
  overflow-y: auto;
}

:deep(.el-card__header) {
  padding: 10px;
}
</style>
